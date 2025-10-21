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

### Basic Chain Discovery

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

// Get all supported chains
const chains = await core.getAllChains();
console.log(`Found ${chains.chains.length} supported chains`);

// Display chain information
chains.chains.forEach(chain => {
  console.log(`${chain.name}:`);
  console.log(`  Chain ID: ${chain.chainId}`);
  console.log(`  Network ID: ${chain.networkId}`);
  console.log(`  Bridge: ${chain.bridgeAddress}`);
  console.log(`  Routes: ${chain.supportedRoutes.join(', ')}`);
});
```

### Chain Information Structure

Each chain object contains comprehensive metadata:

```typescript
interface Chain {
  chainId: number;           // Standard chain ID (1 for Ethereum)
  networkId: number;         // Agglayer network ID (0 for Ethereum)
  name: string;              // Human-readable name
  bridgeAddress: string;     // Bridge contract address
  supportedRoutes: string[]; // ['agglayer', 'lifi', etc.]
  nativeCurrency: {
    name: string;            // "Ethereum"
    symbol: string;          // "ETH"
    decimals: number;        // 18
  };
  blockExplorerUrl: string;  // Explorer URL
  rpcUrl: string;           // RPC endpoint
}
```

## Getting Specific Chain Metadata

### Filter by Chain IDs

```typescript
// Get metadata for specific chains
const specificChains = await core.getChainMetadataByChainIds([1, 747474, 8453]);

console.log(`Retrieved ${specificChains.chains.length} chains`);
specificChains.chains.forEach(chain => {
  console.log(`\n${chain.name}:`);
  console.log(`  Chain ID: ${chain.chainId}`);
  console.log(`  Network ID: ${chain.networkId}`);
  console.log(`  Native Currency: ${chain.nativeCurrency.symbol}`);
  console.log(`  Block Explorer: ${chain.blockExplorerUrl}`);
  console.log(`  Supported Routes: ${chain.supportedRoutes.join(', ')}`);
});
```

### Chain Data with Supported Tokens

```typescript
// Get chains with their supported tokens
const chainsWithTokens = await core.getChainDataAndTokensByChainIds([1, 747474]);

chainsWithTokens.chains.forEach(chain => {
  console.log(`\n${chain.name} Tokens:`);
  
  if (chain.fromTokens && chain.fromTokens.length > 0) {
    console.log(`  From Tokens: ${chain.fromTokens.length} available`);
    chain.fromTokens.slice(0, 3).forEach(token => {
      console.log(`    - ${token.symbol}: ${token.address}`);
    });
  }
  
  if (chain.toTokens && chain.toTokens.length > 0) {
    console.log(`  To Tokens: ${chain.toTokens.length} available`);
  }
});
```

## Token Metadata Operations

### Getting Token Information

```typescript
// Get specific token metadata
const tokenMetadata = await core.getTokenMetadata({
  tokenAddress: '0xA0b86a33E6441b8c4C8C0e4b8c4C8C0e4b8c4C8C0' // USDC
});

console.log('Token Metadata:');
console.log(`  Name: ${tokenMetadata.name}`);
console.log(`  Symbol: ${tokenMetadata.symbol}`);
console.log(`  Decimals: ${tokenMetadata.decimals}`);
console.log(`  Origin Network: ${tokenMetadata.originTokenNetwork}`);
console.log(`  Origin Address: ${tokenMetadata.originTokenAddress}`);
```

### Token Metadata Structure

```typescript
interface TokenMetadata {
  name: string;                    // "USD Coin"
  symbol: string;                  // "USDC"
  decimals: number;                // 6
  address: string;                 // Token contract address
  originTokenNetwork: number;      // Origin network ID
  originTokenAddress: string;      // Original token address
  wrappedTokenNetwork?: number;    // Wrapped network ID
  wrappedTokenAddress?: string;    // Wrapped token address
}
```

## Token Mappings

### Cross-Chain Token Relationships

```typescript
// Get token mappings for cross-chain relationships
const mappings = await core.getTokenMappings({
  tokenAddress: '0xA0b86a33E6441b8c4C8C0e4b8c4C8C0e4b8c4C8C0'
});

console.log('Token Mappings:');
mappings.forEach(mapping => {
  console.log(`  Origin: Network ${mapping.originTokenNetwork} - ${mapping.originTokenAddress}`);
  console.log(`  Wrapped: Network ${mapping.wrappedTokenNetwork} - ${mapping.wrappedTokenAddress}`);
});
```

### Token Mapping Structure

```typescript
interface TokenMapping {
  originTokenNetwork: number;      // Original network ID
  originTokenAddress: string;      // Original token address
  wrappedTokenNetwork: number;     // Wrapped network ID
  wrappedTokenAddress: string;     // Wrapped token address
}
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

