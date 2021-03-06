[![Build Status](https://travis-ci.org/bodhiproject/hweb3.js.svg?branch=master)](https://travis-ci.org/bodhiproject/hweb3.js)

# Hweb3.js - Web3.js for Html

Hweb3 is a library for dApps to interract with the Html blockchain. Hweb3 communicates to a Html node via the provider provided.

https://www.npmjs.com/package/hweb3

## Get Started
Run the following in your project folder:

	npm install hweb3 --save

## Web Dapp Usage
This is example is meant for web dapps who would like to use Hweb3's convenience methods with 's RPC provider. Altmask is a Html wallet. More details about Altmask [here](https://github.com/machado-rev/altmask).

### 1. Construct Hweb3 instance
If you have Altmask installed, you will have a `window.altmask` object injected in your browser tab. Pass that into Hweb3 as a parameter to set the provider.
```
const hweb3 = new Hweb3(window.altmask.rpcProvider);
```

### 2. Construct Contract instance
The Contract class is meant for executing `sendtocontract` or `callcontract` at a specific contract address with a given ABI.
```
const contractAddress = 'f7b958eac2bdaca0f225b86d162f263441d23c19';
const contractAbi = [{"constant":false,"inputs":[{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_lastResultIndex","type":"uint8"},{"name":"_arbitrationEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"createDecentralizedOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_lastResultIndex","type":"uint8"},{"name":"_arbitrationEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"doesDecentralizedOracleExist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_bettingEndBlock","type":"uint256"},{"name":"_resultSettingEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"createCentralizedOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"},{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_bettingEndBlock","type":"uint256"},{"name":"_resultSettingEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"doesCentralizedOracleExist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"oracles","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_addressManager","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contractAddress","type":"address"},{"indexed":true,"name":"_oracle","type":"address"},{"indexed":true,"name":"_eventAddress","type":"address"},{"indexed":false,"name":"_name","type":"bytes32[10]"},{"indexed":false,"name":"_resultNames","type":"bytes32[10]"},{"indexed":false,"name":"_numOfResults","type":"uint8"},{"indexed":false,"name":"_bettingEndBlock","type":"uint256"},{"indexed":false,"name":"_resultSettingEndBlock","type":"uint256"},{"indexed":false,"name":"_consensusThreshold","type":"uint256"}],"name":"CentralizedOracleCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contractAddress","type":"address"},{"indexed":true,"name":"_eventAddress","type":"address"},{"indexed":false,"name":"_name","type":"bytes32[10]"},{"indexed":false,"name":"_resultNames","type":"bytes32[10]"},{"indexed":false,"name":"_numOfResults","type":"uint8"},{"indexed":false,"name":"_lastResultIndex","type":"uint8"},{"indexed":false,"name":"_arbitrationEndBlock","type":"uint256"},{"indexed":false,"name":"_consensusThreshold","type":"uint256"}],"name":"DecentralizedOracleCreated","type":"event"}];

// Create a new Contract instance and use the same provider as hweb3
const contract = hweb3.Contract(contractAddress, contractAbi);
```

### 3. Get Logged In Altmask Account
To get the current logged in account in Altmask, you will have to add an [Event Listener](https://www.w3schools.com/jsref/met_element_addeventlistener.asp) to listen to messages sent from Altmask.
```
let account;

function onAltmaskAcctChange(event) {
  if (event.data.message && event.data.message.type == "ACCOUNT_CHANGED") {
    account = event.data.message.payload;

    // You now have the logged in account.
    // account = InpageAccount {
    //   loggedIn: true,
    //   name: "My Wallet", 
    //   network: "TestNet",
    //   address: "qJHp6dUSmDShpEEMmwxqHPo7sFSdydSkPM",
    //   balance: 49.10998413
    // } 

    // You may also get the account from `window.altmask.account`.
    // account = window.altmask.account
  }
}
window.addEventListener('message', onAltmaskAcctChange, false);
```

### 4. Execute sendtocontract
The last piece is to execute a `sendtocontract` on your Contract instance. This will automatically show a Altmask popup to confirm that you would like to send the transaction.
```
// Does a sendtocontract call on a function called setResult(uint8)
const tx = await contract.send('setResult', {
  methodArgs: [1],    // Sets the function params
  gasLimit: 1000000,  // Sets the gas limit to 1 million
  senderAddress: account.address,
});
// tx = txid of the transaction
```

## Hweb3Provider
The provider is the link between Hweb3 and the blockchain. A compatible Hweb3 Provider adheres to the following interface:
```
interface Hweb3Provider: {
  rawCall: (method: string, args: any[]) => Promise; // returns the result of the request
}
```

## Hweb3
Instantiate a new instance of `Hweb3`: 
```
const { Hweb3 } = require('hweb3');

// Instantiate Hweb3 with HttpProvider
// Pass in the URL of your Html node RPC port with auth credentials.
// Default Html RPC ports: testnet=13889 mainnet=3889
const hweb3 = new Hweb3('http://bodhi:bodhi@localhost:13889');

// Instantiate Hweb3 with AltmaskRPCProvider
// AltmaskRPCProvider is a provider for the Altmask Wallet Chrome Extension.
// Please note AltmaskRPCProvider only allows the rawCall() method to be used.
// It is specifically used for `sendtocontract` and `callcontract` only.
const hweb3 = new Hweb3(window.altmask.rpcProvider);
```

### isConnected()
Checks if you are connected properly to the local html node.
```
async function isConnected() {
  return await hweb3.isConnected();
}
```

### getHexAddress(address)
Converts a Html address to hex format.
```
async function getHexAddress() {
  return await hweb3.getHexAddress('qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy');
}
```

### fromHexAddress(hexAddress)
Converts a hex address to Html format.
```
async function fromHexAddress() {
  return await hweb3.fromHexAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3');
}
```

### getBlockCount()
Gets the current block height of your local Html node.
```
async function getBlockCount() {
  return await hweb3.getBlockCount();
}
```

### getTransaction(txid)
Gets the transaction details of the transaction id.
```
async function getTransaction(args) {
  const {
    transactionId, // string
  } = args;

  return await hweb3.getTransactionReceipt(transactionId);
}
```

### getTransactionReceipt(txid)
Gets the transaction receipt of the transaction id.
```
async function getTransactionReceipt(args) {
  const {
    transactionId, // string
  } = args;

  return await hweb3.getTransactionReceipt(transactionId);
}
```

### listUnspent()
Gets the unspent outputs that can be used.
```
async function listUnspent() {
  return await hweb3.listUnspent();
}
```

### searchLogs(fromBlock, toBlock, addresses, topics, contractMetadata, removeHexPrefix)
Gets the logs given the params on the blockchain.

The `contractMetadata` param contains the contract names and ABI that you would like to parse. An example of one is:
```
# contract_metadata.js
module.exports = {
  EventFactory: {
    address: 'd53927df927be7fc51ce8bf8b998cb6611c266b0',
    abi: [{ constant: true, inputs: [{ name: '', type: 'bytes32' }], name: 'topics', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_oracle', type: 'address' }, { name: '_name', type: 'bytes32[10]' }, { name: '_resultNames', type: 'bytes32[10]' }, { name: '_bettingEndBlock', type: 'uint256' }, { name: '_resultSettingEndBlock', type: 'uint256' }], name: 'createTopic', outputs: [{ name: 'topicEvent', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [{ name: '_name', type: 'bytes32[10]' }, { name: '_resultNames', type: 'bytes32[10]' }, { name: '_bettingEndBlock', type: 'uint256' }, { name: '_resultSettingEndBlock', type: 'uint256' }], name: 'doesTopicExist', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { inputs: [{ name: '_addressManager', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, name: '_topicAddress', type: 'address' }, { indexed: true, name: '_creator', type: 'address' }, { indexed: true, name: '_oracle', type: 'address' }, { indexed: false, name: '_name', type: 'bytes32[10]' }, { indexed: false, name: '_resultNames', type: 'bytes32[10]' }, { indexed: false, name: '_bettingEndBlock', type: 'uint256' }, { indexed: false, name: '_resultSettingEndBlock', type: 'uint256' }], name: 'TopicCreated', type: 'event' }],
  },

  TopicEvent: {
    abi: [{ constant: false, inputs: [{ name: '_resultIndex', type: 'uint8' }, { name: '_sender', type: 'address' }, { name: '_amount', type: 'uint256' }], name: 'voteFromOracle', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'totalBotValue', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '_oracleIndex', type: 'uint8' }], name: 'getOracle', outputs: [{ name: '', type: 'address' }, { name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'address' }], name: 'didWithdraw', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'resultSet', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'status', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getFinalResult', outputs: [{ name: '', type: 'uint8' }, { name: '', type: 'string' }, { name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'resultNames', outputs: [{ name: '', type: 'bytes32' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'oracles', outputs: [{ name: 'didSetResult', type: 'bool' }, { name: 'oracleAddress', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'finalizeResult', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: '_oracle', type: 'address' }, { name: '_resultIndex', type: 'uint8' }, { name: '_consensusThreshold', type: 'uint256' }], name: 'centralizedOracleSetResult', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'totalQtumValue', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_consensusThreshold', type: 'uint256' }], name: 'invalidateOracle', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'getBetBalances', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'calculateQtumContributorWinnings', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getVoteBalances', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getTotalVotes', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_better', type: 'address' }, { name: '_resultIndex', type: 'uint8' }], name: 'bet', outputs: [], payable: true, stateMutability: 'payable', type: 'function' }, { constant: false, inputs: [{ name: '_resultIndex', type: 'uint8' }, { name: '_currentConsensusThreshold', type: 'uint256' }], name: 'votingOracleSetResult', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'getTotalBets', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getEventName', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'invalidResultIndex', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'numOfResults', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'withdrawWinnings', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'calculateBotContributorWinnings', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { inputs: [{ name: '_owner', type: 'address' }, { name: '_centralizedOracle', type: 'address' }, { name: '_name', type: 'bytes32[10]' }, { name: '_resultNames', type: 'bytes32[10]' }, { name: '_bettingEndBlock', type: 'uint256' }, { name: '_resultSettingEndBlock', type: 'uint256' }, { name: '_addressManager', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'constructor' }, { payable: true, stateMutability: 'payable', type: 'fallback' }, { anonymous: false, inputs: [{ indexed: true, name: '_eventAddress', type: 'address' }, { indexed: false, name: '_finalResultIndex', type: 'uint8' }], name: 'FinalResultSet', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: '_winner', type: 'address' }, { indexed: false, name: '_qtumTokenWon', type: 'uint256' }, { indexed: false, name: '_botTokenWon', type: 'uint256' }], name: 'WinningsWithdrawn', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: '_previousOwner', type: 'address' }, { indexed: true, name: '_newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event' }],
  },
};
```

Usage:
```
const ContractMetadata = require('./contract_metadata');

async function(args) {
  let {
    fromBlock, // number
    toBlock, // number
    addresses, // string array
    topics // string array
  } = args;

  if (addresses === undefined) {
    addresses = [];
  }
  if (topics === undefined) {
    topics = [];
  }

  // removeHexPrefix = true removes the '0x' hex prefix from all hex values
  return await hweb3.searchLogs(fromBlock, toBlock, addresses, topics, contractMetadata, true);
}
```

## Contract.js
Instantiate a new instance of `Contract`: 
```
const { Hweb3 } = require('hweb3');

const hweb3 = new Hweb3('http://bodhi:bodhi@localhost:13889');

// contractAddress = The address of your contract deployed on the blockchain
const contractAddress = 'f7b958eac2bdaca0f225b86d162f263441d23c19';

// contractAbi = The ABI of the contract
const contractAbi = [{"constant":false,"inputs":[{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_lastResultIndex","type":"uint8"},{"name":"_arbitrationEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"createDecentralizedOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_lastResultIndex","type":"uint8"},{"name":"_arbitrationEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"doesDecentralizedOracleExist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_bettingEndBlock","type":"uint256"},{"name":"_resultSettingEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"createCentralizedOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"},{"name":"_eventAddress","type":"address"},{"name":"_eventName","type":"bytes32[10]"},{"name":"_eventResultNames","type":"bytes32[10]"},{"name":"_numOfResults","type":"uint8"},{"name":"_bettingEndBlock","type":"uint256"},{"name":"_resultSettingEndBlock","type":"uint256"},{"name":"_consensusThreshold","type":"uint256"}],"name":"doesCentralizedOracleExist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"oracles","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_addressManager","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contractAddress","type":"address"},{"indexed":true,"name":"_oracle","type":"address"},{"indexed":true,"name":"_eventAddress","type":"address"},{"indexed":false,"name":"_name","type":"bytes32[10]"},{"indexed":false,"name":"_resultNames","type":"bytes32[10]"},{"indexed":false,"name":"_numOfResults","type":"uint8"},{"indexed":false,"name":"_bettingEndBlock","type":"uint256"},{"indexed":false,"name":"_resultSettingEndBlock","type":"uint256"},{"indexed":false,"name":"_consensusThreshold","type":"uint256"}],"name":"CentralizedOracleCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_contractAddress","type":"address"},{"indexed":true,"name":"_eventAddress","type":"address"},{"indexed":false,"name":"_name","type":"bytes32[10]"},{"indexed":false,"name":"_resultNames","type":"bytes32[10]"},{"indexed":false,"name":"_numOfResults","type":"uint8"},{"indexed":false,"name":"_lastResultIndex","type":"uint8"},{"indexed":false,"name":"_arbitrationEndBlock","type":"uint256"},{"indexed":false,"name":"_consensusThreshold","type":"uint256"}],"name":"DecentralizedOracleCreated","type":"event"}];

// Create a Contract instance from the Hweb3 instance
const contract = hweb3.Contract(contractAddress, contractAbi);
```

### call(methodName, params)
Executes a `callcontract`
```
// callcontract on a method named 'bettingEndBlock'
async function exampleCall(args) {
  const {
    senderAddress, // address
  } = args;

  return await contract.call('bettingEndBlock', {
    methodArgs: [],
    senderAddress: senderAddress,
  });
}
```

### send(methodName, params)
Executes a `sendtocontract`
```
// sendtocontract on a method named 'setResult'
async function exampleSend(args) {
  const {
    resultIndex, // number
    senderAddress, // address
  } = args;

  return await contract.send('setResult', {
    methodArgs: [resultIndex],
    gasLimit: 1000000, // setting the gas limit to 1 million
    senderAddress: senderAddress,
  });
}
```

## Encoder
`Encoder` static functions are exposed in Hweb3 instances.
```
const { Hweb3 } = require('hweb3');

const hweb3 = new Hweb3('http://bodhi:bodhi@localhost:13889');
hweb3.encoder.objToHash(abiObj, isFunction);
hweb3.encoder.addressToHex(address);
hweb3.encoder.boolToHex(value);
hweb3.encoder.intToHex(num);
hweb3.encoder.uintToHex(num);
hweb3.encoder.stringToHex(string, maxCharLen);
hweb3.encoder.stringArrayToHex(strArray, numOfItems);
hweb3.encoder.padHexString(hexStr);
hweb3.encoder.constructData(abi, methodName, args);
```

## Decoder
`Decoder` static functions are exposed in Hweb3 instances.
```
const { Hweb3 } = require('hweb3');

const hweb3 = new Hweb3('http://althash:password@localhost:14889');
hweb3.decoder.toHtmlAddress(hexAddress, isMainnet);
hweb3.decoder.removeHexPrefix(value);
hweb3.decoder.decodeSearchLog(rawOutput, contractMetadata, removeHexPrefix);
hweb3.decoder.decodeCall(rawOutput, contractABI, methodName, removeHexPrefix);
```

## Utils
`Utils` static functions are exposed in Hweb3 instances.
```
const { Hweb3 } = require('hweb3');

const hweb3 = new Hweb3('http://althash:password@localhost:14889');
hweb3.utils.paramsCheck(methodName, params, required, validators);
hweb3.utils.appendHexPrefix(value);
hweb3.utils.trimHexPrefix(str);
hweb3.utils.chunkString(str, length);
hweb3.utils.toUtf8(hex);
hweb3.utils.fromUtf8(str);
hweb3.utils.isJson(str);
hweb3.utils.isHtmlAddress(address);
```

## Running Tests
You need to create a `.env` file in the root folder with the following variables in the following formats. Change it to how your environment is setup.
```
HTML_RPC_ADDRESS='http://althash:password@localhost:14889'
SENDER_ADDRESS='hMZK8FNPRm54jvTLAGEs1biTCgyCkcsmna'
WALLET_PASSPHRASE='bodhi'
```
