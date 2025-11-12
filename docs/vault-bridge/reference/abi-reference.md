---
title: ABI Reference
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  ABI Reference
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Complete smart contract function documentation for Vault Bridge
  </p>
</div>

## Overview

This reference documents all public functions, events, and data structures for Vault Bridge smart contracts. For integration examples, see the [Integration Guides](../integration-guides/).

## VaultBridgeToken Contract

The VaultBridgeToken is an ERC-20 token, ERC-4626 vault, and Unified Bridge extension deployed on Ethereum (Layer 1).

**Interface:** ERC-20, ERC-4626, ERC-2612 (Permit)

### Core Functions

#### depositAndBridge()

Deposit underlying assets and bridge minted vbTokens to L2 in a single transaction.

```solidity
function depositAndBridge(
    uint256 assets,
    address receiver,
    uint32 destinationNetworkId,
    bool forceUpdateGlobalExitRoot
) external returns (uint256 shares)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `assets` | `uint256` | Amount of underlying tokens to deposit (in token's decimals) |
| `receiver` | `address` | Address to receive vbTokens on destination network |
| `destinationNetworkId` | `uint32` | Network ID of destination chain (must not equal source) |
| `forceUpdateGlobalExitRoot` | `bool` | Whether to immediately update Global Exit Root (recommended: `true`) |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `shares` | `uint256` | Amount of vbTokens minted and bridged (1:1 with assets) |

**Events Emitted:**

```solidity
event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares);
```

**Requirements:**
- `assets` > 0
- `receiver` != address(0)
- `destinationNetworkId` != current network
- Caller must have approved VaultBridgeToken to spend `assets`
- Contract must not be paused

**Example:**

```solidity
// Approve underlying
underlying.approve(address(vbToken), 100e6);

// Deposit and bridge
uint256 shares = vbToken.depositAndBridge(
    100e6,           // 100 USDC
    userAddress,     // Receiver on L2
    747474,          // Katana network ID
    true             // Force update GER
);
```

---

#### claimAndRedeem()

Claim vbTokens from the bridge and immediately redeem for underlying in a single transaction.

```solidity
function claimAndRedeem(
    bytes32[32] calldata smtProofLocalExitRoot,
    bytes32[32] calldata smtProofRollupExitRoot,
    uint256 globalIndex,
    bytes32 mainnetExitRoot,
    bytes32 rollupExitRoot,
    address destinationAddress,
    uint256 amount,
    address receiver,
    bytes calldata metadata
) external returns (uint256 assets)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `smtProofLocalExitRoot` | `bytes32[32]` | Merkle proof for local exit tree (from API) |
| `smtProofRollupExitRoot` | `bytes32[32]` | Merkle proof for rollup exit tree (from API) |
| `globalIndex` | `uint256` | Global index of bridge transaction (from API) |
| `mainnetExitRoot` | `bytes32` | Mainnet exit root (from API) |
| `rollupExitRoot` | `bytes32` | Rollup exit root (from API) |
| `destinationAddress` | `address` | Original destination address from bridge |
| `amount` | `uint256` | Amount of vbTokens to claim and redeem |
| `receiver` | `address` | Address to receive underlying tokens |
| `metadata` | `bytes` | Bridge metadata (usually empty `0x`) |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `assets` | `uint256` | Amount of underlying tokens received (1:1 with vbTokens) |

**Requirements:**
- Valid Merkle proofs from Bridge Service API
- Bridge transaction must be finalized
- Not already claimed
- Contract must not be paused

**Example:**

```solidity
// Fetch proof from Bridge Service API
const proof = await fetchBridgeProof(networkId, depositCount);

// Claim and redeem
uint256 assets = vbToken.claimAndRedeem(
    proof.smtProofLocalExitRoot,
    proof.smtProofRollupExitRoot,
    proof.globalIndex,
    proof.l1InfoTreeLeaf.globalExitRoot,
    proof.rollupExitRoot,
    userAddress,
    amount,
    userAddress,
    "0x"
);
```

---

### ERC-4626 Vault Functions

#### deposit()

Deposit underlying tokens and receive vbTokens on L1 (no bridging).

```solidity
function deposit(uint256 assets, address receiver) external returns (uint256 shares)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `assets` | `uint256` | Amount of underlying to deposit |
| `receiver` | `address` | Address to receive vbTokens |

**Returns:** `shares` - Amount of vbTokens minted (1:1 ratio)

---

#### withdraw()

Burn vbTokens and receive underlying tokens on L1.

```solidity
function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `assets` | `uint256` | Amount of underlying to withdraw |
| `receiver` | `address` | Address to receive underlying |
| `owner` | `address` | Owner of vbTokens being burned |

**Returns:** `shares` - Amount of vbTokens burned

---

#### redeem()

Burn vbTokens and receive underlying tokens on L1.

