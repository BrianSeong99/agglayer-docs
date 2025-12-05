---
title: Agglayer Route
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Agglayer Route
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 640px; margin: 0;">
    Move vbTokens across Agglayer’s unified bridge, understand the on-chain components, and operate safely on Layer&nbsp;Y networks
  </p>
</div>

## Overview

Agglayer provides the canonical pathway for vbTokens between Ethereum (Layer&nbsp;X) and participating Layer&nbsp;Y rollups. Deposits originate on Ethereum, lock the underlying collateral inside the vbToken vault, and bridge freshly minted vbTokens (or mapped custom tokens) to the destination network. Returning value follows the inverse flow and culminates in `claimAndRedeem` on Ethereum for the underlying asset. This guide details the participating contracts, message flow, and operational responsibilities.

## Why Agglayer

- **Canonical liquidity** – vbTokens maintain their identity across Agglayer-connected chains without synthetic wrapper tokens.
- **Proof-backed security** – Every transfer contributes to the pessimistic proof; claims on Ethereum require Merkle proofs verified by the Agglayer bridge.
- **Composable UX** – Chains can optionally map vbTokens to custom ERC-20s or deploy Native Converters for local liquidity while reusing shared bridge infrastructure.

## Architecture Overview

| Layer | Component | Purpose |
|-------|-----------|---------|
| Ethereum (Layer&nbsp;X) | `VaultBridgeToken` (`deposit`, `depositAndBridge`) | Custodies the underlying asset, mints/burns vbTokens, and initiates bridge transfers. |
| Ethereum | `AgglayerBridge` (`bridgeAsset`, `claimAsset`) | Locks vbTokens, emits cross-network messages, and verifies proofs for claims. |
| Layer&nbsp;Y chain | `AgglayerBridge` instance | Receives bridged vbTokens, exposes `bridgeAsset` to return funds, and updates exit roots. |
| Layer&nbsp;Y chain | vbToken mapping or `CustomToken` | Receives the bridged asset (either the same vbToken or a mapped derivative). |
| Off-chain | Bridge Service API / proof fetcher | Provides SMT proofs and global indices required to claim bridged assets back on Ethereum. |
| Optional Layer&nbsp;Y | `NativeConverter` + underlying ERC-20 | Enables local swaps between bridged assets (e.g., bridged USDC) and vbTokens without returning to Ethereum. |

## Before You Bridge

- **Network IDs** – Obtain the Agglayer network ID for your chain (see [ABI Reference](../reference/abi-reference.md)); all bridge calls rely on it.
- **Token Mapping** – Choose whether vbTokens should arrive as vbTokens (default) or be mapped to a custom ERC-20 on Layer&nbsp;Y.
- **Wallet Funding** – Ensure users have Ethereum gas for deposits and Layer&nbsp;Y gas for interactions on your rollup.
- **Operational Contacts** – Align with the Agglayer bridge team for mapping changes and emergency pause procedures.

## Bridge Flows

### Ethereum → Layer Y

1. User holds the underlying asset on Ethereum (e.g., USDC).
2. Call `depositAndBridge()` on the vbToken contract with:
   - `assets`: amount to deposit
   - `destinationNetworkId`: Agglayer network ID of your chain
   - `receiver`: destination wallet on Layer Y
3. Wait ~20–30 minutes for Agglayer finality. The user receives vbTokens (or your mapped token) on Layer Y.

### Layer Y → Ethereum

1. On Layer Y, call the Agglayer bridge’s `bridgeAsset()` function with the vbToken amount and Ethereum destination address.
2. After finality, fetch the proof using the Bridge Service API and execute either:
   - `claimAndRedeem()` to claim vbTokens and immediately redeem for the underlying, or
   - `claimAsset()` + `redeem()` if you prefer a two-step process.

## Optional: Native Converter UX

Deploying the [Native Converter](../core-concepts/native-converter.md) on Layer Y lets users swap local bridged assets (e.g., bridged USDC) into vbTokens without returning to Ethereum. This improves UX if your chain already has liquidity in the underlying asset.

## Operational Guidance

| Responsibility | Checklist |
|----------------|-----------|
| Monitoring | Track Agglayer `BridgeEvent` logs on Layer&nbsp;Y and `ClaimEvent`/`Withdraw` events on Ethereum. Alert on transfers exceeding expected finality. |
| Liquidity | Publish your network ID and addresses in the [assets & vaults catalog](../reference/assets-and-vaults.md) so integrators can discover canonical tokens. |
| Mapping changes | Coordinate with the Agglayer bridge manager before altering token mappings or setting custom receivers. |
| Incident response | Use `pause` capabilities on vbTokens, Native Converters, and bridge contracts if abnormal flows or proof discrepancies appear. |

## Step-by-Step Code Examples

### Ethereum → Layer Y (TypeScript)

```typescript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC!);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const vbUSDC = new ethers.Contract(
  "0xb62Ba0719527701309339a175dDe3CBF1770dd38", // Sepolia vbUSDC
  [
    "function depositAndBridge(uint256 assets, address receiver, uint32 destinationNetworkId, bool forceUpdateGlobalExitRoot) external returns (uint256)"
  ],
  wallet
);

const USDC = new ethers.Contract(
  "0xCea1D25a715eC34adFB2267ACe127e8D107778dd", // Sepolia USDC
  ["function approve(address spender, uint256 amount) external returns (bool)"],
  wallet
);

async function bridgeToLayerY() {
  const amount = ethers.parseUnits("100", 6);
  const destinationNetworkId = 747474; // example Layer Y ID

  await (await USDC.approve(vbUSDC.target, amount)).wait();

  const tx = await vbUSDC.depositAndBridge(
    amount,
    wallet.address,
    destinationNetworkId,
    true
  );
  console.log(`Bridge tx: ${tx.hash}`);
  await tx.wait();
  console.log("vbTokens bridged to Layer Y");
}

bridgeToLayerY().catch(console.error);
```

### Layer Y → Ethereum (TypeScript, `claimAndRedeem` path)

```typescript
import { ethers } from "ethers";
import fetch from "node-fetch";

const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC!);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const vbUSDC = new ethers.Contract(
  "0xb62Ba0719527701309339a175dDe3CBF1770dd38", // Sepolia vbUSDC
  [
    "function claimAndRedeem(bytes32[32],bytes32[32],uint256,bytes32,bytes32,address,uint256,address,bytes) external returns (uint256)"
  ],
  wallet
);

async function claimOnEthereum(depositCount: number) {
  const baseUrl = process.env.BRIDGE_API_URL!;

  const indexResp = await fetch(
    `${baseUrl}/l1-info-tree-index?network_id=747474&deposit_count=${depositCount}`
  );
  const { l1_info_tree_index } = await indexResp.json();

  const proofResp = await fetch(
    `${baseUrl}/claim-proof?network_id=747474&deposit_count=${depositCount}&leaf_index=${l1_info_tree_index}`
  );
  const { proof } = await proofResp.json();

  const tx = await vbUSDC.claimAndRedeem(
    proof.smtProofLocalExitRoot,
    proof.smtProofRollupExitRoot,
    proof.globalIndex,
    proof.l1InfoTreeLeaf.globalExitRoot,
    proof.rollupExitRoot,
    wallet.address,
    proof.amount,
    wallet.address,
    "0x"
  );
  console.log(`Claim tx: ${tx.hash}`);
  await tx.wait();
  console.log("Underlying redeemed on Ethereum");
}

claimOnEthereum(42).catch(console.error);
```
