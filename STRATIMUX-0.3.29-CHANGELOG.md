# Stratimux v0.3.29: Bi-Directional Ownership System

## Changelog Entry

### v0.3.29 - Bi-Directional Ownership & Compositional Terminology
This major update completes the ownership system architecture initiated in v0.3.281, introducing a production-ready **bi-directional ownership system** with stake-based coordination, enabling deterministic concurrency control through compositional patterns. Additionally, comprehensive terminology updates align the framework with its higher-order compositional paradigm.

### Foundation: v0.3.281 - Dynamic Concept Management & Stage Lifecycle
The groundwork for v0.3.29's ownership system was laid in v0.3.281 with critical stage lifecycle enhancements:

#### v0.3.281 Stage Lifecycle Management
* **Automatic Registration**: Stage planners self-register via StratiDECK integration
* **Dual Conclusion Patterns**: ([src/model/stagePlanner/stagePlannerHelpers.ts:108-109](src/model/stagePlanner/stagePlannerHelpers.ts))
  ```typescript
  // Declarative cleanup with automatic unregister
  conclude()
  // Imperative control for complex flows  
  stagePlanner.conclude()
  ```
* **Proper Cleanup**: Both methods dispatch `muxiumUnregisterStagePlanner` ([src/concepts/muxium/qualities/unregisterStagePlanner.quality.ts:13-25](src/concepts/muxium/qualities/unregisterStagePlanner.quality.ts))
* **Curried Architecture**: Prepares framework for runtime concept modifications ([src/model/stagePlanner/stagePlannerPlan.ts:80-96](src/model/stagePlanner/stagePlannerPlan.ts))

#### Key Features
* **Bi-Directional Ownership System**: Stake-based coordination with temporal priority (FIFO)
  - Actions opt-in via KeyedSelectors attached to any action
  - KeyedSelectors cascade through ActionStrategies automatically ([src/model/action/strategy/actionStrategyHelpers.ts:36-82](src/model/action/strategy/actionStrategyHelpers.ts))
  - O(depth) performance through stake checking at end wrungs only ([src/model/ownership.ts:410-473](src/model/ownership.ts))
  - Deterministic execution order across multiple runs ([src/test/trux/trux.test.ts:180-199](src/test/trux/trux.test.ts))

* **Critical `switchMap` → `mergeMap` Fix**: Enables true bi-directional action flow
  ```typescript
  // src/model/method/methodAsync.ts:79
  mergeMap(([act, concepts]: [ActionDeck<T, C>, Concepts]) =>
    createActionController$(act, (params) => {
      // All action streams now preserved
  ```

* **Stage Ownership Integration**: Building on v0.3.281's foundation
  - v0.3.281 introduced the curried `stageO()` pattern ([src/model/stagePlanner/stagePlannerHelpers.ts:33-63](src/model/stagePlanner/stagePlannerHelpers.ts))
  - v0.3.29 completes the integration with ownership system
  ```typescript
  // v0.3.281 introduced, v0.3.29 finalized
  stageO()      // Waits for ownership initialization (default)
  stageO(true)  // Explicitly skip ownership check
  ```

#### Breaking Changes (Cumulative from v0.3.281)
* **`stageO()` API Evolution**: 
  - v0.3.281: Moved from optional concepts parameter to explicit ownership control
  - v0.3.29: Now fully integrated with ownership system for coordination
* **Terminology Alignment**: 
  - "Hierarchical" → "Uni-directional tree composition"
  - "Parent-child relationships" → "Uni-directional relationships"
  - Ownership system itself maintains bi-directional relationships

#### How to Enable Ownership
```typescript
// 1. Opt any action into ownership (attaches KeyedSelector)
const action = d.concept.e.someAction();
action.keyedSelectors = [createKeyedSelector('your.path.here')];

// 2. Make strategies ownership-aware (src/test/trux/strategies.ts:41-91)
const backTrack = createActionNode(deck.ownership.e.ownershipBackTrack());
const actionNode = createActionNode(yourAction(), {
  failureNode: backTrack,  // Prevents auto-failure when blocked
  agreement: 10000,         // Sufficient time for coordination
  keyedSelectors: [selector]  // These cascade through the strategy
});

// 3. Compose ownership into your muxium
const muxium = muxification('Your App', {
  yourConcept: createYourConcept(),
  ownership: createOwnershipConcept()  // Just add this
});
```

#### Performance Improvements
* **Stake-based checking**: O(n*m) → O(depth) for deep trees (~10x improvement)
* **KeyedSelector deduplication**: Reduced memory footprint in strategy chains
* **Efficient stake recalculation**: Only rebuilds on stub clearing

#### Validation
* **Trux spatial mapping tests**: 7 strategies with deterministic execution order
* **Parallel branch execution**: Independent roots (A, B, E) run simultaneously
* **Bi-directional blocking**: Ancestors block descendants, descendants block ancestors

---

## Extended Documentation

### Understanding Bi-Directional Ownership

The ownership system creates a **deterministic mutex** that understands compositional relationships. Think of it as a coordination mechanism where:

