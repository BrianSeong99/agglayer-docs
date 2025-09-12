---
title: Data Structures
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Data Structures
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Explore the Sparse Merkle Trees and data structures that power Pessimistic Proof state verification
  </p>
</div>

## Overview

Pessimistic Proof uses sophisticated data structures to compute state transitions between bridging events. The system relies on three main Sparse Merkle Trees and several supporting data structures to track and verify all state changes.

**Core Components:**

- **Sparse Merkle Trees**: Local Exit Tree, Nullifier Tree, Local Balance Tree
- **State Transitions**: Bridge Exits, Imported Bridge Exits
- **State Representations**: Local State, Multi Batch Header, Proof Output

## Unified Bridge Foundation

Pessimistic Proof builds on top of the Unified Bridge data structure. For complete understanding, refer to the [Unified Bridge Data Structures](/agglayer/core-concepts/unified-bridge/data-structures/).

**Key Unified Bridge Components:**

- **Local Exit Tree**: Records outgoing cross-chain transactions
- **Global Exit Root**: Combines all chain states for verification
- **Global Index**: Unique reference for transactions within Global Exit Root

![Unified Bridge Tree](../../../img/agglayer/UnifiedBridgeTree.png)

*Figure 1: Unified Bridge data structure foundation*

## Local Balance Tree & TokenInfo

The Local Balance Tree tracks all token balances on a chain using a 192-bit depth Sparse Merkle Tree.

### TokenInfo Structure

```rust
pub struct TokenInfo {
    /// Network which the token originates from
    pub origin_network: NetworkId,
    /// The address of the token on the origin network
    pub origin_token_address: Address,
}
```

### Key Layout

The `TokenInfo` key uses a clever bit layout:

- **First 32 bits**: Origin network ID where the token originated
- **Next 160 bits**: Token address on the origin chain

### Balance Updates

When assets are bridged out or claimed, the token balance in the Local Balance Tree is updated accordingly.

![Local Balance Tree](../../../img/agglayer/LocalBalanceTree.png)

*Figure 2: Local Balance Tree structure showing token balance tracking*

## Nullifier Tree

The Nullifier Tree prevents double-spending and ensures transaction uniqueness across the network. Each chain maintains its own 64-bit depth Sparse Merkle Tree.

### Key Structure

The Nullifier Tree key is constructed using:

- **First 32 bits**: Network ID of the chain where the transaction originated
- **Last 32 bits**: Index of the bridge exit within the LET of the source chain (Local Index/depositCount)

### Double-Spending Prevention

```rust
// Default state: all leaves are false
nullifier_tree.get(key) == false

// After claiming: leaf is marked true
nullifier_tree.set(key, true)

// Prevents re-claiming
if nullifier_tree.get(key) == true {
    return Err("Already claimed");
}
```

![Nullifier Tree](../../../img/agglayer/NullifierTree.png)

*Figure 3: Nullifier Tree structure preventing double-spending*

## Bridge Exits

Bridge Exits represent outbound transactions from a chain.

### Structure

```rust
pub struct BridgeExit {
    /// Enum, 0 is asset, 1 is message
    pub leaf_type: LeafType,
    /// Unique ID for the token being transferred
    pub token_info: TokenInfo,
    /// Network which the token is transferred to
    pub dest_network: NetworkId,
    /// Address which will own the received token
    pub dest_address: Address,
    /// Token amount sent
    pub amount: U256,
    /// PermitData, CallData, etc.
    pub metadata: Vec<u8>,
}
```

### Usage

All outbound transactions from a chain are represented in a `BridgeExit` vector during pessimistic proof generation.

## Imported Bridge Exits

Imported Bridge Exits represent inbound transactions to a chain.

### Structure

```rust
pub struct ImportedBridgeExit {
    /// The bridge exit from the source network
    pub bridge_exit: BridgeExit,
    /// The claim data
    pub claim_data: Claim,
    /// The global index of the imported bridge exit
    pub global_index: GlobalIndex,
}
```

### Claim Data Types

```rust
pub enum Claim {
    Mainnet(Box<ClaimFromMainnet>),
    Rollup(Box<ClaimFromRollup>),
}
```

**Separation Reason**: L1 and Rollup claims require different proof paths:

