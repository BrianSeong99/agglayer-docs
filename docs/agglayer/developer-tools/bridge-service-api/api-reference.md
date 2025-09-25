---
title: API Reference
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  API Reference
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Complete REST API documentation for AggKit Bridge Service with examples and response formats
  </p>
</div>

## API Base URL

All Bridge Service endpoints follow a consistent structure that makes integration straightforward:

```
{base_url}/bridge/v1/{endpoint}
```

## Health & Status

### `GET /` - Service Health Check

Before integrating with the Bridge Service API, you'll want to verify it's running and healthy.

**Use Case**: Application health monitoring and service discovery.

**Example Request:**
```bash
curl "http://localhost:5577/"
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "network_id": 1,
  "uptime": "2h15m30s",
  "last_processed_block": 15234567
}
```

**Response Fields:**
- `status`: Service health indicator
- `version`: API version for compatibility checks
- `network_id`: Primary network being served
- `uptime`: Service runtime duration
- `last_processed_block`: Latest indexed block number

### `GET /sync-status` - Component Synchronization Status

When troubleshooting missing data or stale responses, check whether all underlying components are properly synchronized.

**Use Case**: Debugging data availability issues and monitoring sync lag.

**Example Request:**
```bash
curl "http://localhost:5577/bridge/v1/sync-status"
```

**Response:**
```json
{
  "l1_sync": {
    "current_block": 15234567,
    "synced_block": 15234560,
    "is_synced": true
  },
  "l2_sync": {
    "current_block": 8765432,
    "synced_block": 8765432,
    "is_synced": true
  },
  "bridge_sync": {
    "l1_bridges_indexed": 12345,
    "l2_bridges_indexed": 6789,
    "last_update": "2024-09-24T10:30:45Z"
  }
}
```

**What This Tells You:**
- **L1/L2 Sync**: How current the blockchain data is
- **Bridge Sync**: Number of bridge events indexed and last update time
- **Is Synced**: Whether there's significant lag that might affect data freshness

## Bridge Transaction Queries

### `GET /bridges` - Query Bridge Transactions

The most commonly used endpoint for getting bridge transaction data. Perfect for building transaction histories, monitoring user activity, and tracking bridge status.

**Common Use Cases:**
- "Show all bridges from this user's address"
- "Find bridge transactions between these networks"
- "Get transaction history with pagination"
- "Check if a specific bridge was processed"

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `network_id` | integer | ✅ | Origin network ID (0=L1, 1=L2, etc.) | `0` |
| `page_number` | integer | ❌ | Page number (default: 1) | `1` |
| `page_size` | integer | ❌ | Page size (default: 100, max: 1000) | `10` |
| `deposit_count` | integer | ❌ | Filter by specific deposit count | `42` |
| `from_address` | string | ❌ | Filter by sender address | `0xf39F...` |
| `network_ids` | array | ❌ | Filter by destination network IDs | `1,2` |

**Example Request Patterns:**
```bash
# Get recent bridges for a user
curl "http://localhost:5577/bridge/v1/bridges?network_id=0&from_address=0xf39F...&page_size=10"

# Find specific transaction by deposit count
curl "http://localhost:5577/bridge/v1/bridges?network_id=0&deposit_count=42"

# Check ready-to-claim transactions
curl "http://localhost:5577/bridge/v1/bridges?network_id=0&ready_for_claim=true"
```

**Response Structure:**
```json
{
  "bridges": [
    {
      "tx_hash": "0x8d1b60d0eaab6f609955bdd371e8004f47349cc809ff1bee81dc9d37237a031c",
      "deposit_count": 42,
      "origin_network": 0,
      "destination_network": 1,
      "origin_address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "destination_address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "amount": "1000000000000000000",
      "block_timestamp": 1695563045,
      "ready_for_claim": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150
  }
}
```

**Key Response Fields:**
- `tx_hash`: Bridge transaction identifier
- `deposit_count`: Sequential index for proof generation
- `amount`: Bridge amount in wei/token units
- `ready_for_claim`: Whether transaction can be claimed
- `block_timestamp`: When the bridge occurred

