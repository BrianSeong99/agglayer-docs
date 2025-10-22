---
title: ERC20 Operations
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  ERC20 Operations
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Complete ERC20 token management including balance checks, approvals, transfers, and direct bridge operations
  </p>
</div>

## Overview

ERC20 operations provide comprehensive token management through direct blockchain interactions, including balance checking, allowance management, token transfers, and direct bridge operations with built-in gas estimation and error handling.

## Creating Token Instances

### Basic Token Instance Creation

```typescript
import { AggLayerSDK, SDK_MODES } from '@agglayer/sdk';

const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: {
    defaultNetwork: 1, // Ethereum mainnet
    customRpcUrls: {
      1: 'https://eth-mainnet.g.alchemy.com/v2/your-key',
      747474: 'https://rpc.katana.network',
    },
  },
});

const native = sdk.getNative();

// Create ERC20 token instance
const usdcToken = native.erc20('0xA0b86a33E6441b8c4C8C0e4b8c4C8C0e4b8c4C8C0', 1); // USDC on Ethereum
const katanaUsdc = native.erc20('0x203a662b0bd271a6ed5a60edfbd04bfce608fd36', 747474); // USDC on Katana

// Create native ETH instance
const ethToken = native.erc20('0x0000000000000000000000000000000000000000', 1); // Native ETH
```

### Token Instance Methods

```typescript
interface ERC20Token {
  // Balance operations
  getBalance(address: string): Promise<string>;
  
  // Allowance operations
  getAllowance(owner: string, spender: string): Promise<string>;
  buildApprove(spender: string, amount: string, from?: string): Promise<TransactionParams>;
  
  // Transfer operations
  buildTransfer(to: string, amount: string, from?: string): Promise<TransactionParams>;
  buildTransferFrom(from: string, to: string, amount: string, spender?: string): Promise<TransactionParams>;
  
  // Bridge operations
  bridgeTo(destinationNetwork: number, destinationAddress: string, amount: string, from?: string, options?: BridgeOptions): Promise<TransactionParams>;
  getWrappedToken(): Promise<string>;
  
  // Claim operations
  claimAsset(bridgeTxHash: string, sourceNetwork: number, bridgeIndex: number, claimer: string): Promise<TransactionParams>;
  claimMessage(bridgeTxHash: string, sourceNetwork: number, bridgeIndex: number, claimer: string): Promise<TransactionParams>;
  
  // Event operations
  getBridgeEventInfo(bridgeTxHash: string, sourceNetwork: number, bridgeIndex: number): Promise<BridgeEventInfo>;
}
```

## Balance Operations

### Checking Token Balances

Check ERC20 token balances and native currency balances for any address on any supported network.

```typescript
// Check ERC20 token balance
const balance = await usdcToken.getBalance('0xUserAddress');
console.log(`Balance: ${formatAmount(balance, 6)} USDC`);

// Check native ETH balance
const ethBalance = await native.getNativeBalance('0xUserAddress', 1);
console.log(`ETH Balance: ${formatAmount(ethBalance)} ETH`);

// Helper function for formatting amounts
function formatAmount(amount: string, decimals: number = 18): string {
  const value = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  return (Number(value) / Number(divisor)).toString();
}
```

## Allowance Operations

### Managing Token Approvals

Check current token allowances and build approval transactions for bridge contracts or other spenders.

```typescript
// Check current allowance for bridge contract
const bridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
const allowance = await usdcToken.getAllowance('0xUserAddress', bridgeAddress);
console.log(`Allowance: ${formatAmount(allowance, 6)} USDC`);

// Build approval transaction
const approvalTx = await usdcToken.buildApprove(
  bridgeAddress,
  '100000000000', // 100,000 USDC
  '0xUserAddress'
);
```

## Transfer Operations

### Building Transfer Transactions

Build standard ERC20 transfer transactions and transferFrom transactions for approved spending scenarios.

```typescript
// Build transfer transaction
const transferTx = await usdcToken.buildTransfer(
  '0xRecipientAddress',
  '1000000000', // 1000 USDC
  '0xUserAddress'
);

// Build transferFrom transaction
const transferFromTx = await usdcToken.buildTransferFrom(
  '0xOwnerAddress',
  '0xRecipientAddress',
  '1000000000',
  '0xSpenderAddress'
);
```

## Bridge Operations

### Direct Bridge-to Operations

Bridge ERC20 tokens directly to another network using the Agglayer bridge contract. Get wrapped token addresses for destination networks.

```typescript
// Build bridge transaction
const bridgeTx = await usdcToken.bridgeTo(
  747474, // Katana network ID
  '0xRecipientOnKatana',
  '1000000000', // 1000 USDC
  '0xUserAddress',
  {
    forceUpdateGlobalExitRoot: true,
    permitData: '0x',
  }
);

// Get wrapped token address
const wrappedAddress = await usdcToken.getWrappedToken();
```

## Claim Operations

**⚠️ Local Development Note**: The SDK's `claimAsset()` method doesn't work with AggSandbox locally due to API endpoint differences. For local development, use AggSandbox's auto-claiming service instead.

### Claiming Bridged Assets

Claim bridged assets on the destination network after the bridge transaction has been processed by AggKit.

```typescript
// Claim assets on destination network
const bridgeTxHash = '0xYourBridgeTransactionHash';
const sourceNetwork = 1; // Ethereum
const bridgeIndex = 0;   // Bridge index

const claimTx = await katanaUsdc.claimAsset(
  bridgeTxHash,
  sourceNetwork,
  bridgeIndex,
  userAddress
);
```

### Claiming Bridge Messages

Claim bridge messages sent via contract-to-contract communication on the destination network.

```typescript
// Claim bridge messages (for contract-to-contract communication)
const messageClaimTx = await katanaUsdc.claimMessage(
  bridgeTxHash,
  sourceNetwork,
  bridgeIndex,
  userAddress
);

console.log('Message claim transaction built:');
console.log(`  To: ${messageClaimTx.to}`);
console.log(`  From: ${messageClaimTx.from}`);
console.log(`  Gas: ${messageClaimTx.gas}`);
```

### Bridge Event Information

Get comprehensive information about a bridge transaction including origin network, token details, and deposit count for claiming.

```typescript
// Get bridge event information
const bridgeEventInfo = await usdcToken.getBridgeEventInfo(
  bridgeTxHash,
  sourceNetwork,
  bridgeIndex
);
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
const usdcToken = native.erc20('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 1);

// Check balance
const balance = await usdcToken.getBalance('0xUserAddress');

// Check allowance
const allowance = await usdcToken.getAllowance(
  '0xUserAddress',
  '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe'
);

// Build approval
const approvalTx = await usdcToken.buildApprove(
  '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe',
  '100000000000',
  '0xUserAddress'
);

// Build bridge transaction
const bridgeTx = await usdcToken.bridgeTo(
  747474,
  '0xRecipientOnKatana',
  '1000000000',
  '0xUserAddress',
  { forceUpdateGlobalExitRoot: true, permitData: '0x' }
);
```

