# Spatial Ownership: Bi-Directional Coordination System

## Abstract
The Spatial Ownership design pattern enables deterministic mutex-like coordination for concurrent ActionStrategies executing across distributed Muxium networks. This **bi-directional ownership system** employs stake-based coordination with temporal priority (FIFO), creating compositional relationships between ActionStrategies and the OwnershipLedger through a ticket-stub mechanism.

**Key Innovation**: Unlike traditional distributed locking that shares state across entire networks, ownership leverages spatial locality—only the location holding the value maintains its lock state. Actions carry ticket stubs noting their ownership claims, with expiration times matching action lifetimes (default 5000ms, configurable via agreement).

This achieves soft locking in environments traditionally unable to support such coordination, enabling massively parallel networks that scale dynamically. The system is **opt-in**—not all nodes require the Ownership concept, nor do all values require locks. Logical determination guides when coordination is necessary based on orchestration scale and complexity.

## Research Context: Compositional Relationships

The ownership system demonstrates **bi-directional blocking** within uni-directional tree compositions:
- **Uni-directional trees** define spatial relationships (like file paths: `trux.A.B.C`)
- **Bi-directional coordination** enforces mutual exclusion between ancestors and descendants
- **Parallel execution** allows siblings and independent branches to run simultaneously

### Stake-Based Performance (O(depth))
The stake system awards ownership at **end wrungs only**—where paths terminate in the tree structure:
```typescript
// From O(n*m) checking to O(depth) stake verification
if (!node.stake || node.stake === stubKey) {
  return true; // We have stake or can claim it
}
```

This creates natural hierarchical respect: ancestors claim stake before descendants, while independent branches execute in parallel.

## Moving Actions off Premise

The critical capability enabling distributed computation requires careful handling of ownership locks when actions move between premises (servers, workers, clients). The **only mechanisms** that clear locks are:
1. Strategy conclusion entering ownershipMode
2. Explicit removal via ownership qualities

### Off-Premise Pattern
To move actions off premise while maintaining locks, we **counter** the standard strategy pattern:

1. **Create a quality without method** - Uses reducer to queue actions
2. **Principle subscribes to queue** - Takes control of ActionStrategy
3. **Maintains expiration awareness** - Respects temporal constraints

```typescript
// Quality reducer adds to off-premise queue
reducer: (state, action) => {
  if (action.strategy?.stubs) {
    return {
      offPremiseQueue: [...state.offPremiseQueue, action]
    };
  }
  return {};
}

// Principle monitors and processes queue
principle.subscribe(concepts => {
  const queue = selectState(concepts, 'concept').offPremiseQueue;
  if (queue.length > 0) {
    // Process with ownership maintained
    const action = queue[0];
    // Send to worker/server/client
    // Stubs remain intact until explicit clear
  }
});
```

This pattern enables safe state transformation of locked values across premises. Only transform values with KeyedSelectors when ownership is required—otherwise clone values without selectors.

**Original Use Case**: FileSystem manipulation where paths act as KeyedSelectors, enabling safe concurrent file operations while Stratimux operates within TypeScript constraints. Binary file transformations move off-premise while maintaining path locks.

## Ownership Internals

### State Structure
```typescript
export type OwnershipState = {
  initialized: boolean;
  ownershipLedger: OwnershipLedger;
  uniDirectionalLedger: UniDirectionalLedger;  // v0.3.29: Stake-based
  pendingActions: Action[];
  isResponsibleForMode: boolean;
}
```

### Core Components
* **initialized** - Controls when principles/subscriptions engage with ownership
* **ownershipLedger** - Map using KeyedSelector keys to OwnershipTicket arrays (FIFO queues)
* **uniDirectionalLedger** - v0.3.29 addition: KeyWrung tree with stake tracking at end wrungs
* **pendingActions** - Actions blocked awaiting ownership, dispatched FIFO when ready
* **isResponsibleForMode** - Set false via `createOwnershipConcept()` for custom mode implementations

### Useful Ownership Qualities
* **ownershipBackTrack** - ActionStrategy failureNode handler for blocked actions
* **ownershipClearPayloadStubs** - Clears specific stubs from ledger (manual unlock)
* **ownershipClearStrategyStubsFromLedgerAndSelf** - Clears all strategy stubs
* **ownershipClearPendingActions** - Empties pendingAction list
* **ownershipClearPendingActionsOfStrategyTopic** - Selective pending clear by topic
* **ownershipResetLedger** - Complete ledger reset

### Internal Ownership Qualities
* **ownershipInitialize** - Sets initialized to true, enabling ownership principle

## Implementation Details (v0.3.29)

### Enabling Ownership
```typescript
// 1. Attach KeyedSelector to any action
const action = d.concept.e.someAction();
action.keyedSelectors = [createKeyedSelector('your.path.here')];

// 2. Make strategies ownership-aware
const backTrack = createActionNode(deck.ownership.e.ownershipBackTrack());
const actionNode = createActionNode(yourAction(), {
  failureNode: backTrack,  // Prevents auto-failure when blocked
  agreement: 10000,         // Sufficient time for coordination
});

// 3. Compose ownership into muxium
const muxium = muxification('Your App', {
  yourConcept: createYourConcept(),
  ownership: createOwnershipConcept()
});
```

### Critical Integration: switchMap → mergeMap
The v0.3.29 fix enabling true bi-directional flow:
```typescript
// src/model/method/methodAsync.ts:79
mergeMap(([act, concepts]: [ActionDeck<T, C>, Concepts]) =>
  createActionController$(act, (params) => {
    // All action streams now preserved, not orphaned
```
Without this, RxJS `switchMap` was canceling ActionControllers, preventing ownership from demonstrating its parallel execution capabilities.

### Performance Characteristics
* **Stake checking**: O(depth) vs previous O(n*m) for deep trees
* **KeyedSelector deduplication**: Automatic via `mergeKeyedSelectors()`
* **Stake recalculation**: Only on stub clearing, not every check
* **Temporal priority**: Creation timestamps ensure true FIFO within queues

## Validation & Proof

The Trux spatial mapping tests demonstrate deterministic execution across 7 strategies:
- **Parallel branches**: Independent roots (A, B, E) execute simultaneously
- **Bi-directional blocking**: Ancestors block descendants, descendants block ancestors
- **Temporal fairness**: FIFO ordering within ownership queues
- **Deterministic order**: Same execution sequence across multiple runs

This proof validates the ownership system as a production-ready coordination mechanism for distributed graph computation.