- **Mainnet**: Direct proof from Mainnet Exit Root to L1 Info Root
- **Rollup**: Proof from Local Exit Root → Rollup Exit Root → L1 Info Root

## Local State

Local State represents the complete state of a local chain.

### Structure

```rust
pub struct LocalNetworkState {
    /// Commitment to the BridgeExit
    pub exit_tree: LocalExitTree<Keccak256Hasher>,
    /// Commitment to the balance for each token
    pub balance_tree: LocalBalanceTree<Keccak256Hasher>,
    /// Commitment to claimed assets on foreign networks
    pub nullifier_tree: NullifierTree<Keccak256Hasher>,
}
```

### Components

- **Exit Tree**: Records all outgoing bridge transactions
- **Balance Tree**: Tracks token balances for all assets
- **Nullifier Tree**: Prevents double-spending of claimed assets

## Multi Batch Header

The comprehensive state transition record for pessimistic proof generation.

### Structure

```rust
pub struct MultiBatchHeader<H> {
    /// Network that emitted this MultiBatchHeader
    pub origin_network: NetworkId,
    /// Previous local exit root
    pub prev_local_exit_root: H::Digest,
    /// Previous local balance root
    pub prev_balance_root: H::Digest,
    /// Previous nullifier tree root
    pub prev_nullifier_root: H::Digest,
    /// List of bridge exits created in this batch
    pub bridge_exits: Vec<BridgeExit>,
    /// List of imported bridge exits claimed in this batch
    pub imported_bridge_exits: Vec<(ImportedBridgeExit, NullifierPath<H>)>,
    /// Commitment to the imported bridge exits
    pub imported_exits_root: Option<H::Digest>,
    /// L1 info root used to import bridge exits
    pub l1_info_root: H::Digest,
    /// Token balances with Merkle proofs
    pub balances_proofs: BTreeMap<TokenInfo, (U256, LocalBalancePath<H>)>,
    /// Signer committing to the state transition
    pub signer: Address,
    /// Signature committing to the state transition
    pub signature: Signature,
    /// State commitment target hashes
    pub target: StateCommitment,
}
```

### Purpose

Serves as the master input capturing the complete set of changes between old and new local states, containing all data required for pessimistic proof generation.

## Pessimistic Proof Output

The final result of Pessimistic Proof computation.

### Structure

```rust
pub struct PessimisticProofOutput {
    /// The previous local exit root
    pub prev_local_exit_root: Digest,
    /// The previous pessimistic root
    pub prev_pessimistic_root: Digest,
    /// The l1 info root for proving imported bridge exits
    pub l1_info_root: Digest,
    /// The origin network of the pessimistic proof
    pub origin_network: NetworkId,
    /// The consensus hash
    pub consensus_hash: Digest,
    /// The new local exit root
    pub new_local_exit_root: Digest,
    /// The new pessimistic root (balance + nullifier tree)
    pub new_pessimistic_root: Digest,
}
```

### Pessimistic Root Formula

```
prev_pessimistic_root = hash(prev_local_balance_root, prev_nullifier_root)
new_pessimistic_root = hash(new_local_balance_root, new_nullifier_root)
```

## Certificate

A Certificate represents a state transition of a chain that gets submitted to Agglayer.

### Structure

```rust
pub struct Certificate {
    /// NetworkID of the origin network
    pub network_id: NetworkId,
    /// Simple increment to count the Certificate per network
    pub height: Height,
    /// Previous local exit root
    pub prev_local_exit_root: Digest,
    /// New local exit root
    pub new_local_exit_root: Digest,
    /// List of bridge exits included in this state transition
    pub bridge_exits: Vec<BridgeExit>,
    /// List of imported bridge exits included in this state transition
    pub imported_bridge_exits: Vec<ImportedBridgeExit>,
    /// Signature committed to the bridge exits and imported bridge exits
    pub signature: Signature,
    /// Fixed size field of arbitrary data for the chain needs
    pub metadata: Metadata,
}
```

### Validation

If a certificate is invalid, any state transitions in the current epoch will be reverted, protecting the network from invalid state changes.

<!-- CTA Button Component -->
<div style="text-align: center; margin: 3rem 0;">
  <a href="/agglayer/core-concepts/pessimistic-proof/proof-generation/" style="background: #0071F7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
    Learn About Proof Generation →
  </a>
</div>
