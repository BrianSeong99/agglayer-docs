---
title: Bridge-and-Call
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Bridge-and-Call
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Advanced atomic operations that combine asset transfers with contract execution using Lxly.js
  </p>
</div>

## Overview

Bridge-and-call is the most advanced cross-chain operation in Lxly.js, enabling atomic transactions that both transfer assets and execute smart contract functions on the destination chain. This powerful feature allows for complex cross-chain workflows in a single transaction.

**Key Features:**

- **Atomic Operations**: Asset transfer and contract execution succeed or fail together
- **No Interface Required**: Target contracts don't need `IBridgeMessageReceiver`
- **JumpPoint Deployment**: Temporary contracts handle execution
- **Fallback Support**: Handles failed executions gracefully

## Basic Bridge-and-Call

### Simple Bridge-and-Call

```javascript
const { LxLyClient, use } = require('@maticnetwork/lxlyjs');
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-web3');

// Initialize client (see Client Initialization guide)
const client = await initializeClient();

async function basicBridgeAndCall() {
  try {
    // Get bridge extension for source network
    const bridgeExtension = client.bridgeExtensions[0];  // Ethereum
    
    // Encode function call for destination contract
    const targetContract = client.contract(targetABI, targetAddress, 1);
    const callData = await targetContract.encodeAbi('receiveTokens', userAddress, amount);
    
    // Execute bridge-and-call
    const result = await bridgeExtension.bridgeAndCall(
      '0x3fd0A53F4Bf853985a95F4Eb3F9C9FDE1F8e2b53',  // Token to bridge
      '1000000000000000000',  // 1 token
      1,  // Destination network (Polygon)
      '0xTargetContractAddress',  // Contract to call
      userAddress,  // Fallback address
      callData,  // Encoded function call
      true  // Force update global exit root
    );
    
    const txHash = await result.getTransactionHash();
    console.log('Bridge-and-call transaction:', txHash);
    
    return txHash;
  } catch (error) {
    console.error('Bridge-and-call failed:', error);
    throw error;
  }
}
```

### Bridge ETH and Call

```javascript
async function bridgeETHAndCall() {
  try {
    const bridgeExtension = client.bridgeExtensions[0];
    
    // Encode function call
    const callData = await targetContract.encodeAbi('processPayment', paymentId, amount);
    
    // Bridge ETH and call contract
    const result = await bridgeExtension.bridgeAndCall(
      '0x0000000000000000000000000000000000000000',  // ETH token (zero address)
      '100000000000000000',  // 0.1 ETH
      1,  // Destination network
      '0xPaymentContractAddress',
      userAddress,  // Fallback address
      callData,
      true,
      undefined,  // No permit data for ETH
      {
        value: '100000000000000000',  // ETH value to send
        gasLimit: 400000
      }
    );
    
    const txHash = await result.getTransactionHash();
    console.log('ETH bridge-and-call transaction:', txHash);
    
    return txHash;
  } catch (error) {
    console.error('ETH bridge-and-call failed:', error);
    throw error;
  }
}
```

### Bridge-and-Call with Permit

```javascript
async function bridgeAndCallWithPermit() {
  const amount = '2000000000000000000';  // 2 tokens
  
  try {
    const sourceToken = client.erc20('0x3fd0A53F4Bf853985a95F4Eb3F9C9FDE1F8e2b53', 0);
    const bridgeExtension = client.bridgeExtensions[0];
    
    // Get permit data for bridge extension
    const bridgeExtensionAddress = bridgeExtension.contractAddress;
    const permitData = await sourceToken.getPermitData(amount, {
      spenderAddress: bridgeExtensionAddress
    });
    
    // Encode target function call
    const callData = await targetContract.encodeAbi('processTokens', amount, userAddress);
    
    // Execute bridge-and-call with permit (no separate approval needed)
    const result = await bridgeExtension.bridgeAndCall(
      '0x3fd0A53F4Bf853985a95F4Eb3F9C9FDE1F8e2b53',
      amount,
      1,  // Destination network
      '0xTargetContractAddress',
      userAddress,
      callData,
      true,
      permitData,  // Permit data for gasless approval
      { gasLimit: 450000 }
    );
    
    const txHash = await result.getTransactionHash();
    console.log('Gasless bridge-and-call transaction:', txHash);
    
    return txHash;
  } catch (error) {
    console.error('Gasless bridge-and-call failed:', error);
    throw error;
  }
}
```

## Target Contract

### Contract Requirements

