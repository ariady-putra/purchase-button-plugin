import PurchaseButton from './component/PurchaseButton';

// import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <table><tr><td>
        <img src='https://static.wixstatic.com/media/7a5846_aeecaac3b7774f62a2607926806c9040~mv2.png/v1/fill/w_179,h_179,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/352.png'
            className='Item' alt='Item 1'/>
      </td></tr><tr><td>
        Item price: 5 ADA
      </td></tr><tr><td>
        
        <PurchaseButton txInfo={{
          toAddress : 'addr_test1qp75v9ld0084zl07kwjyfnwagm7nsvdvnkknqkhkmf025gq6rx4eret2xzeatlfajkeq7u2fxl55drpd96xeaxzns85sfxah9j',
          lovelaces : 5000000, // 5 ADA = 5million lovelace
        }}/>
        
      </td></tr></table>
    </div>
  );
}

export default App;
