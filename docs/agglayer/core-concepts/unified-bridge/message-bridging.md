---
title: Message Bridging
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Message Bridging
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Enable cross-chain smart contract communication and execution using the Unified Bridge
  </p>
</div>

## Overview

Message bridging enables smart contracts on different chains to communicate and execute functions across chains. This allows for complex cross-chain applications where contracts can trigger actions on other chains.

![Message Bridging Process](../../img/agglayer/BridgeMessageProcess.png)

*Figure 1: Complete message bridging flow from source chain to destination chain*

## Key Concepts

### Cross-Chain Execution

Message bridging enables:
- **Contract-to-Contract Communication**: Smart contracts can call functions on other chains
- **Cross-Chain State Updates**: Contracts can update state on destination chains
- **Complex Workflows**: Multi-chain applications with coordinated execution
- **Trustless Communication**: Cryptographic verification of all cross-chain messages

### Message Structure

Cross-chain messages contain:
- **Destination Contract**: Address of the contract to execute on destination chain
- **Function Data**: Encoded function call data
- **Value**: ETH value to send with the message (if any)
- **Gas Limit**: Maximum gas for execution on destination chain
- **Metadata**: Additional data for the message

## Bridge Message Function

The `bridgeMessage` function initiates message transfers between chains.

### Function Signature

```solidity
function bridgeMessage(
    uint32 destinationNetwork,
    address destinationAddress,
    uint256 gasLimit,
    bytes calldata data
) external payable
```

### Parameters

- **`destinationNetwork`**: Network ID of the destination chain
- **`destinationAddress`**: Address of the contract to execute on destination chain
- **`gasLimit`**: Maximum gas for execution on destination chain
- **`data`**: Encoded function call data

### Process Steps

1. **Validation**: Check destination network is not the source network
2. **Value Handling**: Handle ETH value if provided
3. **Event Emission**: Emit `BridgeEvent` with message details
4. **Tree Update**: Add message to Local Exit Tree as leaf node

### Example Usage

```solidity
// Bridge a message to call a function on destination chain
bridgeMessage(
    1, // destinationNetwork (L2)
    0x..., // destinationAddress (contract address)
    100000, // gasLimit
    abi.encodeWithSignature("updateValue(uint256)", 123) // data
);
```

## Claim Message Function

The `claimMessage` function claims and executes bridged messages on the destination chain.

### Function Signature

```solidity
function claimMessage(
    bytes32[_DEPOSIT_CONTRACT_TREE_DEPTH] calldata smtProofLocalExitRoot,
    bytes32[_DEPOSIT_CONTRACT_TREE_DEPTH] calldata smtProofRollupExitRoot,
    uint256 globalIndex,
    bytes32 mainnetExitRoot,
    bytes32 rollupExitRoot,
    uint32 originNetwork,
    address originAddress,
    uint32 destinationNetwork,
    address destinationAddress,
    uint256 gasLimit,
    bytes calldata data
) external
```

### Parameters

- **`smtProofLocalExitRoot`**: Merkle proof for Local Exit Root
- **`smtProofRollupExitRoot`**: Merkle proof for Rollup Exit Root
- **`globalIndex`**: Global index identifying the message
- **`mainnetExitRoot`**: Mainnet Exit Root at time of message
- **`rollupExitRoot`**: Rollup Exit Root at time of message
- **`originNetwork`**: Network ID of source chain
- **`originAddress`**: Address that sent the message
- **`destinationNetwork`**: Network ID of destination chain
- **`destinationAddress`**: Address of the contract to execute
- **`gasLimit`**: Maximum gas for execution
- **`data`**: Encoded function call data

### Process Steps

1. **Validation**: Verify destination network matches current chain
2. **Proof Verification**: Verify Merkle proofs against Global Exit Root
3. **Duplicate Check**: Ensure message hasn't been claimed before
4. **Message Execution**: Execute the message on destination contract
5. **Claim Record**: Mark message as claimed

### Message Execution

```solidity
// Execute the message on destination contract
(bool success, bytes memory returnData) = destinationAddress.call{
    value: msg.value,
    gas: gasLimit
}(data);

require(success, "Message execution failed");
```

## Bridging Flows

### L1 to L2 Message Bridging

1. **User Action**: User calls `bridgeMessage` on L1
2. **Value Handling**: ETH value locked in L1 bridge contract
3. **Event Emission**: `BridgeEvent` emitted with message details
4. **LET Update**: Message added to L1's Local Exit Tree
5. **MER Update**: Mainnet Exit Root updated on L1
6. **GER Update**: Global Exit Root updated
7. **L2 Sync**: L2 syncs with latest GER
8. **User Claim**: User calls `claimMessage` on L2
9. **Message Execution**: Message executed on L2 contract

### L2 to L1 Message Bridging

