---
title: API Reference
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  API Reference
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Complete TypeScript API documentation for all Agglayer SDK methods, interfaces, and configuration options
  </p>
</div>

## AgglayerSDK

The main SDK class that orchestrates Multi-Bridge Routes and Agglayer Native Bridge modules.

### Constructor

```typescript
new AggLayerSDK(config?: SDKConfig)
```

Creates a new Agglayer SDK instance with optional configuration.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `SDKConfig?` | Optional configuration object |

**Example:**
```typescript
// Zero configuration (uses defaults)
const sdk = new AggLayerSDK();

// With configuration
const sdk = new AggLayerSDK({
  mode: [SDK_MODES.CORE, SDK_MODES.NATIVE],
  core: {
    apiBaseUrl: 'https://arc-api.polygon.technology',
    apiTimeout: 30000,
  },
  native: {
    defaultNetwork: 1,
    customRpcUrls: {
      1: 'https://eth-mainnet.g.alchemy.com/v2/your-key',
    },
  },
});
```

### Methods

#### `getCore(): CoreClient`

Returns the Multi-Bridge Routes (Core) module instance.

**Returns:** `CoreClient` instance for ARC API operations

**Throws:** Error if Core module not initialized (not in mode array)

**Example:**
```typescript
const core = sdk.getCore();
const routes = await core.getRoutes({...});
```

#### `getNative(): NativeClient`

Returns the Native Bridge module instance.

**Returns:** `NativeClient` instance for direct blockchain operations

**Throws:** Error if Native module not initialized (not in mode array)

**Example:**
```typescript
const native = sdk.getNative();
const token = native.erc20('0xTokenAddress', 1);
```

## CoreClient (Multi-Bridge Routes)

Provides access to ARC API for route aggregation and optimization.

### Methods

#### `getAllChains(): Promise<ChainsResponse>`

Retrieves metadata for all supported chains.

**Returns:** Promise resolving to chains response with pagination handling

**Example:**
```typescript
const chains = await core.getAllChains();
console.log(`Found ${chains.chains.length} supported chains`);

chains.chains.forEach(chain => {
  console.log(`${chain.name}: ${chain.supportedRoutes.join(', ')}`);
});
```

#### `getChainMetadataByChainIds(ids: number[]): Promise<ChainsResponse>`

Retrieves metadata for specific chains by their IDs.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `ids` | `number[]` | Array of chain IDs to retrieve |

**Returns:** Promise resolving to filtered chains response

**Example:**
```typescript
const specificChains = await core.getChainMetadataByChainIds([1, 747474]);
specificChains.chains.forEach(chain => {
  console.log(`${chain.name}: Chain ID ${chain.chainId}, Network ID ${chain.networkId}`);
});
```

#### `getRoutes(params: RoutesRequestParams): Promise<RoutesResponse>`

Discovers optimal cross-chain routes using ARC API aggregation.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `params.fromChainId` | `number` | ✅ | Source chain ID |
| `params.toChainId` | `number` | ✅ | Destination chain ID |
| `params.fromTokenAddress` | `string` | ✅ | Source token address |
| `params.toTokenAddress` | `string` | ✅ | Destination token address |
| `params.amount` | `string` | ✅ | Amount to bridge (in token units) |
| `params.fromAddress` | `string` | ❌ | Sender address |
| `params.toAddress` | `string` | ❌ | Recipient address |
| `params.slippage` | `number` | ❌ | Slippage tolerance (0.5 = 0.5%) |
| `params.preferences` | `RoutePreferences` | ❌ | Route optimization preferences |

**Returns:** Promise resolving to array of available routes

**Example:**
```typescript
const routes = await core.getRoutes({
  fromChainId: 8453,
  toChainId: 747474,
  fromTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  toTokenAddress: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',
  amount: '1000000000',
  fromAddress: '0xUserAddress',
  slippage: 1.0,
  preferences: {
    prioritize: 'COST',
    minAmountToReceive: '995000000',
  },
});
```

#### `getUnsignedTransaction(route: Route): Promise<UnsignedTransaction>`

Converts a discovered route into an executable transaction. The transaction must be signed and sent to the blockchain for execution.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `route` | `Route` | Route object from getRoutes() |

**Returns:** Promise resolving to unsigned transaction ready for signing

**Example:**
```typescript
const routes = await core.getRoutes({...});
const transaction = await core.getUnsignedTransaction(routes[0]);

// Sign and send to blockchain (swap below code with your own wallet client)
const receipt = await wallet.sendTransaction(transaction);
await receipt.wait(); // Wait for confirmation
console.log(`Transaction confirmed: ${receipt.hash}`);
```

#### `getClaimUnsignedTransaction(params: BuildClaimTransactionRequestParam): Promise<UnsignedTransaction>`

Builds claim transaction for Agglayer bridge operations. The transaction must be signed and sent to the blockchain for execution.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `params.sourceNetworkId` | `number` | Source network ID (Agglayer network ID, not chain ID) |
| `params.depositCount` | `number` | Deposit count from bridge transaction |