```solidity
function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `shares` | `uint256` | Amount of vbTokens to burn |
| `receiver` | `address` | Address to receive underlying |
| `owner` | `address` | Owner of vbTokens |

**Returns:** `assets` - Amount of underlying tokens received

---

### View Functions

#### convertToShares()

Calculate vbTokens for a given amount of underlying.

```solidity
function convertToShares(uint256 assets) external view returns (uint256 shares)
```

**Returns:** Amount of vbTokens for `assets` (1:1 ratio)

---

#### convertToAssets()

Calculate underlying for a given amount of vbTokens.

```solidity
function convertToAssets(uint256 shares) external view returns (uint256 assets)
```

**Returns:** Amount of underlying for `shares` (1:1 ratio)

---

#### totalAssets()

Get total underlying assets managed by the vault.

```solidity
function totalAssets() external view returns (uint256)
```

**Returns:** Total underlying assets (reserved + in yield vault)

---

## NativeConverter Contract

The NativeConverter enables local conversion between bridged assets and vbTokens on L2.

### Conversion Functions

#### convert()

Convert underlying tokens to Custom Tokens (vbTokens) on L2.

```solidity
function convert(uint256 assets, address receiver) external returns (uint256 shares)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `assets` | `uint256` | Amount of underlying to convert |
| `receiver` | `address` | Address to receive Custom Tokens |

**Returns:** `shares` - Amount of Custom Tokens minted (1:1)

**Requirements:**
- `assets` > 0
- `receiver` != address(0)
- Caller must have approved NativeConverter
- Contract must not be paused

**Example:**

```solidity
// Approve Native Converter
bridgedUSDC.approve(address(nativeConverter), 100e6);

// Convert to vbUSDC
uint256 shares = nativeConverter.convert(100e6, userAddress);
```

---

#### convertWithPermit()

Convert using EIP-2612 permit for gasless approval.

```solidity
function convertWithPermit(
    uint256 assets,
    address receiver,
    bytes calldata permitData
) external returns (uint256 shares)
```

**Parameters:** Same as `convert()` plus `permitData` containing permit signature

---

#### deconvert()

Convert Custom Tokens back to underlying tokens on L2.

```solidity
function deconvert(uint256 shares, address receiver) external returns (uint256 assets)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `shares` | `uint256` | Amount of Custom Tokens to deconvert |
| `receiver` | `address` | Address to receive underlying |

**Returns:** `assets` - Amount of underlying tokens received

**Requirements:**
- Sufficient backing available on L2 (check `maxDeconvert()`)
- Caller must own the Custom Tokens

**Example:**

```solidity
// Check if deconversion is possible
uint256 maxDeconvertable = nativeConverter.maxDeconvert(userAddress);
require(amount <= maxDeconvertable, "Insufficient backing");

// Approve Custom Token for burning
vbUSDC.approve(address(nativeConverter), amount);

// Deconvert
uint256 assets = nativeConverter.deconvert(amount, userAddress);
```

---

#### deconvertAndBridge()

Deconvert and bridge underlying to another network in one transaction.

```solidity
function deconvertAndBridge(
    uint256 shares,
    address receiver,
    uint32 destinationNetworkId,
    bool forceUpdateGlobalExitRoot
) external returns (uint256 assets)
```

**Parameters:** Similar to `deconvert()` plus bridge parameters

---

### Migration Functions

#### migrateBackingToLayerX()

Migrate backing from L2 to L1 for yield generation (requires MIGRATOR_ROLE).

```solidity
function migrateBackingToLayerX(uint256 assets) external
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `assets` | `uint256` | Amount of backing to migrate to L1 |

**Requirements:**
- Caller must have MIGRATOR_ROLE
- `assets` <= `migratableBacking()`

**Events Emitted:**

```solidity
event MigrationStarted(uint256 indexed mintedCustomToken, uint256 indexed migratedBacking);
```

---

### View Functions

#### maxDeconvert()

Get maximum Custom Tokens that can be deconverted for a user.

```solidity
function maxDeconvert(address owner) external view returns (uint256 maxShares)
```

**Returns:** Maximum deconvertable shares based on available backing

---

#### migratableBacking()

Get amount of backing that can be migrated to L1.

```solidity
function migratableBacking() external view returns (uint256)
```

**Returns:** Assets available for migration (respects `nonMigratableBackingPercentage`)

---

#### backingOnLayerY()

Get total backing held on L2.

```solidity
function backingOnLayerY() external view returns (uint256)
```

**Returns:** Total underlying backing on L2

---

## CustomToken Contract

Mintable/burnable ERC-20 token for use with Native Converter on L2.

### Functions

#### mint()

Mint Custom Tokens (requires MINTER_ROLE, typically Native Converter).

```solidity
function mint(address to, uint256 amount) external
```

---

#### burn()

Burn Custom Tokens (requires BURNER_ROLE, typically Native Converter).

```solidity
function burn(address from, uint256 amount) external
```

---

## MigrationManager Contract

Handles migration of backing from L2 Native Converters to L1 VaultBridgeToken (deployed on L1).

### onMessageReceived()

Callback triggered when migration arrives from L2.

```solidity
function onMessageReceived(
    address originAddress,
    uint32 originNetwork,
    bytes memory data
) external payable
```

