# bc-web3js
A TypeScript SDK for interacting with the ByteChain Testnet Alpha. Simplifies client-side account management, secure transaction signing, and reliable node communication.


## Installation
To install the bc-web3js SDK in your project, use npm or yarn:


```bash

npm install bc-web3js

```

or

```bash

yarn add bc-web3js

```

## Getting Started
Before using the bc-web3js SDK, you'll need an instance of your core ByteChain Blockchain implementation. This SDK is designed to interact with that instance, which typically represents a running ByteChain node (local or remote).

Make sure to import your BlockChain class from your core ByteChain module:


## 1. Basic Setup & Querying Balance
This example demonstrates how to initialize the bc-web3js SDK and perform basic queries like checking an account's balance and validating an address.



```typescript
// For TypeScript projects:

import BCWeb3 from 'bc-web3js';

// 1. Get a url of the blockchain node/peer you wish to use
const nodeUrl = "http://your-node-url-and-port";

// 2. Initialize BCWeb3 with your blockchain instance
const bcWeb3 = new BCWeb3(myByteChainInstance);

// 3. Query an account balance
const exampleAddress = 'BC1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7';

const balance = bcWeb3.get_bal(exampleAddress);

console.log(`Balance of ${exampleAddress}: ${balance} BC`);

```

## 2. Account Creation & Transaction Signing
This section covers how to create new ByteChain accounts, load existing ones using private keys, and sign transactions.


```typescript
// For TypeScript projects:

import BCWeb3 from 'bc-web3js';


const nodeUrl = "http://your-node-url-and-port";

const bcWeb3 = new BCWeb3(nodeUrl);

// 1. Create a new account (generates a new private key internally)
const newAccount = bcWeb3.createAccount();

console.log('--- New Account Created ---');

console.log('Address:', newAccount.blockchain_addr);

// 2. Load an existing account using its private key

//    Replace 'YOUR_EXISTING_PRIVATE_KEY_HEX_HERE' with an actual private key

//    associated with an account that has funds on your testnet.

const existingPrivateKey = 'YOUR_EXISTING_PRIVATE_KEY_HEX_HERE';

const senderAccount = bcWeb3.load_account(existingPrivateKey);

console.log('\n--- Loaded Account ---');

console.log('Sender Address:', senderAccount.blockchain_addr);

console.log('Sender Balance:', bcWeb3.get_acc_bal(senderAccount.blockchain_addr));


// 3. Create and sign a transaction

//    This returns a signed transaction object, but does NOT send it to the network.

const recipientAddress = 'BC_ANOTHER_ADDRESS_HERE'; // Replace with a recipient ByteChain address

const amount = 10; // Amount of Byte to send



```



## 3. Blockchain Data Querying

Retrieve information about blocks and transactions from the blockchain instance.



```typescript

// For TypeScript projects:

import BCWeb3 from 'bc-web3js';

import { BlockChain } from 'your-bytechain-core-module'; // Adjust path to your BlockChain implementation



const myByteChainInstance = new BlockChain(); // Replace with your actual BlockChain instance

const bcWeb3 = new BCWeb3(myByteChainInstance);



// 1. Get the latest block

const latestBlock = bcWeb3.get_latest_block();

if (latestBlock) {

    console.log('\n--- Latest Block ---');

    console.log('Block Height:', latestBlock.block_header.block_height);

    console.log('Block Hash:', latestBlock.block_header.block_hash);

    console.log('Transactions in block:', latestBlock.transactions.length);

} else {

    console.log('No blocks found in the blockchain instance.');

}



// 2. Get a block by its height (e.g., block 0 - the genesis block)

const genesisBlock = bcWeb3.get_block(0);

if (genesisBlock) {

    console.log('\n--- Genesis Block ---');

    console.log('Block Hash:', genesisBlock.block_header.block_hash);

    // ... other block details

} else {

    console.log('Block at height 0 not found.');

}



// 3. Get transactions currently in the mempool (transaction pool)

const txPool = bcWeb3.get_transaction_pool();

console.log(`\n--- Transaction Pool (${txPool.length} transactions) ---`);

txPool.forEach(tx => {

    console.log(`- ID: ${tx.id}, From: ${tx.sender}, To: ${tx.recipient}, Amount: ${tx.amount}`);

});



// 4. Get a specific transaction by ID

//    Replace 'YOUR_TRANSACTION_ID_HERE' with an actual transaction ID from your testnet.

const sampleTxId = 'YOUR_TRANSACTION_ID_HERE';

const retrievedTx = bcWeb3.get_transaction(sampleTxId);

if (retrievedTx) {

    console.log('\n--- Retrieved Transaction ---');

    console.log(`Found transaction with ID: ${retrievedTx.id}`);

    console.log(`Details: From ${retrievedTx.sender} to ${retrievedTx.recipient}, Amount: ${retrievedTx.amount}`);

} else {

    console.log(`\nTransaction with ID ${sampleTxId} not found in chain or mempool.`);

}

```