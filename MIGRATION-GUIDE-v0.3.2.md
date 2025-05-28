# Stratimux v0.3.2 Migration Guide - Stratideck Complete

## Overview

Stratimux v0.3.2 represents the completion of the **Stratideck** system and introduces **Full Isolated Functional Composition of Concepts**. This major release brings significant architectural improvements through the **DECK Interface System** while requiring explicit type definitions for enhanced type safety at scale.

## 🚨 Breaking Changes Summary

### 1. Quality Type System Overhaul
**CRITICAL:** All concepts now require explicit type definitions for each quality.

### 2. Enhanced StratiDECK Interface System
Complete type-safe access to concept functionality through the new **d.e.c.k** interface pattern.

### 3. Muxified Concepts via `muxifyConcepts` for API Handling
The system now emphasizes using **muxified concepts** through `muxifyConcepts` for handling APIs and creating isolated concept instances.

---

## 🔧 Quality Type System Migration

### Before (v0.3.1 and earlier)
```typescript
// OLD: Simple typeof pattern
const counterQualities = {
  counterAdd,
  counterSubtract,
  counterSetCount,
  counterMultiply
};

export type CounterQualities = typeof counterQualities;
```

### After (v0.3.2 REQUIRED)
```typescript
// NEW: Explicit type definitions for each quality
export type CounterAdd = Quality<CounterState>;
export type CounterSubtract = Quality<CounterState>;  
export type CounterSetCount = Quality<CounterState, CounterSetCountPayload>;
export type CounterMultiply = Quality<CounterState, CounterMultiplyPayload>;

// NEW: Explicit qualities interface
export type CounterQualities = {
  counterAdd: CounterAdd,
  counterSubtract: CounterSubtract,
  counterSetCount: CounterSetCount,
  counterMultiply: CounterMultiply
};
```

### Quality File Updates
**Every quality file must now export its type:**

```typescript
// add.quality.ts
import { Quality } from '../../../model/quality';

+ export type CounterAdd = Quality<CounterState>;
export const counterAdd = createQualityCard<CounterState>({
  type: 'Counter Add',
  reducer: (state) => ({
    count: state.count + 1
  }),
  methodCreator: defaultMethodCreator,
  keyedSelectors: [counterSelectCount]
});
```

---

## 🏗️ Concept Deck Type System

### Maintaining Concept Decks via Type System

The **Deck type system** is now critical for type safety. You must explicitly define how concepts are loaded onto the Deck type:

```typescript
// REQUIRED: Export deck types for each concept
export type CounterDeck = {
  counter: Concept<CounterState, CounterQualities>,
};
```

If the Concept is **Muxified**

### Before
```typescript
// Old: Type Union of Decks
export type MuxifiedCounterDeck = {
  counter: Concept<MuxifiedCounterState, MuxifiedCounterQualities>,
} & CounterDeck;
```

### After (v0.3.2 REQUIRED)
```typescript
// REQUIRED: Place Muxified Decks into the Deck Slot for the Concept Type at your Deck Creation.
export type MuxifiedCounterDeck = {
  counter: Concept<MuxifiedCounterState, MuxifiedCounterQualities, CounterDeck>,
};
```

### Type Inference Requirement
Loading Deck onto the Concept Type forces explicit requirement for the Qualities type version, inferring from the qualities object:

```typescript
// This pattern is now required for complex concepts
export const createCounterConcept = () => {
  return createConcept<CounterState, CounterQualities>(
    counterName,
    initialCounterState,
    counterQualities
  );
};
```

---

## 🎯 Muxified Concepts for API Handling

### The New Paradigm: `muxifyConcepts`

The Stratimux Concept System now emphasizes **muxified concepts** for handling APIs and creating isolated, reusable concept instances:

