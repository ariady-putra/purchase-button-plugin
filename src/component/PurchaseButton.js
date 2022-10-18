import React from 'react';

function PurchaseButton({id, label='Purchase using', walletList, txInfo, callback, onError}) {
  // Protocol Parameters
  const pp = {
    min_fee_a           : 44,
    min_fee_b           : 155381,
    coins_per_utxo_word : '4310',
    coins_per_utxo_size : '4310',
    pool_deposit        : '500000000',
    key_deposit         : '2000000',
    max_val_size        : '5000',
    max_tx_size         : 16384,
  };
  
  // List of user wallets
  const [wallets, setWallets] = React.useState(() => []);
  
  React.useEffect(() => {
    const wallets = [];
    for(const key in window.cardano) {
      if(window.cardano[key].enable && wallets.indexOf(key) === -1) {
        wallets.push(key);
      }
    }
    setWallets(wallets.sort());
    try {
      walletList(wallets.sort());
    }
    catch {}
  }, []);
  
  return (
    <table><tbody>
      {wallets.map(key =>
        <tr key={`${id}.${key}`}><td><button className='Purchase-button'
          onClick={async () => {
            try {
              const userWallet  = await window.cardano[key].enable();
              const hexAddress  = await userWallet.getChangeAddress();
              const wallet      = {
                api     : userWallet,
                address : hexAddress,
              };
              
              await import('@emurgo/cardano-serialization-lib-asmjs').then(async ({
                Address,
                BigNum,
                CoinSelectionStrategyCIP2,
                LinearFee,
                Transaction,
                TransactionBuilder,
                TransactionBuilderConfigBuilder,
                TransactionOutput,
                TransactionUnspentOutput,
                TransactionUnspentOutputs,
                TransactionWitnessSet,
                Value,
              }) => {
                const minFeeA = BigNum.from_str('' + pp.min_fee_a);
                const minFeeB = BigNum.from_str('' + pp.min_fee_b);
                const feeAlgo = LinearFee.new(minFeeA, minFeeB);
                
                const coinsPerUtxoWord = BigNum.from_str(pp.coins_per_utxo_word);
                // const coinsPerUtxoByte = BigNum.from_str(pp.coins_per_utxo_size);
                
                const poolDeposit = BigNum.from_str(pp.pool_deposit);
                const keyDeposit  = BigNum.from_str(pp.key_deposit);
                
                const config = TransactionBuilderConfigBuilder.new()
                  .fee_algo(feeAlgo)
                  .coins_per_utxo_word(coinsPerUtxoWord)
                  // .coins_per_utxo_byte(coinsPerUtxoByte)
                  .pool_deposit(poolDeposit)
                  .key_deposit(keyDeposit)
                  .max_value_size(pp.max_val_size)
                  .max_tx_size(pp.max_tx_size)
                  .build();
                const builder = TransactionBuilder.new(config);
                
                const numOutput = BigNum.from_str('' + txInfo.lovelaces);
                const valOutput = Value.new(numOutput);
                const to = Address.from_bech32(txInfo.toAddress);
                const transactionOutput = TransactionOutput.new(to, valOutput);
                builder.add_output(transactionOutput);
                
                const utxoS = await wallet.api.getUtxos();
                const transactionUnspentOutputs = TransactionUnspentOutputs.new();
                for(const utxo of utxoS) {
                  const transactionUnspentOutput = TransactionUnspentOutput.from_hex(utxo);
                  if(transactionUnspentOutput.output().to_js_value().amount.multiasset == null)
                    transactionUnspentOutputs.add(transactionUnspentOutput);
                }
                builder.add_inputs_from(transactionUnspentOutputs,
                  CoinSelectionStrategyCIP2.RandomImprove);
                
                const changeAddress = Address.from_hex(wallet.address);
                builder.add_change_if_needed(changeAddress);
                
                const txBody = builder.build();
                const noWitness = TransactionWitnessSet.new();
                const txNoWitness = Transaction.new(txBody, noWitness);
                
                const txRaw = txNoWitness.to_hex();
                const txWitness = await wallet.api.signTx(txRaw);
                
                const witnessed = TransactionWitnessSet.from_hex(txWitness);
                const txWitnessed = Transaction.new(txBody, witnessed);
                
                const txSigned = txWitnessed.to_hex();
                const txHash = await wallet.api.submitTx(txSigned);
                try {
                  callback({txHash});
                }
                catch {
                  const e = JSON.stringify({txHash});
                  console.log(e);
                }
              });
            }
            catch(x) {
              try {
                onError(x);
              }
              catch {
                const e = JSON.stringify(x);
                console.log(e);
              }
            }
          }}>
            <table><tbody><tr><td>
              <img src = {window.cardano[key].icon}
                  width={32} height={32} alt={key}/>
              </td><td>
              {`${label} ${window.cardano[key].name}`}
            </td></tr></tbody></table>
        </button></td></tr>
      )}
    </tbody></table>
  );
}

export default PurchaseButton;
