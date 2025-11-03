---
title: Agglayer Native Bridge
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Agglayer Native Bridge
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Direct blockchain operations with Agglayer bridge contracts for maximum control and flexibility
  </p>
</div>

## Overview

Agglayer Native Bridge is the SDK's **Native module** that provides direct interaction with Agglayer bridge contracts and blockchain networks. Unlike Multi-Bridge Routes which uses ARC API for route aggregation, Native Bridge gives you complete control over bridge operations, ERC20 token management, and chain configurations across local, testnet, and mainnet environments.

## Core Features

<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 800px; margin: 1rem 0;">

  <!-- ERC20 Operations Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      ERC20 Operations
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Complete ERC20 token management including balance checks, approvals, transfers, and direct bridge operations with built-in gas estimation.
    </p>
    <a href="/agglayer/developer-tools/agglayer-sdk/agglayer-native-bridge/operations/erc20-operations/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Learn more →
    </a>
  </div>

  <!-- Bridge Operations Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Bridge Operations
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Direct bridge contract interactions including asset bridging, message bridging, claim operations, and proof generation.
    </p>
    <a href="/agglayer/developer-tools/agglayer-sdk/agglayer-native-bridge/operations/bridge-operations/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Learn more →
    </a>
  </div>

  <!-- Chain Management Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Chain Management
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Built-in chain registry with support for custom networks, RPC configuration, and multi-environment setups (local, testnet, mainnet).
    </p>
    <a href="/agglayer/developer-tools/agglayer-sdk/agglayer-native-bridge/operations/chain-management/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Learn more →
    </a>
  </div>

</div>

## Complete Guides

<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 800px; margin: 1rem 0;">

  <!-- Local Testing Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Local Testing with AggSandbox
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Complete guide for local development using AggSandbox. Perfect for rapid prototyping with instant feedback and comprehensive debugging.
    </p>
    <a href="/agglayer/developer-tools/agglayer-sdk/agglayer-native-bridge/step-by-step-guide/native-bridge-locally/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Start locally →
    </a>
  </div>

  <!-- Testnet Testing Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Testnet Development
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Step-by-step guide for testnet development using Sepolia and other test networks. Validate your integration with real network conditions.
    </p>
    <a href="/agglayer/developer-tools/agglayer-sdk/agglayer-native-bridge/step-by-step-guide/native-bridge-testnet/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Test on testnet →
    </a>
  </div>

  <!-- Production Deployment Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Production Deployment
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Production-ready implementation with mainnet configuration, error handling, monitoring, and security best practices.
    </p>
    <a href="/agglayer/developer-tools/agglayer-sdk/agglayer-native-bridge/step-by-step-guide/native-bridge-mainnet/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Deploy to mainnet →
    </a>
  </div>

</div>

## When to Use Native Bridge

Choose Native Bridge when you need direct control over bridge operations, local testing capabilities with AggSandbox, or custom bridge logic beyond standard route aggregation. It's ideal for advanced integrations with custom business logic and testnet development workflows.

Consider [Multi-Bridge Routes](../multi-bridge-routes/index.md) for route optimization across multiple providers and cross-chain bridging from non-Agglayer chains.

## Quick Example

Here's how simple it is to perform direct bridge operations with Native Bridge:

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

// Initialize for local testing
const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1,
    customRpcUrls: {
      1: 'http://localhost:8545',     // AggSandbox L1
      1101: 'http://localhost:8546',  // AggSandbox L2
    },
  },
});

const native = sdk.getNative();

// Create token instance and bridge directly
const token = native.erc20('0xTokenAddress', 1);
const bridgeTx = await token.bridgeTo(
  1101, // Destination network
  '0xRecipientAddress',
  '1000000000000000000', // 1 token
  '0xFromAddress'
);

// Transaction ready for signing and execution
console.log('Bridge transaction built:', bridgeTx.to);
```
