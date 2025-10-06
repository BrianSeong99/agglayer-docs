---
title: L1InfoTreeSync
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  L1InfoTreeSync
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    L1 state synchronization system that maintains real-time sync with Ethereum's L1 Info Tree and rollup exit trees
  </p>
</div>

## Meet L1InfoTreeSync: The Dual-Tree Manager

L1InfoTreeSync is the component responsible for **maintaining two critical Merkle trees** that track different aspects of Ethereum L1 state. These trees provide the foundational data that other AggKit components need for proof generation and certificate validation.

**The Two Trees:**

1. **L1 Info Tree**: Tracks historical Global Exit Root updates from the Global Exit Root contract
2. **Rollup Exit Tree**: Tracks rollup state submissions from the Rollup Manager contract

**Why two trees**: Different AggKit operations need different types of L1 data. The L1 Info Tree provides historical GER context for claim verification, while the Rollup Exit Tree provides rollup state data for certificate building.

- **L1 Info Tree Sync**: Maintains the complete L1 Info Tree containing historical Global Exit Roots
- **Rollup Exit Tree Sync**: Tracks rollup exit tree updates from all connected L2s
- **Merkle Proof Generation**: Provides cryptographic proofs for cross-chain verification
- **State Consistency**: Handles blockchain reorganizations and maintains data integrity
- **Finality Management**: Respects different finality requirements (latest, safe, finalized)

## The Detective's Mission: Why Watching L1 is Critical

### The Evidence Collection Challenge

Cross-chain operations require **accurate L1 state information** for several critical functions:

1. **Proof Generation**: Merkle proofs must reference correct historical L1 states
2. **Certificate Validation**: AggSender needs L1 data to build valid certificates
3. **Claim Verification**: Cross-chain claims must be verified against settled L1 state
4. **Reorg Handling**: L1 reorganizations must be detected and handled properly

### **L1InfoTreeSync's Solution**

L1InfoTreeSync provides **comprehensive L1 state management**:

```mermaid
graph TB
    subgraph "Ethereum L1"
        GERContract[Global Exit Root Contract]
        RollupManager[Rollup Manager]
        Events[UpdateL1InfoTree Events]
        Batches[VerifyBatches Events]
    end
    
    subgraph "L1InfoTreeSync"
        Monitor[Event Monitoring]
        L1Tree[L1 Info Tree]
        RollupTree[Rollup Exit Tree]
        Proofs[Merkle Proof Generator]
    end
    
    subgraph "Data Consumers"
        AggSender[AggSender]
        AggOracle[AggOracle]
        BridgeService[Bridge Service]
    end
    
    GERContract --> Events
    RollupManager --> Batches
    Events --> Monitor
    Batches --> Monitor
    
    Monitor --> L1Tree
    Monitor --> RollupTree
    L1Tree --> Proofs
    RollupTree --> Proofs
    
    Proofs --> AggSender
    Proofs --> AggOracle
    Proofs --> BridgeService
    
    style Monitor fill:#e8f5e8
    style L1Tree fill:#e3f2fd
    style RollupTree fill:#e3f2fd
    style Proofs fill:#fff3e0
```

*Figure 1: L1InfoTreeSync's role in L1 state synchronization*

## How L1InfoTreeSync Works

### Event Processing for Two Different Trees

L1InfoTreeSync monitors **two types of events** from Ethereum L1 and processes them into **two separate tree structures**:

```mermaid
sequenceDiagram
    participant GERContract as Global Exit Root Contract
    participant RollupManager as Rollup Manager Contract
    participant L1InfoTreeSync as L1InfoTreeSync
    
    Note over GERContract,L1InfoTreeSync: L1 Info Tree Updates
    GERContract->>L1InfoTreeSync: UpdateL1InfoTree Event
    L1InfoTreeSync->>L1InfoTreeSync: Process into L1 Info Tree (AppendOnly)
    L1InfoTreeSync->>L1InfoTreeSync: Store L1InfoTreeLeaf in database
    
    Note over RollupManager,L1InfoTreeSync: Rollup Exit Tree Updates  
    RollupManager->>L1InfoTreeSync: VerifyBatches Event
    L1InfoTreeSync->>L1InfoTreeSync: Process into Rollup Exit Tree (Updatable)
    L1InfoTreeSync->>L1InfoTreeSync: Store VerifyBatches record in database
```

