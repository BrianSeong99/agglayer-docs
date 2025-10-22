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

### Finding Available Routes

Discover available routes between chains with cost analysis, execution time estimates, and risk assessment for each option.

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

// Find routes from Ethereum to Katana
const routes = await core.getRoutes({
  fromChainId: 1,        // Ethereum
  toChainId: 747474,     // Katana
  fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',   // USDC on Katana
  amount: '1000000000',  // 1000 USDC (6 decimals)
  fromAddress: '0xYourWalletAddress',
  slippage: 0.5, // 0.5% slippage tolerance
});

console.log(`Found ${routes.length} available routes`);
```

### Route Response Structure

Each route contains comprehensive information about the bridge path:

```typescript
interface Route {
  // Route identification
  id: string;
  provider: string[];        // ['agglayer'] or ['lifi']
  
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

### Route Optimization with Preferences

Customize route discovery with optimization preferences to prioritize cost, speed, or output amount. Set minimum acceptable outputs and exclude specific protocols.

```typescript
// Cost optimization
const costOptimizedRoutes = await core.getRoutes({
  fromChainId: 8453,
  toChainId: 747474,
  fromTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',
  amount: '3000000000',
  fromAddress: '0xYourAddress',
  slippage: 0.5,
  preferences: {
    prioritize: 'COST',
    minAmountToReceive: '2950000000',
  },
});
```

### Route Preferences Options

Available preferences for customizing route discovery:

```typescript
interface RoutePreferences {
  prioritize?: 'COST' | 'SPEED';
  minAmountToReceive?: string;
  gasEstimate?: string;
  excludeProtocols?: string[];
  includeProtocols?: string[];
}
```

- **`prioritize`**: Decide whether you care more about minimizing cost (fees + slippage) or maximizing speed (time to complete).
- **`minAmountToReceive`**: Specify the minimum amount of the destination token you are willing to accept. Routes yielding less due to slippage/fees will be filtered out.
- **`gasEstimate`**: Optionally specify a gas cost budget or threshold. The routing engine can consider this when choosing the route.
- **`excludeProtocols`**: List protocols (bridges or DEXes) that you do not want to use. For example, if you don't trust a certain bridge, you can exclude it.
- **`includeProtocols`**: List protocols to prefer or constrain to. Use this when you only want trusted bridges or a specific DEX aggregator.

Speed optimization with protocol filtering:

```typescript
const speedOptimizedRoutes = await core.getRoutes({
  fromChainId: 1,
  toChainId: 747474,
  fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',
  amount: '1000000000',
  fromAddress: '0xYourAddress',
  slippage: 0.5,
  preferences: {
    prioritize: 'SPEED',
    includeProtocols: ['agglayer', 'lifi'],
  },
});
```

Custom constraints with minimum output:

```typescript
const constrainedRoutes = await core.getRoutes({
  fromChainId: 1,
  toChainId: 747474,
  fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',
  amount: '1000000000',
  fromAddress: '0xYourAddress',
  slippage: 0.5,
  preferences: {
    minAmountToReceive: '995000000', // Must receive at least 995 USDC
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