**Returns:** Promise resolving to claim transaction

**Example:**
```typescript
const claimTx = await core.getClaimUnsignedTransaction({
  sourceNetworkId: 0, // Ethereum network ID
  depositCount: 12345,
});

// Sign and send to blockchain (swap below code with your own wallet client)
const receipt = await wallet.sendTransaction(claimTx);
await receipt.wait(); // Wait for confirmation
console.log(`Claim transaction confirmed: ${receipt.hash}`);
```

#### `getTransactions(params: TransactionsRequestQueryParams): Promise<PaginatedTransactionsResponse>`

Retrieves transaction history with filtering and pagination.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `params.address` | `string?` | Filter by user address |
| `params.sourceNetworkIds` | `string?` | Comma-separated source network IDs |
| `params.destinationNetworkIds` | `string?` | Comma-separated destination network IDs |
| `params.limit` | `number?` | Number of transactions to return (max 100) |
| `params.startAfter` | `string?` | Cursor for pagination |

**Returns:** Promise resolving to paginated transactions response

**Example:**
```typescript
const transactions = await core.getTransactions({
  address: '0xUserAddress',
  limit: 20,
  sourceNetworkIds: '1,8453',
  destinationNetworkIds: '747474',
});

console.log(`Found ${transactions.transactions.length} transactions`);
```

## NativeClient (Native Bridge)

Provides direct blockchain operations and bridge contract interactions.

### Methods

#### `erc20(tokenAddress: string, networkId?: number): ERC20`

Creates an ERC20 token instance for the specified network.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tokenAddress` | `string` | Token contract address (use '0x0000...' for native ETH) |
| `networkId` | `number?` | Network ID (uses default if not provided) |

**Returns:** ERC20 token instance

**Example:**
```typescript
const usdc = native.erc20('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 1);
const eth = native.erc20('0x0000000000000000000000000000000000000000', 1);
```

#### `bridge(bridgeAddress: string, networkId?: number): Bridge`

Creates a bridge instance for direct bridge contract interactions.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `bridgeAddress` | `string` | Bridge contract address |
| `networkId` | `number?` | Network ID (uses default if not provided) |

**Returns:** Bridge instance

**Example:**
```typescript
const bridge = native.bridge('0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe', 1);
const networkId = await bridge.getNetworkId();
```

#### `getNativeBalance(address: string, networkId?: number): Promise<string>`

Gets native token balance (ETH, MATIC, etc.) for an address.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | `string` | Address to check balance for |
| `networkId` | `number?` | Network ID (uses default if not provided) |

**Returns:** Promise resolving to balance in wei

**Example:**
```typescript
const balance = await native.getNativeBalance('0xUserAddress', 1);
console.log(`ETH Balance: ${formatAmount(balance)} ETH`);
```

## ERC20 Class

Represents an ERC20 token instance with bridge capabilities.

### Methods

#### `getBalance(address: string): Promise<string>`

Gets token balance for an address.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | `string` | Address to check balance for |

**Returns:** Promise resolving to balance in token units

#### `getAllowance(owner: string, spender: string): Promise<string>`

Gets current allowance for a spender.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `owner` | `string` | Token owner address |
| `spender` | `string` | Spender address |

**Returns:** Promise resolving to allowance amount

#### `buildApprove(spender: string, amount: string, from?: string): Promise<TransactionParams>`

Builds an approve transaction. The transaction must be signed and sent to the blockchain for execution.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `spender` | `string` | Address to approve |
| `amount` | `string` | Amount to approve |
| `from` | `string?` | From address |

**Returns:** Promise resolving to transaction parameters

**Example:**
```typescript
const approvalTx = await token.buildApprove(
  bridgeAddress,
  '1000000',
  userAddress
);

// Sign and send to blockchain (swap below code with your own wallet client)
const receipt = await wallet.sendTransaction(approvalTx);
await receipt.wait(); // Wait for confirmation
```

#### `bridgeTo(destinationNetwork: number, destinationAddress: string, amount: string, from?: string, options?: BridgeOptions): Promise<TransactionParams>`

Builds a bridge transaction to another network. The transaction must be signed and sent to the blockchain for execution.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `destinationNetwork` | `number` | Destination network ID |
| `destinationAddress` | `string` | Recipient address |
| `amount` | `string` | Amount to bridge |
| `from` | `string?` | From address |
| `options` | `BridgeOptions?` | Bridge options |

**Returns:** Promise resolving to bridge transaction parameters

**Example:**
```typescript
const bridgeTx = await token.bridgeTo(
  20, // Destination network ID
  userAddress,
  '1000000',
  userAddress
);

// Sign and send to blockchain (swap below code with your own wallet client)
const receipt = await wallet.sendTransaction(bridgeTx);
await receipt.wait(); // Wait for confirmation
console.log(`Bridge transaction confirmed: ${receipt.hash}`);
```

## Type Definitions

### SDKConfig

```typescript
interface SDKConfig {
  mode?: SDKMode[];
  core?: CoreConfig;
  native?: NativeConfig;
}

type SDKMode = 'CORE' | 'NATIVE';
```

### CoreConfig

```typescript
interface CoreConfig {
  apiBaseUrl?: string;    // Default: 'https://arc-api.polygon.technology'
  apiTimeout?: number;    // Default: 30000 (30 seconds)
  websocketBaseUrl?: string; // Future: WebSocket endpoint
}
```

### NativeConfig

```typescript
interface NativeConfig {
  defaultNetwork?: number;              // Default: 1 (Ethereum)
  chains?: ChainConfig[];              // Custom chain configurations
  customRpcUrls?: Record<number, string>; // Override RPC URLs by chain ID
}
```

### Route

```typescript
interface Route {
  id: string;
  provider: string[];           // ['agglayer'] or ['lifi', 'agglayer']
  fromChainId: number;
  toChainId: number;
  fromAmount: string;
  toAmount: string;
  toAmountMin: string;
  executionDuration: number;    // Seconds
  totalCostUSD: string;
  gasCostUSD: string;
  steps: Step[];
  feeCosts: FeeCost[];
  gasCosts: GasCost[];
  riskFactors: RiskFactors;
  transactionRequest?: UnsignedTransaction;
}
```

### TransactionParams

```typescript
interface TransactionParams {
  from?: string;
  to: string;
  data: string;
  value?: string;
  gas?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce?: string;
}
```

## Constants

### SDK_MODES

```typescript
const SDK_MODES = {
  CORE: 'CORE',     // Multi-Bridge Routes
  NATIVE: 'NATIVE', // Native Bridge
} as const;
```

### Built-in Networks

```typescript
const NETWORKS = {
  ETHEREUM: 1,
  KATANA: 747474,
} as const;
```

## Usage Patterns

### Module Selection

Choose the modules you need based on your use case:

```typescript
// Multi-Bridge Routes only (for route aggregation)
const sdk = new AggLayerSDK({
  mode: [SDK_MODES.CORE],
});

// Native Bridge only (for direct bridge operations)
const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
});

