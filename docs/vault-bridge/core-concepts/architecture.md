---
title: Vault Bridge Architecture
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Vault Bridge Architecture
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 640px; margin: 0;">
    How Vault Bridge mints yield-bearing vbTokens on Ethereum and distributes them safely across Agglayer and other bridge routes
  </p>
</div>

## High-Level Overview

Vault Bridge wraps blue-chip assets on Ethereum (Layer&nbsp;X) into ERC‑4626 vbTokens that accrue yield from curated vaults. Those vbTokens can be bridged to Layer&nbsp;Y networks through multiple transport layers (Agglayer today, Hyperlane for yield routes, more coming). The architecture is intentionally modular: Layer&nbsp;X contracts handle collateralization and yield, Layer&nbsp;Y contracts focus on user experience and liquidity, and bridge adapters provide the cross-network plumbing.

| Location | Component | Responsibility |
|----------|-----------|----------------|
| Layer&nbsp;X (Ethereum) | `VaultBridgeToken` | ERC‑4626 vault that holds the underlying, enforces risk controls, and mints/burns vbTokens. |
| Layer&nbsp;X | `VaultBridgeTokenPart2` | Operational add-on providing reserve management, migration completion, and admin utilities. |
| Layer&nbsp;X | `MigrationManager` | Singleton that receives migrated backing from Layer&nbsp;Y and completes vbToken mint + bridge locking. |
| Layer&nbsp;Y | `AgglayerBridge` / bridge adapters | Receive vbTokens (or mapped tokens), emit exit roots, and send messages back to Ethereum. |
| Layer&nbsp;Y | `CustomToken` (optional) | ERC‑20 wrapper that maps a vbToken into the local token conventions on Layer&nbsp;Y. |
| Layer&nbsp;Y | `NativeConverter` (optional) | Local pseudo-ERC‑4626 vault that swaps between bridged underlying tokens and Custom Tokens. |
| Off-chain | Bridge service + relayers | Provide Merkle proofs, manage Hyperlane warp routes, or automate migration finalization. |

## Core Flows

### 1. Deposit & Bridge (Layer&nbsp;X → Layer&nbsp;Y)

1. User approves the underlying asset (e.g., USDC) to the vbToken.
2. `VaultBridgeToken.depositAndBridge()` pulls the underlying, mints vbTokens 1:1, and reserves part of the assets for instant withdrawals.
3. vbTokens are either minted to the user (staying on Ethereum) or bridged via the selected transport:
   - **Agglayer**: vbTokens are locked in the Agglayer bridge and emitted on the destination network.
   - **Hyperlane**: vbTokens remain on Sepolia (testnet) while synthetic HypERC20s represent them on remote chains.
4. Optional `NativeConverter` on Layer&nbsp;Y lets users trade local bridged assets for vbTokens.

### 2. Redeem & Withdraw (Layer&nbsp;Y → Layer&nbsp;X)

1. Users call the bridge on Layer&nbsp;Y (`bridgeAsset`) to send vbTokens back to Ethereum.
2. After finality, the Bridge Service API supplies SMT proofs.
3. On Ethereum, users execute `claimAndRedeem()` (or `claimAsset()` + `redeem()`) to receive the underlying asset.
4. `VaultBridgeToken` enforces solvency checks, redeeming first from reserves, then withdrawing from the yield vault if needed.

### 3. Migration (Native Converter → Layer&nbsp;X)

1. Layer&nbsp;Y operators call `NativeConverter.migrateBackingToLayerX()` to send accumulated backing (bridged underlying) to Layer&nbsp;X.
2. The converter bridges both assets and an instruction message to `MigrationManager`.
3. `MigrationManager` claims the assets, calls `VaultBridgeTokenPart2.completeMigration()`, and mints vbTokens that are locked on the origin Layer&nbsp;Y bridge to maintain 1:1 backing.
4. Migration fees fund and reserve rebalancing protect against fee-on-transfer assets.

## Layer X Contracts

### VaultBridgeToken (per asset)

The VaultBridgeToken contract combines ERC‑20, ERC‑4626, and permit extensions. It keeps an internal reserve of the underlying asset, enforcing a configurable minimum reserve ratio that powers instant withdrawals. Excess collateral is deposited into external yield strategies such as Morpho or Yearn, subject to slippage limits and solvency checks. Whenever users invoke bridge-aware entry points like `depositAndBridge`, the vbToken handles minting and routes the newly issued shares through the selected bridge adapter.

