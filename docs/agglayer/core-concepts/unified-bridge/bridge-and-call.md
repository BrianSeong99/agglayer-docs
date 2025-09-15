---
title: Bridge-and-Call
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Bridge-and-Call
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Advanced cross-chain functionality that enables direct contract calls on destination chains with asset transfers
  </p>
</div>

## Overview

Bridge-and-Call is an advanced feature of the Unified Bridge that allows developers to initiate cross-chain transactions that both transfer assets and execute smart contract functions on the destination chain in a single operation. This enables more complex cross-chain workflows and reduces the number of transactions required for sophisticated cross-chain applications.

It is different from **Bridge Message**, where Bridge Message requires the destination address to be a smart contract that implemented the `IBridgeMessageReceiver.sol` interface. Whereas for **Bridge-and-Call**, it itself is the contract that has implemented the interface, and it will be able to execute any functions on any smart contract in the destination network.

![Bridge-and-Call Process](../../../img/agglayer/BridgeAndCallProcess.png)

*Figure 1: Complete Bridge-and-Call flow showing asset transfer and contract execution*

## Key Differences from Bridge Message

| Feature | Bridge Message | Bridge-and-Call |
|---------|----------------|-----------------|
| **Destination Contract** | Must implement `IBridgeMessageReceiver` | Can call any contract |
| **Execution** | Contract handles message reception | JumpPoint contract executes calls |
| **Flexibility** | Limited to specific interface | Full contract call flexibility |
| **Use Case** | Simple message passing | Complex cross-chain operations |

## Core Components

### BridgeExtension.sol

The main contract that handles Bridge-and-Call operations on both source and destination chains.

**Key Functions**:

- `bridgeAndCall()`: Initiates asset transfer with contract call
- `onMessageReceived()`: Handles incoming Bridge-and-Call messages

**Deployment**: Deployed on both L1 and all connected L2s

### JumpPoint.sol

A temporary contract that executes the actual function calls on the destination chain.

**Key Features**:

- **Temporary Contract**: Created for each Bridge-and-Call operation
- **Asset Handling**: Receives and manages transferred assets
- **Function Execution**: Executes calls on target contracts
- **Fallback Handling**: Manages failed executions

## Bridge-and-Call Function

The `bridgeAndCall` function initiates both asset transfer and contract execution.

### Function Signature

```solidity
function bridgeAndCall(
    address token,
    uint256 amount,
    uint32 destinationNetwork,
    address callAddress,
    address fallbackAddress,
    bytes calldata callData,
    bool forceUpdateGlobalExitRoot
) external payable
```

### Parameters

- **`token`**: Token contract address to transfer (0x0 for native gas token)
- **`amount`**: Amount of tokens to transfer
- **`destinationNetwork`**: Network ID of the destination chain
- **`callAddress`**: Contract address to call on destination chain
- **`fallbackAddress`**: Address to receive assets if execution fails
- **`callData`**: Encoded function call data
- **`forceUpdateGlobalExitRoot`**: Whether to update GER immediately

### Process Steps

1. **Token Preparation**: Handle different token types (native, WETH, ERC20)
2. **Asset Bridging**: Call `bridgeAsset` to transfer tokens
3. **Message Bridging**: Call `bridgeMessage` with encoded call data
4. **Event Emission**: Emit events for both operations

### Token Preparation Logic

#### Native Gas Token
```solidity
// Gas token already transferred to contract via msg.value
// No additional preparation needed
```

#### WETH
```solidity
// Transfer WETH from sender to contract
IWETH(token).transferFrom(msg.sender, address(this), amount);
```

#### ERC20 Tokens
```solidity
// Transfer ERC20 tokens from sender to contract
IERC20(token).transferFrom(msg.sender, address(this), amount);
```

## Message Reception

The `onMessageReceived` function handles incoming Bridge-and-Call messages on the destination chain.

### Function Signature

```solidity
function onMessageReceived(
    address originAddress,
    uint32 originNetwork,
    bytes calldata data
) external payable
```

### Parameters

