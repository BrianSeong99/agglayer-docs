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

Retrieve recent bridge transactions with status, protocols used, and amount information for tracking and monitoring.

```typescript
import { AggLayerSDK } from '@agglayer/sdk';

const sdk = new AggLayerSDK();
const core = sdk.getCore();

const recentTransactions = await core.getTransactions({
  limit: 10,
});
```

## Filtering Transactions

### Filtering by Address and Networks

Filter transaction history by user address or network pairs to narrow down results for specific use cases.

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