**Internal Processing:**
- Receives migrated backing
- Deposits into VaultBridgeToken
- Locks minted vbTokens in bridge for L2 claim

---

## Events Reference

### VaultBridgeToken Events

```solidity
// ERC-4626 standard event
event Deposit(
    address indexed sender,
    address indexed owner,
    uint256 assets,
    uint256 shares
);

event Withdraw(
    address indexed sender,
    address indexed receiver,
    address indexed owner,
    uint256 assets,
    uint256 shares
);

// Vault Bridge specific
event YieldCollected(
    address indexed yieldRecipient,
    uint256 vbTokenAmount
);

event ReserveRebalanced(
    uint256 oldReservedAssets,
    uint256 newReservedAssets,
    uint256 reservePercentage
);
```

### NativeConverter Events

```solidity
event MigrationStarted(
    uint256 indexed mintedCustomToken,
    uint256 indexed migratedBacking
);

event NonMigratableBackingPercentageSet(
    uint256 nonMigratableBackingPercentage
);
```

---

## Error Reference

### VaultBridgeToken Errors

```solidity
error InvalidAssets();                          // Amount is 0 or invalid
error InvalidShares();                          // Shares amount is 0 or invalid
error InvalidReceiver();                        // Receiver is zero address or invalid
error InvalidDestinationNetworkId();            // Destination same as source
error IncorrectAmountOfSharesRedeemed(uint256 redeemed, uint256 expected);
```

### NativeConverter Errors

```solidity
error InvalidAssets();
error InvalidShares();
error InvalidReceiver();
error InvalidPermitData();
error InvalidDestinationNetworkId();
error AssetsTooLarge(uint256 available, uint256 requested);
error OnlyMigrator();
```

---

## Access Control Roles

### VaultBridgeToken Roles

| Role | Purpose | Capabilities |
|------|---------|--------------|
| `DEFAULT_ADMIN_ROLE` | Contract administration | Grant/revoke roles, configure parameters |
| `REBALANCER_ROLE` | Reserve management | Rebalance reserves between liquid and yield vault |
| `YIELD_COLLECTOR_ROLE` | Yield distribution | Collect generated yield |
| `PAUSER_ROLE` | Emergency control | Pause/unpause contract |

### NativeConverter Roles

| Role | Purpose | Capabilities |
|------|---------|--------------|
| `DEFAULT_ADMIN_ROLE` | Contract administration | Grant/revoke roles, configure parameters |
| `MIGRATOR_ROLE` | Backing migration | Trigger `migrateBackingToLayerX()` |
| `PAUSER_ROLE` | Emergency control | Pause/unpause contract |

### CustomToken Roles

| Role | Purpose | Capabilities |
|------|---------|--------------|
| `DEFAULT_ADMIN_ROLE` | Token administration | Grant/revoke roles |
| `MINTER_ROLE` | Token minting | Mint Custom Tokens (usually Native Converter) |
| `BURNER_ROLE` | Token burning | Burn Custom Tokens (usually Native Converter) |

---

## Gas Estimates

Approximate gas costs on Ethereum mainnet (at 20 gwei):

| Function | Gas Used | Approximate Cost (ETH) |
|----------|----------|------------------------|
| `depositAndBridge()` | ~250,000 | 0.005 |
| `claimAndRedeem()` | ~300,000 | 0.006 |
| `deposit()` | ~150,000 | 0.003 |
| `withdraw()` / `redeem()` | ~180,000 | 0.0036 |

L2 operations (Native Converter):

| Function | Gas Used | Approximate Cost |
|----------|----------|------------------|
| `convert()` | ~100,000 | Minimal (L2 gas) |
| `deconvert()` | ~120,000 | Minimal (L2 gas) |
| `migrateBackingToLayerX()` | ~200,000 | Minimal (L2 gas) |

*Note: Actual costs vary with network conditions and L2 gas prices*

---

## Integration Checklist

When integrating Vault Bridge, ensure you:

- [ ] Use correct contract addresses for your network
- [ ] Handle all error cases appropriately
- [ ] Implement proper allowance management
- [ ] Fetch fresh proofs for claims
- [ ] Test on testnet thoroughly
- [ ] Monitor contract pause state
- [ ] Implement proper event monitoring
- [ ] Handle 1:1 conversion ratio assumptions

---

## Additional Resources

- [VaultBridgeToken Source Code](https://github.com/agglayer/vault-bridge/blob/main/src/VaultBridgeToken.sol)
- [NativeConverter Source Code](https://github.com/agglayer/vault-bridge/blob/main/src/NativeConverter.sol)
- [Integration Tests](https://github.com/agglayer/vault-bridge/tree/main/test/integration)
- [ERC-4626 Specification](https://eips.ethereum.org/EIPS/eip-4626)

For practical integration examples, see:
- [Ethereum to L2 Bridging Guide](../integration-guides/eth-to-l2.md)
- [L2 to Ethereum Bridging Guide](../integration-guides/l2-to-eth.md)
- [Native Converter Integration](../integration-guides/native-converter-integration.md)

