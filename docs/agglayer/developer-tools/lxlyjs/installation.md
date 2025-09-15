---
title: Installation
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Installation
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Install and configure Lxly.js in your JavaScript or TypeScript project
  </p>
</div>

## Prerequisites

Before installing Lxly.js, ensure you have the following:

### System Requirements

| Requirement | Version | Description |
|-------------|---------|-------------|
| **Node.js** | 14.0.0+ | JavaScript runtime environment |
| **npm** | 6.0.0+ | Package manager (comes with Node.js) |
| **Web3 Provider** | Latest | Web3.js or Ethers.js for blockchain interaction |

### Verify Prerequisites

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check if you have a Web3 provider preference
npm list web3 ethers
```

## Installation

### Using NPM

```bash
# Install Lxly.js
npm install @maticnetwork/lxlyjs

# Install a Web3 provider plugin (choose one)
npm install @maticnetwork/maticjs-web3  # For Web3.js users
npm install @maticnetwork/maticjs-ethers  # For Ethers.js users

# Install provider dependencies
npm install @truffle/hdwallet-provider  # For Web3.js
npm install ethers  # For Ethers.js
```

### Using Yarn

```bash
# Install Lxly.js
yarn add @maticnetwork/lxlyjs

# Install a Web3 provider plugin (choose one)
yarn add @maticnetwork/maticjs-web3  # For Web3.js users
yarn add @maticnetwork/maticjs-ethers  # For Ethers.js users

# Install provider dependencies
yarn add @truffle/hdwallet-provider  # For Web3.js
yarn add ethers  # For Ethers.js
```

## Provider Setup

Lxly.js supports multiple Web3 providers. Choose the one that best fits your application:

### Web3.js Provider

```javascript
import { LxLyClient, use } from '@maticnetwork/lxlyjs';
import { Web3ClientPlugin } from '@maticnetwork/maticjs-web3';
import HDWalletProvider from '@truffle/hdwallet-provider';

// Enable Web3.js support
use(Web3ClientPlugin);

const client = new LxLyClient();
```

### Ethers.js Provider

```javascript
import { LxLyClient, use } from '@maticnetwork/lxlyjs';
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';
import { providers, Wallet } from 'ethers';

// Enable Ethers.js support
use(Web3ClientPlugin);

const client = new LxLyClient();
```

## Basic Configuration

### Environment Setup

Create a `.env` file for your configuration:

```bash
# Network Configuration
NETWORK=testnet  # or 'mainnet'

# Ethereum/Sepolia Configuration
NETWORK_0_RPC=https://eth-sepolia.g.alchemy.com/v2/your-api-key
NETWORK_0_BRIDGE=0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582
NETWORK_0_WRAPPER=0x0f04f8434bac2e1db8fca8a34d3e177b6c7ccaba

# Polygon zkEVM/Cardona Configuration
NETWORK_1_RPC=https://rpc.cardona.zkevm-rpc.com
NETWORK_1_BRIDGE=0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582

# Account Configuration (for testing only)
USER1_PRIVATE_KEY=your_private_key_here
USER1_FROM=your_address_here
```

**⚠️ Security Warning**: Never commit private keys to version control. Use environment variables or secure key management systems in production.

### Configuration File

Create a `config.js` file:

```javascript
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  network: process.env.NETWORK || 'testnet',
  configuration: {
    0: {
      rpc: process.env.NETWORK_0_RPC,
      bridgeAddress: process.env.NETWORK_0_BRIDGE,
      wrapperAddress: process.env.NETWORK_0_WRAPPER,
      isEIP1559Supported: true
    },
    1: {
      rpc: process.env.NETWORK_1_RPC,
      bridgeAddress: process.env.NETWORK_1_BRIDGE,
      isEIP1559Supported: false
    }
  },
  tokens: {
    0: {
      ether: '0x0000000000000000000000000000000000000000',
      erc20: '0x3fd0A53F4Bf853985a95F4Eb3F9C9FDE1F8e2b53' // Example token
    },
    1: {
      ether: '0x0000000000000000000000000000000000000000',
      erc20: '0x3cc6055f4e88638c46daa9cf5f5fc54a801e5f03' // Wrapped token
    }
  },
  user1: {
    privateKey: process.env.USER1_PRIVATE_KEY,
    address: process.env.USER1_FROM
  }
};
```

## Verification

### Test Installation

Create a simple test file to verify everything is working:

```javascript
// test-installation.js
const { LxLyClient, use } = require('@maticnetwork/lxlyjs');
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const config = require('./config');

use(Web3ClientPlugin);

async function testInstallation() {
  try {
    const client = new LxLyClient();
    
    await client.init({
      log: true,
      network: config.network,
      providers: {
        0: {
          provider: new HDWalletProvider([config.user1.privateKey], config.configuration[0].rpc),
          configuration: {
            bridgeAddress: config.configuration[0].bridgeAddress,
            wrapperAddress: config.configuration[0].wrapperAddress,
            isEIP1559Supported: true
          },
          defaultConfig: {
            from: config.user1.address
          }
        }
      }
    });

    console.log('✅ Lxly.js installed and configured successfully!');
    console.log('🌐 Connected to network:', config.network);
    
    // Test basic functionality
    const token = client.erc20(config.tokens[0].ether, 0);
    const balance = await token.getBalance(config.user1.address);
    console.log('💰 ETH Balance:', balance);
    
  } catch (error) {
    console.error('❌ Installation test failed:', error.message);
  }
}

testInstallation();
```

Run the test:

```bash
node test-installation.js
```

Expected output:
```
✅ Lxly.js installed and configured successfully!
🌐 Connected to network: testnet
💰 ETH Balance: 1000000000000000000
```

## Network Configurations

### Testnet Configuration

For development and testing:

| Network | Name | Chain ID | RPC | Bridge Address |
|---------|------|----------|-----|----------------|
| **Network 0** | Sepolia | 11155111 | `https://eth-sepolia.g.alchemy.com/v2/demo` | `0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582` |
| **Network 1** | Cardona | 2442 | `https://rpc.cardona.zkevm-rpc.com` | `0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582` |

### Mainnet Configuration

For production deployment:

| Network | Name | Chain ID | RPC | Bridge Address |
|---------|------|----------|-----|----------------|
| **Network 0** | Ethereum | 1 | Your Ethereum RPC | `0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe` |
| **Network 1** | Polygon zkEVM | 1101 | Your Polygon RPC | `0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe` |

## Custom Networks

### Adding Custom Networks

Lxly.js supports custom blockchain networks:

```javascript
import { LxLyClient, use, setProofApi } from '@maticnetwork/lxlyjs';

// Set custom proof API for merkle proof generation
setProofApi('https://your-custom-proof-api.com/');

const client = new LxLyClient();
await client.init({
  network: 'custom',
  providers: {
    2: {  // Custom network ID
      provider: customProvider,
      configuration: {
        bridgeAddress: '0xYourCustomBridgeAddress',
        wrapperAddress: '0xYourCustomWrapperAddress',
        isEIP1559Supported: true  // Depends on your network
      },
      defaultConfig: {
        from: '0xYourAddress'
      }
    }
  }
});
```

### Proof API Integration

For custom networks, you may need to provide a custom Proof API:

```javascript
// The Proof API should follow this format:
// GET /merkle-proof?networkId={networkId}&depositCount={depositCount}

// Response format:
{
  "proof": {
    "merkle_proof": ["0x...", "0x...", ...],
    "rollup_merkle_proof": ["0x...", "0x...", ...],
    "main_exit_root": "0x...",
    "rollup_exit_root": "0x..."
  }
}
```