### The Two Tree Types Explained

**L1 Info Tree (AppendOnly)**:

- **Source**: `UpdateL1InfoTree` events from Global Exit Root contract
- **Structure**: Append-only tree that grows with each Global Exit Root update
- **Purpose**: Provides historical GER data for claim verification
- **Use case**: When users need to prove their bridge transaction was included in a specific historical state

**Rollup Exit Tree (Updatable)**:

- **Source**: `VerifyBatches` events from Rollup Manager contract  
- **Structure**: Updatable tree where L2 chains can update their submitted state
- **Purpose**: Tracks which L2 chains have submitted state and their current exit roots
- **Use case**: When AggSender needs to build certificates with rollup state context

### **Merkle Tree Management**

L1InfoTreeSync maintains two critical Merkle trees:

#### **1. L1 Info Tree**
```mermaid
graph TB
    subgraph "L1 Info Tree (32 levels)"
        Root[L1 Info Tree Root]
        Leaves[L1InfoTreeLeaf Nodes]
    end
    
    subgraph "Leaf Content"
        Leaf[L1InfoTreeLeaf]
        GER[Global Exit Root]
        BlockHash[Previous Block Hash]
        Timestamp[Block Timestamp]
        Index[L1 Info Tree Index]
    end
    
    Root --> Leaves
    Leaves --> Leaf
    
    Leaf --> GER
    Leaf --> BlockHash
    Leaf --> Timestamp
    Leaf --> Index
    
    style Root fill:#e8f5e8
    style Leaf fill:#e3f2fd
```

*Figure 3: L1 Info Tree structure and leaf content*

#### **2. Rollup Exit Tree**
```mermaid
graph TB
    subgraph "Rollup Exit Tree"
        RootRET[Rollup Exit Tree Root]
        L2Leaves[L2 Local Exit Roots]
    end
    
    subgraph "L2 Contributions"
        L2A[L2 Chain A<br/>Local Exit Root]
        L2B[L2 Chain B<br/>Local Exit Root]
        L2C[L2 Chain C<br/>Local Exit Root]
    end
    
    L2A --> L2Leaves
    L2B --> L2Leaves
    L2C --> L2Leaves
    L2Leaves --> RootRET
    
    style RootRET fill:#e8f5e8
    style L2Leaves fill:#e3f2fd
```

*Figure 4: Rollup Exit Tree aggregating all L2 states*

## Integration with Other Components

### **AggSender Integration**

L1InfoTreeSync provides **essential data** for certificate generation:

```mermaid
sequenceDiagram
    participant AS as AggSender
    participant L1S as L1InfoTreeSync
    participant L1 as Ethereum L1
    
    Note over AS,L1: Certificate Building Process
    AS->>L1S: Get L1 Info Tree Data
    L1S->>L1: Query Latest Block
    L1S->>L1S: Generate Merkle Proofs
    L1S-->>AS: L1InfoTreeLeaf + Proofs
    AS->>AS: Include L1 Data in Certificate
```

**Data Provided**:

- Current L1 Info Tree root and leaf data
- Merkle proofs for imported bridge exits
- L1 block finality information
- Historical Global Exit Root data

### **AggOracle Integration**

L1InfoTreeSync enables **GER detection** for oracle operations:

```mermaid
sequenceDiagram
    participant L1 as Ethereum L1
    participant L1S as L1InfoTreeSync
    participant AO as AggOracle
    participant L2 as L2 Chain
    
    Note over L1,L2: GER Detection and Propagation
    L1->>L1S: New GER Event
    L1S->>L1S: Process Event
    L1S->>L1S: Update L1 Info Tree
    L1S->>AO: New GER Available
    AO->>L2: Propagate GER to L2
```
