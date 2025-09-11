---
title: Asset Bridging
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Asset Bridging
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Learn how to bridge tokens and native assets between different chains using the Unified Bridge
  </p>
</div>

## Overview

Asset bridging enables the transfer of tokens and native assets between AggLayer connected chains. The Unified Bridge supports various token types and provides a secure, trustless mechanism for cross-chain asset transfers.

![Asset Bridging Process](../../img/agglayer/BridgeAssetProcess.png)

*Figure 1: Complete asset bridging flow from source chain to destination chain*

## Supported Token Types

The Unified Bridge handles different token types with specific mechanisms:

| Token Type | Source Chain Action | Destination Chain Action |
|------------|-------------------|------------------------|
| **Native Gas Token** (ETH, Custom Gas Token) | Bridge contract holds tokens | Bridge contract transfers tokens |
| **WETH** | Burn WETH tokens from user | Mint WETH tokens to user |
| **Foreign ERC20** (Not native to source) | Burn ERC20 tokens from user | Mint wrapped tokens to user |
| **Native ERC20** (Native to source) | Transfer ERC20 to bridge contract | Transfer from bridge contract to user |

## Bridge Asset Function

The `bridgeAsset` function initiates asset transfers between chains.

### Function Signature

```solidity
function bridgeAsset(
    uint32 destinationNetwork,
    address destinationAddress,
    uint256 amount,
    address token,
    bool forceUpdateGlobalExitRoot,
    bytes calldata permitData
) external payable
```

### Parameters

- **`destinationNetwork`**: Network ID of the destination chain
- **`destinationAddress`**: Address to receive assets on destination chain
- **`amount`**: Amount of tokens to bridge
- **`token`**: Token contract address (0x0 for native gas token)
- **`forceUpdateGlobalExitRoot`**: Whether to update GER immediately
- **`permitData`**: Raw permit data for ERC20 tokens (optional)

### Process Steps

1. **Validation**: Check destination network is not the source network
2. **Token Preparation**: Handle token based on type (lock, burn, or transfer)
3. **Event Emission**: Emit `BridgeEvent` with transaction details
4. **Tree Update**: Add transaction to Local Exit Tree as leaf node

### Token Preparation Logic

#### Native Gas Token
```solidity
// Bridge contract holds the tokens
// No additional action required
```

#### WETH
```solidity
// Burn WETH tokens from user's address
IWETH(token).burnFrom(msg.sender, amount);
```

#### Foreign ERC20
```solidity
// Burn ERC20 tokens from user's address
IERC20(token).burnFrom(msg.sender, amount);
```

#### Native ERC20
```solidity
// Execute permit if provided
if (permitData.length > 0) {
    IERC20Permit(token).permit(...);
}
// Transfer tokens to bridge contract
IERC20(token).transferFrom(msg.sender, address(this), amount);
```

## Claim Asset Function

The `claimAsset` function claims bridged assets on the destination chain.

### Function Signature

```solidity
function claimAsset(
    bytes32[_DEPOSIT_CONTRACT_TREE_DEPTH] calldata smtProofLocalExitRoot,
    bytes32[_DEPOSIT_CONTRACT_TREE_DEPTH] calldata smtProofRollupExitRoot,
    uint256 globalIndex,
    bytes32 mainnetExitRoot,
    bytes32 rollupExitRoot,
    uint32 originNetwork,
    address originTokenAddress,
    uint32 destinationNetwork,
    address destinationAddress,
    uint256 amount,
    bytes calldata metadata
) external
```

### Parameters

- **`smtProofLocalExitRoot`**: Merkle proof for Local Exit Root
- **`smtProofRollupExitRoot`**: Merkle proof for Rollup Exit Root
- **`globalIndex`**: Global index identifying the transaction
- **`mainnetExitRoot`**: Mainnet Exit Root at time of transaction
- **`rollupExitRoot`**: Rollup Exit Root at time of transaction
- **`originNetwork`**: Network ID of source chain
- **`originTokenAddress`**: Token address on source chain
- **`destinationNetwork`**: Network ID of destination chain
- **`destinationAddress`**: Address to receive assets
- **`amount`**: Amount of tokens to claim
- **`metadata`**: Additional metadata (if any)

### Process Steps

1. **Validation**: Verify destination network matches current chain
2. **Proof Verification**: Verify Merkle proofs against Global Exit Root
3. **Duplicate Check**: Ensure transaction hasn't been claimed before
4. **Token Transfer**: Transfer tokens based on token type
5. **Claim Record**: Mark transaction as claimed

### Proof Verification Logic

