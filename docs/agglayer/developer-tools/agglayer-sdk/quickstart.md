---
title: Quickstart
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Quickstart
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Complete your first cross-chain bridge operation in 10 minutes with a direct Base → Katana example
  </p>
</div>

## Overview

This quickstart guide walks you through a complete cross-chain bridge operation: **Base → Katana** using WETH. You'll learn how the Agglayer SDK's Multi-Bridge Routes module uses ARC API to discover optimal cross-chain routes and build executable transactions.

**What You'll Learn:**

- How to discover optimal cross-chain routes between Base and Katana
- How to build executable transactions from routes
- How ARC API aggregates bridge providers (LiFi, Agglayer)
- How to handle WETH bridging scenarios

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and **npm** installed
- **Agglayer SDK** installed (`npm install @agglayer/sdk@beta`)
- **Basic understanding** of blockchain transactions and cross-chain bridging

## Your First Cross-Chain Bridge

### Step 1: Initialize the SDK

Create a new file `quickstart-example.ts`:

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

async function quickstartExample() {
  // Initialize SDK with zero configuration
  const sdk = new AggLayerSDK();
  const core = sdk.getCore();
  
  console.log('🚀 Agglayer SDK initialized with ARC API integration');
}

quickstartExample();
```

The SDK uses intelligent defaults and connects to the ARC API automatically.

### Step 2: Discover Available Routes

```typescript
// Add to your quickstart-example.ts
async function quickstartExample() {
  const sdk = new AggLayerSDK();
  const core = sdk.getCore();
  
  console.log('🔍 Discovering routes: Base → Katana (WETH)...');
  
  const routes = await core.getRoutes({
    fromChainId: 8453,    // Base
    toChainId: 747474,    // Katana
    fromTokenAddress: '0x4200000000000000000000000000000000000006', // WETH on Base
    toTokenAddress: '0xEE7D8BCFb72bC1880D0Cf19822eB0A2e6577aB62',   // WETH on Katana
    amount: '1000000000000000000', // 1 ETH (18 decimals)
    fromAddress: '0xYourWalletAddress',
    slippage: 0.5, // 0.5% slippage tolerance
  });
  
  console.log(`✅ Found ${routes.length} available routes`);
}
```

### Step 3: Analyze Route Options

```typescript
// Add route analysis
const bestRoute = routes[0]; // Routes are sorted by optimization preference

console.log('\n📊 Best Route Analysis:');
console.log(`Provider: ${bestRoute.provider.join(' + ')}`);
console.log(`Input: ${formatAmount(bestRoute.fromAmount, 18)} WETH on Base`);
console.log(`Output: ${formatAmount(bestRoute.toAmount, 18)} WETH on Katana`);
console.log(`Steps: ${bestRoute.steps.length} (direct Base → Katana route)`);
console.log(`Execution Time: ${bestRoute.executionDuration}s`);
console.log(`Total Cost: $${bestRoute.totalCostUSD}`);

// Show step breakdown
console.log('\n🛤️ Route Breakdown:');
bestRoute.steps.forEach((step, index) => {
  console.log(`  Step ${index + 1}: ${step.type} via ${step.tool}`);
  console.log(`    ${step.action.fromChainId} → ${step.action.toChainId}`);
  console.log(`    ${formatAmount(step.action.fromAmount, 18)} → ${formatAmount(step.action.toAmount, 18)} WETH`);
});

// Helper function for formatting
function formatAmount(amount: string, decimals: number = 18): string {
  const value = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  return (Number(value) / Number(divisor)).toString();
}
```

### Step 4: Build Executable Transaction

```typescript
// Build the transaction ready for user signing
console.log('\n🔨 Building executable transaction...');

const unsignedTx = await core.getUnsignedTransaction(bestRoute);

console.log('✅ Transaction ready for signing:');
console.log(`To: ${unsignedTx.to}`);
console.log(`Value: ${unsignedTx.value} wei`);
console.log(`Gas Limit: ${unsignedTx.gasLimit}`);
console.log(`Chain ID: ${unsignedTx.chainId} (Base)`);
console.log(`Data: ${unsignedTx.data.slice(0, 100)}...`);
```

### Step 5: Check Approval Requirements

```typescript
// Check if token approval is needed
console.log('\n🔍 Checking approval requirements...');

const approvalStep = bestRoute.steps.find(step => step.estimate.approvalAddress);