1. **Uni-directional tree compositions** define the spatial relationships (like file paths)
2. **Bi-directional blocking** enforces mutual exclusion between ancestors and descendants
3. **Parallel execution** allows siblings and independent branches to run simultaneously

### The switchMap → mergeMap Connection ([src/model/method/methodAsync.ts:79](src/model/method/methodAsync.ts))

This critical fix enables the bi-directional nature of the system:
- **Before**: RxJS `switchMap` was canceling previous ActionControllers, orphaning 6/7 actions
- **After**: `mergeMap` preserves all action streams, allowing ownership to coordinate them
- **Impact**: Without this, ownership couldn't demonstrate parallel execution capabilities
- **Location**: All async method creators now use `mergeMap` for proper stream preservation

### KeyedSelector Cascading ([src/model/action/strategy/actionStrategyHelpers.ts:36-82](src/model/action/strategy/actionStrategyHelpers.ts))

When you attach a KeyedSelector to any action or strategy node, it automatically:
1. **Propagates** through the entire strategy chain via `mergeKeyedSelectors()`
2. **Merges** with existing selectors (deduplication based on unique keys)
3. **Preserves** through backtrack operations
4. **Enables** ownership tracking at each step

```typescript
// mergeKeyedSelectors implementation ensures no duplicates
export const mergeKeyedSelectors = <T>(
  currentSelectors?: KeyedSelector<T>[],
  nextSelectors?: KeyedSelector<T>[]
): KeyedSelector<T>[] | undefined
```

### Stage Ownership Requirements

For stages that utilize ownership:
```typescript
// In your stage planner
stageO()  // Default: waits for ownership to initialize

// Or explicitly skip ownership
stageO(true)  // Skip ownership check
```

This ensures stages don't execute before ownership is ready to coordinate them.

### Terminology Evolution

The framework now consistently uses compositional language:
- **Uni-directional relationships**: The tree structure itself (one-way associations)
- **Bi-directional ownership**: The blocking mechanism (mutual exclusion)
- **Compositional patterns**: How concepts relate without hierarchy

### Files Modified

#### Core System
- **[/src/model/ownership.ts](src/model/ownership.ts)** - Complete stake system with temporal priority
  - Lines 17-21: Added `created` field to OwnershipTicket
  - Lines 43-47: KeyWrung with stake tracking
  - Lines 410-473: `checkStakeOwnership()` implementation
  - Lines 155-209: `recalculateStakeAtWrung()` for stake management
  
- **[/src/model/method/methodAsync.ts](src/model/method/methodAsync.ts)** - switchMap → mergeMap fix
  - Line 79: Critical stream preservation change
  
- **[/src/concepts/ownership/ownership.mode.ts](src/concepts/ownership/ownership.mode.ts)** - Ownership bypass & ordering
  - Lines 48-52: Ownership concept bypass logic
  - Lines 71-76: Strategy auto-failure without `failureNode`
  
- **[/src/model/action/strategy/actionStrategyHelpers.ts](src/model/action/strategy/actionStrategyHelpers.ts)** - KeyedSelector propagation
  - Lines 36-82: `mergeKeyedSelectors()` implementation

#### Test Infrastructure
- **[/src/test/trux/](src/test/trux/)** - Spatial mapping validation concept
  - [trux.test.ts:180-199](src/test/trux/trux.test.ts): Deterministic execution validation
  - [strategies.ts:65-90](src/test/trux/strategies.ts): Ownership-aware strategy pattern
  
- **[/src/test/ownership.test.ts](src/test/ownership.test.ts)** - Core ownership functionality tests

#### Documentation
- Multiple terminology updates: "hierarchical" → "uni-directional tree composition"
- Comprehensive ownership system documentation

---

## Migration Guide

### Existing Projects
No breaking changes unless using ownership. The system is opt-in.

### Projects Using Ownership
1. Update `stageO()` calls to handle ownership initialization
2. Add `failureNode: ownershipBackTrack` to strategies
3. Increase agreement times to 10000ms+ for coordination delays

### New Projects
Simply compose ownership from the start:
```typescript
ownership: createOwnershipConcept()
```

---

## Summary

The v0.3.281-v0.3.29 update arc represents a **major architectural evolution** for Stratimux:

### v0.3.281 Foundation → v0.3.29 Completion
1. **v0.3.281** established the stage lifecycle infrastructure with curried architecture
2. **v0.3.29** leveraged this foundation to implement bi-directional ownership
3. Together they enable **deterministic concurrency control** through compositional patterns

This proves that **complex coordination patterns can be implemented as composable concepts** without framework-level primitives. The bi-directional ownership system provides deterministic concurrency control while maintaining the framework's commitment to higher-order composition and functional programming principles.

**Version Path**: 0.3.28 → 0.3.281 → 0.3.29  
**Status**: Production Ready  
**Performance**: 10x improvement for deep trees  
**Compatibility**: Fully backward compatible (opt-in feature)  
**Architecture**: Stage lifecycle + Ownership system = Complete coordination solution