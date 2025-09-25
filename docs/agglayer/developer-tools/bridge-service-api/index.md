---
title: Bridge Service API
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Bridge Service API
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    REST API for accessing bridge data, transaction status, and proof generation services
  </p>
</div>

## Meet the Bridge Service API: Your Gateway to Cross-Chain Data

Building a bridge application shouldn't require running an entire AggKit infrastructure. The **Bridge Service API** is your **direct gateway** to all the bridge data you need - transaction histories, claim statuses, cryptographic proofs, and network information - available through simple REST endpoints.

**Think of it as**: Your personal bridge data assistant that has already indexed everything, organized it perfectly, and can answer any question about cross-chain activity instantly.

### **The Challenge Bridge Developers Face**

Imagine you're building a bridge interface for users. Without the Bridge Service API, you'd need to:

- Run and maintain multiple blockchain indexers
- Implement complex Merkle proof generation
- Handle multi-network synchronization
- Build sophisticated filtering and pagination systems

**With Bridge Service API**: You make a simple HTTP request and get exactly the data you need, instantly formatted and ready to use in your application.

## What Bridge Developers Actually Need

### **"Has my user's bridge transaction been processed?"**
Get instant answers about any bridge transaction status across all networks, with rich filtering by address, network, or transaction details.

### **"Can my user claim their bridged assets yet?"**
Check claim readiness, generate the required proofs, and verify completion status - all the data needed for a seamless claiming experience.

### **"How do I build a bridge transaction monitor?"**
Access comprehensive transaction histories, real-time status updates, and automated proof generation to create powerful user interfaces.

### **"What bridges are happening across the ecosystem?"**
Monitor bridge activity, track network health, and analyze cross-chain flows for analytics and business intelligence.

## Getting Started: Your First API Call

The Bridge Service API uses **simple REST endpoints** with no authentication required for most operations:

```bash
# Check if the API is running
curl "http://localhost:5577/bridge/v1/"

# Get recent bridge transactions on a network
curl "http://localhost:5577/bridge/v1/bridges?network_id=0&page_size=5"
```

**API Structure**: All endpoints follow the pattern `{base_url}/bridge/v1/{endpoint}` with consistent JSON responses and intuitive parameter names.

## Real-World Example: Building a Bridge Monitor

Let's walk through building a practical bridge monitoring interface:

### **Step 1: Show User's Bridge History**

```bash
# Get all bridges for a specific user address
curl "http://localhost:5577/bridge/v1/bridges?network_id=0&from_address=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
```

**Response**: Complete transaction history with amounts, timestamps, and claim status.

### **Step 2: Check What's Ready to Claim**

```bash
# Filter for claimable transactions
curl "http://localhost:5577/bridge/v1/bridges?network_id=0&from_address=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266&ready_for_claim=true"
```

**Response**: Only transactions that are ready for users to claim.

### **Step 3: Generate Claim Proof**

```bash
# Get the proof needed for claiming
curl "http://localhost:5577/bridge/v1/claim-proof?network_id=0&deposit_count=42&leaf_index=15"
```

**Response**: Complete cryptographic proof data that can be used directly in claim transactions.

**The result**: A fully functional bridge interface with just three API calls!

## Next Steps

Ready to explore the complete API documentation?

<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 800px; margin: 1rem 0;">

  <!-- API Reference Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Complete API Reference
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Comprehensive documentation for all endpoints, parameters, and response formats with practical examples.
    </p>
    <a href="/agglayer/developer-tools/bridge-service-api/api-reference/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Explore API →
    </a>
  </div>

</div>

