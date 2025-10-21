---
title: Route Discovery
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Route Discovery
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Find optimal cross-chain routes with advanced filtering, optimization, and risk assessment
  </p>
</div>

## Overview

Route discovery is the core functionality of Multi-Bridge Routes, enabling you to find the best possible paths for cross-chain operations. The SDK's `getRoutes()` method queries ARC API to aggregate routes from multiple bridge providers and present them with comprehensive analysis.

## Basic Route Discovery

### Simple Route Request

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

// Find routes from Ethereum to Katana
const routes = await core.getRoutes({
  fromChainId: 1,        // Ethereum
  toChainId: 747474,     // Katana
  fromTokenAddress: '0xA0b86a33E6441b8c4C8C0e4b8c4C8C0e4b8c4C8C0', // USDC on Ethereum
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',   // USDC on Katana
  amount: '1000000000',  // 1000 USDC (6 decimals)
  fromAddress: '0xYourWalletAddress',
  slippage: 0.5, // 0.5% slippage tolerance
});

console.log(`Found ${routes.length} available routes`);
```

### Route Response Structure

Each route contains comprehensive information:

```typescript
interface Route {
  // Route identification
  id: string;
  provider: string[];        // ['agglayer'] or ['lifi', 'agglayer']
  
  // Basic information
  fromChainId: number;
  toChainId: number;
  fromAmount: string;        // Input amount
  toAmount: string;          // Expected output amount
  toAmountMin: string;       // Minimum guaranteed output
  
  // Cost analysis
  gasCostUSD: string;        // Gas costs in USD
  totalCostUSD: string;      // Total cost including fees
  executionDuration: number; // Expected time in seconds
  
  // Route details
  steps: Step[];             // Individual bridge/swap steps
  feeCosts: FeeCost[];       // Fee breakdown
  gasCosts: GasCost[];       // Gas cost breakdown
  riskFactors: RiskFactors;  // Risk assessment
}
```

## Advanced Route Discovery

### Cross-Chain Route Discovery

```typescript
// Base → Katana (cross-chain routing)
const crossChainRoutes = await core.getRoutes({
  fromChainId: 8453,     // Base
  toChainId: 747474,     // Katana
  fromTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',   // USDC on Katana
  amount: '3000000000',  // 3000 USDC
  fromAddress: '0xYourAddress',
  slippage: 1.5, // Higher slippage for cross-chain
  preferences: {
    prioritize: 'COST', // Optimize for lowest cost
    minAmountToReceive: '2950000000', // Minimum acceptable output
  },
});

// Analyze cross-chain route
const route = crossChainRoutes[0];
console.log(`Cross-chain route: ${route.provider.join(' + ')}`);
console.log(`Steps: ${route.steps.length}`);

route.steps.forEach((step, index) => {
  console.log(`Step ${index + 1}: ${step.action.fromChainId} → ${step.action.toChainId} via ${step.tool}`);
});
```

### Route Optimization Preferences

```typescript
// Cost optimization
const costOptimizedRoutes = await core.getRoutes({
  // ... basic parameters
  preferences: {
    prioritize: 'COST',
    excludeProtocols: ['expensive-bridge'], // Exclude specific providers
  },
});

// Speed optimization
const speedOptimizedRoutes = await core.getRoutes({
  // ... basic parameters  
  preferences: {
    prioritize: 'SPEED',
    includeProtocols: ['agglayer', 'lifi'], // Only include specific providers
  },
});

// Custom optimization
const customRoutes = await core.getRoutes({
  // ... basic parameters
  preferences: {
    minAmountToReceive: '995000000', // Minimum output requirement
    gasEstimate: '500000', // Maximum gas willing to spend
  },
});
```

## Working Example

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

const routes = await core.getRoutes({
  fromChainId: 8453,    // Base
  toChainId: 747474,    // Katana
  fromTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',
  amount: '1000000000', // 1000 USDC
  fromAddress: '0xUserAddress',
  slippage: 1.0,
  preferences: {
    prioritize: 'COST',
  },
});
```

