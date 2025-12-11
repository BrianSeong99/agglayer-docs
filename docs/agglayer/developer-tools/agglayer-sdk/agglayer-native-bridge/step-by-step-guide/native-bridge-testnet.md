---
title: Native bridge (Testnet)
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Native bridge (Testnet)
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Step-by-step guide for testnet development with real network conditions
  </p>
</div>

## Overview

This guide walks through using Agglayer Native Bridge on testnet networks for integration validation. You'll learn how to bridge assets on testnet with real network conditions and actual gas costs.

Before starting, ensure you have testnet RPC access and testnet tokens (Sepolia ETH, test USDC, etc.).

## Step 1: Initialize SDK

Configure the SDK for testnet networks with appropriate RPC URLs.

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 11155111, // Sepolia
    customRpcUrls: {
      11155111: 'https://eth-sepolia.g.alchemy.com/v2/your-key',
      747474: 'https://rpc.katana.network',
    },
  },
});

const native = sdk.getNative();
```

## Step 2: Check Balances

Verify you have sufficient testnet tokens and ETH for gas fees.

```typescript
const sepoliaUsdc = native.erc20('0xSepoliaUSDCAddress', 11155111);
const balance = await sepoliaUsdc.getBalance('0xYourAddress');
const ethBalance = await native.getNativeBalance('0xYourAddress', 11155111);

console.log(`USDC Balance: ${balance}`);
console.log(`ETH Balance: ${ethBalance}`);
```

## Step 3: Build Approval

Check allowance and build approval transaction if needed, then sign and broadcast it to the blockchain.

```typescript
const bridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
const amount = '10000000'; // 10 USDC
const allowance = await sepoliaUsdc.getAllowance('0xYourAddress', bridgeAddress);

if (BigInt(allowance) < BigInt(amount)) {
  const approvalTx = await sepoliaUsdc.buildApprove(
    bridgeAddress,
    amount,
    '0xYourAddress'
  );
  
  // Sign and send to blockchain (swap below code with your own wallet client)
  const receipt = await wallet.sendTransaction(approvalTx);
  await receipt.wait(); // Wait for confirmation
}
```

## Step 4: Build Bridge Transaction

Build the bridge transaction to transfer tokens from Sepolia to Katana, then sign and broadcast it.

```typescript
const bridgeTx = await sepoliaUsdc.bridgeTo(
  20, // Katana network ID
  '0xYourAddress',
  amount,
  '0xYourAddress',
  {
    forceUpdateGlobalExitRoot: true,
    permitData: '0x',
  }
);

// Sign and send to blockchain (swap below code with your wallet client)
const receipt = await wallet.sendTransaction(bridgeTx);
await receipt.wait(); // Wait for confirmation
const bridgeTxHash = receipt.hash;
console.log(`Bridge transaction confirmed: ${bridgeTxHash}`);
```

## Step 5: Wait for AggKit Processing

Wait for AggKit to process the bridge event (typically 2-5 minutes on testnet).

```typescript
console.log('Waiting for AggKit to process bridge event...');
await new Promise(resolve => setTimeout(resolve, 300000)); // 5 minutes
```

## Step 6: Build Claim Transaction

Build the claim transaction on the destination network, then sign and send it to retrieve your bridged tokens.

```typescript
const katanaUsdc = native.erc20('0xKatanaUSDCAddress', 747474);
const claimTx = await katanaUsdc.claimAsset(
  bridgeTxHash,
  0, // Source network (Sepolia)
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
import { ethers } from 'ethers';

async function testnetNativebridgeExample() {
  try {
    // Initialize SDK
    const sdk = new AggLayerSDK({
      mode: [SDK_MODES.NATIVE],
      native: {
        defaultNetwork: 11155111,
        customRpcUrls: {
          11155111: 'https://eth-sepolia.g.alchemy.com/v2/your-key',
          747474: 'https://rpc.katana.network',
        },
      },
    });
    
    const native = sdk.getNative();
    const sepoliaUsdc = native.erc20('0xSepoliaUSDCAddress', 11155111);
    const katanaUsdc = native.erc20('0xKatanaUSDCAddress', 747474);
    
    // Check balance
    const balance = await sepoliaUsdc.getBalance('0xYourAddress');
    console.log(`Sepolia USDC: ${balance}`);
    
    // Build approval
    const bridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
    const amount = '10000000';
    
    const allowance = await sepoliaUsdc.getAllowance('0xYourAddress', bridgeAddress);
    if (BigInt(allowance) < BigInt(amount)) {
      const approvalTx = await sepoliaUsdc.buildApprove(
        bridgeAddress,
        amount,
        '0xYourAddress'
      );
      // Sign and send
    }
    
    // Build bridge transaction
    const bridgeTx = await sepoliaUsdc.bridgeTo(
      20,
      '0xYourAddress',
      amount,
      '0xYourAddress',
      { forceUpdateGlobalExitRoot: true, permitData: '0x' }
    );
    // Sign and send
    
    // Wait for AggKit
    console.log('Waiting for AggKit processing...');
    await new Promise(resolve => setTimeout(resolve, 300000));
    
    // Build claim
    const claimTx = await katanaUsdc.claimAsset(
      '0xBridgeTxHash',
      0,
      0,
      '0xYourAddress'
    );
    // Sign and send
    
    console.log('Testnet native bridge completed!');
    
  } catch (error) {
    console.error('Example failed:', error);
  }
}

testnetNativebridgeExample();
```
