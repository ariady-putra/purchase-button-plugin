import React from 'react';

import PurchaseButton from './component/PurchaseButton';
import './component/PurchaseButton.css';

import logo from './Nami_ADA.png';
import './App.css';

function App() {
  const [txHash, setTxHash] = React.useState(() => {});
  const [error, setError] = React.useState(() => {});
  
  return (
    <div className="App">
      <h1>Testnet Preview</h1>
      <table><tr><td>
        <img src={logo} className='Item' alt='Item 1'/>
      </td></tr><tr><td>
        Give me: 5 tADA
      </td></tr><tr><td>
        
        <PurchaseButton label={'Send using'} callback={setTxHash} onError={setError} txInfo={{
          toAddress : 'addr_test1qp75v9ld0084zl07kwjyfnwagm7nsvdvnkknqkhkmf025gq6rx4eret2xzeatlfajkeq7u2fxl55drpd96xeaxzns85sfxah9j',
          lovelaces : 5000000, // 5 ADA = 5million lovelace
        }}/>
        
      </td></tr></table>
      {JSON.stringify(txHash)}
      {JSON.stringify(error)}
    </div>
  );
}

export default App;
