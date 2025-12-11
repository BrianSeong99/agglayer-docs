---
title: Native Bridge (Locally)
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Native Bridge (Locally)
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Step-by-step guide for local development using AggSandbox
  </p>
</div>

## Overview

This guide walks through using Agglayer Native Bridge with AggSandbox for local development. You'll learn how to bridge assets locally with instant feedback and automatic claiming.

**Important**: SDK manual claiming doesn't work with AggSandbox due to API endpoint differences. Use AggSandbox's auto-claiming service instead.

## Prerequisites

Before starting, ensure you have AggSandbox running locally and the Agglayer SDK installed.

## Step 1: Start AggSandbox

Start AggSandbox to run local L1 and L2 networks with pre-deployed bridge contracts and test tokens.

```bash
# Clone AggSandbox repository
git clone https://github.com/0xPolygon/aggsandbox.git
cd aggsandbox

# Install AggSandbox CLI
make install

# Start AggSandbox with auto-claiming enabled
aggsandbox start -c  # The -c flag enables auto-claiming service
```

This will start:
- **L1 network** on `http://localhost:8545` with pre-deployed bridge contract
- **L2 network** on `http://localhost:8546` with pre-deployed bridge contract
- **AggKit service** for proof generation and merkle tree management
- **Auto-claiming service** to automatically claim bridged assets on destination chains

The `-c` flag is important because SDK manual claiming doesn't work with AggSandbox due to API endpoint differences. Auto-claiming will handle claims automatically after ~30 seconds.

## Step 2: Initialize SDK

Configure the SDK to connect to AggSandbox's local networks.

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1,
    customRpcUrls: {
      1: 'http://localhost:8545',    // AggSandbox L1
      1101: 'http://localhost:8546', // AggSandbox L2
    },
  },
});

const native = sdk.getNative();
```

## Step 3: Check Balances

Check token balances on both L1 and L2 networks before bridging.

```typescript
const token = native.erc20('0xTokenAddress', 1);
const balance = await token.getBalance('0xUserAddress');
console.log(`Balance: ${balance}`);
```

## Step 4: Build Approval

Check allowance and build approval transaction if needed for the bridge contract. The SDK builds the transaction, but you need to sign and send it to the blockchain for execution.

```typescript
const bridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
const allowance = await token.getAllowance('0xUserAddress', bridgeAddress);

if (BigInt(allowance) < BigInt(amount)) {
  const approvalTx = await token.buildApprove(
    bridgeAddress,
    amount,
    '0xUserAddress'
  );
  
  // Sign and send to blockchain using your wallet (swap below code with your own wallet client)
  const receipt = await wallet.sendTransaction(approvalTx);
  await receipt.wait(); // Wait for confirmation
}
```

## Step 5: Build Bridge Transaction

Build the bridge transaction to transfer tokens from L1 to L2, then sign and broadcast it to the blockchain.

```typescript
const bridgeTx = await token.bridgeTo(
  1101, // L2 network ID
  '0xRecipientAddress',
  '1000000000000000000', // 1 token
  '0xUserAddress',
  {
    forceUpdateGlobalExitRoot: true,
    permitData: '0x',
  }
);

// Sign and send to blockchain (swap below code with your own wallet client)
const receipt = await wallet.sendTransaction(bridgeTx);
await receipt.wait(); // Wait for confirmation
console.log(`Bridge transaction confirmed: ${receipt.hash}`);
```

## Step 6: Wait for Auto-Claiming

AggSandbox's auto-claiming service will automatically claim the bridged assets on L2 after ~30 seconds.

```typescript
console.log('Waiting for auto-claiming service (30s)...');
await new Promise(resolve => setTimeout(resolve, 30000));

// Verify tokens were automatically claimed
const l2Balance = await l2Token.getBalance('0xRecipientAddress');
console.log(`L2 balance after auto-claim: ${l2Balance}`);
```

## Complete Example

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';
import { ethers } from 'ethers';

async function localNativeBridgeExample() {
  try {
    // Initialize SDK
    const sdk = new AggLayerSDK({
      mode: [SDK_MODES.NATIVE],
      native: {
        defaultNetwork: 1,
        customRpcUrls: {
          1: 'http://localhost:8545',
          1101: 'http://localhost:8546',
        },
      },
    });
    
    const native = sdk.getNative();
    
    // Create token instances
    const l1Token = native.erc20('0xTokenAddress', 1);
    const l2Token = native.erc20('0xTokenAddress', 1101);
    
    // Check balances
    const balance = await l1Token.getBalance('0xUserAddress');
    console.log(`L1 balance: ${balance}`);
    
    // Build approval if needed
    const bridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
    const amount = '1000000000000000000';
    
    const allowance = await l1Token.getAllowance('0xUserAddress', bridgeAddress);
    if (BigInt(allowance) < BigInt(amount)) {
      const approvalTx = await l1Token.buildApprove(
        bridgeAddress,
        amount,
        '0xUserAddress'
      );
      // Sign and send approvalTx with wallet
    }
    
    // Build bridge transaction
    const bridgeTx = await l1Token.bridgeTo(
      1101,
      '0xUserAddress',
      amount,
      '0xUserAddress',
      { forceUpdateGlobalExitRoot: true, permitData: '0x' }
    );
    // Sign and send bridgeTx with wallet
    
    // Wait for auto-claiming
    console.log('Waiting for auto-claiming (30s)...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Verify final balance
    const l2Balance = await l2Token.getBalance('0xUserAddress');
    console.log(`L2 balance: ${l2Balance}`);
    
  } catch (error) {
    console.error('Example failed:', error);
  }
}

localNativeBridgeExample();
```