```typescript
import { muxifyConcepts } from 'stratimux';
import { createConcept } from 'stratimux';
import { createCounterConcept } from '../concepts/counter/counter.concept';

// Create isolated concept instances
const counterOne = muxifyConcepts([createCounterConcept()], createConcept('counterOne', {}));
const counterTwo = muxifyConcepts([createCounterConcept()], createConcept('counterTwo', {}));
const counterThree = muxifyConcepts([createCounterConcept()], createConcept('counterThree', {}));

// Load into muxium with proper deck types
type DECK = {
  counter: Concept<CounterState, CounterQualities>;
  counterOne: Concept<CounterState, CounterQualities, CounterDeck>;
  counterTwo: Concept<CounterState, CounterQualities, CounterDeck>;
  counterThree: Concept<CounterState, CounterQualities, CounterDeck>;
};

const muxium = muxification<DECK>('Multi-Counter System', {
  counter: createCounterConcept(),
  counterOne,
  counterTwo,
  counterThree
});
```

### Higher Order Access Patterns

Muxified concepts enable **higher order deck access**:

```typescript
muxium.plan<DECK>('Counter Management', ({stage}) => [
  stage(({d, dispatch}) => {
    // Outer concept access
    console.log('Base counter:', d.counter.k.count.select());
    
    // Higher order access: outer → inner navigation
    console.log('Counter One (outer):', d.counterOne.k.count.select());
    console.log('Counter One (inner):', d.counterOne.d.counter.k.count.select());
    
    // Dispatch to specific instances
    dispatch(d.counterOne.e.counterAdd()); // Only affects counterOne
    dispatch(d.counterTwo.e.counterAdd()); // Only affects counterTwo
  })
]);
```

---

## 🔄 Test Pattern Migration

### Before
```typescript
const qualities = {experimentDebounceNextActionNode};
const experiment = createExperimentConcept(initialState, qualities) as Concept<typeof initialState, typeof qualities>;

type DECK = {
  experiment: Concept<ExperimentState, typeof qualities>
}
```

### After  
```typescript
const qualities = {experimentDebounceNextActionNode};
+ type Qualities = {experimentDebounceNextActionNode: ExperimentDebounceNextActionNode};
const experiment = createExperimentConcept(initialState, qualities) as Concept<typeof initialState, Qualities>;

type DECK = {
  experiment: Concept<ExperimentState, Qualities>
}
```

---

## 🚀 Enhanced DECK Interface System

### Complete d.e.c.k Access Pattern

The v0.3.2 StratiDECK system provides **Full Isolated Functional Composition**:

```typescript
// Complete type-safe access to concept functionality
muxium.plan<DECK>('My Plan', ({stage, d}) => [
  stage(({dispatch, d, c}) => {
    // d: Access to all loaded concept decks
    const count = d.muxifiedCounter.d.counter.k.count.select();
    
    // e: Entry point for actions (direct concept access)
    const action = d.counter.e.counterAdd(); 
    dispatch(action, {
      throttle: 0
    });
    
    // c: Semaphore comparator functions
    if (d.muxifiedCounter.counterAdd(action)) { /* Evaluates to True as they are the same Quality, but will effect each counter specifically. */ }
    
    // k: Constant selectors (keyed selectors)
    const open = d.muxium.k.open.select();
  })
]);
```

### Benefits of StratiDECK Interface

1. **Type Safety**: Complete TypeScript inference without manual assertions
2. **Performance**: Eliminates string-based concept lookups of traditional action oriented design via an advanced semaphore system that requires Zero Knowledge or handling from the user.
3. **Simplicity**: All in One API allowing for easy access to your concept's parts via e: Actions, c: Comparators, k: Constants (KeyedSelectors).
4. **Consistency**: Muxified pattern for state access and action dispatch
5. **Maintainability**: Self-documenting code to help handle increasing degrees of application complexity.

---

## 📚 Core System Changes

