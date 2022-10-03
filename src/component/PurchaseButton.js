import React from 'react';
import {
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
} from '@emurgo/cardano-serialization-lib-asmjs';

import './PurchaseButton.css';

function PurchaseButton({txInfo}) {
  // Protocol Parameters
  const pp = {
    min_fee_a           : 44,
    min_fee_b           : 155381,
    coins_per_utxo_word : '34482',
    coins_per_utxo_size : '34482',
    pool_deposit        : '500000000',
    key_deposit         : '400000',
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
  }, []);
  
  return (
    <table>
      {wallets.map(key =>
        <tr><td><button className = 'Purchase-button'
                        onClick   = {async () => {
            try {
              const userWallet    = await window.cardano[key].enable();
              const hexAddress    = await userWallet.getChangeAddress();
              const wallet        = {
                api     : userWallet,
                address : hexAddress,
              };
              
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
              if(txInfo.callback != null)
                txInfo.callback(txHash);
              console.log(JSON.stringify({txHash}));
            }
            catch(x) {
              console.log(JSON.stringify(x));
            }
          }}>
            <table><tr><td>
              <img src = {window.cardano[key].icon}
                  width={32} height={32} alt={key}/>
              </td><td>
              {`Purchase using ${window.cardano[key].name}`}
            </td></tr></table>
        </button></td></tr>
      )}
    </table>
  );
}

export default PurchaseButton;