## Claim Tracking

### `GET /claims` - Query Claim Transactions

Check which bridge transactions have been successfully claimed. Essential for verifying claim completion and avoiding duplicate claims.

**Use Cases:**
- "Has this bridge been claimed yet?"
- "Show all claims by this user"
- "Verify claim completion"

**Key Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network_id` | integer | ✅ | Network where claims occurred |
| `from_address` | string | ❌ | Filter by claimer address |
| `page_size` | integer | ❌ | Results per page (default: 100) |

**Example Usage:**
```bash
# Check claims on a specific network
curl "http://localhost:5577/bridge/v1/claims?network_id=1&page_size=10"

# Find claims by specific user
curl "http://localhost:5577/bridge/v1/claims?network_id=1&from_address=0x7099..."
```

**Response:**
```json
{
  "claims": [
    {
      "tx_hash": "0xa9fa5418144f7c8c1b78cd0e5560d6550411667ef937b554636a613f933b3d9f",
      "global_index": "0x000000000000000000000000000000000000000000000000000000000000002a",
      "amount": "1000000000000000000",
      "block_timestamp": 1695563145,
      "bridge_tx_hash": "0x8d1b60d0eaab6f609955bdd371e8004f47349cc809ff1bee81dc9d37237a031c"
    }
  ]
}
```

## Proof Generation

### `GET /claim-proof` - Generate Claim Proof

The most important endpoint for bridge applications - generates the cryptographic proofs required to claim bridged assets.

**Use Case**: Get all the proof data needed to execute a claim transaction on the destination chain.

**Required Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `network_id` | integer | Origin network of bridge transaction | `0` |
| `deposit_count` | integer | Deposit count from bridge event | `42` |
| `leaf_index` | integer | L1 Info Tree index for proof | `15` |

**Example Request:**
```bash
curl "http://localhost:5577/bridge/v1/claim-proof?network_id=0&deposit_count=42&leaf_index=15"
```

**Response Structure:**
```json
{
  "proof": {
    "smtProofLocalExitRoot": ["0x...", "0x...", "0x..."],
    "smtProofRollupExitRoot": ["0x...", "0x..."],
    "l1InfoTreeLeaf": {
      "globalExitRoot": "0x...",
      "blockNumber": 15234567,
      "timestamp": 1695563045
    }
  }
}
```

**Usage**: Pass the entire `proof` object to your claim contract function. The API handles all the complex Merkle tree calculations for you.

## Additional Utilities

### `GET /l1-info-tree-index` - Get L1 Info Tree Index

Find the L1 Info Tree index needed for proof generation from a bridge transaction.

**Use Case**: Get the `leaf_index` parameter required for `/claim-proof` endpoint.

```bash
curl "http://localhost:5577/bridge/v1/l1-info-tree-index?network_id=0&deposit_count=42"
```

**Response:**
```json
{
  "l1_info_tree_index": 15,
  "block_number": 15234567,
  "global_exit_root": "0x..."
}
```

### `GET /token-mappings` - Token Information

Get token mapping information for cross-chain token relationships.

**Use Case**: Display token information and cross-chain mappings in bridge interfaces.

```bash
curl "http://localhost:5577/bridge/v1/token-mappings"
```

## Error Handling

**Common Error Scenarios:**

| Error Code | When It Happens | What To Do |
|------------|-----------------|------------|
| `INVALID_NETWORK_ID` | Using unsupported network ID | Check supported networks via `/` endpoint |
| `BRIDGE_NOT_FOUND` | Transaction not yet indexed | Wait for indexing to complete |
| `PROOF_NOT_AVAILABLE` | L1 finality not reached | Wait for L1 confirmation |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Implement backoff and retry |

**Example Error Response:**
```json
{
  "error": {
    "code": "INVALID_NETWORK_ID",
    "message": "Network ID 999 is not supported"
  }
}
```
