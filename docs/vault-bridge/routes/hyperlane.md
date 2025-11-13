---
title: Hyperlane Route
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Hyperlane Route
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 640px; margin: 0;">
    Bridge vbTokens with Hyperlane yield routes and operate synthetic liquidity safely across partner chains
  </p>
</div>

## Why Hyperlane

Hyperlane Warp Routes extend Vault Bridge beyond Agglayer-connected chains. vbTokens remain fully collateralized on Ethereum (Sepolia for testnet) while synthetic vbTokens (`HypERC20`) circulate on destination chains such as Polygon Amoy or Optimism Sepolia. The Hyperlane protocol handles message routing, proof verification, and synthetic mint/burn without requiring bespoke relayers.

## Architecture Overview

| Layer | Component | Purpose |
|-------|-----------|---------|
| Ethereum Sepolia (Origin) | `HypERC20CollateralVaultDeposit` | Custodies vbTokens deposited into the route and escrows collateral for synthetic issuance. |
| Ethereum Sepolia | `WarpRoute` config (`WarpMessenger`, `Router`) | Tracks domain IDs and routes messages to destination mailboxes. |
| Destination chain (Amoy / Optimism Sepolia) | `HypERC20` synthetic token | Mints synthetic vbTokens when messages arrive; burns on return. |
| Destination chain | `Mailbox` + `InterchainGasPaymaster` | Core Hyperlane contracts that deliver and pay for cross-chain messages. |
| Off-chain operator | Hyperlane CLI / automation | Submits `warp send` and `warp return`, monitors status, funds gas. |

Canonical addresses are maintained in [`assets-and-vaults`](../reference/assets-and-vaults.md#test-networks). For quick reference, the Sepolia testnet route uses collateral contract `0x5C0edadd0b674E932dF98d1Bb0f4aec41494A0EA`, and Polygon Amoy synthetic token `0xf7CC62aD0D6A439469E4Ce7CFBA510A1A30b1fA0`.

## Prerequisites

1. **Tooling**

    - Hyperlane CLI (`npm i -g @hyperlane-xyz/cli`)
    - Foundry / `cast` for approvals (optional)
    - Environment variables: `ETHEREUM_RPC`, `AMOY_RPC`, `PRIVATE_KEY`

2. **Config**

    - `yield-route-config.yaml` matching the deployed route ID
    - Funding on origin (Sepolia ETH) and destination (Amoy POL) for gas

3. **Addresses**

    - vbToken on Sepolia: `0xb62Ba0719527701309339a175dDe3CBF1770dd38` (vbUSDC)
    - Destination recipient wallet(s)

## Step 1 – Approve & Deposit vbTokens (Sepolia → Hyperlane)

```bash
# Approve vbUSDC to the Hyperlane collateral contract (100 vbUSDC with 6 decimals)
cast send 0xb62Ba0719527701309339a175dDe3CBF1770dd38 \
  "approve(address,uint256)" \
  0x5C0edadd0b674E932dF98d1Bb0f4aec41494A0EA \
  100000000 \
  --rpc-url "$ETHEREUM_RPC" \
  --private-key "$PRIVATE_KEY"

# Initiate the warp route send (Sepolia → Amoy)
hyperlane warp send \
  --config yield-route-config.yaml \
  --route USDC/sepolia-amoy-optimism \
  --origin sepolia \
  --destination amoy \
  --amount 100 \
  --recipient 0xRecipientOnAmoy
```

What happens:
- vbUSDC moves from the user wallet into the collateral contract.
- Hyperlane enqueues a message containing the deposit metadata.
- A message ID and nonce are printed; note them for monitoring.

Monitor status via [explorer.hyperlane.xyz](https://explorer.hyperlane.xyz/) or `hyperlane warp status --message-id <id>`.

## Step 2 – Verify Synthetic Mint on Destination

Within a few minutes (depending on gas payments), the Hyperlane Mailbox on Polygon Amoy executes the message and mints synthetic vbUSDC to the recipient address.

```bash
# Check synthetic balance on Amoy (6 decimals)
cast call 0xf7CC62aD0D6A439469E4Ce7CFBA510A1A30b1fA0 \
  "balanceOf(address)(uint256)" \
  0xRecipientOnAmoy \
  --rpc-url "$AMOY_RPC"
```

On PolygonScan Amoy, the transaction will appear as `handle` on the Mailbox contract followed by `Transfer` events on the synthetic token.

## Step 3 – Return Synthetic vbTokens to Sepolia

Hyperlane supports a “warp return” command that burns the synthetic vbToken and sends the collateral back to the origin chain.

```bash
# Burn 100 synthetic vbUSDC on Amoy and return collateral to Sepolia
hyperlane warp return \
  --config yield-route-config.yaml \
  --route USDC/sepolia-amoy-optimism \
  --origin amoy \
  --destination sepolia \
  --amount 100 \
  --sender 0xRecipientOnAmoy \
  --recipient 0xSepoliaReceiver
```

The command performs the following:

1. Burns synthetic vbUSDC (`HypERC20`)
2. Sends a message to the Sepolia collateral contract
3. Releases vbUSDC back to the specified Sepolia address

You can also execute the burn manually with the synthetic contract’s `burn` function and fund the interchain gas paymaster separately.

## Step 4 – Claim Backing from Sepolia to Ethereum Mainnet

Once vbUSDC is back on Sepolia, follow the standard [L2 → L1 redemption flow](agglayer.md) to move value to Ethereum Mainnet:

1. Bridge vbUSDC (Sepolia) to Ethereum through Agglayer’s `bridgeAsset`.
2. Wait for finality and fetch proofs via the Bridge Service API (`/claim-proof`).
3. Execute `claimAndRedeem` on the L1 `VaultBridgeToken` to receive underlying USDC.

This step mirrors the Agglayer redemption path; reuse the TypeScript claim script from the [Agglayer route](agglayer.md) with Sepolia RPC endpoints and proof data.
