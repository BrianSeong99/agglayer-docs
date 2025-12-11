---
title: Chain Management
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Chain Management
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Built-in chain registry with support for custom networks, RPC configuration, and multi-environment setups
  </p>
</div>

## Overview

Chain management provides comprehensive network configuration and registry management for the Agglayer SDK, including built-in support for multiple networks, custom RPC configuration, and environment-specific setups for local, testnet, and mainnet development.

## Built-in Network Support

### Getting Network Information

Access built-in network configurations and retrieve supported networks with their chain IDs, RPC URLs, and bridge addresses.

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1,
  },
});

const native = sdk.getNative();
const supportedNetworks = native.getSupportedNetworks();
const networkConfig = native.getNetwork(1);
```

## Custom Network Configuration

### Adding Custom Networks and RPC URLs

Add custom L2 chains and override RPC URLs for existing networks to use premium providers or private endpoints.

```typescript
// Add custom networks
const customSDK = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1,
    chains: [
      {
        chainId: 999999,
        networkId: 999,
        name: 'Custom Test Chain',
        rpcUrl: 'https://custom-rpc.example.com',
        nativeCurrency: { name: 'Custom Token', symbol: 'CUSTOM', decimals: 18 },
        bridgeAddress: '0xCustomBridgeAddress',
        isTestnet: true,
      }
    ],
    customRpcUrls: {
      1: 'https://premium-ethereum-rpc.example.com',
      747474: 'https://premium-katana-rpc.example.com',
    },
  },
});
```

## Environment-Specific Configurations

### Local, Testnet, and Mainnet Setups

Configure the SDK for different development environments with appropriate RPC URLs and network settings.

Local (AggSandbox):

```typescript
const localSDK = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1,
    customRpcUrls: {
      1: 'http://localhost:8545',
      1101: 'http://localhost:8546',
    },
  },
});
```

Testnet:

```typescript
const testnetSDK = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 11155111,
    customRpcUrls: {
      11155111: 'https://eth-sepolia.g.alchemy.com/v2/your-key',
      747474: 'https://rpc.katana.network',
    },
  },
});
```

Mainnet:

```typescript
const mainnetSDK = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1,
    customRpcUrls: {
      1: 'https://eth-mainnet.g.alchemy.com/v2/your-key',
      747474: 'https://rpc.katana.network',
    },
  },
});
```

## Chain Registry Operations

### Accessing the Chain Registry

Access the chain registry directly to query supported chains, check chain support, and filter chains by type (mainnet/testnet).

```typescript
// Access chain registry
const chainRegistry = native.getChainRegistry();
const allChains = chainRegistry.getAllChains();
const supportedChainIds = chainRegistry.getSupportedChainIds();
const isSupported = chainRegistry.isChainSupported(1);

// Filter by type
const mainnetChains = chainRegistry.getChainsByType('mainnet');
const testnetChains = chainRegistry.getChainsByType('testnet');
```

## Working Example

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

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

// Get supported networks
const supportedNetworks = native.getSupportedNetworks();
const defaultNetwork = native.getDefaultNetwork();

// Get network configuration
const ethereumConfig = native.getNetwork(1);

// Access chain registry
const chainRegistry = native.getChainRegistry();
const allChains = chainRegistry.getAllChains();
const isSupported = chainRegistry.isChainSupported(747474);
```
