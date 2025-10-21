---
title: Transaction History
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Transaction History
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Track and monitor cross-chain transactions across all bridge providers
  </p>
</div>

## Overview

Transaction history operations provide tracking and monitoring of cross-chain bridge transactions across all bridge providers.

## Basic Transaction History

### Getting Recent Transactions

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

const recentTransactions = await core.getTransactions({
  limit: 10,
});
```

### Transaction Structure

```typescript
interface Transaction {
  id: string;                    // Unique transaction ID
  transactionHash: string;       // Blockchain transaction hash
  status: string;               // Transaction status
  protocols: string[];          // Bridge providers used
  fromAddress: string;          // Sender address
  toAddress: string;            // Recipient address
  lastUpdatedAt: number;        // Unix timestamp of last update
  sending: {
    network: {
      chainId: number;          // Source chain ID
    };
    amount: string;             // Amount sent
    token: {
      originTokenAddress: string; // Token address
      originTokenNetwork: number; // Token network
    };
  };
  receiving?: {
    network: {
      chainId: number;          // Destination chain ID
    };
    amount: string;             // Amount received
    timestamp?: number;         // Completion timestamp
  };
  bridgeHash?: string | null;   // Bridge-specific hash
  depositCount?: number | null; // Agglayer deposit count
  leafIndex?: number | null;    // Merkle tree leaf index
  blockNumber?: number | null;  // Block number
}
```

## Filtering Transactions

```typescript
// By user address
const userTransactions = await core.getTransactions({
  address: '0xUserAddress',
  limit: 20,
});

// By network pairs
const networkFilteredTx = await core.getTransactions({
  sourceNetworkIds: '1,747474',
  destinationNetworkIds: '747474,1',
  limit: 15,
});
```

## Working Example

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

// Get recent transactions
const recentTransactions = await core.getTransactions({ limit: 10 });

// Get user transactions
const userTransactions = await core.getTransactions({
  address: '0xUserAddress',
  limit: 20,
});
```
