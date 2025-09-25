---
title: Architecture
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Architecture
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Discover how AggKit's ingenious architecture makes complex cross-chain synchronization feel effortless
  </p>
</div>

## The Architecture Story: Building a Synchronization Symphony

Imagine conducting an orchestra where the musicians are scattered across different buildings, in different time zones, playing different instruments, but they all need to stay perfectly synchronized to create beautiful music together. That's essentially the challenge AggKit solves for blockchain networks.

Traditional blockchain architecture assumes you're dealing with a single network. But in the Agglayer ecosystem, you're dealing with **multiple sovereign chains** that each have their own rhythm, their own pace, their own way of doing things – yet they all need to work together seamlessly.

AggKit's architecture is the **conductor's baton** that keeps everyone in perfect harmony.

## The Three-Tier Architecture: How the Magic Happens

Let's break down AggKit's architecture into three distinct tiers, each with its own purpose and personality:

### Tier 1: Your Chain's Domain

At the foundation, you have **your L2 chain** doing what it does best – processing transactions, executing smart contracts, maintaining state. This is your domain, where you have full sovereignty and control.

When users perform bridge operations on your chain, several things happen simultaneously: bridge contracts emit events, state gets updated, and your chain needs to communicate these changes to the broader ecosystem. This is where AggKit steps in.

### Tier 2: The AggKit Synchronization Orchestra

In the middle tier, you have **AggKit components** working together like a well-orchestrated symphony. Each component has its specialized role, but they all coordinate to ensure seamless synchronization:

![Aggkit](../../../img/agglayer/Aggkit.png)

*Figure 1: The three-tier architecture – your chain, AggKit synchronization, and the broader ecosystem*

### Tier 3: The Unified Ecosystem

At the top tier, you have **the broader Agglayer ecosystem** – Agglayer itself, Ethereum L1, and all the other chains connected to the network. This is where the global state lives, where final settlement happens, and where the unified liquidity that makes everything possible is maintained.

## Data Flow Architecture

### The Two Essential Conversations

Understanding AggKit's architecture means understanding the **two critical conversations** that keep everything synchronized:

#### **Upward Flow: L2 → Agglayer**
```mermaid
sequenceDiagram
    participant L2 as L2 Chain
    participant BS as BridgeSync
    participant L1S as L1InfoTreeSync
    participant AS as AggSender
    participant AL as Agglayer
    
    Note over L2,AL: Certificate Submission Flow
    L2->>BS: Bridge Events
    BS->>AS: Bridge Data
    L1S->>AS: L1 Verification Data
    AS->>AS: Build Certificate
    AS->>AL: Submit Certificate
    AL->>AL: Generate Pessimistic Proof
    AL-->>AS: Certificate Status
```

**Purpose**: Submits L2 state transitions to Agglayer for validation and proof generation.

**Components Involved**:

- **BridgeSync**: Captures bridge events from L2 contracts
- **L1InfoTreeSync**: Provides L1 verification data and Merkle proofs
- **AggSender**: Packages data into signed certificates and submits to Agglayer

#### **Downward Flow: Agglayer → L2**
```mermaid
sequenceDiagram
    participant L1 as Ethereum L1
    participant L1S as L1InfoTreeSync
    participant AO as AggOracle
    participant L2S as L2GERSync
    participant L2 as L2 Chain
    
    Note over L1,L2: GER Propagation Flow
    L1->>L1S: GER Update Event
    L1S->>AO: New GER Available
    AO->>L2: Inject GER
    L2->>L2S: GER Injected Event
    L2S->>L2S: Index GER Locally
```

**Purpose**: Propagates global state updates from Agglayer/L1 to L2 chains for claim verification.

**Components Involved**:

- **L1InfoTreeSync**: Monitors L1 for Global Exit Root updates
- **AggOracle**: Propagates GER updates to L2 contracts (with v0.3.5 committee security)
- **L2GERSync**: Indexes and manages GER state locally on L2

## Component Interaction Patterns

### **Certificate Generation Pattern**

```mermaid
graph LR
    subgraph "Data Collection"
        A[Bridge Events] --> D[Certificate Builder]
        B[L1 Verification Data] --> D
        C[Chain State] --> D
    end
    
    subgraph "Certificate Processing"
        D --> E[Sign Certificate]
        E --> F[Submit to Agglayer]
        F --> G[Monitor Status]
    end
    
    subgraph "Error Handling"
        G --> H{Certificate Status}
        H -->|Success| I[Complete]
        H -->|Error| J[Retry Logic]
        J --> D
    end
    
    style D fill:#e8f5e8
    style F fill:#e3f2fd
    style I fill:#f3e5f5
```

*Figure 2: Certificate generation and submission pattern*

### **Oracle Propagation Pattern**

```mermaid
graph LR
    subgraph "GER Detection"
        A[Monitor L1] --> B[Detect New GER]
        B --> C[Validate GER]
    end
    
    subgraph "Committee Consensus (v0.3.5)"
        C --> D{Committee Mode?}
        D -->|Yes| E[Propose GER]
        E --> F[Collect Votes]
        F --> G{Quorum Met?}
        G -->|Yes| H[Inject GER]
        G -->|No| I[Wait for Votes]
        I --> F
        D -->|No| H
    end
    
    subgraph "L2 Update"
        H --> J[Update L2 Contract]
        J --> K[Index Locally]
    end
    
    style E fill:#fff3e0
    style F fill:#fff3e0
    style G fill:#fff3e0
    style H fill:#e8f5e8
```

*Figure 3: GER propagation with v0.3.5 committee security*

### **v0.3.5 Security Enhancements**

The major architectural improvement in v0.3.5 is the **elimination of single-address vulnerabilities**:

#### **Before v0.3.5: Single Point of Failure**
```mermaid
graph LR
    L1[L1 GER Updates] --> Single[Single AggOracle]
    Single --> L2[L2 GER Contract]
    
    style Single fill:#ffebee
```

**Risk**: Single compromised address could steal funds or mint unauthorized assets.

#### **After v0.3.5: Distributed Security**
```mermaid
graph LR
    L1[L1 GER Updates] --> Committee[AggOracle Committee]
    
    subgraph Committee
        M1[Member 1]
        M2[Member 2]
        M3[Member 3]
        Quorum[Threshold Quorum]
    end
    
    M1 --> Quorum
    M2 --> Quorum
    M3 --> Quorum
    Quorum --> L2[L2 GER Contract]
    
    style Committee fill:#e8f5e8
    style Quorum fill:#e3f2fd
```

**Security**: Multiple parties must agree before any GER injection, eliminating single points of failure.

