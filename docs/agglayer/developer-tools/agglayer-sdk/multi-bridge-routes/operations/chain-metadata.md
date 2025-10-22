---
title: Chain Metadata
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Chain Metadata
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Access comprehensive chain and token information for building dynamic bridge interfaces
  </p>
</div>

## Overview

Chain metadata operations provide access to comprehensive information about supported chains, tokens, and bridge capabilities. This data is essential for building dynamic user interfaces, token selectors, and chain dropdowns in cross-chain applications.

## Getting All Supported Chains

### Retrieving Supported Chains

Get all chains supported by the ARC API with their configurations, bridge addresses, and available routes.

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

// Get all supported chains
const chains = await core.getAllChains();
console.log(`Found ${chains.chains.length} supported chains`);
```

### Chain Information Structure

Each chain object contains comprehensive metadata:

```typescript
interface Chain {
  chainId: number; // Standard chain ID (1 for Ethereum)
  networkId: number; // Agglayer network ID (0 for Ethereum)
  name: string; // Human-readable name
  bridgeAddress: string; // Bridge contract address
  supportedRoutes: string[]; // ['agglayer', 'lifi', etc.]
  nativeCurrency: {
    name: string; // "Ethereum"
    symbol: string; // "ETH"
    decimals: number; // 18
  };
  blockExplorerUrl: string; // Explorer URL
  rpcUrl: string; // RPC endpoint
}
```

## Getting Specific Chain Metadata

### Filtering Chains by Chain IDs

Get metadata for specific chains by providing their chain IDs, including network information and supported bridge routes.

```typescript
// Get metadata for specific chains
const specificChains = await core.getChainMetadataByChainIds([1, 747474, 8453]);
```

### Getting Chains with Token Lists

Retrieve chains along with their supported tokens for building token selectors and validating bridge pairs.

```typescript
// Get chains with their supported tokens
const chainsWithTokens = await core.getChainDataAndTokensByChainIds([1, 747474]);
```

## Token Metadata Operations

### Getting Token Information

Retrieve detailed token metadata including name, symbol, decimals, and origin network information for any supported token.

```typescript
// Get specific token metadata
const tokenMetadata = await core.getTokenMetadata({
  tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' // USDC
});
```

## Token Mappings

### Getting Cross-Chain Token Relationships

Retrieve token mappings to understand how tokens are represented across different networks (origin vs wrapped versions).

```typescript
// Get token mappings for cross-chain relationships
const mappings = await core.getTokenMappings({
  tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
});
```



## Working Example

Here's a complete working example from our test suite:

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

// Get all supported chains
const allChains = await core.getAllChains();

// Get specific chain metadata
const specificChains = await core.getChainMetadataByChainIds([1, 747474]);

// Get chains with tokens
const chainsWithTokens = await core.getChainDataAndTokensByChainIds([1, 747474]);
```

