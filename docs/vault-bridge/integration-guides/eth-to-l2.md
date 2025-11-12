---
title: Ethereum to L2 Bridging
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Ethereum to L2 Bridging
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Bridge vbTokens from Ethereum to Layer 2 chains using depositAndBridge()
  </p>
</div>

## Overview

Bridging vbTokens from Ethereum (L1) to Layer 2 chains is a streamlined process that combines deposit and bridging into a single transaction. This guide covers the `depositAndBridge()` function with complete smart contract examples.

**What happens:**

1. User deposits underlying asset (e.g., USDC) on Ethereum
2. VaultBridgeToken mints vbToken (e.g., vbUSDC) 1:1
3. vbToken is automatically bridged to destination L2
4. User receives vbToken on L2 (as bridged token or custom token)

**Timeline**: ~20-30 minutes for bridge finalization

## Prerequisites

Before integrating L1→L2 bridging:

1. **Contract Addresses**: Know your VaultBridgeToken and underlying token addresses
   - See [Contract Addresses](../reference/contract-addresses.md) for deployments
2. **Network IDs**: Identify destination L2 network ID
3. **Testnet Access**: Have Sepolia ETH for testing
4. **Development Environment**: Foundry or Hardhat installed

## The depositAndBridge() Function

### Function Signature

```solidity
function depositAndBridge(
    uint256 assets,
    address receiver,
    uint32 destinationNetworkId,
    bool forceUpdateGlobalExitRoot
) external returns (uint256 shares)
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `assets` | `uint256` | Amount of underlying tokens to deposit (in token decimals) |
| `receiver` | `address` | Address to receive vbTokens on destination L2 |
| `destinationNetworkId` | `uint32` | Network ID of destination chain (e.g., 747474 for Katana) |
| `forceUpdateGlobalExitRoot` | `bool` | Whether to update Global Exit Root immediately (usually `true`) |

### Returns

| Return Value | Type | Description |
|--------------|------|-------------|
| `shares` | `uint256` | Amount of vbTokens minted and bridged (1:1 with assets) |

### Events Emitted

The function emits an ERC-4626 `Deposit` event:

```solidity
event Deposit(
    address indexed sender,      // msg.sender (who deposited)
    address indexed owner,       // VaultBridgeToken contract (when bridging)
    uint256 assets,              // Amount of underlying deposited
    uint256 shares               // Amount of vbToken minted
)
```

## Step-by-Step Example: Sepolia Testnet

Let's bridge vbUSDC from Sepolia to an L2.

### Step 1: Get Testnet Tokens

```bash
# Get Sepolia ETH from faucet
# https://sepoliafaucet.com/

# Get test USDC (if available) or use existing testnet USDC
```

### Step 2: Prepare Contract Addresses

From [Contract Addresses](../reference/contract-addresses.md):

```solidity
address constant SEPOLIA_USDC = 0xCea1D25a715eC34adFB2267ACe127e8D107778dd;
address constant SEPOLIA_VBUSDC = 0xb62Ba0719527701309339a175dDe3CBF1770dd38;
uint32 constant DESTINATION_NETWORK = 20; // Example L2 network ID
```

### Step 3: Deploy Integration Contract

A minimal helper contract keeps the deposit logic reusable:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVaultBridgeToken {
    function depositAndBridge(
        uint256 assets,
        address receiver,
        uint32 destinationNetworkId,
        bool forceUpdateGlobalExitRoot
    ) external returns (uint256 shares);
}

contract SimpleVaultBridgeIntegrator {
    IERC20 public immutable underlying;
    IVaultBridgeToken public immutable vaultBridgeToken;
    uint32 public immutable destinationNetwork;

    constructor(address _underlying, address _vaultBridgeToken, uint32 _destinationNetwork) {
        underlying = IERC20(_underlying);
        vaultBridgeToken = IVaultBridgeToken(_vaultBridgeToken);
        destinationNetwork = _destinationNetwork;
    }

    function bridge(uint256 amount, address receiver) external returns (uint256 shares) {
        underlying.transferFrom(msg.sender, address(this), amount);
        underlying.approve(address(vaultBridgeToken), amount);
        shares = vaultBridgeToken.depositAndBridge(amount, receiver, destinationNetwork, true);
    }
}
```

```bash
# Using Foundry
forge create SimpleVaultBridgeIntegrator \
    --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
    --private-key YOUR_PRIVATE_KEY \
    --constructor-args \
        0xCea1D25a715eC34adFB2267ACe127e8D107778dd \
        0xb62Ba0719527701309339a175dDe3CBF1770dd38 \
        20
```

### Step 4: Execute Bridge Transaction

```javascript
// Using ethers.js
const { ethers } = require('ethers');

// Setup
const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const USDC = new ethers.Contract(SEPOLIA_USDC, ERC20_ABI, wallet);
const integrator = new ethers.Contract(INTEGRATOR_ADDRESS, INTEGRATOR_ABI, wallet);

// Amount: 10 USDC (6 decimals)
const amount = ethers.parseUnits('10', 6);
const receiver = wallet.address; // Or different L2 address

// Approve
const approveTx = await USDC.approve(integrator.address, amount);
await approveTx.wait();
console.log('Approved USDC');

// Bridge
const bridgeTx = await integrator.bridge(amount, receiver);
const receipt = await bridgeTx.wait();
console.log('Bridged! Transaction:', receipt.hash);

// Extract shares from event
const event = receipt.logs.find(log => 
    log.topics[0] === ethers.id('Bridged(address,address,uint256,uint256,uint32)')
);
console.log('vbTokens bridged:', ethers.formatUnits(event.data, 6));
```

### Step 5: Verify on L2

Wait ~20-30 minutes, then check L2:

```javascript
// On L2
const L2_VBUSDC_ADDRESS = '0x...'; // Bridged vbUSDC address on L2

const vbUSDC = new ethers.Contract(L2_VBUSDC_ADDRESS, ERC20_ABI, l2Provider);
const balance = await vbUSDC.balanceOf(receiver);
console.log('L2 vbUSDC Balance:', ethers.formatUnits(balance, 6));
```

## Gas Optimization Tips

1. **Batch Approvals**: Approve once with `type(uint256).max` instead of per transaction
2. **Force Update**: Set `forceUpdateGlobalExitRoot = true` for faster finalization
3. **Direct Calls**: For power users, calling `depositAndBridge()` directly saves gas vs. wrapper contracts

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| `InvalidDestinationNetworkId()` | Destination is same as source | Verify network ID is correct L2 ID |
| `InvalidAssets()` | Amount is 0 | Check amount is > 0 |
| `InvalidReceiver()` | Receiver is 0 address or contract itself | Provide valid receiver address |
| Transfer fails | Insufficient allowance | Approve underlying token first |
| `Pausable: paused` | VaultBridgeToken is paused | Wait for unpause or contact team |
