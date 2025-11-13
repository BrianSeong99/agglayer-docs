---
title: Quickstart
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Quickstart
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Get started with Vault Bridge in 5 minutes
  </p>
</div>

## What You'll Build

In this quickstart, you'll create a simple integration that bridges vbUSDC from Ethereum to an L2 chain using the `depositAndBridge()` function.

**Time required:** ~5 minutes  
**Prerequisites:** Basic Solidity and JavaScript knowledge

## Before You Start

1. **Complete Legal Onboarding**: [Contact the Vault Bridge team](https://info.polygon.technology/vaultbridge-intake-form) to complete required legal documentation
2. **Understand the Basics**: Review [What is Vault Bridge?](overview.md)
3. **Set Up Testnet**: Get Sepolia ETH from a [faucet](https://sepoliafaucet.com/)

## Step 1: Smart Contract Integration

Create a simple contract that bridges vbTokens:

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

contract QuickVaultBridge {
    IERC20 public immutable usdc;
    IVaultBridgeToken public immutable vbUSDC;
    uint32 public constant L2_NETWORK_ID = 20; // Your L2 network ID
    
    constructor(address _usdc, address _vbUSDC) {
        usdc = IERC20(_usdc);
        vbUSDC = IVaultBridgeToken(_vbUSDC);
    }
    
    function bridgeToL2(uint256 amount) external {
        // Transfer USDC from user
        usdc.transferFrom(msg.sender, address(this), amount);
        
        // Approve vbUSDC contract
        usdc.approve(address(vbUSDC), amount);
        
        // Bridge to L2
        vbUSDC.depositAndBridge(
            amount,
            msg.sender, // Receiver on L2
            L2_NETWORK_ID,
            true       // Force update GER
        );
    }
}
```

**Deploy on Sepolia:**

```bash
forge create QuickVaultBridge \
    --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
    --private-key YOUR_PRIVATE_KEY \
    --constructor-args \
        0xCea1D25a715eC34adFB2267ACe127e8D107778dd \ # Sepolia USDC
        0xb62Ba0719527701309339a175dDe3CBF1770dd38   # Sepolia vbUSDC
```

## Step 2: Execute a Bridge Transaction

Use JavaScript to interact with your contract:

```javascript
// bridge.js
const { ethers } = require('ethers');

// Setup
const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Addresses (Sepolia)
const USDC = '0xCea1D25a715eC34adFB2267ACe127e8D107778dd';
const QUICK_VAULT_BRIDGE = 'YOUR_DEPLOYED_CONTRACT';

// ABIs
const ERC20_ABI = ['function approve(address,uint256) external'];
const BRIDGE_ABI = ['function bridgeToL2(uint256) external'];

async function bridgeToL2() {
    const amount = ethers.parseUnits('10', 6); // 10 USDC
    
    // Approve your contract
    const usdc = new ethers.Contract(USDC, ERC20_ABI, wallet);
    const approveTx = await usdc.approve(QUICK_VAULT_BRIDGE, amount);
    await approveTx.wait();
    console.log('✅ Approved');
    
    // Bridge
    const bridge = new ethers.Contract(QUICK_VAULT_BRIDGE, BRIDGE_ABI, wallet);
    const bridgeTx = await bridge.bridgeToL2(amount);
    const receipt = await bridgeTx.wait();
    
    console.log('✅ Bridged! Tx:', receipt.hash);
    console.log('Wait ~20-30 minutes for L2 finalization');
}

bridgeToL2().catch(console.error);
```

Run it:

```bash
node bridge.js
```

## Step 3: Verify on L2

After ~20-30 minutes, check your L2 balance:

```javascript
// check-l2-balance.js
const { ethers } = require('ethers');

const L2_RPC = 'YOUR_L2_RPC_URL';
const L2_VBUSDC = '0x...'; // vbUSDC address on L2

async function checkBalance() {
    const provider = new ethers.JsonRpcProvider(L2_RPC);
    const vbUSDC = new ethers.Contract(
        L2_VBUSDC,
        ['function balanceOf(address) view returns (uint256)'],
        provider
    );
    
    const balance = await vbUSDC.balanceOf('YOUR_ADDRESS');
    console.log('L2 vbUSDC Balance:', ethers.formatUnits(balance, 6));
}

checkBalance();
```
