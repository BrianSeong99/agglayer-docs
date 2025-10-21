---
title: Multi-Bridge Routing (Mainnet)
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Multi-Bridge Routing (Mainnet)
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Step-by-step guide for multi-bridge routing using the Agglayer SDK on mainnet
  </p>
</div>

## Overview

This guide walks through the complete process of multi-bridge routing using the Agglayer SDK. You'll learn how to discover routes, build transactions, and monitor cross-chain operations.

Before starting, ensure you have completed the [Quickstart tutorial](../../quickstart.md) and have mainnet RPC access for the chains you want to bridge between.

## Step 1: Initialize the SDK

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();
```

## Step 2: Discover Routes

```typescript
// Get available routes for your bridge operation
const routes = await core.getRoutes({
  fromChainId: 1,       // Ethereum
  toChainId: 747474,    // Katana
  fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36', // USDC on Katana
  amount: '1000000000', // 1000 USDC (6 decimals)
  fromAddress: '0xYourWalletAddress',
  slippage: 0.5,
  preferences: {
    prioritize: 'COST', // or 'SPEED', 'OUTPUT'
  },
});

console.log(`Found ${routes.length} routes`);
```

## Step 3: Analyze Routes

```typescript
// Routes are automatically sorted by your preferences
const bestRoute = routes[0];

console.log(`Best route: ${bestRoute.provider.join(' + ')}`);
console.log(`Expected output: ${formatAmount(bestRoute.toAmount, 6)} USDC`);
console.log(`Total cost: $${bestRoute.totalCostUSD}`);
console.log(`Execution time: ${bestRoute.executionDuration || 'N/A'}s`);

// Check all available routes
routes.forEach((route, index) => {
  console.log(`Route ${index + 1}: ${route.provider.join(' + ')}`);
  console.log(`  Output: ${formatAmount(route.toAmount, 6)} tokens`);
  console.log(`  Cost: $${route.totalCostUSD}`);
});
```

## Step 4: Build Transaction

```typescript
// Build the transaction for the selected route
const transaction = await core.getUnsignedTransaction(bestRoute);

console.log('Transaction ready for signing:');
console.log(`To: ${transaction.to}`);
console.log(`Gas limit: ${transaction.gasLimit}`);
console.log(`Chain ID: ${transaction.chainId}`);
```

## Step 5: Check Approval Requirements

```typescript
// Check if token approval is needed before bridging
const approvalStep = bestRoute.steps.find(step => step.estimate.approvalAddress);

if (approvalStep) {
  console.log('Approval required before bridge transaction');
  console.log(`Token: ${approvalStep.action.fromToken.address}`);
  console.log(`Spender: ${approvalStep.estimate.approvalAddress}`);
  console.log(`Amount: ${approvalStep.action.fromAmount}`);
} else {
  console.log('No approval required');
}
```

## Step 6: Monitor Transaction

```typescript
// After sending the transaction, monitor its status
async function monitorTransaction(txHash: string) {
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    try {
      const transactions = await core.getTransactions({ limit: 100 });
      const tx = transactions.transactions.find(t => t.transactionHash === txHash);
      
      if (tx) {
        console.log(`Transaction status: ${tx.status}`);
        
        if (tx.status === 'COMPLETED') {
          console.log('Bridge transaction completed!');
          console.log(`Final amount: ${tx.receiving?.amount || 'Unknown'}`);
          break;
        } else if (tx.status === 'FAILED') {
          throw new Error('Bridge transaction failed');
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute
      attempts++;
      
    } catch (error) {
      console.error('Monitoring error:', error);
      attempts++;
    }
  }
}
```

## Complete Example

Here's a complete walkthrough example:

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

async function multiBridgeExample() {
  try {
    console.log('Multi-Bridge Routing Example - Ethereum → Katana');
    
    // Initialize SDK
    const sdk = new AggLayerSDK();
    const core = sdk.getCore();
    
    // Step 1: Verify supported chains
    const chains = await core.getAllChains();
    const ethereumChain = chains.chains.find(c => c.chainId === 1);
    const katanaChain = chains.chains.find(c => c.chainId === 747474);
    
    console.log(`Ethereum supported: ${ethereumChain ? 'Yes' : 'No'}`);
    console.log(`Katana supported: ${katanaChain ? 'Yes' : 'No'}`);
    
    // Step 2: Discover routes
    const routes = await core.getRoutes({
      fromChainId: 1,
      toChainId: 747474,
      fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',
      amount: '1000000000',
      fromAddress: '0x222112d597336CB201221Bf3acC0a6230475aF99',
      slippage: 0.5,
      preferences: {
        prioritize: 'COST',
      },
    });
    
    if (routes.length === 0) {
      console.log('No routes found');
      return;
    }
    
    // Step 3: Analyze best route
    const bestRoute = routes[0];
    console.log(`Best route: ${bestRoute.provider.join(' + ')}`);
    console.log(`Expected output: ${formatAmount(bestRoute.toAmount, 6)} USDC`);
    console.log(`Total cost: $${bestRoute.totalCostUSD}`);
    console.log(`Execution time: ${bestRoute.executionDuration || 'N/A'}s`);
    
    // Step 4: Build transaction
    const transaction = await core.getUnsignedTransaction(bestRoute);
    console.log('Transaction ready for signing');
    console.log(`To: ${transaction.to}`);
    console.log(`Gas limit: ${transaction.gasLimit}`);
    
    // Step 5: Check approval requirements
    const approvalStep = bestRoute.steps.find(step => step.estimate.approvalAddress);
    if (approvalStep) {
      console.log('Approval required before bridge transaction');
    } else {
      console.log('No approval required');
    }
    
    console.log('\nMulti-bridge routing walkthrough completed!');
    
  } catch (error) {
    console.error('Example failed:', error);
  }
}

function formatAmount(amount: string, decimals: number = 18): string {
  return (Number(BigInt(amount)) / Number(BigInt(10 ** decimals))).toString();
}

multiBridgeExample();
```