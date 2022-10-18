import React from 'react';

import PurchaseButton from './component/PurchaseButton';
import './component/PurchaseButton.css';

import logo from './Nami_ADA.png';
import './App.css';

function App() {
  const addr = 'addr1qyh99v0nhc8e7vcvl3gy8lhwkg7h3ykqgy2nud6gdkdad3fj9q6vf6cgnw48r2ljtmaauxn4s44uuskz3hvggjsslkaqd0rgze';
  
  const [wallets, setWallets] = React.useState(() => [{}]);
  const [ada, setAda] = React.useState(() => 1);
  
  const [txHash, setTxHash] = React.useState(() => {});
  const [error, setError] = React.useState(() => {});
  
  return (
    <div className="App">
      {!wallets.length ? 'You have no Cardano wallets installed :-(' :
        <table><tbody><tr><td>
          <img src={logo} alt={addr} className='Qr'/>
        </td></tr><tr><td>
          Give me: <input
            type       = 'number'
            className  = 'Ada'
            onChange   = {ada => setAda(ada.target.value)}
            value      = {ada}
            min        = {1}
          /> ADA
        </td></tr><tr><td>
          
          <PurchaseButton
            id          = {addr}
            label       = {'Send using'}
            walletList  = {setWallets}
            callback    = {setTxHash}
            onError     = {setError}
            txInfo      = {{
              lovelaces: `${1000000*ada}`,
              toAddress: `${addr}`,
            }}
          />
          
        </td></tr></tbody></table>
      }
      {JSON.stringify(txHash)}
      {JSON.stringify(error)}
    </div>
  );
}

export default App;