if (approvalStep) {
  console.log('⚠️ Approval required before bridge:');
  console.log(`  Token: ${approvalStep.action.fromToken.address}`);
  console.log(`  Spender: ${approvalStep.estimate.approvalAddress}`);
  console.log(`  Amount: ${formatAmount(approvalStep.action.fromAmount, 18)} WETH`);
  console.log('💡 User must approve this amount first');
} else {
  console.log('✅ No approval required - ready to execute');
}
```

### Complete Example

Here's the complete quickstart example:

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

async function quickstartExample() {
  try {
    console.log('🚀 Agglayer SDK Quickstart: Base → Katana WETH Bridge');
    
    // Step 1: Initialize SDK
    const sdk = new AggLayerSDK();
    const core = sdk.getCore();
    console.log('✅ SDK initialized');
    
    // Step 2: Discover routes
    console.log('\n🔍 Discovering optimal routes...');
    const routes = await core.getRoutes({
      fromChainId: 8453,    // Base
      toChainId: 747474,    // Katana  
      fromTokenAddress: '0x4200000000000000000000000000000000000006', // WETH on Base
      toTokenAddress: '0xEE7D8BCFb72bC1880D0Cf19822eB0A2e6577aB62',   // WETH on Katana
      amount: '1000000000000000000', // 1 ETH (18 decimals)
      fromAddress: '0xYourWalletAddress',
      slippage: 0.5,
    });
    
    if (routes.length === 0) {
      console.log('❌ No routes found for this combination');
      return;
    }
    
    // Step 3: Analyze best route
    const bestRoute = routes[0];
    console.log(`✅ Best route: ${bestRoute.provider.join(' + ')}`);
    console.log(`Expected output: ${formatAmount(bestRoute.toAmount, 18)} WETH`);
    console.log(`Total cost: $${bestRoute.totalCostUSD}`);
    console.log(`Execution time: ${bestRoute.executionDuration}s`);
    
    // Step 4: Build transaction
    console.log('\n🔨 Building executable transaction...');
    const transaction = await core.getUnsignedTransaction(bestRoute);
    console.log('✅ Transaction ready for wallet signing');
    
    // Step 5: Show next steps
    console.log('\n🎯 Next Steps:');
    console.log('1. Present transaction to user wallet for signing');
    console.log('2. Submit signed transaction to Base network');
    console.log('3. Monitor transaction execution across bridges');
    console.log('4. Handle claim process if using Agglayer Bridge');
    
  } catch (error) {
    console.error('❌ Quickstart failed:', error);
  }
}

function formatAmount(amount: string, decimals: number = 18): string {
  return (Number(BigInt(amount)) / Number(BigInt(10 ** decimals))).toString();
}

quickstartExample();
```

## Run Your Example

```bash
# Save the code as quickstart-example.ts
npx ts-node quickstart-example.ts
```

Expected output:
```
🚀 Agglayer SDK Quickstart: Base → Katana WETH Bridge
✅ SDK initialized
🔍 Discovering optimal routes...
✅ Best route: lifi
Expected output: 0.999 WETH
Total cost: $0.032
Execution time: 3s
🔨 Building executable transaction...
✅ Transaction ready for wallet signing
🎯 Next Steps:
1. Present transaction to user wallet for signing
2. Submit signed transaction to Base network  
3. Monitor transaction execution across bridges
```

## What You Just Did

### **Route Aggregation Magic**

You just experienced the power of **ARC API route aggregation**:

1. **Multi-Provider Search**: The SDK queried both Agglayer Bridge and LiFi Bridge for available routes
2. **Direct Route Discovery**: Found an optimal direct route from Base → Katana using LiFi Relay
3. **Optimization**: Routes were automatically sorted by your preferences (cost, speed, output amount)
4. **Transaction Building**: The route was converted to a single executable transaction

### **Behind the Scenes**

The **Base → Katana** route works like this:

1. **LiFi Relay**: Direct bridge between Base and Katana chains using LiFi's relay infrastructure
2. **ARC API**: Aggregated multiple bridge providers and found the most efficient direct route
3. **Single Step**: Despite being cross-chain, the operation executes as one transaction

This demonstrates the power of route aggregation - the ARC API finds the most efficient path and presents it as a simple transaction to users.

## What's Next?

Now that you've completed your first cross-chain bridge operation, explore more advanced features:

### **Production Deployment**
Learn how to build production-ready applications with comprehensive error handling, monitoring, and real-time transaction tracking:

- **[Multi-Bridge Routing on Mainnet](/agglayer/developer-tools/agglayer-sdk/multi-bridge-routes/step-by-step-guide/multi-bridge-routing-mainnet/)** - Complete production implementation guide with service architecture and monitoring

### **Direct Bridge Control**
Use Native Routes for direct blockchain operations and local testing:

- **[Native Bridge Overview](/agglayer/developer-tools/agglayer-sdk/agglayer-native-bridge/)** - Direct bridge contract interactions with full control
- **[Local Testing with AggSandbox](/agglayer/developer-tools/agglayer-sdk/agglayer-native-bridge/step-by-step-guide/native-bridge-locally/)** - Test locally with instant feedback

### **Deep Dive**
Explore the full capabilities of the SDK:

- **[Multi-Bridge Routes Operations](/agglayer/developer-tools/agglayer-sdk/multi-bridge-routes/)** - Chain metadata, route discovery, transaction building
- **[Native Bridge Operations](/agglayer/developer-tools/agglayer-sdk/agglayer-native-bridge/operations/erc20-operations/)** - ERC20 operations, bridge operations, chain management
- **[API Reference](/agglayer/developer-tools/agglayer-sdk/api-reference/)** - Complete TypeScript API documentation with all methods and interfaces
