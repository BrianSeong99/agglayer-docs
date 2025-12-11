---
title: Native bridge (Mainnet)
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Native bridge (Mainnet)
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Step-by-step guide for production deployment on mainnet
  </p>
</div>

## Overview

This guide walks through using Agglayer Native Bridge on mainnet for production deployment. You'll learn how to bridge real assets with proper security considerations.

Before starting, ensure you have mainnet RPC access, real funds for testing, and have completed testing on local and testnet environments.

## Step 1: Initialize SDK

Configure the SDK for mainnet networks with production RPC URLs.

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1, // Ethereum
    customRpcUrls: {
      1: 'https://eth-mainnet.g.alchemy.com/v2/your-key',
      747474: 'https://rpc.katana.network',
    },
  },
});

const native = sdk.getNative();
```

## Step 2: Validate Balances

Check you have sufficient tokens and ETH for gas fees on the source network.

```typescript
const ethereumUsdc = native.erc20('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 1);
const balance = await ethereumUsdc.getBalance('0xYourAddress');
const ethBalance = await native.getNativeBalance('0xYourAddress', 1);

console.log(`USDC Balance: ${balance}`);
console.log(`ETH Balance: ${ethBalance}`);
```

## Step 3: Build Approval

Check allowance and build approval transaction for the bridge contract, then sign and broadcast it to the blockchain.

```typescript
const bridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
const amount = '1000000000'; // 1000 USDC
const allowance = await ethereumUsdc.getAllowance('0xYourAddress', bridgeAddress);

if (BigInt(allowance) < BigInt(amount)) {
  const approvalTx = await ethereumUsdc.buildApprove(
    bridgeAddress,
    amount,
    '0xYourAddress'
  );
  
  // Sign and send to blockchain (swap below code with your own wallet client)
  const receipt = await wallet.sendTransaction(approvalTx);
  await receipt.wait(); // Wait for confirmation
  console.log(`Approval confirmed: ${receipt.hash}`);
}
```

## Step 4: Build Bridge Transaction

Build the bridge transaction to transfer tokens from Ethereum to Katana, then sign and broadcast it.

```typescript
const bridgeTx = await ethereumUsdc.bridgeTo(
  20, // Katana network ID
  '0xYourAddress',
  amount,
  '0xYourAddress',
  {
    forceUpdateGlobalExitRoot: true,
    permitData: '0x',
  }
);

// Sign and send to blockchain (swap below code with your own wallet client)
const receipt = await wallet.sendTransaction(bridgeTx);
await receipt.wait(); // Wait for confirmation
const bridgeTxHash = receipt.hash;
console.log(`Bridge transaction confirmed: ${bridgeTxHash}`);
```

## Step 5: Wait for AggKit Processing

Wait for AggKit to process the bridge event (timing varies on mainnet based on network congestion).

```typescript
console.log('Waiting for AggKit to process bridge event...');
// Typically 10-30 minutes on mainnet
await new Promise(resolve => setTimeout(resolve, 1800000)); // 30 minutes
```

## Step 6: Build Claim Transaction

Build the claim transaction on Katana, then sign and send it to retrieve your bridged tokens.

```typescript
const katanaUsdc = native.erc20('0x203a662b0bd271a6ed5a60edfbd04bfce608fd36', 747474);
const claimTx = await katanaUsdc.claimAsset(
  bridgeTxHash,
  0, // Source network (Ethereum)
  0, // Bridge index
  '0xYourAddress'
);

// Sign and send to blockchain (swap below code with your own wallet client)
const claimReceipt = await wallet.sendTransaction(claimTx);
await claimReceipt.wait(); // Wait for confirmation
console.log(`Claim transaction confirmed: ${claimReceipt.hash}`);
```

## Complete Example

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

async function mainnetNativebridgeExample() {
  try {
    // Initialize SDK
    const sdk = new AggLayerSDK({
      mode: [SDK_MODES.NATIVE],
      native: {
        defaultNetwork: 1,
        customRpcUrls: {
          1: 'https://eth-mainnet.g.alchemy.com/v2/your-key',
          747474: 'https://rpc.katana.network',
        },
      },
    });
    
    const native = sdk.getNative();
    const ethereumUsdc = native.erc20('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 1);
    const katanaUsdc = native.erc20('0x203a662b0bd271a6ed5a60edfbd04bfce608fd36', 747474);
    
    // Check balances
    const balance = await ethereumUsdc.getBalance('0xYourAddress');
    const ethBalance = await native.getNativeBalance('0xYourAddress', 1);
    console.log(`USDC: ${balance}, ETH: ${ethBalance}`);
    
    // Build approval
    const bridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
    const amount = '1000000000';
    
    const allowance = await ethereumUsdc.getAllowance('0xYourAddress', bridgeAddress);
    if (BigInt(allowance) < BigInt(amount)) {
      const approvalTx = await ethereumUsdc.buildApprove(
        bridgeAddress,
        amount,
        '0xYourAddress'
      );
      // Sign and send
    }
    
    // Build bridge transaction
    const bridgeTx = await ethereumUsdc.bridgeTo(
      20,
      '0xYourAddress',
      amount,
      '0xYourAddress',
      { forceUpdateGlobalExitRoot: true, permitData: '0x' }
    );
    // Sign and send
    
    // Wait for AggKit
    console.log('Waiting for AggKit processing...');
    await new Promise(resolve => setTimeout(resolve, 1800000)); // 30 minutes
    
    // Build claim
    const claimTx = await katanaUsdc.claimAsset(
      '0xBridgeTxHash',
      0,
      0,
      '0xYourAddress'
    );
    // Sign and send
    
    console.log('Mainnet native bridge completed!');
    
  } catch (error) {
    console.error('Example failed:', error);
  }
}

mainnetNativebridgeExample();
```