// Both modules (for complete functionality)
const sdk = new AggLayerSDK({
  mode: [SDK_MODES.CORE, SDK_MODES.NATIVE],
});
```

### Environment-Specific Configuration

Configure the SDK for different environments:

```typescript
const config = {
  development: {
    mode: [SDK_MODES.CORE, SDK_MODES.NATIVE],
    core: { apiBaseUrl: 'https://arc-api.polygon.technology' },
    native: { 
      defaultNetwork: 11155111, // Sepolia
      customRpcUrls: { 
        11155111: process.env.SEPOLIA_RPC_URL,
        747474: process.env.KATANA_RPC_URL,
      }
    },
  },
  production: {
    mode: [SDK_MODES.CORE, SDK_MODES.NATIVE],
    core: { apiBaseUrl: 'https://arc-api.polygon.technology' },
    native: {
      defaultNetwork: 1,
      customRpcUrls: {
        1: process.env.ETHEREUM_RPC_URL,
        747474: process.env.KATANA_RPC_URL,
      },
    },
  },
};

const sdk = new AggLayerSDK(config[process.env.NODE_ENV || 'development']);
```

## Error Handling

### Common Error Patterns

Handle errors gracefully in your application:

```typescript
// Network errors from ARC API
try {
  const routes = await core.getRoutes({...});
} catch (error) {
  console.error('Failed to discover routes:', error);
  // Fallback to cached routes or show error to user
}

// Configuration errors
try {
  const native = sdk.getNative();
} catch (error) {
  console.error('Native module not initialized. Add SDK_MODES.NATIVE to mode array.');
}

// Transaction errors
try {
  const tx = await core.getUnsignedTransaction(route);
  const receipt = await wallet.sendTransaction(tx);
  await receipt.wait();
} catch (error) {
  console.error('Transaction failed:', error);
  // Handle insufficient gas, reverted transaction, etc.
}
```

### Retry with Exponential Backoff

Implement retry logic for network operations:

```typescript
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const delay = 1000 * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

// Usage
const routes = await retryOperation(() => core.getRoutes({...}));
```
  
## Migration Guide

### From Lxly.js to Agglayer SDK

```typescript
// Old (Lxly.js)
const client = new LxLyClient();
await client.init(config);
const token = client.erc20('0xTokenAddress', 0);

// New (Agglayer SDK)
const sdk = new AggLayerSDK({
  mode: [SDK_MODES.NATIVE],
  native: { defaultNetwork: 1 }
});
const native = sdk.getNative();
const token = native.erc20('0xTokenAddress', 1);
```

### Key Differences

| Feature | Lxly.js | Agglayer SDK |
|---------|---------|--------------|
| **Route Aggregation** | ❌ Not available | ✅ ARC API integration |
| **Cross-Chain Bridging** | ❌ Manual integration | ✅ Automatic via ARC API |
| **TypeScript Support** | ⚠️ Partial | ✅ Full type safety |
| **Configuration** | Complex setup | Zero-config defaults |
