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

![Unified Bridge Data Structure](../../../img/agglayer/UnifiedBridgeTree.png)

*Figure 1: Complete data structure hierarchy showing how Local Exit Roots, Rollup Exit Root, Mainnet Exit Root, and Global Exit Root work together*

## Local Exit Root & Local Index

Each Agglayer connected chain maintains its own Local Exit Tree (LET) that records all outgoing cross-chain transactions.

### Local Exit Tree (LET)

- **Structure**: 32-level binary Sparse Merkle Tree
- **Purpose**: Records all bridge transactions initiated on the chain
- **Storage**: Maintained in `PolygonZKEVMBridgeV2.sol` on each chain
- **Updates**: Root updated with each new cross-chain transaction

### Local Index (depositCount)

- **Definition**: The index of the leaf node in the Local Exit Tree
- **Value**: Each leaf represents a hash of a cross-chain transaction (`bridgeAsset` or `bridgeMessage`)
- **Increment**: Incremented with each new bridge transaction

![Local Exit Tree](../../../img/agglayer/LET.png)

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

![Rollup Exit Tree](../../../img/agglayer/RET.png)

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

![Mainnet Exit Tree](../../../img/agglayer/L1MET.png)

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

![L1 Info Tree](../../../img/agglayer/L1InfoTree.png)

*Figure 5: L1 Info Tree structure showing how Global Exit Roots are maintained*

## Data Flow

### Flow for L1 -> L2 Bridge Asset

1. User/Developer/Dapp initiate `bridgeAsset` call on L1
2. Bridge contract on L1 appends an exit leaf to mainnet exit tree of the L1, and update its mainnet exit root.
3. Global exit root manager appends the new L1 mainnet exit root to global exit tree and computes the new global exit root.
4. L2 sequencer fetches and updates the latest global exit root from the global exit root manager.
5. User/Developer/Dapp/Chain initiates `claimAsset` call, and also provides the smtProof.
6. Bridge contract on destination L2 chain validates the smtProof against the global exit root on its chain. If passes next step.
7. Transfer/Mint the asset to the destination address.

![Bridge Asset L1 to L2](../../../img/agglayer/BridgeAssetProcess.png)

### Flow for L2 -> L1 Bridge Message

1. User/Developer/Dapp initiate `bridgeMessage` call on L2
2. Bridge contract on L2 appends an exit leaf to local exit tree of the L2, and update its local exit root on L2.
3. Sends the new local exit root to L1 to verify, once passed the L2's local exit root, aka the leaf node in the rollup exit tree will be updated, which will cause a chain of updates to Global exit root updates on L1 and also L1InfoTree updates.
4. User/Developer/Dapp/Chain initiates `claimMessage` call, and also provides the smtProof.
5. Bridge contract on destination L1 chain validates the smtProof against the global exit root on its chain. If passes next step.
6. Execute `onMessageReceived` process.

![Bridge Message L2 to L1](../../../img/agglayer/BridgeMessageProcess.png)

### Flow for L2 -> L2 Bridge and Call

1. User/Developer/Dapp initiate `bridgeAndCall` call on L2 Source.
2. Similar to L2 -> L1 process, global exit root on L1 is updated, which includes the source chain bridging transaction.
3. Then destination L2 sequencer fetches and updates the latest global exit root from the global exit root manager.
4. Bridge contract on destination L2 chain validates the smtProof against the global exit root on its chain. If passes next step.
5. Process the `claimAsset`, `claimMessage` on destination L2 chain.

![Bridge and Call L2 to L2](../../../img/agglayer/BridgeAndCallProcess.png)

<!-- CTA Button Component -->
<div style="text-align: center; margin: 3rem 0;">
  <a href="/agglayer/core-concepts/unified-bridge/bridge-components/" style="background: #0071F7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
    Learn About Components →
  </a>
</div>
