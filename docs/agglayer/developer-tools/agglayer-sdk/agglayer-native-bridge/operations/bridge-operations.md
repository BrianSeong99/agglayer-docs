---
title: Bridge Operations
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Bridge Operations
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Direct bridge contract interactions including asset bridging, message bridging, and claim operations
  </p>
</div>

## Overview

Bridge operations provide direct interaction with Agglayer bridge contracts, enabling asset bridging, message bridging, claim operations, and comprehensive bridge event management across networks.

## Creating Bridge Instances

### Basic Bridge Instance Creation

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1,
    customRpcUrls: {
      1: 'https://eth-mainnet.g.alchemy.com/v2/your-key',
      747474: 'https://rpc.katana.network',
    },
  },
});

const native = sdk.getNative();

// Create bridge instance
const bridge = native.bridge('0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe', 1); // Ethereum mainnet
console.log(`Bridge instance created: ${bridge.getBridgeAddress()}`);
```

### Bridge Instance Methods

Network information:

```typescript
interface Bridge {
  getNetworkId(): Promise<number>;
  getBridgeAddress(): string;
}
```

Asset bridging methods:

```typescript
interface Bridge {
  buildBridgeAsset(params: BridgeAssetParams, from?: string): Promise<TransactionParams>;
  buildClaimAsset(params: ClaimAssetParams, claimer: string): Promise<TransactionParams>;
  buildClaimAssetFromHash(bridgeTxHash: string, sourceNetwork: number, bridgeIndex: number, claimer: string): Promise<TransactionParams>;
}
```

Message bridging methods:

```typescript
interface Bridge {
  buildBridgeMessage(params: BridgeMessageParams, from?: string): Promise<TransactionParams>;
  buildClaimMessage(params: ClaimMessageParams, claimer: string): Promise<TransactionParams>;
  buildClaimMessageFromHash(bridgeTxHash: string, sourceNetwork: number, bridgeIndex: number, claimer: string): Promise<TransactionParams>;
}
```

Token information methods:

```typescript
interface Bridge {
  getWrappedTokenAddress(params: TokenAddressParams): Promise<string>;
  getPrecalculatedWrapperAddress(params: TokenAddressParams): Promise<string>;
  getOriginTokenInfo(params: WrappedTokenParams): Promise<[number, string]>;
}
```

Claim status and event methods:

```typescript
interface Bridge {
  isClaimed(params: ClaimStatusParams): Promise<boolean>;
  getBridgeEventInfo(bridgeTxHash: string, sourceNetwork: number, bridgeIndex: number): Promise<BridgeEventInfo>;
}
```

## Asset Bridging Operations

### Building Asset Bridge Transactions

Build bridge transactions for ERC20 tokens and native currencies to transfer assets between networks.

```typescript
// Build asset bridge transaction
const bridgeAssetTx = await bridge.buildBridgeAsset(
  {
    destinationNetwork: 747474,
    destinationAddress: '0xRecipientOnKatana',
    amount: '1000000000000000000',
    token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    forceUpdateGlobalExitRoot: true,
    permitData: '0x',
  },
  '0xUserAddress'
);

// Bridge native ETH
const ethBridgeTx = await bridge.buildBridgeAsset(
  {
    destinationNetwork: 747474,
    destinationAddress: '0xRecipientOnKatana',
    amount: '1000000000000000000', // 1 ETH
    token: '0x0000000000000000000000000000000000000000',
    forceUpdateGlobalExitRoot: true,
    permitData: '0x',
  },
  '0xUserAddress'
);
```

## Message Bridging Operations

### Building Message Bridge Transactions

Build bridge transactions for contract-to-contract communication across chains using arbitrary message data.

**Important**: The destination contract must implement the `onMessageReceived` function to receive and process bridged messages. See the [Unified Bridge Message Bridging documentation](/agglayer/core-concepts/unified-bridge/message-bridging/) for details on the `IBridgeMessageReceiver` interface.

```typescript
// Build message bridge transaction
const bridgeMessageTx = await bridge.buildBridgeMessage(
  {
    destinationNetwork: 747474,
    destinationAddress: '0xContractOnKatana', // Must implement onMessageReceived
    forceUpdateGlobalExitRoot: true,
    permitData: '0x1234', // Message data
  },
  '0xUserAddress'
);
```

### Required Interface for Destination Contract

The destination contract must implement this interface:

```solidity
interface IBridgeMessageReceiver {
  function onMessageReceived(
    address originAddress,
    uint32 originNetwork,
    bytes calldata data
  ) external payable;
}
```

## Claim Operations

### Claiming Bridged Assets and Messages

Claim bridged assets and messages on the destination network after AggKit processes the bridge transaction. **Note**: SDK claiming doesn't work with AggSandbox locally due to API endpoint differences.

Claim bridged assets using deposit count:

```typescript
const claimAssetTx = await bridge.buildClaimAsset(
  {
    sourceNetworkId: 0, // Ethereum network ID
    depositCount: 12345,
  },
  '0xClaimerAddress'
);
```

Claim using bridge transaction hash:

```typescript
const claimFromHashTx = await bridge.buildClaimAssetFromHash(
  '0xBridgeTransactionHash',
  0, // Source network
  0, // Bridge index
  '0xClaimerAddress'
);
```

Claim bridge messages:

```typescript
const claimMessageTx = await bridge.buildClaimMessage(
  {
    sourceNetworkId: 0,
    depositCount: 12345,
  },
  '0xClaimerAddress'
);
```

## Token Information Operations

### Getting Token Addresses and Origin Info

Retrieve wrapped token addresses for destination networks and origin token information from wrapped tokens.

```typescript
// Get wrapped token address
const wrappedTokenAddress = await bridge.getWrappedTokenAddress({
  originNetwork: 0,
  originTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
});

// Get precalculated wrapper address
const precalculatedAddress = await bridge.getPrecalculatedWrapperAddress({
  originNetwork: 0,
  originTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
});

// Get origin token info
const originInfo = await bridge.getOriginTokenInfo({
  wrappedToken: '0xWrappedTokenAddress',
});
```

## Claim Status and Verification

### Checking Claim Status and Bridge Events

Verify if assets have been claimed, get bridge event details, and retrieve network information for the bridge contract.

```typescript
// Check if bridge deposit is claimed
const isClaimed = await bridge.isClaimed({
  leafIndex: 12345,
  sourceBridgeNetwork: 0,
});

// Get bridge event information
const bridgeEventInfo = await bridge.getBridgeEventInfo(
  '0xBridgeTransactionHash',
  0, // Source network
  0  // Bridge index
);

// Get bridge network ID
const networkId = await bridge.getNetworkId();
const bridgeAddress = bridge.getBridgeAddress();
```

## Working Example

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1,
    customRpcUrls: {
      1: 'https://eth-mainnet.g.alchemy.com/v2/your-key',
      747474: 'https://rpc.katana.network',
    },
  },
});

const native = sdk.getNative();
const bridge = native.bridge('0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe', 1);

// Build bridge asset transaction
const bridgeAssetTx = await bridge.buildBridgeAsset(
  {
    destinationNetwork: 20,
    destinationAddress: '0xRecipientAddress',
    amount: '10000000000',
    token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    forceUpdateGlobalExitRoot: true,
    permitData: '0x',
  },
  '0xUserAddress'
);

// Check claim status
const isClaimed = await bridge.isClaimed({
  leafIndex: 12345,
  sourceBridgeNetwork: 0,
});

// Get wrapped token address
const wrappedAddress = await bridge.getWrappedTokenAddress({
  originNetwork: 0,
  originTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
});
```