### Muxium Signature Updates
```typescript
// OLD signature
- export function muxification<C extends LoadConcepts, Q = void>(
+ export function muxification<C extends LoadConcepts>(
  name: string,
  deckLoad: LoadConcepts,
  options?: { /* ... */ }
- ): Muxium<C & MuxiumDeck, Q>
+ ): Muxium<C & MuxiumDeck, MaybeEnhancedMuxiumQualities>
```

### Enhanced Stage Planning
New `createStages` helper function:
```typescript
// NEW: Enhanced stage composition with scope encapsulation
export type Planner<Q = void, C = void, S = void> = (uI: HInterface<Q, C, S> & {
  stage: typeof createStage<Q, C, S>
  stageO: typeof stageWaitForOpenThenIterate,
  conclude: typeof stageConclude,
+ staging: typeof createStages<Q, C, S>  // NEW
}) => PartialStaging<Q, C, S>[];
```

Usage:
```typescript
const plan = muxium.plan<DECK>('Enhanced Plan', ({staging, stage, d}) => staging(() => {
  const stageOne = stage(({dispatch, d}) => {
    dispatch(d.counter.e.counterAdd());
  });
  
  const stageTwo = stage(({d}) => {
    expect(d.counter.k.count.select()).toBe(1);
  });
  
  return [stageOne, stageTwo];
}));
```

### Debug Enhancements
New `lastStrategyActionList` property:
```typescript
export type MuxiumState = {
  dialog: string;
  storeDialog: boolean;
  lastStrategy: string;
+ lastStrategyActionList: Array<string>;  // NEW: For debugging
  lastStrategyData: unknown;
  lastStrategyDialog: string;
  generation: number;
}
```

---

## 🔧 Step-by-Step Migration Process

### 1. Update Package Installation
```bash
npm install stratimux@latest
```

### 2. Update All Quality Files
For each quality file:
```typescript
// Add type export
+ export type YourQualityName = Quality<YourState, YourPayload?>;
```

### 3. Update All Concept Files
```typescript
// Replace typeof pattern with explicit interface
- export type YourConceptQualities = typeof yourQualities;
+ export type YourConceptQualities = {
+   qualityOne: QualityOneType,
+   qualityTwo: QualityTwoType,
+   // ... explicit mapping
+ };

// Add deck type export
+ export type YourConceptDeck = {
+   yourConcept: Concept<YourState, YourConceptQualities>,
+ };
// If it is a Muxified Concept with a Deck Union, place such in the designated Slot.
+ export type YourMuxifiedConceptDeck = {
+   yourConcept: Concept<YourMuxifiedState, YourMuxifiedConceptQualities, ThisConceptsDecks>,
+ };
```

### 4. Update Test Files
```typescript
// Add explicit type definitions
const qualities = {yourQuality};
+ type Qualities = {yourQuality: YourQualityType};
const concept = createYourConcept(state, qualities) as Concept<typeof state, Qualities>;
```

### 5. Leverage Muxified Concepts for APIs
```typescript
// Create isolated concept instances for API handling
const apiCounter = muxifyConcepts([createCounterConcept()], createConcept('apiCounter', {}));
const dbCounter = muxifyConcepts([createCounterConcept()], createConcept('dbCounter', {}));

type DECK = {
  counter: Concept<CounterState, CounterQualities>;
  apiCounter: Concept<CounterState, CounterQualities, CounterDeck>;
  dbCounter: Concept<CounterState, CounterQualities, CounterDeck>;
};
```

### 6. Update DECK Usage Patterns
```typescript
// Migrate to consistent DECK interface usage
stage(({d, dispatch}) => {
  // All DECK pattern - recommended
  const count = d.counter.k.count.select();
  dispatch(d.counter.e.counterAdd());
  
  // Access muxified concept functionality
  dispatch(d.apiCounter.e.counterAdd());        // Affects only API counter
  dispatch(d.apiCounter.d.counter.e.counterAdd()); // Inner navigation
});
```

---

## ⚠️ Common Migration Pitfalls

