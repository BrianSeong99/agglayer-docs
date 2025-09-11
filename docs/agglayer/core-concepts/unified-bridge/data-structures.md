---
title: Data Structures
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Data Structures
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Understanding the Merkle tree data structures that power the Unified Bridge's cross-chain verification system
  </p>
</div>

## Overview

The Unified Bridge maintains a sophisticated Merkle tree structure to track and verify all cross-chain transactions. This hierarchical system ensures that every cross-chain transaction is cryptographically verifiable and that source chain transactions are finalized on L1 before they can be claimed on the destination chain.

![Unified Bridge Data Structure](../../img/agglayer/UnifiedBridgeTree.png)

*Figure 1: Complete data structure hierarchy showing how Local Exit Roots, Rollup Exit Root, Mainnet Exit Root, and Global Exit Root work together*

## Local Exit Root & Local Index

Each AggLayer connected chain maintains its own Local Exit Tree (LET) that records all outgoing cross-chain transactions.

### Local Exit Tree (LET)

- **Structure**: 32-level binary Sparse Merkle Tree
- **Purpose**: Records all bridge transactions initiated on the chain
- **Storage**: Maintained in `PolygonZKEVMBridgeV2.sol` on each chain
- **Updates**: Root updated with each new cross-chain transaction

### Local Index (depositCount)

- **Definition**: The index of the leaf node in the Local Exit Tree
- **Value**: Each leaf represents a hash of a cross-chain transaction (`bridgeAsset` or `bridgeMessage`)
- **Increment**: Incremented with each new bridge transaction

![Local Exit Tree](../../img/agglayer/LET.png)

*Figure 2: Local Exit Tree structure showing how bridge transactions are recorded as leaves*

## Rollup Exit Root

The Rollup Exit Root (RER) is the Merkle root of all L2s' Local Exit Roots, maintained on L1.

### How it Works

1. **L2 Submission**: L2s submit their Local Exit Root to `PolygonRollupManager.sol` on L1
2. **Frequency**: L2s can choose to submit immediately or batch multiple transactions
3. **RER Update**: RollupManager updates the Rollup Exit Tree with the new L2 LET
4. **GER Update**: RER update triggers Global Exit Root update

### Key Contracts

- **PolygonRollupManager.sol**: Manages L2 state updates on L1
- **PolygonZkEVMGlobalExitRootV2.sol**: Updates GER when RER changes

![Rollup Exit Tree](../../img/agglayer/RET.png)

*Figure 3: Rollup Exit Tree showing how L2 Local Exit Roots are aggregated*

## Mainnet Exit Root

The Mainnet Exit Root (MER) tracks L1 to L2 bridge transactions, similar to how L2s track their outgoing transactions.

### How it Works

1. **L1 Bridge**: When L1 bridge transactions occur, they're recorded in L1's Local Exit Tree
2. **MER Update**: Mainnet Exit Root is updated in `PolygonZkEVMGlobalExitRootV2.sol`
3. **GER Update**: MER update triggers Global Exit Root update

### Key Difference

- **L2s**: Submit their LET to L1 via RollupManager
- **L1**: Updates its own MER directly in the Global Exit Root contract

![Mainnet Exit Tree](../../img/agglayer/L1MET.png)

*Figure 4: Mainnet Exit Tree showing how L1 bridge transactions are tracked*

## Global Exit Root

The Global Exit Root (GER) is the root hash that combines both Rollup Exit Root and Mainnet Exit Root.

### Formula

```
GER = hash(RollupExitRoot, MainnetExitRoot)
```

### L1 Info Tree

The L1 Info Tree is a 32-level binary Sparse Merkle Tree that maintains all Global Exit Roots:

- **Purpose**: Historical record of all GER updates
- **Height**: 32 levels
- **Updates**: New leaf added with each GER update
- **Sync**: L2s sync with latest GER via `updateExitRoot` function

### Global Index

The Global Index is a 256-bit identifier that uniquely locates each cross-chain transaction:

| Bits | Purpose | Description |
|------|---------|-------------|
| 191 bits | Unused | Reserved bits (typically filled with zeros) |
| 1 bit | Mainnet Flag | 0 = Rollup, 1 = Mainnet |
| 32 bits | Rollup Index | Specific rollup ID (only when mainnet flag = 0) |
| 32 bits | Local Root Index | Index within the local exit tree |

![L1 Info Tree](../../img/agglayer/L1InfoTree.png)

*Figure 5: L1 Info Tree structure showing how Global Exit Roots are maintained*

## Data Flow

### L2 to L2 Transaction

1. **Bridge Initiated**: User calls `bridgeAsset` on L2A
2. **LET Updated**: Transaction recorded in L2A's Local Exit Tree
3. **L2A Submission**: L2A submits its LET to L1 via RollupManager
4. **RER Updated**: Rollup Exit Root updated on L1
5. **GER Updated**: Global Exit Root updated
6. **L2B Sync**: L2B syncs with latest GER
7. **Claim**: User claims on L2B using Merkle proofs

### L1 to L2 Transaction

1. **Bridge Initiated**: User calls `bridgeAsset` on L1
2. **LET Updated**: Transaction recorded in L1's Local Exit Tree
3. **MER Updated**: Mainnet Exit Root updated on L1
4. **GER Updated**: Global Exit Root updated
5. **L2 Sync**: L2 syncs with latest GER
6. **Claim**: User claims on L2 using Merkle proofs

### L2 to L1 Transaction

1. **Bridge Initiated**: User calls `bridgeAsset` on L2
2. **LET Updated**: Transaction recorded in L2's Local Exit Tree
3. **L2 Submission**: L2 submits its LET to L1 via RollupManager
4. **RER Updated**: Rollup Exit Root updated on L1
5. **GER Updated**: Global Exit Root updated
6. **L1 Sync**: L1 already has latest GER
7. **Claim**: User claims on L1 using Merkle proofs

## Security Properties

### Cryptographic Security

- **Merkle Proofs**: All claims require valid Merkle proofs against the Global Exit Root
- **Root Verification**: Claims verified against the latest synchronized GER
- **Unique Identification**: Global Index ensures each transaction is uniquely identifiable

### Finality Requirements

- **L1 Finality**: All cross-chain transactions must be finalized on L1 before claiming
- **GER Synchronization**: Destination chains must sync with latest GER
- **Proof Validity**: Merkle proofs must be valid against the synchronized GER

## Getting Started

Ready to understand how these data structures work in practice?

<!-- CTA Button Component -->
<div style="text-align: center; margin: 3rem 0;">
  <a href="/agglayer/core-concepts/unified-bridge/bridge-components/" style="background: #0071F7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
    Learn About Components →
  </a>
</div>
