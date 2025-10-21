---
title: Transaction Building
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Transaction Building
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Convert discovered routes into executable transactions ready for wallet signing
  </p>
</div>

## Overview

Transaction building converts discovered routes into executable blockchain transactions. The SDK handles multi-step routes, approval requirements, and gas estimation to provide transactions ready for wallet signing.

## Basic Transaction Building

### From Route to Transaction

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

// Step 1: Discover routes
const routes = await core.getRoutes({
  fromChainId: 1,
  toChainId: 747474,
  fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36', // USDC on Katana
  amount: '1000000000',
  fromAddress: '0xUserAddress',
  slippage: 0.5,
});

// Step 2: Build transaction from best route
const selectedRoute = routes[0];
const unsignedTx = await core.getUnsignedTransaction(selectedRoute);
```

### Transaction Structure

```typescript
interface UnsignedTransaction {
  to: string;              // Contract address to call
  value: string;           // ETH value in wei (usually "0" for token operations)
  data: string;            // Encoded function call data
  gasLimit: string;        // Gas limit estimate
  chainId: number;         // Target chain ID
  gasPrice?: string;       // Gas price (legacy)
  maxFeePerGas?: string;   // EIP-1559 max fee
  maxPriorityFeePerGas?: string; // EIP-1559 priority fee
}
```

## Approval Requirements

```typescript
// Check if route requires token approval
const approvalStep = selectedRoute.steps.find(step => step.estimate.approvalAddress);

if (approvalStep) {
  console.log('Approval required before bridge transaction');
}
```

## Claim Transaction Building

```typescript
if (route.provider.includes('agglayer')) {
  const claimTx = await core.getClaimUnsignedTransaction({
    sourceNetworkId: 0, // Ethereum network ID
    depositCount: 12345, // From bridge transaction
  });
}
```

## Working Example

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

const routes = await core.getRoutes({
  fromChainId: 1,
  toChainId: 747474,
  fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36', // USDC on Katana
  amount: '1000000000',
  fromAddress: '0xUserAddress',
  slippage: 0.5,
});

const selectedRoute = routes[0];
const unsignedTx = await core.getUnsignedTransaction(selectedRoute);
```
