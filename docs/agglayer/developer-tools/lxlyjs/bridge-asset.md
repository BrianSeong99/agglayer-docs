---
title: Bridge Asset
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Bridge Asset
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Complete guide to bridging ERC20 tokens and ETH across chains using Lxly.js
  </p>
</div>

## Overview

Asset bridging is the most fundamental cross-chain operation, enabling users to transfer tokens and native assets between different blockchain networks. This guide covers token transfers with comprehensive examples and best practices.

**Key Features:**

- **Token Transfers**: Bridge ERC20 tokens between chains
- **ETH Bridging**: Transfer native ETH across networks
- **Automatic Wrapping**: Tokens are automatically wrapped on destination chains
- **1:1 Backing**: Perfect value preservation across all networks

## Token Instance Creation

### Initialize Tokens

```javascript
const { LxLyClient, use } = require('@maticnetwork/lxlyjs');
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-web3');

// Initialize client (see Client Initialization guide)
const client = await initializeClient();

// Create ERC20 token instances
const erc20Ethereum = client.erc20('0x3fd0A53F4Bf853985a95F4Eb3F9C9FDE1F8e2b53', 0);  // Network 0
const erc20Polygon = client.erc20('0x3cc6055f4e88638c46daa9cf5f5fc54a801e5f03', 1);   // Network 1

// ETH token (use zero address)
const ethToken = client.erc20('0x0000000000000000000000000000000000000000', 0);
```

### Token Types

| Token Type | Address | Description |
|------------|---------|-------------|
| **Native ETH** | `0x0000000000000000000000000000000000000000` | Native Ether on Ethereum |
| **ERC20 Token** | Contract address | Any ERC20-compliant token |
| **Wrapped Token** | Generated address | Token representation on destination chain |

## Basic Asset Bridging

### Bridge ERC20 Tokens

```javascript
async function bridgeERC20() {
  const amount = '1000000000000000000';  // 1 token (18 decimals)
  const destinationAddress = '0xRecipientAddress';
  const destinationNetwork = 1;  // Polygon zkEVM
  
  try {
    // Check and handle approval if needed
    const isApprovalNeeded = await erc20Ethereum.isApprovalNeeded();
    if (isApprovalNeeded) {
      const allowance = await erc20Ethereum.getAllowance(userAddress);
      if (parseInt(allowance) < parseInt(amount)) {
        console.log('🔐 Approving tokens...');
        const approveResult = await erc20Ethereum.approve(amount);
        await approveResult.getReceipt();
        console.log('✅ Approval completed');
      }
    }
    
    // Bridge tokens
    const bridgeResult = await erc20Ethereum.bridgeAsset(
      amount,
      destinationAddress,
      destinationNetwork,
      {
        gasLimit: 300000,
        forceUpdateGlobalExitRoot: true
      }
    );
    
    const bridgeTxHash = await bridgeResult.getTransactionHash();
    console.log('Bridge transaction:', bridgeTxHash);
    
    return bridgeTxHash;
  } catch (error) {
    console.error('Bridge failed:', error);
    throw error;
  }
}
```

### Bridge ETH

```javascript
async function bridgeETH() {
  const ethAmount = '100000000000000000';  // 0.1 ETH
  const destinationAddress = '0xRecipientAddress';
  
  try {
    const bridgeResult = await ethToken.bridgeAsset(
      ethAmount,
      destinationAddress,
      1,  // Destination network (Polygon)
      {
        value: ethAmount,  // ETH value to send
        gasLimit: 250000
      }
    );
    
    const txHash = await bridgeResult.getTransactionHash();
    console.log('ETH bridge transaction:', txHash);
    
    return txHash;
  } catch (error) {
    console.error('ETH bridge failed:', error);
    throw error;
  }
}
```

### Bridge with Permit

For tokens that support permit (gasless approvals):

