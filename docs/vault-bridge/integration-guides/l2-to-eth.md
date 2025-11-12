---
title: L2 to Ethereum Bridging
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  L2 to Ethereum Bridging
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Return vbTokens from Layer 2 to Ethereum with proof-based redemption
  </p>
</div>

## Overview

Bridging vbTokens from L2 back to Ethereum (L1) is a multi-step process that requires cryptographic proof generation. Unlike the simple L1→L2 flow, the L2→L1 direction involves:

1. Bridge vbTokens from L2 using Agglayer's `bridgeAsset()`
2. Wait for transaction finalization (~20-30 minutes)
3. Fetch cryptographic proofs from Bridge Service API
4. Claim and redeem on Ethereum

This guide covers both redemption paths with complete examples and automation scripts.

## Prerequisites

Before implementing L2→L1 bridging:

1. **API Access**: Access to Agglayer Bridge Service API
2. **Contract Addresses**: VaultBridgeToken and bridge addresses
3. **Understanding Proofs**: Familiarity with Merkle proofs (see [Agglayer Unified Bridge](/agglayer/core-concepts/unified-bridge/))
4. **Testnet Setup**: Sepolia ETH for testing

## Two Redemption Paths

There are two ways to handle the claim and redemption on L1:

### Path 1: Combined claimAndRedeem()

**Single transaction that claims vbToken from bridge and immediately redeems for underlying.**

**Pros:**

- Simpler for users (1 transaction on L1)
- Atomically claims and redeems
- Less gas overall

**Cons:**

- User must execute transaction (can't automate without their key)
- All-or-nothing redemption

**When to use:** Direct user flows, wallets, simple integrations

### Path 2: Separate claimAsset() + redeem()

**Two separate transactions: first claim vbToken from bridge, then redeem for underlying.**

**Pros:**

- More flexible (can claim to different address)
- Can batch redemptions
- Easier to automate claiming for users

**Cons:**

- Two transactions (more gas)
- Requires managing intermediate vbToken balance

**When to use:** Automated systems, relayers, complex workflows

## Understanding the Flow

### Complete L2→L1 Journey

```
Step 1 (L2): Bridge vbToken
   ↓
   User calls lxlyBridge.bridgeAsset()
   ↓
   Event emitted with deposit_count
   
Step 2: Wait for Finalization
   ↓
   ~20-30 minutes for L2 block finalization
   
Step 3: Fetch Proof
   ↓
   Call Bridge Service API with deposit_count
   ↓
   Receive Merkle proofs
   
Step 4 (L1): Claim and Redeem
   ↓
   Option A: claimAndRedeem() → receive underlying
   Option B: claimAsset() → redeem() → receive underlying
```

## Path 1: claimAndRedeem() Implementation

The combined path is ideal when the same account triggers the claim and wants the underlying immediately. A minimal contract only needs to pass the proof payload through to `claimAndRedeem()`:

```solidity
function claimAndRedeem(
    bytes32[32] calldata gerProof,
    bytes32[32] calldata rollupProof,
    uint256 globalIndex,
    bytes32 mainnetExitRoot,
    bytes32 rollupExitRoot,
    address destination,
    uint256 amount,
    address receiver
) external {
    vaultBridgeToken.claimAndRedeem(
        gerProof,
        rollupProof,
        globalIndex,
        mainnetExitRoot,
        rollupExitRoot,
        destination,
        amount,
        receiver,
        ""
    );
}
```

Automation scripts (TypeScript & Python) that fetch proofs and call this function live in the [vault-bridge/examples](https://github.com/agglayer/vault-bridge/tree/main/examples) folder—copy them directly for production use.

## Path 2: claimAsset() + redeem() Implementation

Choose this approach when a relayer or service performs the claim and redemption on behalf of users. Break the flow into two calls:

```solidity
function claimVbToken(BridgeProof calldata proof, uint32 originNetwork) external {
    lxLyBridge.claimAsset(
        proof.gerProof,
        proof.rollupProof,
        proof.globalIndex,
        proof.mainnetExitRoot,
        proof.rollupExitRoot,
        originNetwork,
        address(vaultBridgeToken),
        proof.destinationNetwork,
        proof.destination,
        proof.amount,
        ""
    );
}

function redeemVbToken(uint256 shares, address receiver) external returns (uint256 assets) {
    vaultBridgeToken.transferFrom(msg.sender, address(this), shares);
    assets = vaultBridgeToken.redeem(shares, receiver, address(this));
}
```

End-to-end scripts that:

- monitor `BridgeEvent` emissions, 
- fetch proofs from the Bridge Service API, and
- trigger the two transactions

are available in the [vault-bridge/examples](https://github.com/agglayer/vault-bridge/tree/main/examples) directory.

## Choosing the Right Path

| Scenario | Recommended Path | Reason |
|----------|------------------|--------|
| Direct user withdrawal | Path 1 (`claimAndRedeem`) | Simpler UX, atomic operation |
| Automated relayer service | Path 2 (separate) | Flexibility, can claim on behalf of users |
| Batching multiple redemptions | Path 2 (separate) | Can accumulate vbTokens before redeeming |
| Smart contract integration | Either | Depends on contract logic needs |
| Frontend wallet | Path 1 (`claimAndRedeem`) | Better user experience |

## Error Handling & Troubleshooting

### Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `PROOF_NOT_AVAILABLE` | L1 not finalized yet | Wait longer, check `/bridges` endpoint |
| `BRIDGE_NOT_FOUND` | Invalid deposit count | Verify deposit count from bridge transaction |
| `AlreadyClaimed` | Trying to claim twice | Check `/claims` endpoint first |
| `InvalidProof` | Proof expired or incorrect | Fetch fresh proof from API |
| `Insufficient balance` | Not enough vbToken | Verify bridge completed successfully |

### Debugging Checklist

1. **Verify bridge transaction succeeded on L2**
   ```bash
   curl "${BRIDGE_API_URL}/bridges?network_id=20&deposit_count=42"
   ```

2. **Check if ready to claim**
   ```json
   {
     "bridges": [{
       "ready_for_claim": true  // Must be true
     }]
   }
   ```

3. **Verify proof parameters are correct**
   - Array lengths: `smtProofLocalExitRoot` = 32, `smtProofRollupExitRoot` = 32
   - All bytes32 values properly formatted with `0x` prefix

4. **Check if already claimed**
   ```bash
   curl "${BRIDGE_API_URL}/claims?network_id=0"
   ```

## Gas Optimization

- **Path 1 vs Path 2**: Path 1 uses ~30% less gas overall
- **Proof freshness**: Use latest proof to avoid reverts
- **Batch operations**: For Path 2, consider batching multiple redemptions

