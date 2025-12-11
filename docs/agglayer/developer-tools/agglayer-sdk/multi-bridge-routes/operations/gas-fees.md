---
title: Understanding Gas Fees
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Understanding Gas Fees
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Learn how gas fees and bridge costs vary by route provider with real-world transaction examples
  </p>
</div>

## Overview

When bridging assets across chains using Multi-Bridge Routes, the total cost of your transaction depends on multiple factors beyond just network gas fees. Different bridge providers have distinct fee structures that can significantly impact the final amount your users receive.

Understanding these cost variations helps you make informed routing decisions and set proper user expectations in your application.

## Fee Components

Every cross-chain bridge transaction involves three main cost components:

### Network Gas Fees

The cost to execute the transaction on the blockchain, paid in the native currency (ETH, POL, etc.). This varies based on:

- Current network congestion
- Transaction complexity
- Gas price at execution time

### Bridge Protocol Fees

Service fees charged by the bridge provider for facilitating the cross-chain transfer. Each protocol has its own fee model:

- Fixed percentage of transfer amount
- Flat fee per transaction
- Dynamic fees based on liquidity

### Slippage

The difference between expected and actual output due to:

- Market price movements during execution
- Liquidity pool conditions
- Route efficiency

## Real-World Examples

Let's compare the actual costs of bridging **50 USDC from Base to Ethereum** using different routes:

### Example 1: Stargate Route (via Agglayer UI)

**Source Transaction:** [View on BaseScan](https://basescan.org/tx/0x676fb2e2e8c69f4127c2a00732a524a59c797b0082db7ec2dc971a7ac2695a95)

- Stargate Protocol Fees: **$0.52** in ETH
- Network Gas Fees: **$0.06** in ETH
- **Total Source Cost: $0.58**

**Destination Transaction:** [View on Etherscan](https://etherscan.io/tx/0x7c7668d08402c9464247a02ffb72f776a578bd04867f21c7eb3f171cf44a9d82)

- Amount Received: **49.92 USDC**
- Bridge Fees + Slippage: **$0.08**

**Total Transaction Cost: ~$0.66**

---

### Example 2: Stargate Route (via Jumper UI)

**Source Transaction:** [View on BaseScan](https://basescan.org/tx/0x7932df6692ed525e43f875c1bb8d67c3e0a5b81286c9bcfcff81b18b7fd5b9ed)

- Stargate Protocol Fees: **$0.52** in ETH
- Network Gas Fees: **$0.09** in ETH
- **Total Source Cost: $0.61**

**Destination Transaction:** [View on Etherscan](https://etherscan.io/tx/0x1c9c601f7c3ec57a6ef9621d26e3f99a0413058c763419dfd14465698b6feeee)

- Amount Received: **49.92 USDC**
- Bridge Fees + Slippage: **$0.08**

**Total Transaction Cost: ~$0.69**

---

### Example 3: Across Route (via Agglayer UI)

**Source Transaction:** [View on BaseScan](https://basescan.org/tx/0x60b18ffeb081b8193c89bacfdea83fa6f8e196fccbde5c06e622748761489da7)

- Network Gas Fees: **$0.008** in ETH
- **Total Source Cost: $0.008**

**Destination Transaction:** [View on Etherscan](https://etherscan.io/tx/0x6734c6e6dce48e9c758c17558b2d1e8fecb3e348af2d93e928c0811645411b45)

- Amount Received: **49.86 USDC**
- Bridge Fees + Slippage: **$0.14**

**Total Transaction Cost: ~$0.148**

## Key Takeaways

Here's a comparison of the total costs for bridging 50 USDC from Base to Ethereum:

| Route | Source Costs | Output Amount | Total Fees | Total Cost |
|-------|-------------|---------------|------------|------------|
| **Stargate (Agglayer UI)** | $0.58 | 49.92 USDC | $0.08 | **~$0.66** |
| **Stargate (Jumper UI)** | $0.61 | 49.92 USDC | $0.08 | **~$0.69** |
| **Across (Agglayer UI)** | $0.008 | 49.86 USDC | $0.14 | **~$0.148** |

### Important Insights

1. **Lowest gas ≠ Lowest total cost**: Across has 75x lower source gas fees but still results in the cheapest overall transaction
2. **Protocol fees vary significantly**: Stargate charges $0.52+ upfront vs Across's minimal gas
3. **Same route, different UIs**: Even the same bridge (Stargate) can have slightly different gas costs depending on the interface
4. **Output matters most**: Focus on total cost and final output, not just gas fees

## Using SDK Route Data

When building your application, use the route response data to compare costs programmatically:

```typescript
const routes = await core.getRoutes({
  fromChainId: 8453,      // Base
  toChainId: 1,           // Ethereum
  fromTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  toTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  amount: '50000000',     // 50 USDC
  fromAddress: '0xYourAddress',
  slippage: 0.5,
});

// Compare routes by total cost and output
routes.forEach(route => {
  console.log(`Provider: ${route.provider.join(' + ')}`);
  console.log(`Total Cost: $${route.totalCostUSD}`);
  console.log(`Output: ${route.toAmount}`);
  console.log(`Duration: ${route.executionDuration}s`);
  console.log('---');
});
```

Each route includes:

- `totalCostUSD`: Estimated total cost in USD (includes gas + bridge fees)
- `toAmount`: Expected output amount after all fees
- `executionDuration`: Estimated time to complete the bridge
- `provider`: Array of bridge providers used in the route

## Best Practices

1. **Display total costs to users** - Show both upfront gas and expected output, not just one
2. **Compare routes holistically** - Consider cost, speed, and output together
3. **Set realistic expectations** - Explain that final amounts may vary due to slippage
4. **Update estimates regularly** - Gas prices and liquidity conditions change constantly
5. **Test with small amounts first** - Verify route behavior before committing large transfers

By understanding these cost dynamics, you can help users make informed decisions and build a better cross-chain bridging experience.

