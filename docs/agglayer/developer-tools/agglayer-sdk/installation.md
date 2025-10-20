---
title: Installation
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Installation
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Install and configure the Agglayer SDK in your TypeScript or JavaScript project
  </p>
</div>

## Prerequisites

Before installing the Agglayer SDK, ensure you have the following:

### System Requirements

| Requirement | Version | Description |
|-------------|---------|-------------|
| **Node.js** | 18.0.0+ | JavaScript runtime environment |
| **npm** | 8.0.0+ | Package manager (comes with Node.js) |
| **TypeScript** | 4.9.0+ | For TypeScript projects (recommended) |

### Verify Prerequisites

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check TypeScript version (if using TypeScript)
npx tsc --version
```

## Installation

### Using NPM

```bash
# Production (stable) - Coming Soon
npm install @agglayer/sdk
```

## Basic Setup

### TypeScript Project Setup

```typescript
// src/index.ts
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

// Zero configuration - uses intelligent defaults
const sdk = new AggLayerSDK();

// Access Multi-Bridge Routes (ARC API)
const core = sdk.getCore();

// Or configure both modules
const fullSDK = new AggLayerSDK({
  mode: [SDK_MODES.CORE, SDK_MODES.NATIVE],
  core: {
    apiBaseUrl: 'https://arc-api.polygon.technology',
    apiTimeout: 30000,
  },
  native: {
    defaultNetwork: 1, // Ethereum mainnet
  },
});

const core = fullSDK.getCore();
const native = fullSDK.getNative();
```

### JavaScript Project Setup

```javascript
// src/index.js
const { AggLayerSDK, SDK_MODES } = require('@agglayer/sdk');

// Zero configuration setup
const sdk = new AggLayerSDK();

// Access modules
const core = sdk.getCore();
```

## Environment Configuration

### Environment Variables

Create a `.env` file for your configuration:

```bash
# Multi-Bridge Routes Configuration (ARC API)
ARC_API_BASE_URL=https://arc-api.polygon.technology
ARC_API_TIMEOUT=30000

# Native Routes Configuration (RPC URLs)
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
KATANA_RPC_URL=https://rpc.katana.network
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key

# AggSandbox Local Configuration
AGGSANDBOX_L1_RPC_URL=http://localhost:8545
AGGSANDBOX_L2_RPC_URL=http://localhost:8546

# Development Configuration
NODE_ENV=development

# Optional: Additional API Services
TOKEN_LIST_API=https://api-polygon-tokens.polygon.technology/tokenlists/agglayer.tokenlist.json
BALANCE_API=https://balance-api-gcp.polygon.technology/mainnet/tokens
```

### Configuration Examples

#### Local Configuration

For local development with AggSandbox:

```typescript
// config/local.ts
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

export const localSDK = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1, // L1 network in AggSandbox
    customRpcUrls: {
      1: process.env.AGGSANDBOX_L1_RPC_URL || 'http://localhost:8545',
      1101: process.env.AGGSANDBOX_L2_RPC_URL || 'http://localhost:8546',
    },
  },
});

// Note: Multi-Bridge Routes (CORE mode) not available locally
// Use Native Routes for direct bridge contract interactions
```

**Additional Environment Variables for Local Testing:**
```bash
# Optional: For testing with known AggSandbox private keys
AGG_SANDBOX_PRIVATE_KEY=(Can be found via `Aggsandbox info` command)

**Important:** SDK manual claiming doesn't work with AggSandbox due to API endpoint differences. Use AggSandbox's auto-claiming service for local testing.

#### Testnet Configuration

```typescript
// config/development.ts
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

export const developmentSDK = new AggLayerSDK({
  mode: [SDK_MODES.CORE, SDK_MODES.NATIVE],
  core: {
    apiBaseUrl: process.env.ARC_API_BASE_URL || 'https://arc-api.polygon.technology',
    apiTimeout: 10000, // Shorter timeout for development
  },
  native: {
    defaultNetwork: 11155111, // Sepolia testnet
    customRpcUrls: {
      11155111: process.env.SEPOLIA_RPC_URL,
      747474: process.env.KATANA_RPC_URL,
    },
  },
});
```

#### Mainnet Configuration

```typescript
// config/production.ts
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

export const productionSDK = new AggLayerSDK({
  mode: [SDK_MODES.CORE, SDK_MODES.NATIVE],
  core: {
    apiBaseUrl: 'https://arc-api.polygon.technology',
    apiTimeout: 30000,
  },
  native: {
    defaultNetwork: 1, // Ethereum mainnet
    customRpcUrls: {
      1: process.env.ETHEREUM_RPC_URL,
      747474: process.env.KATANA_RPC_URL,
    },
  },
});
```

## Verification

### Test Installation

Create a simple test file to verify everything is working:

```typescript
// test-installation.ts
import { AggLayerSDK } from '@agglayer/sdk';

async function testInstallation() {
  try {
    // Test Multi-Bridge Routes
    const sdk = new AggLayerSDK();
    const core = sdk.getCore();
    
    console.log('🚀 Testing Agglayer SDK installation...');
    
    // Test ARC API connection
    const chains = await core.getAllChains();
    console.log(`✅ Multi-Bridge Routes: Found ${chains.chains.length} supported chains`);
    
    // Test Native Routes (if RPC configured)
    if (process.env.ETHEREUM_RPC_URL) {
      const nativeSDK = new AggLayerSDK({
        mode: ['NATIVE'],
        native: {
          defaultNetwork: 1,
          customRpcUrls: {
            1: process.env.ETHEREUM_RPC_URL,
          },
        },
      });
      
      const native = nativeSDK.getNative();
      const supportedNetworks = native.getSupportedNetworks();
      console.log(`✅ Native Routes: ${supportedNetworks.length} networks configured`);
    }
    
    console.log('🎉 Installation verified successfully!');
    
  } catch (error) {
    console.error('❌ Installation test failed:', error);
    process.exit(1);
  }
}

testInstallation();
```

Run the test:

```bash
npx ts-node test-installation.ts
```

Expected output:
```
🚀 Testing Agglayer SDK installation...
✅ Multi-Bridge Routes: Found 15 supported chains
✅ Native Routes: 2 networks configured
🎉 Installation verified successfully!
```

## Module Selection

The SDK uses a modular architecture - choose the modules you need:

### Multi-Bridge Routes Only

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

const sdk = new AggLayerSDK({
  mode: [SDK_MODES.CORE], // Only Multi-Bridge Routes
  core: {
    apiBaseUrl: 'https://arc-api.polygon.technology',
  },
});

const core = sdk.getCore();
// native module not available
```

### Native Routes Only

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE], // Only Native Routes
  native: {
    defaultNetwork: 1,
    customRpcUrls: {
      1: process.env.ETHEREUM_RPC_URL,
    },
  },
});

const native = sdk.getNative();
// core module not available
```

### Both Modules

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

const sdk = new AggLayerSDK({
  mode: [SDK_MODES.CORE, SDK_MODES.NATIVE], // Both modules
  core: {
    apiBaseUrl: 'https://arc-api.polygon.technology',
  },
  native: {
    defaultNetwork: 1,
    customRpcUrls: {
      1: process.env.ETHEREUM_RPC_URL,
      747474: process.env.KATANA_RPC_URL,
    },
  },
});

const core = sdk.getCore();
const native = sdk.getNative();
```