```javascript
async function bridgeWithPermit() {
  const amount = '2000000000000000000';  // 2 tokens
  const destinationAddress = '0xRecipientAddress';
  const destinationNetwork = 1;
  
  try {
    // Bridge with permit (single transaction, no separate approval)
    const bridgeResult = await erc20Ethereum.bridgeAssetWithPermit(
      amount,
      destinationAddress,
      destinationNetwork,
      {
        gasLimit: 350000,
        forceUpdateGlobalExitRoot: true
      }
    );
    
    const txHash = await bridgeResult.getTransactionHash();
    console.log('Bridge with permit transaction:', txHash);
    
    return txHash;
  } catch (error) {
    console.error('Bridge with permit failed:', error);
    throw error;
  }
}
```

## Claiming Assets

### Check Claim Status

```javascript
async function checkClaimStatus(bridgeTransactionHash, sourceNetwork) {
  try {
    // Check if bridge is claimable
    const isClaimable = await client.isBridgeClaimable(bridgeTransactionHash, sourceNetwork);
    console.log('Is claimable:', isClaimable);
    
    // Check if already claimed
    const isClaimed = await client.isBridged(bridgeTransactionHash, sourceNetwork, 1);
    console.log('Is claimed:', isClaimed);
    
    return { isClaimable, isClaimed };
  } catch (error) {
    console.error('Error checking claim status:', error);
    throw error;
  }
}
```

### Claim Bridged Assets

```javascript
async function claimAssets(bridgeTransactionHash, sourceNetwork) {
  const destinationNetwork = 1;  // Claiming on Polygon
  
  try {
    // Get destination token instance
    const destinationToken = client.erc20('0x3cc6055f4e88638c46daa9cf5f5fc54a801e5f03', destinationNetwork);
    
    // Claim the bridged assets
    const claimResult = await destinationToken.claimAsset(
      bridgeTransactionHash,
      sourceNetwork,
      {
        gasLimit: 400000
      }
    );
    
    const claimTxHash = await claimResult.getTransactionHash();
    console.log('Claim transaction:', claimTxHash);
    
    return claimTxHash;
  } catch (error) {
    console.error('Claim failed:', error);
    throw error;
  }
}
```

### Check Claimed Token Balances

```javascript
async function verifyClaimedAssets(userAddress, destinationNetwork) {
  try {
    // Get destination token instance
    const destinationToken = client.erc20('0x3cc6055f4e88638c46daa9cf5f5fc54a801e5f03', destinationNetwork);
    
    // Check current balance
    const currentBalance = await destinationToken.getBalance(userAddress);
    console.log('Current balance on destination:', currentBalance);
    
    // Convert to readable format (assuming 18 decimals)
    const readableBalance = (parseInt(currentBalance) / 10**18).toString();
    console.log('Readable balance:', readableBalance, 'tokens');
    
    return currentBalance;
  } catch (error) {
    console.error('Error checking claimed assets:', error);
    throw error;
  }
}
```

## Token Information

### Get Token Metadata

```javascript
// Get wrapped token address on destination
const wrappedTokenAddress = await sourceToken.bridge.getMappedTokenInfo(
  0,  // Origin network
  '0x3fd0A53F4Bf853985a95F4Eb3F9C9FDE1F8e2b53'  // Origin token address
);
console.log('Wrapped token address:', wrappedTokenAddress);

// Pre-calculate wrapped token address (even if not deployed yet)
const precalculatedAddress = await sourceToken.bridge.precalculatedMappedTokenInfo(
  0,  // Origin network
  '0x3fd0A53F4Bf853985a95F4Eb3F9C9FDE1F8e2b53'  // Origin token address
);
console.log('Precalculated address:', precalculatedAddress);

// Get origin token info from wrapped token
const originInfo = await destinationToken.bridge.getOriginTokenInfo(
  '0x3cc6055f4e88638c46daa9cf5f5fc54a801e5f03'  // Wrapped token address
);
console.log('Origin network:', originInfo[0]);
console.log('Origin token address:', originInfo[1]);
```