Bridge-and-call target contracts do NOT need to implement `IBridgeMessageReceiver`. The `JumpPoint` contract handles the bridge reception and calls your contract directly.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BridgeAndCallTarget {
    event TokensReceived(address token, uint256 amount, address from);
    
    mapping(address => uint256) public tokenBalances;
    
    // This function can be called directly by JumpPoint
    function receiveTokens(address token, uint256 amount, address from) external {
        // JumpPoint will transfer tokens to this contract before calling
        require(IERC20(token).balanceOf(address(this)) >= amount, "Tokens not received");
        
        tokenBalances[token] += amount;
        emit TokensReceived(token, amount, from);
    }
    
    // Process payment and execute business logic
    function processPayment(
        address paymentToken,
        uint256 paymentAmount,
        bytes calldata orderData
    ) external {
        require(IERC20(paymentToken).balanceOf(address(this)) >= paymentAmount, "Payment not received");
        
        // Decode and process order
        (uint256 productId, uint256 quantity, address recipient) = abi.decode(orderData, (uint256, uint256, address));
        
        // Execute business logic
        // ...
    }
}
```

## Claiming Bridge-and-Call

### Two-Phase Claiming

Bridge-and-call operations create two separate bridges that must be claimed in sequence:

```javascript
async function claimBridgeAndCall(bridgeTransactionHash, sourceNetwork) {
  const destinationNetwork = 1;
  
  try {
    console.log('🎯 Starting bridge-and-call claim process...');
    
    // Phase 1: Claim asset bridge (deposit_count = 0)
    console.log('📦 Claiming asset bridge...');
    const destinationToken = client.erc20('0xDestinationTokenAddress', destinationNetwork);
    
    const assetClaimResult = await destinationToken.claimAsset(
      bridgeTransactionHash,
      sourceNetwork,
      {
        bridgeIndex: 0,  // Asset bridge is always index 0
        gasLimit: 400000
      }
    );
    
    const assetClaimTxHash = await assetClaimResult.getTransactionHash();
    console.log('✅ Asset claim transaction:', assetClaimTxHash);
    
    // Wait for asset claim confirmation
    await assetClaimResult.getReceipt();
    console.log('✅ Asset claim confirmed');
    
    // Phase 2: Claim message bridge (deposit_count = 1)
    console.log('📨 Claiming message bridge...');
    const bridge = client.bridges[destinationNetwork];
    
    // Build payload for message claim
    const messagePayload = await client.bridgeUtil.buildPayloadForClaim(
      bridgeTransactionHash,
      sourceNetwork,
      1  // Message bridge is always index 1
    );
    
    const messageClaimResult = await bridge.claimMessage(
      messagePayload.smtProof,
      messagePayload.smtProofRollup,
      messagePayload.globalIndex,
      messagePayload.mainnetExitRoot,
      messagePayload.rollupExitRoot,
      messagePayload.originNetwork,
      messagePayload.originTokenAddress,
      messagePayload.destinationNetwork,
      messagePayload.destinationAddress,
      messagePayload.amount,
      messagePayload.metadata,
      { gasLimit: 500000 }
    );
    
    const messageClaimTxHash = await messageClaimResult.getTransactionHash();
    console.log('✅ Message claim transaction:', messageClaimTxHash);
    
    console.log('🎉 Bridge-and-call completed successfully!');
    
    return {
      assetClaimTxHash,
      messageClaimTxHash
    };
    
  } catch (error) {
    console.error('❌ Bridge-and-call claim failed:', error);
    throw error;
  }
}
```

### Verify Contract Execution

```javascript
async function verifyContractExecution(targetContractAddress, expectedChanges) {
  try {
    const targetContract = client.contract(targetABI, targetContractAddress, 1);
    
    // Check if contract state changed as expected
    const results = await Promise.all([
      targetContract.read('tokenBalances', tokenAddress),
      targetContract.read('lastOperationTimestamp'),
      targetContract.read('operationCount')
    ]);
    
    const [tokenBalance, lastOperation, operationCount] = results;
    
    console.log('Contract verification:');
    console.log('  Token balance:', tokenBalance);
    console.log('  Last operation:', new Date(lastOperation * 1000));
    console.log('  Operation count:', operationCount);
    
    // Verify expected changes
    const verified = parseInt(tokenBalance) >= parseInt(expectedChanges.minTokenBalance);
    console.log(verified ? '✅ Verification passed' : '❌ Verification failed');
    
    return {
      tokenBalance,
      lastOperation,
      operationCount,
      verified
    };
    
  } catch (error) {
    console.error('Contract verification failed:', error);
    throw error;
  }
}
```