---
title: Unified Bridge
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Unified Bridge
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    The core interoperability layer enabling seamless cross-chain communication and asset transfers across AggLayer connected chains
  </p>
</div>

## Overview

The Unified Bridge is the primary interoperability layer that enables cross-chain communication among AggLayer connected chains. It provides a unified interface for developers and users to initiate cross-chain transactions, facilitating seamless interaction between different networks including L1 to L2, L2 to L1, and L2 to L2 transfers.

## Key Features

- **Unified Interface**: Single bridge contract interface across all connected chains
- **Asset Bridging**: Secure transfer of tokens and native assets between chains
- **Message Bridging**: Cross-chain smart contract communication and execution
- **Trustless Security**: Cryptographic verification of all cross-chain transactions
- **Developer Friendly**: Simple APIs and comprehensive tooling support

## Core Components

### Bridge Contracts

The core smart contracts deployed on each connected chain:

- **PolygonZKEVMBridgeV2.sol**: Main bridge contract maintaining Local Exit Tree (LET)
- **PolygonRollupManager.sol**: L1 contract managing rollup state updates
- **PolygonZkEVMGlobalExitRootV2.sol**: L1 contract maintaining Global Exit Root (GER)
- **PolygonZkEVMGlobalExitRootL2.sol**: L2 contract syncing with L1 GER updates

### Bridge Service

Off-chain infrastructure providing:

- **Chain Indexer Framework**: EVM blockchain data indexer for each connected chain
- **Transaction API**: Real-time bridge transaction status and details
- **Proof Generation API**: Merkle proof generation for claim verification

### Developer Tools

- **Lxly.js SDK**: JavaScript library with prebuilt bridge functions
- **Auto Claim Service**: Automated claiming service for bridge transactions
- **API Documentation**: Comprehensive API reference and examples

## Data Structure

The Unified Bridge maintains a sophisticated Merkle tree structure to track and verify all cross-chain transactions:

![Unified Bridge Data Structure](../../img/agglayer/UnifiedBridgeTree.png)

### Local Exit Root (LER)

Each connected chain maintains its own Local Exit Tree (LET) that records all outgoing cross-chain transactions:

- **Height**: 32-level binary tree
- **Updates**: Root updated with each new bridge transaction
- **Storage**: Maintained in `PolygonZKEVMBridgeV2.sol` on each chain

### Rollup Exit Root (RER)

The L1 contract maintains a tree of all L2 Local Exit Roots:

- **Purpose**: Aggregates all L2 bridge transactions
- **Updates**: Updated when L2s submit their LET to L1
- **Management**: Handled by `PolygonRollupManager.sol`

### Mainnet Exit Root (MER)

Tracks L1 to L2 bridge transactions:

- **Purpose**: Records L1 bridge activities
- **Updates**: Updated when L1 bridge transactions occur
- **Storage**: Maintained in `PolygonZKEVMBridgeV2.sol` on L1

### Global Exit Root (GER)

The root hash combining RER and MER:

- **Formula**: `GER = hash(RER, MER)`
- **Purpose**: Single root representing all cross-chain activity
- **Sync**: L2s sync with L1 GER updates

## Bridging Operations

### Asset Bridging

Transfer tokens and native assets between chains:

**Bridge Asset Process:**
1. User calls `bridgeAsset()` on source chain
2. Tokens are locked/burned on source chain
3. Transaction recorded in Local Exit Tree
4. L2 submits LET to L1 (if applicable)
5. GER updated on L1
6. User claims assets on destination chain

**Claim Asset Process:**
1. User calls `claimAsset()` on destination chain
2. Merkle proofs verified against GER
3. Tokens minted/transferred on destination chain
4. Transaction marked as claimed

### Message Bridging

Enable cross-chain smart contract communication:

**Bridge Message Process:**
1. User calls `bridgeMessage()` on source chain
2. Message data recorded in Local Exit Tree
3. L2 submits LET to L1 (if applicable)
4. GER updated on L1
5. User claims message on destination chain

**Claim Message Process:**
1. User calls `claimMessage()` on destination chain
2. Merkle proofs verified against GER
3. Message executed on destination chain
4. Transaction marked as claimed

## Security Model

The Unified Bridge implements multiple layers of security:

### Cryptographic Verification

- **Merkle Proofs**: All claims require valid Merkle proofs
- **Global Index**: Unique identifier for each cross-chain transaction
- **Root Verification**: Claims verified against Global Exit Root

### Trust Assumptions

- **L1 Security**: Relies on L1 blockchain security
- **Rollup Validity**: Assumes rollup state transitions are valid
- **Contract Security**: Smart contract implementations are secure

### Economic Security

- **Asset Locking**: Source chain assets locked until claimed
- **Proof Verification**: Cryptographic proofs prevent invalid claims
- **Finality Requirements**: Claims only possible after L1 finality

## Getting Started

Ready to start building with the Unified Bridge?

<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 800px; margin: 1rem 0;">

  <!-- Data Structures Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Data Structures
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Learn about Local Exit Root, Rollup Exit Root, Mainnet Exit Root, and Global Exit Root.
    </p>
    <a href="/agglayer/core-concepts/unified-bridge/data-structures/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Learn more →
    </a>
  </div>

  <!-- Bridge Components Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Bridge Components
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Understand the smart contracts, services, and tools that power the Unified Bridge.
    </p>
    <a href="/agglayer/core-concepts/unified-bridge/bridge-components/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Learn more →
    </a>
  </div>

  <!-- Asset Bridging Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Asset Bridging
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Learn how to bridge tokens and native assets between different chains.
    </p>
    <a href="/agglayer/core-concepts/unified-bridge/asset-bridging/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Learn more →
    </a>
  </div>

  <!-- Message Bridging Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Message Bridging
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Enable cross-chain smart contract communication and execution.
    </p>
    <a href="/agglayer/core-concepts/unified-bridge/message-bridging/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Learn more →
    </a>
  </div>

  <!-- Bridge-and-Call Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Bridge-and-Call
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Advanced cross-chain functionality combining asset transfers with contract execution.
    </p>
    <a href="/agglayer/core-concepts/unified-bridge/bridge-and-call/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Learn more →
    </a>
  </div>

</div>

<!-- CTA Button Component -->
<div style="text-align: center; margin: 3rem 0;">
  <a href="/agglayer/get-started/quickstart/" style="background: #0071F7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
    Start Building →
  </a>
</div>