- **`originAddress`**: BridgeExtension address on source chain
- **`originNetwork`**: Network ID of source chain
- **`data`**: Encoded call data containing:
    - `dependsOnIndex`: Index of the asset bridge transaction
    - `callAddress`: Contract to call on destination
    - `fallbackAddress`: Fallback address for failed executions
    - `assetOriginalNetwork`: Original network of the asset
    - `assetOriginalAddress`: Original address of the asset
    - `callData`: Function call data

### Process Steps

1. **Access Control**: Verify caller is bridge contract and origin is valid
2. **Data Decoding**: Decode the message data
3. **Asset Verification**: Check if asset bridge transaction is claimed
4. **JumpPoint Creation**: Deploy JumpPoint contract with call parameters
5. **Asset Transfer**: Transfer assets to JumpPoint contract
6. **Function Execution**: Execute the call on target contract

## JumpPoint Contract

The JumpPoint contract is a temporary contract that handles the actual execution on the destination chain.

### Constructor

```solidity
constructor(
    address bridge,
    uint32 assetOriginalNetwork,
    address assetOriginalAddress,
    address callAddress,
    address fallbackAddress,
    bytes memory callData
) payable
```

### Execution Process

1. **Asset Detection**: Identify the type of transferred asset
2. **Asset Transfer**: Transfer asset to target contract
3. **Function Call**: Execute the specified function call
4. **Fallback Handling**: Handle failed executions by transferring to fallback address

## Bridging Flows

### L1 to L2 Bridge-and-Call

```mermaid
sequenceDiagram
    participant User
    participant L1_BridgeExt as L1 BridgeExtension
    participant L1_Bridge as L1 Bridge Contract
    participant L1_MET as L1 Mainnet Exit Tree
    participant GER_Manager as Global Exit Root Manager
    participant L2_GER as L2 Global Exit Root
    participant L2_BridgeExt as L2 BridgeExtension
    participant JumpPoint as JumpPoint Contract
    participant Target_Contract as Target Contract

    User->>L1_BridgeExt: bridgeAndCall()
    L1_BridgeExt->>L1_BridgeExt: Prepare tokens
    L1_BridgeExt->>L1_Bridge: bridgeAsset()
    L1_BridgeExt->>L1_Bridge: bridgeMessage()
    L1_Bridge->>L1_MET: Add transactions to MET
    L1_MET->>GER_Manager: Update Global Exit Root
    GER_Manager->>L2_GER: Sync latest GER
    User->>L2_BridgeExt: first claimAsset() + then claimMessage()
    L2_BridgeExt->>JumpPoint: Create JumpPoint contract
    JumpPoint->>Target_Contract: Execute call with assets
```

### L2 to L2 Bridge-and-Call

```mermaid
sequenceDiagram
    participant User
    participant L2A_BridgeExt as L2A BridgeExtension
    participant L2A_Bridge as L2A Bridge Contract
    participant L2A_LET as L2A Local Exit Tree
    participant RollupManager as Rollup Manager (L1)
    participant GER_Manager as Global Exit Root Manager
    participant L2B_GER as L2B Global Exit Root
    participant L2B_BridgeExt as L2B BridgeExtension
    participant JumpPoint as JumpPoint Contract
    participant Target_Contract as Target Contract

    User->>L2A_BridgeExt: bridgeAndCall()
    L2A_BridgeExt->>L2A_BridgeExt: Prepare tokens
    L2A_BridgeExt->>L2A_Bridge: bridgeAsset()
    L2A_BridgeExt->>L2A_Bridge: bridgeMessage()
    L2A_Bridge->>L2A_LET: Add transactions to LET
    L2A_LET->>RollupManager: Submit LET to L1
    RollupManager->>GER_Manager: Update Global Exit Root
    GER_Manager->>L2B_GER: Sync latest GER
    User->>L2B_BridgeExt: first claimAsset() + then claimMessage()
    L2B_BridgeExt->>JumpPoint: Create JumpPoint contract
    JumpPoint->>Target_Contract: Execute call with assets
```
