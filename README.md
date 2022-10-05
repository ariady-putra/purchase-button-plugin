# purchase-button-plugin
Fully front-end [`PurchaseButton`](src/component/PurchaseButton.js) React component. Connect and purchase in 1 click.
<img src="screenshots/0_HomePage0.png">
<img src="screenshots/3_SignTx.png">
NOTE: Pop-up window depends on the client's browser, wallet extension used, and system configurations. It may fail to take focus.

## How to integrate
Take a look at [`App.js`](src/App.js#L21):
```js
<PurchaseButton txInfo={{
  toAddress : 'addr_test1qp75v9ld0084zl07kwjyfnwagm7nsvdvnkknqkhkmf025gq6rx4eret2xzeatlfajkeq7u2fxl55drpd96xeaxzns85sfxah9j',
  lovelaces : 5000000, // 5 ADA = 5million lovelace
}}/>
```
Just provide `txInfo` map containing `toAddress` and `lovelaces`.

## Callbacks
Optional attributes are `callback` and `onError` function for success and error events respectively.

### On success
The `callback` function takes 1 parameter which is a map containing `txHash`, see: [`PurchaseButton.js`](src/component/PurchaseButton.js#L109).

### On exception
The `onError` function also takes 1 parameter which is a map containing the error, see: [`PurchaseButton.js`](src/component/PurchaseButton.js#L118).

## TODO
- Provide a component to display error / transaction status for user feedback, currently it's only logged at console.
- Support tokens other than ADA.