```solidity
// Construct Global Exit Root
bytes32 globalExitRoot = keccak256(abi.encodePacked(mainnetExitRoot, rollupExitRoot));

// Verify against synchronized GER
require(globalExitRoot == getGlobalExitRoot(), "Invalid global exit root");

// Verify Merkle proofs based on origin
if (originNetwork == 0) {
    // L1 to L2: Verify against mainnet exit root
    verifyMerkleProof(smtProofLocalExitRoot, mainnetExitRoot, globalIndex);
} else {
    // L2 to L2: Verify against rollup exit root
    verifyMerkleProof(smtProofLocalExitRoot, rollupExitRoot, globalIndex);
    verifyMerkleProof(smtProofRollupExitRoot, rollupExitRoot, globalIndex);
}
```

## Bridging Flows

### L1 to L2 Bridging

1. **User Action**: User calls `bridgeAsset` on L1
2. **Token Locking**: Native tokens locked in L1 bridge contract
3. **Event Emission**: `BridgeEvent` emitted with transaction details
4. **LET Update**: Transaction added to L1's Local Exit Tree
5. **MER Update**: Mainnet Exit Root updated on L1
6. **GER Update**: Global Exit Root updated
7. **L2 Sync**: L2 syncs with latest GER
8. **User Claim**: User calls `claimAsset` on L2
9. **Token Transfer**: Tokens transferred to user on L2

### L2 to L1 Bridging

1. **User Action**: User calls `bridgeAsset` on L2
2. **Token Burning**: Tokens burned on L2
3. **Event Emission**: `BridgeEvent` emitted with transaction details
4. **LET Update**: Transaction added to L2's Local Exit Tree
5. **L2 Submission**: L2 submits LET to L1 via RollupManager
6. **RER Update**: Rollup Exit Root updated on L1
7. **GER Update**: Global Exit Root updated
8. **User Claim**: User calls `claimAsset` on L1
9. **Token Transfer**: Tokens transferred to user on L1

### L2 to L2 Bridging

1. **User Action**: User calls `bridgeAsset` on L2A
2. **Token Burning**: Tokens burned on L2A
3. **Event Emission**: `BridgeEvent` emitted with transaction details
4. **LET Update**: Transaction added to L2A's Local Exit Tree
5. **L2A Submission**: L2A submits LET to L1 via RollupManager
6. **RER Update**: Rollup Exit Root updated on L1
7. **GER Update**: Global Exit Root updated
8. **L2B Sync**: L2B syncs with latest GER
9. **User Claim**: User calls `claimAsset` on L2B
10. **Token Transfer**: Tokens transferred to user on L2B

## Using Lxly.js SDK

The Lxly.js SDK simplifies asset bridging with prebuilt functions.

### Installation

```bash
npm install @polygon/lxly
```

### Basic Usage

```javascript
import { Lxly } from '@polygon/lxly';

// Initialize Lxly instance
const lxly = new Lxly({
  rpcUrl: 'https://rpc-url',
  bridgeAddress: '0x...',
  networkId: 1
});

// Bridge assets
const txHash = await lxly.bridgeAsset({
  destinationNetwork: 0,
  destinationAddress: '0x...',
  amount: '1000000000000000000', // 1 ETH
  token: '0x0000000000000000000000000000000000000000', // ETH
  forceUpdateGlobalExitRoot: true
});

console.log('Bridge transaction hash:', txHash);
```

### Advanced Usage

```javascript
// Bridge ERC20 tokens
const txHash = await lxly.bridgeAsset({
  destinationNetwork: 1,
  destinationAddress: '0x...',
  amount: '1000000000000000000', // 1 token
  token: '0x...', // ERC20 token address
  forceUpdateGlobalExitRoot: false,
  permitData: '0x...' // Optional permit data
});

// Claim assets
const claimTxHash = await lxly.claimAsset({
  smtProofLocalExitRoot: [...],
  smtProofRollupExitRoot: [...],
  globalIndex: '0x...',
  mainnetExitRoot: '0x...',
  rollupExitRoot: '0x...',
  originNetwork: 0,
  originTokenAddress: '0x...',
  destinationNetwork: 1,
  destinationAddress: '0x...',
  amount: '1000000000000000000',
  metadata: '0x'
});
```

## Security Considerations

### Proof Verification

- **Merkle Proofs**: All claims require valid Merkle proofs
- **Global Exit Root**: Claims verified against synchronized GER
- **Finality**: Claims only possible after L1 finality

### Token Security

- **Asset Locking**: Source chain assets locked until claimed
- **Burn and Mint**: Foreign tokens burned on source, minted on destination
- **Transfer Verification**: All transfers verified before execution

### Economic Security

- **No Double Spending**: Each transaction can only be claimed once
- **Proof Requirements**: Cryptographic proofs prevent invalid claims
- **Finality Requirements**: L1 finality ensures transaction security

## Getting Started

Ready to start bridging assets?

<!-- CTA Button Component -->
<div style="text-align: center; margin: 3rem 0;">
  <a href="/agglayer/core-concepts/unified-bridge/message-bridging/" style="background: #0071F7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
    Learn About Message Bridging →
  </a>
</div>