1. **User Action**: User calls `bridgeMessage` on L2
2. **Value Handling**: ETH value locked in L2 bridge contract
3. **Event Emission**: `BridgeEvent` emitted with message details
4. **LET Update**: Message added to L2's Local Exit Tree
5. **L2 Submission**: L2 submits LET to L1 via RollupManager
6. **RER Update**: Rollup Exit Root updated on L1
7. **GER Update**: Global Exit Root updated
8. **User Claim**: User calls `claimMessage` on L1
9. **Message Execution**: Message executed on L1 contract

### L2 to L2 Message Bridging

1. **User Action**: User calls `bridgeMessage` on L2A
2. **Value Handling**: ETH value locked in L2A bridge contract
3. **Event Emission**: `BridgeEvent` emitted with message details
4. **LET Update**: Message added to L2A's Local Exit Tree
5. **L2A Submission**: L2A submits LET to L1 via RollupManager
6. **RER Update**: Rollup Exit Root updated on L1
7. **GER Update**: Global Exit Root updated
8. **L2B Sync**: L2B syncs with latest GER
9. **User Claim**: User calls `claimMessage` on L2B
10. **Message Execution**: Message executed on L2B contract

## Using Lxly.js SDK

The Lxly.js SDK simplifies message bridging with prebuilt functions.

### Basic Usage

```javascript
import { Lxly } from '@polygon/lxly';

// Initialize Lxly instance
const lxly = new Lxly({
  rpcUrl: 'https://rpc-url',
  bridgeAddress: '0x...',
  networkId: 1
});

// Bridge a message
const txHash = await lxly.bridgeMessage({
  destinationNetwork: 0,
  destinationAddress: '0x...', // Contract address on destination
  gasLimit: 100000,
  data: '0x...' // Encoded function call data
});

console.log('Bridge message transaction hash:', txHash);
```

### Advanced Usage

```javascript
// Bridge a message with ETH value
const txHash = await lxly.bridgeMessage({
  destinationNetwork: 1,
  destinationAddress: '0x...',
  gasLimit: 200000,
  data: '0x...',
  value: '1000000000000000000' // 1 ETH
});

// Claim a message
const claimTxHash = await lxly.claimMessage({
  smtProofLocalExitRoot: [...],
  smtProofRollupExitRoot: [...],
  globalIndex: '0x...',
  mainnetExitRoot: '0x...',
  rollupExitRoot: '0x...',
  originNetwork: 0,
  originAddress: '0x...',
  destinationNetwork: 1,
  destinationAddress: '0x...',
  gasLimit: 200000,
  data: '0x...'
});
```

## Use Cases

### Cross-Chain DeFi

- **Liquidity Provision**: Provide liquidity on one chain, trigger actions on another
- **Yield Farming**: Farm yields across multiple chains with coordinated strategies
- **Arbitrage**: Execute arbitrage opportunities across chains

### Cross-Chain Gaming

- **Asset Transfers**: Move game assets between chains
- **State Synchronization**: Keep game state synchronized across chains
- **Cross-Chain Events**: Trigger events on other chains based on game actions

### Cross-Chain Governance

- **Voting**: Cast votes on one chain, execute decisions on another
- **Treasury Management**: Manage treasuries across multiple chains
- **Proposal Execution**: Execute governance proposals across chains

### Cross-Chain Identity

- **Identity Verification**: Verify identity on one chain, use on another
- **Credential Sharing**: Share credentials across chains
- **Access Control**: Control access to resources across chains

## Security Considerations

### Message Validation

- **Proof Verification**: All messages require valid Merkle proofs
- **Global Exit Root**: Messages verified against synchronized GER
- **Finality**: Messages only claimable after L1 finality

### Execution Security

- **Gas Limits**: Gas limits prevent infinite loops and excessive gas usage
- **Value Limits**: ETH value limits prevent excessive value transfers
- **Contract Validation**: Destination contracts should validate message sources

### Economic Security

- **No Double Execution**: Each message can only be executed once
- **Proof Requirements**: Cryptographic proofs prevent invalid message execution
- **Finality Requirements**: L1 finality ensures message security

## Best Practices

### Message Design

- **Idempotent Functions**: Design functions to be idempotent when possible
- **Error Handling**: Include proper error handling in destination contracts
- **Gas Estimation**: Accurately estimate gas requirements for message execution

### Security

- **Source Validation**: Validate message sources in destination contracts
- **Access Control**: Implement proper access control for message execution
- **Rate Limiting**: Consider rate limiting for message execution

### Monitoring

- **Event Logging**: Log important events in message execution
- **Error Tracking**: Track and monitor message execution errors
- **Performance Monitoring**: Monitor gas usage and execution times

## Getting Started

Ready to start building cross-chain applications?

<!-- CTA Button Component -->
<div style="text-align: center; margin: 3rem 0;">
  <a href="/agglayer/get-started/quickstart/" style="background: #0071F7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
    Start Building →
  </a>
</div>
