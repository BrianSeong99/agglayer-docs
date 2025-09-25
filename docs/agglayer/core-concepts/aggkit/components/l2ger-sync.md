---
title: L2GERSync
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  L2GERSync
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    L2 Global Exit Root synchronization system that manages GER state on L2 chains
  </p>
</div>

## Meet L2GERSync: The Local Librarian

**L2GERSync** is the component responsible for **managing Global Exit Root synchronization on the L2 side**. It works closely with AggOracle to maintain local GER state, providing efficient access to current and historical Global Exit Root information needed for bridge operations and claim verification.

### The Information Management Challenge

Here's a scenario that illustrates why L2GERSync is crucial: Imagine your chain receives 50 global state updates per day from AggOracle. Each update contains critical information that users need to verify their cross-chain claims. 

**Without L2GERSync**: Every time someone wants to make a claim, your chain would have to dig through contract logs, query external services, or perform expensive on-chain lookups. The user experience would be terrible – claims would take minutes instead of seconds.

**With L2GERSync**: The moment AggOracle updates your chain's global state, L2GERSync immediately catalogs this information in an optimized local database. When someone wants to make a claim, the response is **instant** – all the necessary information is perfectly organized and immediately available.

L2 chains need **efficient access to GER state** for several critical operations:

1. **Claim Verification**: Bridge claims must be verified against current Global Exit Root
2. **Proof Generation**: Merkle proofs require accurate GER state information
3. **API Responses**: Bridge Service APIs need fast GER data access
4. **Historical Queries**: Applications need access to historical GER transitions

### **L2GERSync's Solution**

L2GERSync provides **optimized local GER state management**:

```mermaid
graph TB
    subgraph "GER Sources"
        AggOracle[AggOracle<br/>GER Injection]
        L2Contract[L2 GER Manager Contract]
        Events[GER Injection Events]
    end
    
    subgraph "L2GERSync Processing"
        Monitor[Event Monitoring]
        Index[GER Indexing]
        Store[Local Storage]
        Query[Query Interface]
    end
    
    subgraph "Data Consumers"
        BridgeService[Bridge Service APIs]
        BridgeSync[BridgeSync]
        Applications[External Applications]
    end
    
    AggOracle --> L2Contract
    L2Contract --> Events
    Events --> Monitor
    Monitor --> Index
    Index --> Store
    Store --> Query
    
    Query --> BridgeService
    Query --> BridgeSync
    Query --> Applications
    
    style Monitor fill:#e8f5e8
    style Index fill:#e3f2fd
    style Store fill:#f3e5f5
    style Query fill:#fff3e0
```

*Figure 1: L2GERSync's role in L2 GER state management*

## How L2GERSync Works

### **GER Synchronization Workflow**

```mermaid
sequenceDiagram
    participant AO as AggOracle
    participant L2GER as L2 GER Manager
    participant L2S as L2GERSync
    participant API as Bridge Service
    
    Note over AO,API: GER Update and Indexing Flow
    AO->>L2GER: Inject New GER
    L2GER->>L2GER: Update Contract State
    L2GER->>L2S: GER Injection Event
    L2S->>L2S: Parse Event Data
    L2S->>L2S: Store GER Information
    L2S->>L2S: Update Local Index
    
    Note over API,L2S: Query and Response
    API->>L2S: Query GER Data
    L2S-->>API: Current GER State
```

*Figure 2: GER synchronization and query workflow*

**The beauty**: This happens **automatically**. You don't need to configure which mode to use – L2GERSync examines your contract when it starts up and automatically configures itself for perfect compatibility.