### 1. Inconsistent Concept Naming
```typescript
// ❌ Problem: Mismatched names
const muxium = muxification('App', {
  counterManager: createCounterConcept() // Different names!
});

stage(({d}) => {
  const count = d.counter.k.count.select(); // ❌ Wrong name
});

// ✅ Solution: Consistent naming
const muxium = muxification('App', {
  counter: createCounterConcept()
});

stage(({d}) => {
  const count = d.counter.k.count.select(); // ✅ Correct
});
```

### 2. Missing Deck Type Exports
```typescript
// ❌ Problem: No DECK type export
export const createCounterConcept = () => {
  return createConcept(/* ... */);
};

// ✅ Solution: Always export DECK types
export const createCounterConcept = () => {
  return createConcept(/* ... */);
};

+ export type CounterDeck = {
+   counter: Concept<CounterState, CounterQualities>;
+ };
```

### 3. Mixing DECK and Legacy Patterns
```typescript
// ❌ Problem: Inconsistent patterns
stage(({concepts, d, dispatch}) => {
  const count = d.counter.k.count.select();          // DECK
  const open = selectSlice(concepts, muxiumSelectOpen); // Legacy
});

// ✅ Solution: Use consistent DECK pattern
stage(({d, dispatch}) => {
  const count = d.counter.k.count.select();    // All DECK
  const open = d.muxium.k.open.select();       // All DECK
});
```

---

## 📊 Migration Impact Analysis

### Boilerplate Analysis
- **91 files changed** (+4,189 lines added, -969 removed)
- **Every quality**: +1-2 lines for type exports
- **Every concept**: Complete type interface rewrite required
- **Every test**: Explicit type definitions required
- **Core system**: Major signature changes throughout

### Why This Change Was Necessary
> *"Even though the abstraction adds more boilerplate, it becomes necessary regardless after a concept acquires enough qualities - TypeScript starts to break down in its typings."*

The explicit type system ensures:
1. **Scale Requirement**: Complex concepts with many qualities broke TypeScript
2. **Type Safety**: Explicit typing ensures reliability at enterprise scale  
3. **Development Experience**: Better IDE support and error catching
4. **Framework Completion**: Enables the full DECK interface system

---

## 🎉 Benefits of Migration

### 1. Enhanced Type Safety
Complete TypeScript inference without type assertion hacks.

### 2. Better Performance
Elimination of string-based lookups and concept name matching.

### 3. Simplified API Design
No need to import selectors or manage concept names manually.

### 4. Muxified Concept Isolation
Create truly isolated concept instances for different APIs, databases, or services.

### 5. Higher Order Composition
Navigate through muxified conceptual composition with full type safety.

### 6. Framework Completion
Stratimux now provides **Full Isolated Functional Composition of Concepts** - the system is architecturally complete.

---

## 🔗 Resources

- **Repository**: [https://github.com/Phuire-Research/Stratimux](https://github.com/Phuire-Research/Stratimux)
- **NPM Package**: [stratimux](https://www.npmjs.com/package/stratimux)
- **Documentation**: [STRATIMUX-REFERENCE.md](https://github.com/Phuire-Research/Stratimux/blob/main/STRATIMUX-REFERENCE.md)

---

## ✅ Migration Checklist

- [ ] Update all imports from the old package name
- [ ] Add explicit type exports to all quality files
- [ ] Rewrite concept quality type interfaces using explicit mapping
- [ ] Export DECK types for all concepts
- [ ] Update test files with explicit type definitions
- [ ] Migrate to consistent DECK interface usage patterns
- [ ] Implement muxified concepts for API handling where appropriate
- [ ] Test all functionality with new type system
- [ ] Update any external documentation or examples

---

*The v0.3.2 release represents the completion of Stratimux's core architecture. While requiring more explicit boilerplate, this release ensures type safety and functionality at enterprise scale, making Stratimux a complete solution for complex asynchronous graph programming needs.*
