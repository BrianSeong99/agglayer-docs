---
title: Bridging vbTokens
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Bridging vbTokens
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Understand how vbToken bridging works across Ethereum and Layer 2 chains
  </p>
</div>

## Overview

Vault Bridge Tokens (vbTokens) are yield-bearing ERC-20 tokens that can be bridged between Ethereum (Layer 1) and connected Layer 2 chains. This guide explains the core concepts and mechanics of vbToken bridging.

## What Are vbTokens?

vbTokens are special ERC-20 tokens that combine three functionalities:

1. **ERC-20 Token**: Standard token interface for transfers and approvals
2. **ERC-4626 Vault**: Yield-generating vault that holds underlying assets
3. **Bridge Extension**: Native integration with the Agglayer Unified Bridge

**Supported vbTokens:**

- vbETH (Vault Bridge ETH)
- vbUSDC (Vault Bridge USDC)
- vbUSDT (Vault Bridge USDT)
- vbWBTC (Vault Bridge WBTC)
- vbUSDS (Vault Bridge USDS)

## How vbToken Bridging Works

### Layer 1 (Ethereum)

On Ethereum, vbTokens are **native tokens** managed by the VaultBridgeToken contracts. Key characteristics:

- **1:1 Backing**: Each vbToken is backed 1:1 by the underlying asset (e.g., 1 vbUSDC = 1 USDC)
- **Yield Generation**: Underlying assets are deposited into curated yield vaults (Morpho, Yearn)
- **Redeemable**: vbTokens can always be redeemed for the underlying asset on L1
- **Bridgeable**: Can be directly bridged to L2 chains via the Unified Bridge

### Layer 2 (Katana, etc.)

On L2 chains, vbTokens exist as **bridged tokens**. There are two forms:

1. **Bridge-Wrapped vbToken**: Standard wrapped version created by the Unified Bridge
2. **Custom Token**: Optional upgraded version with additional features (requires Native Converter)

Both maintain the 1:1 value relationship with the L1 vbToken.

## Bridging Directions

The bridging process differs depending on direction:

### L1 → L2 (Ethereum to Layer 2)

**Simple, Single Transaction:**

```
User deposits underlying → vbToken minted → vbToken bridged to L2
```

This is handled by the `depositAndBridge()` function in a single transaction:

1. User approves underlying asset (e.g., USDC) to VaultBridgeToken contract
2. User calls `depositAndBridge()` with amount and destination
3. Contract mints vbToken 1:1 and bridges it to L2
4. User receives vbToken on L2

**Timeline**: ~20-30 minutes for bridge finalization

### L2 → L1 (Layer 2 to Ethereum)

**Two-Step Process with Proof:**

```
User bridges vbToken from L2 → Wait for proof → Claim and redeem on L1
```

This requires multiple steps:

1. **Step 1**: User bridges vbToken from L2 using Agglayer's `bridgeAsset()`
2. **Wait Period**: ~20-30 minutes for transaction finalization
3. **Step 2**: Fetch cryptographic proof from Bridge Service API
4. **Step 3**: Call `claimAndRedeem()` on L1 to receive underlying asset

**Alternative**: Can also claim vbToken first with `claimAsset()`, then separately `redeem()` for underlying

**Timeline**: ~20-30 minutes + time to fetch proof and execute claim

## Key Differences Between Directions

| Aspect | L1 → L2 | L2 → L1 |
|--------|---------|---------|
| **Complexity** | Simple (1 transaction) | Complex (multi-step + proofs) |
| **Special Function** | `depositAndBridge()` | `claimAndRedeem()` or `claimAsset()` + `redeem()` |
| **Proof Required** | No | Yes (from Bridge Service API) |
| **Developer Effort** | Minimal | Requires API integration |
| **User Experience** | Seamless | Needs proof fetching automation |

## Understanding the Agglayer Unified Bridge

vbToken bridging leverages the [Agglayer Unified Bridge](/agglayer/core-concepts/unified-bridge/), a trustless cross-chain bridge secured by cryptographic proofs. 

**How it works:**

1. **Local Exit Tree**: Each chain maintains a Merkle tree of outgoing bridge transactions
2. **Global Exit Root**: The Agglayer aggregates all chain exit trees into a global root
3. **Cryptographic Proofs**: Claims on destination chains require Merkle proofs of inclusion
4. **Verification**: Bridge contract verifies proofs before releasing assets

For vbTokens, the VaultBridgeToken contract extends this bridge functionality with automatic minting and redemption.

> For deeper understanding of bridge mechanics, see [Agglayer Unified Bridge Architecture](/agglayer/core-concepts/unified-bridge/architecture.md) and [Asset Bridging](/agglayer/core-concepts/unified-bridge/asset-bridging.md).

## vbToken vs Standard Token Bridging

**Standard ERC-20 Bridge Flow:**
```
L1: Lock token → L2: Mint wrapped token
L2: Burn wrapped token → L1: Unlock token
```

**vbToken Bridge Flow:**
```
L1: Deposit underlying + mint vbToken + bridge → L2: Receive vbToken
L2: Bridge vbToken → L1: Claim + burn vbToken + receive underlying
```

The key difference is that vbTokens are **minted on-demand during bridging** from the underlying asset, rather than being locked. This enables yield generation on the underlying while the vbToken circulates on L2.

## Native Converter (Optional)

For improved L2 user experience, chains can deploy a **Native Converter** contract that enables:

- **Local Conversion**: Convert bridged assets (e.g., bridged USDC) to vbUSDC directly on L2
- **Deconversion**: Convert vbUSDC back to bridged USDC on L2
- **No L1 Round-Trip**: Users don't need to bridge to L1 to convert

This is particularly useful when users have existing bridged USDC on L2 and want to access vbUSDC yield.

**Example Flow:**
```
User has bridged USDC on Katana
  ↓
Call convert() on Native Converter
  ↓
Receive vbUSDC on Katana (ready to earn yield)
  ↓
Periodically, Native Converter migrates backing to L1 for yield generation
```

See [Native Converter Integration](native-converter-integration.md) for detailed implementation.

## Network IDs and Bridge Addresses

Each chain in the Agglayer has a unique network ID:

| Network | Network ID | Bridge Address |
|---------|-----------|----------------|
| Ethereum Mainnet | 0 | `0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe` |
| Ethereum Sepolia | 0 | `0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582` |
| Katana (Apex) | 747474 | Check [Contract Addresses](../reference/contract-addresses.md) |

> For complete list of addresses, see [Contract Addresses Reference](../reference/contract-addresses.md).

## Security Considerations

**On L1 (Ethereum):**

- vbTokens are always redeemable 1:1 for underlying assets
- Underlying assets are held in audited yield vaults (Morpho, Yearn)
- Solvency is enforced by contract with slippage protection

**On L2:**

- vbTokens are backed by bridged liquidity through Unified Bridge
- Bridge security relies on cryptographic proofs (pessimistic proof + state transition proof)
- No trusted intermediaries required

**Yield Generation:**

- Curated by professional teams (Gauntlet, Steakhouse Financial)
- External credit ratings (Credora)
- See [Risk & Security](../reference/risk-security.md) for detailed information

