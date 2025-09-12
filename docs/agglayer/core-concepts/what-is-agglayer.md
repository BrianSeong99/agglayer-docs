---
title: What is Agglayer?
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  What is Agglayer?
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Understanding the revolutionary protocol that's solving blockchain fragmentation through unified interoperability
  </p>
</div>

## The Blockchain Fragmentation Problem

Imagine the internet if every website required a different browser, different login credentials, and different protocols to access. That's essentially where we are with blockchains today.

We have Ethereum with its robust security and extensive DeFi ecosystem. Polygon with its fast transactions and low fees. Arbitrum with its optimistic rollup technology. Each chain has evolved to solve specific problems, but they exist in isolation.

**The result?** Users juggle multiple wallets, developers rebuild the same functionality across different chains, and assets remain trapped in their respective ecosystems. A user wanting to use ETH from Ethereum in a DeFi protocol on Polygon faces a complex journey of bridging, wrapping, and hoping their assets arrive safely.

## Enter Agglayer: The Interoperability Protocol

Agglayer is not just another bridge or cross-chain solution. It's a fundamental reimagining of how blockchains should interact with each other.

**Think of it this way:** If individual blockchains are like cities, traditional bridges are like highways connecting specific cities. Agglayer is like building a unified transportation network where you can travel between any cities seamlessly, using the same ticket, the same app, and the same experience.

### What Makes Agglayer Different

**1. Unified Liquidity, Not Wrapped Assets**

Traditional bridges create wrapped versions of assets (like WETH or bridged USDC). Agglayer enables true **unified liquidity** where your ETH on Ethereum is the same ETH you use on Polygon - no wrapping, no bridging delays, no fragmented liquidity pools.

**2. Atomic Cross-Chain Transactions**

With Agglayer, you can execute complex operations across multiple chains in a single transaction. Want to use ETH from Ethereum to mint an NFT on Zora? That's one atomic transaction, not a multi-step process with multiple confirmations.

**3. Mathematical Security Guarantees**

Instead of relying on trusted validators or multi-signature schemes, Agglayer uses **mathematical proofs** to ensure security. The system assumes chains can be compromised and builds protection accordingly - if a chain's prover becomes malicious, it can only drain funds up to what's deposited on that specific chain.

## How Agglayer Actually Works

Let's break down the technical architecture that makes this magic possible.

### The Three Security Gateways

**Gateway 1: The Unified Bridge**
This is where cross-chain transactions actually happen. When you want to move assets or execute operations across chains, the Unified Bridge handles the complex cryptographic verification and state management. It maintains sophisticated Merkle tree structures that track every cross-chain operation and ensures mathematical proof of all transactions.

**Gateway 2: Pessimistic Proof System**
Here's where Agglayer gets clever about security. Instead of assuming all chains are honest, Agglayer assumes they might be compromised. The Pessimistic Proof system mathematically ensures that even if a chain's prover becomes malicious, it cannot drain more funds than are currently deposited on that chain. It's like having a financial firewall between chains.

**Gateway 3: State Transition Proof**
This is Agglayer's newest innovation (v0.3). It adds an additional verification gateway that validates not just cross-chain operations, but also ensures that individual chains themselves are operating correctly. Think of it as having both a building security system AND a security guard.

### The Security Innovation

Traditional bridges have a fundamental problem: they require trust. Whether it's a multi-signature wallet, a validator set, or a smart contract, there's always a point of centralized risk.

Agglayer flips this model. It **assumes distrust** and builds mathematical constraints around it:

- **Pessimistic by Design**: The system assumes every chain might be compromised
- **Mathematical Limits**: Even compromised chains can't drain more than their deposits
- **Cryptographic Verification**: Every operation is mathematically proven, not just validated by authorities
- **Isolation**: Problems on one chain can't spread to others

## Why This Matters

### For the Blockchain Ecosystem

Agglayer represents a shift from **interoperability as an afterthought** to **interoperability as a foundation**. Instead of building bridges between isolated chains, we're building a unified network where chains can specialize in what they do best while sharing liquidity and functionality.

### For Developers

You can now build applications that leverage the best of every chain:

- Use Ethereum's security for high-value operations
- Use Polygon's speed for frequent transactions  
- Use specialized chains for domain-specific functionality
- All within a single application architecture

### For Users

The complexity disappears. Cross-chain operations become as simple as single-chain operations. You don't need to understand the underlying infrastructure any more than you need to understand TCP/IP to browse the web.

## The Technical Reality

Agglayer isn't magic - it's sophisticated engineering. The system coordinates:

- **Multiple cryptographic proof systems** (SP1 zkVM, Pessimistic Proofs, State Transition Proofs)
- **Complex state synchronization** across dozens of potential chains
- **Mathematical verification** of every cross-chain operation
- **Sophisticated Merkle tree structures** for efficient verification

But all this complexity is hidden behind simple, familiar interfaces.

## What's Next?

Agglayer represents the evolution toward a truly unified blockchain ecosystem. Just as TCP/IP enabled the internet to become a unified network rather than isolated systems, Agglayer is building the infrastructure for a unified Web3.

The goal isn't to replace existing chains, but to connect them in a way that preserves their sovereignty while enabling seamless interoperability. Each chain can continue to innovate and specialize while participating in a larger, more powerful network.

## Dive Deeper

Ready to understand how Agglayer works under the hood?

<!-- CTA Button Component -->
<div style="text-align: center; margin: 3rem 0;">
  <a href="/agglayer/core-concepts/architecture/" style="background: #0071F7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
    Learn About Architecture →
  </a>
</div>
