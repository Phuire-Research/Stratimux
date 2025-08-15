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

This creates natural uni-directional tree composition respect: ancestors claim stake before descendants, while independent branches execute in parallel.

## Reference Manipulation at Consistent Points

Stratimux uniquely allows **direct reference manipulation** when three conditions align:
1. **Single Outlet**: Only ONE component (typically a principle) manages the reference
2. **Reducer Informed**: State changes are announced via reducers when items enter
3. **Direct Manipulation**: The outlet can manipulate references without dispatching

This paradigm difference enables efficient queue management while maintaining determinism—the queue is managed at its **single point of consistency** (the principle), with reducers informing only when items enter.

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
// Quality reducer adds to off-premise queue (INFORMED ENTRY)
reducer: (state, action) => {
  if (action.strategy?.stubs) {
    return {
      offPremiseQueue: [...state.offPremiseQueue, action]
    };
  }
  return {};
}

// Principle as SINGLE OUTLET with direct manipulation
principle.subscribe(concepts => {
  const queue = selectState(concepts, 'concept').offPremiseQueue;
  if (queue.length > 0) {
    const action = queue[0];      // Direct reference access
    processOffPremise(action);
    queue.shift();                // Direct manipulation - no dispatch
    // Stubs remain intact until explicit clear
  }
});
```

This pattern enables safe state transformation of locked values across premises. The principle's **direct manipulation** of the queue avoids dispatch overhead while maintaining correctness through the single-outlet guarantee.

**Original Use Case**: FileSystem manipulation where paths act as KeyedSelectors, enabling safe concurrent file operations while Stratimux operates within TypeScript constraints. Binary file transformations move off-premise while maintaining path locks.

## Ownership State Architecture

### Complete State Structure ([src/concepts/ownership/ownership.concept.ts:30-42](src/concepts/ownership/ownership.concept.ts))
```typescript
export type OwnershipState = {
  initialized: boolean;
  ownershipLedger: OwnershipLedger;
  uniDirectionalLedger: UniDirectionalLedger;
  higherOrderLedger: HigherOrderLedger;  // Future bi-directional graph support
  higherOrdered: boolean;                 // Toggle for paradigm selection
  pendingActions: Action[];
  isResponsibleForMode: boolean;
}
```

### State Properties Deep Dive

#### **initialized: boolean**
Controls the activation of ownership principles. When false, the ownership system is dormant—no queue processing, no blocking checks. The `ownershipInitializeOwnership` quality sets this to true, activating the entire coordination system.

#### **ownershipLedger: OwnershipLedger**
The core ticket management system. A Map structure where:
- **Keys**: KeyedSelector strings (e.g., "trux.A.B.C")
- **Values**: Arrays of OwnershipTickets in FIFO order
- Each ticket contains: `ticket` (unique ID), `expiration` (timestamp), `created` (for temporal priority)

#### **uniDirectionalLedger: UniDirectionalLedger**
The v0.3.29 stake-based optimization structure:
- **KeyWrung tree**: Navigable path structure
- **Stakes at end wrungs**: Ownership claims only where paths terminate
- **O(depth) performance**: Efficient traversal vs O(n*m) checking

#### **higherOrderLedger: HigherOrderLedger**
Placeholder for future bi-directional graph relationships. When `higherOrdered: true`, would enable full graph-based ownership beyond tree structures.

#### **pendingActions: Action[]**
The queue of blocked actions managed with **direct reference manipulation**:
- Actions enter via reducer (informed entry)
- Principle directly manipulates without dispatch (single outlet)
- FIFO processing when ownership becomes available

#### **isResponsibleForMode: boolean**
Determines if ownership manages its own mode initialization:
- `true` (default): Ownership dispatches `ownershipSetOwnershipModeStrategy`
- `false`: External system handles mode setup (custom implementations)

## Ownership Principles: The Coordination Engine

### Primary Principle: Queue Processing ([src/concepts/ownership/ownership.principle.ts:29-109](src/concepts/ownership/ownership.principle.ts))

The `ownershipPrinciple` is the **single outlet** for pendingActions processing:

```typescript
export const ownershipPrinciple: OwnershipPrinciple = ({
  plan, nextC, conceptSemaphore
}) => {
  plan('ownership Principle Plan', ({d__, stage, stageO }) => [
    stageO(true),  // Skip ownership check (we ARE ownership)
    stage(({concepts, d, dispatch}) => {
      const ownershipState = selectMuxifiedState(concepts, conceptSemaphore);
      
      if (ownershipState?.initialized) {
        // DIRECT REFERENCE MANIPULATION - Single Outlet Pattern
        if (ownershipState.pendingActions.length > 0) {
          for (const action of ownershipState.pendingActions) {
            const [newConcepts, readyToGo] = isActionReady(newConcepts, action);
            if (readyToGo) {
              // Direct array reconstruction without dispatch
              ownershipState.pendingActions = pendingActions.filter(
                p => !areSemaphoresEqual(p, action)
              );
              nextC(newConcepts);  // Update concepts
              dispatch(action, { throttle: 0 });  // Release ready action
              break;  // One at a time
            }
          }
        }
      }
    })
  ]);
};
```

#### Key Behaviors:
1. **Continuous Monitoring**: Checks pendingActions every stage iteration
2. **Single Action Release**: Processes one action at a time for determinism
3. **Expiration Handling**: Moves expired actions to badActions
4. **Initialization Trigger**: Dispatches ownership mode setup when needed

### Secondary Principle: Expiration Cleanup ([src/concepts/ownership/ownership.principle.ts:117-152](src/concepts/ownership/ownership.principle.ts))

The `ownershipExpirationPrinciple` maintains ledger hygiene:

```typescript
export const ownershipExpirationPrinciple: OwnershipPrinciple = ({
  plan, nextC, conceptSemaphore
}) => {
  plan('ownership Expiration Plan', ({stage, stageO}) => [
    stageO(true),
    stage(({concepts}) => {
      const ownershipState = selectMuxifiedState(concepts, conceptSemaphore);
      if (ownershipState?.initialized) {
        // Clean expired tickets from ledger
        for (const [key, line] of ownershipState.ownershipLedger.entries()) {
          const activeTickets = line.filter(t => t.expiration > Date.now());
          if (activeTickets.length !== line.length) {
            ownershipState.ownershipLedger.set(key, activeTickets);
            modified = true;
          }
        }
      }
    })
  ]);
};
```

#### Key Behaviors:
1. **Periodic Cleanup**: Removes expired tickets from ledger
2. **No Queue Impact**: Doesn't affect pendingActions directly
3. **Memory Management**: Prevents ledger bloat from abandoned tickets

### Principle Interaction Pattern

The two principles work in concert:
1. **Main Principle**: Processes queue, dispatches ready actions
2. **Expiration Principle**: Cleans ledger, maintains system health
3. **Both Skip Ownership**: Use `stageO(true)` to avoid self-blocking
4. **Direct Manipulation**: Both can modify state without dispatching

This dual-principle architecture separates concerns while maintaining the single-outlet guarantee for queue processing.

## Useful Ownership Qualities

### Strategy Coordination
* **ownershipBackTrack** - The critical failureNode handler for ownership-aware strategies. When an action is blocked by ownership, this quality allows the strategy to gracefully retry rather than auto-failing. Must be used as `failureNode: createActionNode(deck.ownership.e.ownershipBackTrack())` in all ownership-aware strategies.

### Stub Management
* **ownershipClearPayloadStubs** - Manually unlocks specific stubs from the ownership ledger. Useful when you need to explicitly release ownership without waiting for strategy conclusion. Takes an array of stub keys as payload.
* **ownershipClearStrategyStubsFromLedgerAndSelf** - Comprehensive stub clearing that removes all stubs associated with a strategy from both the ledger and the action itself. Ensures clean ownership release when strategies are terminated early.

### Queue Management
* **ownershipClearPendingActions** - Immediately empties the entire pendingActions queue. Use with caution as this will prevent blocked actions from executing. Primarily for error recovery or system reset scenarios.
* **ownershipClearPendingActionsOfStrategyTopic** - Selectively removes pending actions by strategy topic. Enables targeted cleanup when specific strategies need to be abandoned without affecting others in the queue.

### System Control
* **ownershipResetLedger** - Complete ownership system reset, clearing all tickets, stubs, and stakes. This is a nuclear option that should only be used during major state transitions or recovery from corrupted ownership state.
* **ownershipInitialize** - Internal quality that sets initialized to true, enabling the ownership principle to begin processing. Automatically dispatched by ownership mode when isResponsibleForMode is true.

### Reference Manipulation Pattern
The ownership principle demonstrates **direct reference manipulation** with its pendingActions queue—the principle is the single outlet that can directly access `queue[0]` and manipulate the array without dispatching. This pattern avoids dispatch overhead while maintaining determinism through the single-point-of-consistency guarantee.

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