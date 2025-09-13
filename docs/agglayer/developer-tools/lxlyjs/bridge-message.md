---
title: Bridge Message
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Bridge Message
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Enable cross-chain smart contract communication and execution using Lxly.js
  </p>
</div>

## Overview

Message bridging enables smart contracts on different chains to communicate and execute functions across networks. Unlike asset bridging which transfers tokens, message bridging transfers executable data and triggers contract interactions on the destination network.

**Key Features:**

- **Cross-Chain Communication**: Smart contracts can call functions on other chains
- **Data Transfer**: Send structured data and parameters across networks
- **Contract Execution**: Trigger state changes on destination contracts
- **IBridgeMessageReceiver**: Target contracts must implement the message receiver interface

## Basic Message Bridging

### Send Cross-Chain Message

```javascript
const { LxLyClient, use } = require('@maticnetwork/lxlyjs');
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-web3');

// Initialize client (see Client Initialization guide)
const client = await initializeClient();

async function sendCrossChainMessage() {
  try {
    // Encode message data
    const message = "Hello from Ethereum!";
    const encodedData = client.client.providers[0].provider
      .encodeParameters([message], ['string']);
    
    // Send bridge message
    const bridge = client.bridges[0];  // Source network bridge
    const result = await bridge.bridgeMessage(
      1,  // Destination network
      '0xReceiverContractAddress',  // Target contract
      true,  // Force update global exit root
      encodedData  // Message data
    );
    
    const txHash = await result.getTransactionHash();
    console.log('Message bridge transaction:', txHash);
    
    return txHash;
  } catch (error) {
    console.error('Cross-chain message failed:', error);
    throw error;
  }
}
```

### Message with ETH Value

```javascript
async function sendMessageWithETH() {
  try {
    const message = "Payment notification";
    const encodedData = client.client.providers[0].provider
      .encodeParameters([message, userAddress], ['string', 'address']);
    
    const bridge = client.bridges[0];
    const result = await bridge.bridgeMessage(
      1,  // Destination network
      '0xPaymentContractAddress',
      true,
      encodedData,
      {
        value: '100000000000000000',  // 0.1 ETH
        gasLimit: 350000
      }
    );
    
    const txHash = await result.getTransactionHash();
    console.log('Message with ETH transaction:', txHash);
    
    return txHash;
  } catch (error) {
    console.error('Message with ETH failed:', error);
    throw error;
  }
}
```

## Message Receiver Contract

Target contracts must implement the `IBridgeMessageReceiver` interface:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface IBridgeMessageReceiver {
    function onMessageReceived(
        address originAddress,
        uint32 originNetwork,
        bytes memory data
    ) external payable;
}

contract CrossChainReceiver is IBridgeMessageReceiver {
    string public lastMessage;
    address public lastSender;
    uint32 public lastOriginNetwork;
    uint256 public messageCount;
    
    event MessageReceived(
        address indexed originAddress,
        uint32 originNetwork,
        string message
    );
    
    function onMessageReceived(
        address originAddress,
        uint32 originNetwork,
        bytes memory data
    ) external payable override {
        // Decode the message
        string memory message = abi.decode(data, (string));
        
        // Store message details
        lastMessage = message;
        lastSender = originAddress;
        lastOriginNetwork = originNetwork;
        messageCount++;
        
        emit MessageReceived(originAddress, originNetwork, message);
    }
    
    function getMessageDetails() external view returns (
        string memory message,
        address sender,
        uint32 originNetwork,
        uint256 count
    ) {
        return (lastMessage, lastSender, lastOriginNetwork, messageCount);
    }
}
```

## Claiming Messages

### Claim Message

```javascript
async function claimMessage(bridgeTransactionHash) {
  try {
    // Build claim payload
    const payload = await client.bridgeUtil.buildPayloadForClaim(
      bridgeTransactionHash,
      0,  // Source network
      0   // Bridge index
    );
    
    // Claim message (this will execute onMessageReceived)
    const bridge = client.bridges[1];  // Destination network bridge
    const claimResult = await bridge.claimMessage(
      payload.smtProof,
      payload.smtProofRollup,
      payload.globalIndex,
      payload.mainnetExitRoot,
      payload.rollupExitRoot,
      payload.originNetwork,
      payload.originTokenAddress,
      payload.destinationNetwork,
      payload.destinationAddress,
      payload.amount,
      payload.metadata,
      { gasLimit: 400000 }
    );
    
    const claimTxHash = await claimResult.getTransactionHash();
    console.log('Message claim transaction:', claimTxHash);
    
    return claimTxHash;
  } catch (error) {
    console.error('Message claim failed:', error);
    throw error;
  }
}
```

### Verify Message Execution

```javascript
async function verifyMessageExecution(receiverContractAddress) {
  try {
    const receiverABI = [
      {
        "inputs": [],
        "name": "lastMessage",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMessageDetails",
        "outputs": [
          {"internalType": "string", "name": "message", "type": "string"},
          {"internalType": "address", "name": "sender", "type": "address"},
          {"internalType": "uint32", "name": "originNetwork", "type": "uint32"},
          {"internalType": "uint256", "name": "count", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    
    const receiverContract = client.contract(receiverABI, receiverContractAddress, 1);
    
    // Check if message was received
    const lastMessage = await receiverContract.read('lastMessage');
    const messageDetails = await receiverContract.read('getMessageDetails');
    
    console.log('Last received message:', lastMessage);
    console.log('Message details:', messageDetails);
    
    return { lastMessage, messageDetails };
  } catch (error) {
    console.error('Message verification failed:', error);
    throw error;
  }
}
```