### VaultBridgeTokenPart2

VaultBridgeTokenPart2 augments the base vault with operational controls. It exposes functions for reserve rebalancing, scheduled yield collection, and administrative parameter changes. During migrations, Part2 mints the vbTokens corresponding to the returned backing and locks them on the appropriate Layer&nbsp;Y bridge, keeping cross-network supply balanced. The module also accepts donations—both for general yield distribution and for topping up the migration fee fund when bridging fee-on-transfer assets.

### MigrationManager (singleton)

MigrationManager lives on Ethereum and acts as the trusted orchestrator for any Native Converter. It maintains the mapping between Layer&nbsp;Y converters, their corresponding vbTokens, and the underlying collateral. When a converter bridges backing home, the manager consumes the accompanying message or proof, verifies the mapping, and finalizes the migration. If the collateral arrives as a native gas token, MigrationManager wraps it into the ERC‑20 representation (e.g., WETH) before completing the handoff.

## Layer Y Components

### Bridge Adapters

- **Agglayer Bridge**  
    - Canonical path for production deployments.  
    - Tracks exit roots, processes `bridgeAsset`, and exposes claim APIs.  
    - Works with any network onboarded to the Agglayer unified bridge.

- **Hyperlane Yield Routes**  
    - Maintains vbToken collateral on Sepolia, issues synthetic HypERC20s on partner chains (e.g., Polygon Amoy, Optimism Sepolia).  
    - Uses Hyperlane Mailboxes and Interchain Gas Paymasters to relay messages.  
    - Mailbox security dictates blast radius; see [Hyperlane Route](../routes/hyperlane.md) for specifics.

### Custom Token (optional)

Custom Token is an ERC‑20 with permit deployed on Layer&nbsp;Y that mirrors the decimal precision of the original underlying. Minting and burning rights are restricted to the bridge adapter and the Native Converter, ensuring supply changes always align with collateral movements. Projects typically deploy a Custom Token when they want a first-class vbToken representation rather than reusing generic bridge wrappers.

### Native Converter (optional)

The Native Converter is a pseudo ERC‑4626 vault that lives on Layer&nbsp;Y. It holds the bridged version of the underlying asset and issues the local Custom Token 1:1, giving users a way to move into and out of vbTokens without touching Ethereum. Internally it tracks a backing ledger so operators know how much collateral can be migrated back to Layer&nbsp;X at any time. Deposits can use permit flows, deconversions can bridge assets to other networks, and periodic migrations keep Layer&nbsp;Y liquidity synced with the main vault through MigrationManager.

## Optional Modules & Standards

### Bridged USDC Standard

vbUSDC supports Circle’s [Bridged USDC Standard](https://www.circle.com/blog/bridged-usdc-standard). By adopting the interface and lifecycle requirements upfront, Vault Bridge chains can upgrade to Circle-native USDC without forcing users through manual migrations. Behind the scenes, the same migration tooling moves balances between representations while preserving 1:1 backing.

### Yield Routing Integrations

Bridge adapters are pluggable. Agglayer and Hyperlane are live today, and additional transports can be onboarded without touching Layer&nbsp;X contracts. Regardless of the route, adapters must enforce the invariant that remote supply mirrors underlying collateral on Ethereum—any deviation triggers migration workflows or pause procedures.

## Operational Considerations

**Monitoring** should extend across both layers: watch `BridgeEvent`, `Deposit`, `Withdraw`, and `MigrationCompleted` logs, and maintain dashboards for reserve ratios and yield vault balances.  
**Security controls** rely on pauser roles across vbTokens, Native Converters, and bridge adapters, backed by safeguards such as `yieldVaultMaximumSlippagePercentage` and solvency checks that prevent unhealthy vault interactions.  
**Documentation links** worth bookmarking include [Assets & Vaults](../reference/assets-and-vaults.md), the [Agglayer Route](../routes/agglayer.md), the [Hyperlane Route](../routes/hyperlane.md), and the [Native Converter guide](native-converter.md).

## Roadmap

- Expand transport support beyond Agglayer + Hyperlane to additional EVM and non-EVM ecosystems.
- Standardize health dashboards and on-call runbooks for operators.  
- Continue refining migration automation so Layer&nbsp;Y liquidity self-rebalances with minimal human intervention.
