# Stratimux Reference Guide

## Introduction

Stratimux is an asynchronous graph programming framework that implements a Muxified Turing Machine. This reference guide is **specifically designed for AI agents** and provides a comprehensive overview of the core concepts, patterns, and functionality based on analyzing the codebase and test files.

**Version Coverage**: This guide covers Stratimux v0.3.2 (Stratideck) with complete type system overhaul and DECK interface system.

**For Agents**: This reference provides drop-in code patterns, type definitions, and implementation examples for effective Stratimux development without requiring deep framework knowledge.

## Version 0.3.2 Key Changes (Stratideck)

### Critical Breaking Changes

**Package Name Change**: `@phuire/stratimux` → `stratimux`

**Quality Type System Overhaul**: All qualities now require explicit type definitions due to TypeScript limitations at scale.

```typescript
// OLD Pattern (No longer works with complex concepts)
const qualities = { counterAdd, counterSubtract };
export type CounterQualities = typeof qualities;

// NEW Pattern (Required for v0.3.2+)
export type CounterAdd = Quality<CounterState>;
export type CounterSubtract = Quality<CounterState>;
export type CounterQualities = {
  counterAdd: CounterAdd,
  counterSubtract: CounterSubtract,
};
```

### New Features

#### 1. Enhanced MuxiumState (v0.3.01)
```typescript
export type MuxiumState = {
  dialog: string;
  lastStrategy: string;
  lastStrategyActionList: Array<string>; // NEW: Debug enhancement
  lastStrategyData: unknown;
  generation: number;
}
```

#### 2. createStages Helper Function (v0.3.11)
```typescript
// NEW: Scoped stage composition helper
const plan = muxium.plan<CounterDeck>('createStages Example', ({staging, stage, stageO, d__}) => {
  
  // Traditional approach without createStages
  const manualStages = [
    stageO(() => d__.muxium.e.muxiumKick()),
    stage(({dispatch, d}) => {
      dispatch(d.counter.e.counterAdd(), {iterateStage: true});
    }),
    stage(({concepts, dispatch, d}) => {
      const count = selectSlice(concepts, counterSelectCount);
      if (count === 5) {
        dispatch(d.counter.e.counterSetCount({newCount: 0}), {iterateStage: true});
      }
    })
  ];
  
  // NEW: Using createStages for scoped composition
  const composedStages = staging(() => {
    const initStage = stageO(() => d__.muxium.e.muxiumKick());
    
    const countStage = stage(({dispatch, d}) => {
      dispatch(d.counter.e.counterAdd(), {iterateStage: true});
    });
    
    const resetStage = stage(({concepts, dispatch, d}) => {
      const count = selectSlice(concepts, counterSelectCount);
      if (count === 5) {
        dispatch(d.counter.e.counterSetCount({newCount: 0}), {iterateStage: true});
      }
    });
    
    return [initStage, countStage, resetStage];
  });
  
  return composedStages; // or manualStages - both work identically
});
```

**Benefits of createStages (`staging`):**
- **Scoped composition**: Groups related stages logically  
- **Type safety**: Full TypeScript support within the callback
- **Reusability**: Stage groups can be extracted and reused
- **Readability**: Complex plans become more maintainable

### Migration Required

**All Quality Files Must Export Types**:
```typescript
// Every quality file now requires:
export type QualityName = Quality<StateType, PayloadType?>;
```

**All Concept Files Must Use Explicit Type Mapping**:
```typescript
// Required pattern for all concepts
export type ConceptQualities = {
  qualityOne: QualityOneType,
  qualityTwo: QualityTwoType,
  // ... explicit mapping required
};
```

## Migration Guide for v0.3.2

### 1. Package Installation

```bash
# Remove old package
npm uninstall @phuire/stratimux

# Install new package  
npm install stratimux
```

### 2. Update Import Statements

```typescript
// OLD
import { muxification } from '@phuire/stratimux';

// NEW  
import { muxification } from 'stratimux';
```

### 3. Add Quality Type Exports

For every quality file, add explicit type exports:

```typescript
// OLD (quality file - no type exports required)
export const counterAdd = createQualityCard<CounterState>({
  type: 'Counter Add',
  reducer: (state) => ({ count: state.count + 1 })
});

// NEW (quality file - type export required)
export type CounterAdd = Quality<CounterState>;
export const counterAdd = createQualityCard<CounterState>({
  type: 'Counter Add',
  reducer: (state) => ({ count: state.count + 1 })
});
```

### 4. Update Concept Quality Type Definitions

```typescript
// OLD (implicit typing)
const qualities = { counterAdd, counterSubtract };
export type CounterQualities = typeof qualities;

// NEW (explicit mapping required)
export type CounterQualities = {
  counterAdd: CounterAdd,
  counterSubtract: CounterSubtract,
};
```

### 5. Leverage New createStages Helper

```typescript
// OLD (direct array)
const plan = muxium.plan('My Plan', ({stage}) => [
  stage(() => { /* logic */ }),
  stage(() => { /* logic */ })
]);

// NEW (using staging for better composition)
const plan = muxium.plan('My Plan', ({staging, stage}) => 
  staging(() => {
    const stage1 = stage(() => { /* logic */ });
    const stage2 = stage(() => { /* logic */ });
    return [stage1, stage2];
  })
);
```

### 6. Update Complex Concepts

For concepts with many qualities, ensure all types are explicitly defined:

```typescript
// NEW pattern for complex concepts
export type MyConceptAdd = Quality<MyState>;
export type MyConceptRemove = Quality<MyState>;  
export type MyConceptUpdate = Quality<MyState, UpdatePayload>;
export type MyConceptQuery = Quality<MyState, QueryPayload>;

export type MyConceptQualities = {
  myConceptAdd: MyConceptAdd,
  myConceptRemove: MyConceptRemove,
  myConceptUpdate: MyConceptUpdate,
  myConceptQuery: MyConceptQuery,
};
```

### 7. Enhanced MuxiumState Usage

Take advantage of the new `lastStrategyActionList` property:

```typescript
// NEW debugging capability
stage(({concepts}) => {
  const muxiumState = getMuxiumState(concepts);
  
  // Access new debugging property
  console.log('Last strategy actions:', muxiumState.lastStrategyActionList);
  console.log('Strategy execution trace:', muxiumState.lastStrategyActionList.join(' → '));
});
```

## Core Concepts

### Muxium

A Muxium is the governing concept that contains a set of concepts that formalize its functionality.

```typescript
// Creating a Debugging Muxium
const muxium = muxification('Mock Muxium', {
  counter: createCounterConcept(), 
  chain: createChainConcept()
}, {logging: true, storeDialog: true});
```

```typescript
// Creating a Production Muxium
const muxium = muxification('Production Deck', {
  counter: createCounterConcept(),
  chain: createChainConcept()
}, {logging: false, storeDialog: false});
```

Key properties:
- **Name**: A unique identifier for the Muxium
- **Concepts**: A collection of concepts that make up the Muxium's functionality
- **Options**: Configuration options like logging and storeDialog

### Concept

A Concept is a fundamental building block composed of state, qualities, principles, and mode.

```typescript
// Modern Counter Concept definition (v0.3.2+)
export type CounterState = {
  count: number
}

export const counterName = 'counter';

const initialCounterState: CounterState = {
  count: 0
};

// NEW: Explicit quality type definitions required
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

const counterQualities = {
  counterAdd,
  counterSubtract,
  counterSetCount,
  counterMultiply
};

export const createCounterConcept = () => {
  return createConcept<CounterState, CounterQualities>(
    counterName,
    initialCounterState,
    counterQualities
  );
};

// Modern Deck type definition
export type CounterDeck = {
  counter: Concept<CounterState, CounterQualities>,
};
```

Components of a Concept:
- **Name**: A unique identifier
- **State**: The data structure maintained by the concept
- **Qualities**: Functions that can update state and perform side-effects
- **Principles**: The initialization/setup functions for the concept

### Quality

Qualities define actions that can be performed on a concept. They contain:

1. A type identifier
2. A reducer function to update state
3. An optional method creator for side effects
4. Optional keyed selectors

#### Quality Without Payload

```typescript
// Real example from counter concept (v0.3.2+)
// REQUIRED: Export the quality type
export type CounterAdd = Quality<CounterState>;

export const counterAdd = createQualityCard<CounterState>({
  type: 'Counter Add',
  reducer: (state) => {
    return {
      count: state.count + 1
    };
  },
  methodCreator: defaultMethodCreator,
  keyedSelectors: [counterSelectCount]
});
```

#### Quality Without Payload (No Keyed Selectors)

```typescript
// Simple quality that doesn't need DECK access (v0.3.2+)
// REQUIRED: Export the quality type (even for simple qualities)
export type MuxiumKick = Quality;

export const muxiumKick = createQualityCard({
  type: 'Kick Muxium',
  reducer: defaultReducer,
  methodCreator: defaultMethodCreator
});
```

#### Quality With Payload

```typescript
// REQUIRED: Define the payload type
export type CounterSetCountPayload = {
  newCount: number
}

// REQUIRED: Export the quality type (v0.3.2+)
export type CounterSetCount = Quality<CounterState, CounterSetCountPayload>;

export const counterSetCount = createQualityCardWithPayload<CounterState, CounterSetCountPayload>({
  type: 'Counter set Count',
  reducer: (state, {payload}) => {
    const {newCount} = payload;
    return {
      count: newCount
    };
  },
  methodCreator: defaultMethodCreator,
  keyedSelectors: [counterSelectCount]
});
```

Key differences:
- `createQualityCard` vs `createQualityCardWithPayload`
- Payload-based qualities receive a payload parameter in the reducer
- The payload type must be defined separately

### Strategy

Strategies are composed action sequences that allow for error correction and complex workflows.

```typescript
// Strategy from the counter concept
export function countingStrategy<T extends Deck<CounterDeck>>(deck: Partial<T>): ActionStrategy | undefined {
  if (deck.counter) {
    const {
      counterSubtract,
      counterAdd
    } = deck.counter.e;

    const stepFive = createActionNode(counterSubtract(), {
      successNotes: {
        preposition: 'and finally',
        denoter: 'One.',
      },
    });
    const stepFour = createActionNode(counterAdd(), {
      successNode: stepFive,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });
    const stepThree = createActionNode(counterAdd(), {
      successNode: stepFour,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });
    const stepTwo = createActionNode(counterSubtract(), {
      successNode: stepThree,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });
    const stepOne = createActionNode(counterAdd(), {
      successNode: stepTwo,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });

    const params: ActionStrategyParameters = {
      topic: countingTopic,
      initialNode: stepOne,
    };

    return createStrategy(params);
  } else {
    return undefined;
  }
}
```

Key components:
- **Action Nodes**: Individual steps in the strategy
- **Success/Failure Paths**: Each node can define what hdeckens next on success or failure
- **Topic**: A unique identifier for the strategy
- **Initial Node**: The starting point of the strategy

### Stage Planner

Stage Planners divide application functionality into discrete stages and prevent action overflows. **Version 0.3.2** introduces the `createStages` helper (`staging`) for improved stage composition.

```typescript
// NEW v0.3.2 Pattern: Using createStages helper (staging)
const plan = muxium.plan<CounterDeck>('Stage Planner Example', ({staging, stage, stageO, e__}) => 
  staging(() => {
    // Stage composition within a scoped callback
    const kickStage = stageO(() => e__.muxiumKick());
    
    const incrementStage = stage(({concepts, dispatch, e}) => {
      if (selectSlice(concepts, muxiumSelectOpen)) {
        dispatch(e.muxiumKick(), {iterateStage: true});
      }
    }, {beat: 105});
    
    const addStage = stage(({dispatch, d}) => {
      dispatch(d.counter.e.counterAdd(), {iterateStage: true});
    }, {beat: 105});
    
    const completeStage = stage(({concepts, dispatch, d}) => {
      const state = selectState<CounterState>(concepts, counterName);
      if (state?.count === 9) {
        dispatch(e__.muxiumPreClose({exit: false}), {iterateStage: true});
        plan.conclude();
      } else {
        dispatch(d.counter.e.counterAdd(), {throttle: 1});
      }
    }, {beat: 105});
    
    return [kickStage, incrementStage, addStage, completeStage];
  })
);

// LEGACY Pattern: Direct stage array (still supported)
const legacyPlan = muxium.plan<CounterDeck>('Legacy Pattern', ({stage, stageO, e__}) => [
  stageO(() => e__.muxiumKick()),
  stage(({concepts, dispatch, e}) => {
    // Same logic as above
  }, {beat: 105}),
  // ... more stages
]);
```

**Key Stage Planner Features (v0.3.2):**

- **`staging` (createStages)**: NEW - Scoped stage composition helper
- **`stage`**: Create individual stages with options (beat, priority, selectors)
- **`stageO`**: Special stage that waits for muxium to be open, then iterates
- **`conclude`**: Helper to create a stage that concludes the plan
- **Stages**: Ordered sequence of operations
- **Stage Options**: Configure behavior like beat (throttling/debouncing), priority, selectors
- **Iterate Stage**: Move to the next stage via `{iterateStage: true}`
- **Conclude**: End the plan execution via `plan.conclude()`

### Action Controller

Action Controllers handle asynchronous execution of actions. They are used in method creators to perform operations that need to complete asynchronously.

```typescript
// Real example from experiment concept - throttle async method
export const experimentThrottleAsyncIterateIdThenReceiveInMethod = createQualityCardWithPayload<ExperimentState, Data>({
  type: 'Action Debounce Experiment asynchronously iterate ID then receive in Method via State',
  reducer: (state: ExperimentState) => {
    return {
      id: state.id + 1
    };
  },
  methodCreator: () => createAsyncMethodThrottleWithState(({controller, action, state}) => {
    setTimeout(() => {
      const payload = action.payload;
      if (action.strategy) {
        const data = strategyData_muxifyData<Data>(action.strategy, {
          id: state.id,
          setId: payload.setId
        });
        const strategy = strategySuccess(action.strategy, data);
        controller.fire(strategy);
      }
      controller.fire(action);
    }, 50);
  }, 500)
});
```

Key functions:
- **Subscribe**: Listen for action completion
- **Fire**: Complete an action and move to next step
- **Expire**: Mark an action as failed if timeout is reached

## DECK Interface System

The DECK (Direct Entry with Constant Keys) interface provides type-safe access to concept functionality.

```typescript
// In a stage planner or principle
stage(({concepts, dispatch, d, e, k}) => {
  // d: Access to all concept entry points via deck
  d.counter.e.counterAdd();
  
  // e: Direct entry to current concept's actions
  e.conceptAction();
  
  // k: Constant selectors for state access (current concept only)
  const count = k.count(concepts);
  
  // c: Comparators (not shown in example)
  // Used for stringless comparison
});
```

Components:
- **d (deck)**: Access to all concepts' functionality
- **e (entry)**: Direct actions for the current concept
- **c (comparators)**: Stringless comparison for action types
- **k (keyed selectors)**: State selectors for current concept

### State Access Patterns

Stratimux provides multiple ways to access state, with the DECK interface offering the most direct deckroach:

#### 1. DECK Interface - Direct Keyed Selector Access (Recommended)

```typescript
stage(({d}) => {
  // Direct access to state via keyed selectors
  const count = d.counter.k.count.select();
  expect(count).toBe(1);
});
```

#### 2. Traditional State Selection (Legacy Pattern)

```typescript
stage(({concepts}) => {
  // Using selectState with concept name
  const counter = selectState<CounterState>(concepts, counterName);
  expect(counter?.count).toBe(1);
  
  // Using selectSlice with keyed selector
  const count = selectSlice(concepts, counterSelectCount);
  expect(count).toBe(1);
});
```

#### 3. Select Object Pattern

```typescript
import { select } from '../model/selector';

stage(({concepts}) => {
  // Using the select object
  const counter = select.state<CounterState>(concepts, counterName);
  const count = select.slice<number>(concepts, counterSelectCount);
  expect(count).toBe(1);
});
```

**Best Practice**: Use the DECK interface (`d.counter.k.count.select()`) for direct state access as it provides:
- Type safety
- Cleaner syntax
- Direct access without passing concepts
- Better performance by avoiding concept lookups

## Advanced Concept Patterns

### Concept Isolation and Individual Instances

Stratimux supports creating isolated instances of the same concept through the `muxifyConcepts` function. This enables multiple independent instances of a concept to coexist with separate state management.

#### Creating Isolated Concept Instances

```typescript
import { muxifyConcepts } from '../model/concept/conceptAdvanced';
import { createConcept } from '../model/concept/concept';
import { createCounterConcept } from '../concepts/counter/counter.concept';

// Create multiple isolated counter instances
const counterOne = muxifyConcepts([createCounterConcept()], createConcept('counterOne', {}));
const counterTwo = muxifyConcepts([createCounterConcept()], createConcept('counterTwo', {}));
const counterThree = muxifyConcepts([createCounterConcept()], createConcept('counterThree', {}));

// Load them into a muxium with a base counter
const muxium = muxification('Multi-Counter System', {
  counter: createCounterConcept(),        // Base counter
  counterOne,                             // Isolated instance 1
  counterTwo,                             // Isolated instance 2
  counterThree                            // Isolated instance 3
}, {logging: true, storeDialog: true});
```

#### Benefits of Concept Isolation

1. **Independent State**: Each isolated instance maintains its own state
2. **Compositional Design**: Concepts can be composed without interference
3. **Modular Architecture**: Easy to add/remove instances at runtime
4. **Type Safety**: Full TypeScript support for each instance

### DECK Access Patterns: Outer Plan vs Inner Plan

The DECK interface provides different access patterns depending on whether you're working with outer plans (muxium-level) or inner plans (concept-level). Understanding these patterns is crucial for effective state management.

#### Higher Order DECK Access

When using muxified concepts, the DECK interface creates a higher order structure that allows access to both the outer concept and its inner muxified parts:

```typescript
type DECK = {
  counter: Concept<CounterState, CounterQualities>;
  counterOne: Concept<CounterState, CounterQualities, CounterDeck>;
  counterTwo: Concept<CounterState, CounterQualities>;
  counterThree: Concept<CounterState, CounterQualities>;
};

const plan = muxium.plan<DECK>('Multi-Counter Management', ({stage}) => [
  stage(({d, dispatch}) => {
    // Outer Plan Access: Direct concept access
    console.log('Base counter:', d.counter.k.count.select());
    
    // Higher Order Access: Outer concept with inner deck navigation
    console.log('Counter One (outer):', d.counterOne.k.count.select());
    console.log('Counter One (inner):', d.counterOne.d.counter.k.count.select());
    
    // Dispatch to specific instances
    dispatch(d.counter.e.counterAdd(), { iterateStage: true });
    dispatch(d.counterOne.e.counterAdd(), { iterateStage: true });
  }),
  
  stage(({d}) => {
    // Verify isolated state changes
    expect(d.counter.k.count.select()).toBe(1);
    expect(d.counterOne.k.count.select()).toBe(0);     // Outer state unchanged
    expect(d.counterOne.d.counter.k.count.select()).toBe(1); // Inner state changed
  })
]);
```

#### Access Pattern Comparison

| Pattern | Syntax | Use Case |
|---------|--------|----------|
| **Outer Plan Access** | `d.counter.k.count.select()` | Direct concept state access |
| **Inner Plan Access** | `d.counterOne.d.counter.k.count.select()` | Muxified concept's inner state |
| **Action Dispatch** | `d.counter.e.counterAdd()` | Dispatching to base concept |
| **Isolated Dispatch** | `d.counterOne.e.counterAdd()` | Dispatching to muxified concept |

### MuX Type Parameter in createConcept

The `createConcept` function includes a generic MuX type parameter that enables exact conceptual composition and muxified record tracking:

```typescript
export function createConcept<S extends Record<string, unknown>, Q = void, MuX = void>(
  name: string,
  state: S,
  qualities?: Q,
  principles?: PrincipleFunction<Q, any, S>[],
  mode?: Mode[],
  meta?: Record<string,unknown>,
): Concept<S, Q, MuX>
```

#### MuX Type Parameter Benefits

1. **Exact Composition**: Tracks the exact muxified structure at compile time
2. **Type Safety**: Ensures proper DECK interface types for nested access
3. **Intellisense Support**: Full IDE support for higher order navigation
4. **Runtime Validation**: Enables proper muxified record management

#### Using MuX for Complex Compositions

```typescript
type CounterDeck = {
  counter: Concept<CounterState, CounterQualities>;
};

// Creating a muxified concept with exact typing
const complexCounter = muxifyConcepts(
  [createCounterConcept()], 
  createConcept<ComplexState, ComplexQualities, CounterDeck>('complexCounter', initialState)
);

// The MuX parameter enables this higher order access:
// d.complexCounter.d.counter.k.count.select()
```

### Muxified Record System

Concepts maintain a `muxifiedRecord` that tracks their compositional structure and enables agnostic quality selection:

```typescript
export type Muxified = {
  stateMap: string[];
  actionMap: string[];
};

export type Concept<S, Q, MuX = void> = {
  name: string;
  muxifiedRecord: Record<string, Muxified>;
  // ...other properties
};
```

#### How Concepts Reveal Their Parts

When concepts are muxified, they automatically track:

1. **State Map**: Which state properties came from which source concept
2. **Action Map**: Which actions originated from which source concept
3. **Higher Order Structure**: How nested concepts relate to each other

```typescript
// Example of muxified record structure
const muxifiedRecord = {
  'counter': {
    stateMap: ['count'],
    actionMap: ['counterAdd', 'counterSubtract']
  },
  'experiment': {
    stateMap: ['data', 'id'],
    actionMap: ['experimentAsyncIterateId', 'experimentDebounce']
  }
};
```

#### Agnostic Quality Selection

The muxified record enables runtime discovery of available qualities:

```typescript
// Dynamically access muxified parts
Object.keys(concept.muxifiedRecord).forEach(sourceConcept => {
  const muxified = concept.muxifiedRecord[sourceConcept];
  
  // Access state properties agnostically
  muxified.stateMap.forEach(stateKey => {
    console.log(`State ${stateKey} from ${sourceConcept}:`, concept.state[stateKey]);
  });
  
  // Access actions agnostically
  muxified.actionMap.forEach(actionKey => {
    console.log(`Action ${actionKey} available from ${sourceConcept}`);
  });
});
```

### Muxium as System Control

The Muxium concept serves as the system control layer and follows a special rule: **it never gets muxified with other concepts**. This ensures:

1. **System Integrity**: Core muxium functionality remains unaltered
2. **Predictable Behavior**: System operations are always available at known locations
3. **Isolation Guarantee**: User concepts cannot interfere with system operations
4. **Control Flow**: The muxium maintains exclusive control over concept lifecycle

```typescript
// The muxium is always accessible as:
d.muxium.e.muxiumAction()  // System control actions
d.muxium.k.selector.select()  // System state selectors

// It never deckears in muxified records of other concepts
concept.muxifiedRecord['muxium']  // This will never exist
```

This design ensures that Stratimux maintains a clear separation between user-defined concepts and system-level operations, providing both flexibility and stability.

## Migration Guide: Legacy to DECK Interface

The DECK Interface System represents the modern deckroach to accessing state and dispatching actions in Stratimux. This migration guide helps you transition from legacy patterns to the streamlined DECK interface.

### Why Migrate to DECK Interface?

The DECK interface provides:
- **Type Safety**: Direct TypeScript inference without manual type assertions
- **Performance**: Eliminates string-based concept lookups and name matching
- **Simplicity**: No need to import selectors or manage concept names
- **Consistency**: Muxified pattern for both state access and action dispatch
- **Maintainability**: Self-documenting code with clear property access

### Common Migration Pitfalls and Solutions

#### Pitfall 1: Understanding When keyedSelectors Are Needed
```typescript
// ❌ Problem: DECK interface returns undefined when you need keyed selectors
export const myQuality = createQualityCard<MyState>({
  type: 'My Quality',
  reducer: (state) => ({ ...state, processed: true })
  // No keyedSelectors - this is fine for simple qualities
});

// ✅ Solution: Add keyedSelectors when you need DECK access or ownership control
export const myQuality = createQualityCard<MyState>({
  type: 'My Quality',
  reducer: (state) => ({ ...state, processed: true }),
  keyedSelectors: [
    mySelectProcessed,    // Only include selectors you actually use
    mySelectValue,        // via DECK interface or need for ownership
    mySelectStatus
  ]
});

// ✅ Also valid: Simple quality without keyedSelectors
export const simpleQuality = createQualityCard<MyState>({
  type: 'Simple Quality',
  reducer: (state) => ({ ...state, count: state.count + 1 })
  // No keyedSelectors needed if not using DECK or ownership
});
```

#### Pitfall 2: Inconsistent Concept Naming
```typescript
// ❌ Problem: Concept name doesn't match DECK property
const muxium = muxification('Deck', {
  counterManager: createCounterConcept() // Different names!
});

stage(({d}) => {
  const count = d.counter.k.count.select(); // ❌ Wrong concept name
});

// ✅ Solution: Keep consistent naming
const muxium = muxification('Deck', {
  counter: createCounterConcept()
});

stage(({d}) => {
  const count = d.counter.k.count.select(); // ✅ Correct
});
```

#### Pitfall 3: Mixing DECK and Legacy in Same Function
```typescript
// ❌ Problem: Inconsistent patterns cause confusion
stage(({concepts, d, dispatch}) => {
  const count = d.counter.k.count.select();          // DECK
  const open = selectSlice(concepts, muxiumSelectOpen); // Legacy
  
  dispatch(counterAdd.actionCreator());               // Legacy
  dispatch(d.counter.e.counterSubtract());           // DECK
});

// ✅ Solution: Be consistent within functions
stage(({d, dispatch}) => {
  const count = d.counter.k.count.select();    // All DECK
  const open = d.muxium.k.open.select();       // All DECK
  
  dispatch(d.counter.e.counterAdd());          // All DECK
  dispatch(d.counter.e.counterSubtract());     // All DECK
});
```

#### Pitfall 4: Not Updating Type Definitions
```typescript
// ❌ Problem: Missing DECK type exports
export const createCounterConcept = () => {
  return createConcept(/* ... */);
};

// ✅ Solution: Always export DECK types
export const createCounterConcept = () => {
  return createConcept(/* ... */);
};

export type CounterDeck = {
  counter: Concept<CounterState, typeof counterQualities>;
};
```

#### Pitfall 5: Over-Migrating Complex Selectors
```typescript
// ❌ Problem: Force-fitting complex selectors into DECK
stage(({d}) => {
  // This won't work for complex nested selections
  const complexValue = d.counter.k.deepNestedArray[0].property.select(); // ❌
});

// ✅ Solution: Keep complex selectors as legacy when appropriate
stage(({concepts, d}) => {
  // Simple values use DECK
  const count = d.counter.k.count.select();
  
  // Complex selections use advanced selectors
  const complexSelector = createMuxifiedKeyedSelector(
    concepts, semaphore, 'deep.nested.array', [0, 'property']
  );
  const complexValue = selectSlice(concepts, complexSelector);
});
```

#### Pitfall 6: Ignoring Null Safety Changes
```typescript
// ❌ Problem: Not updating null checks
stage(({d}) => {
  const state = d.counter.k.state.select();
  
  // Old pattern - unnecessary with DECK
  if (state?.count && state?.ready) { // ❌ Redundant checks
    // process
  }
});

// ✅ Solution: Trust DECK interface type safety
stage(({d}) => {
  const count = d.counter.k.count.select();
  const ready = d.muxium.k.open.select();
  
  // Direct checks - DECK handles null safety
  if (count && ready) { // ✅ Clean and safe
    // process
  }
});
```

## Advanced Production Patterns: Ownership System

The Ownership System in Stratimux is an advanced concurrency control mechanism designed for production environments where you need to coordinate complex operations across multiple strategies. **This system is not required for most decklications** and should only be implemented when you have specific needs for state locking and coordination.

### When to Use the Ownership System

The ownership system is particularly valuable during the **refining stage of a Deck in production** when you need to:

#### 1. Coordinate Complex Multi-Step Operations
```typescript
// Use ownership when you have operations that must be atomic
// Example: Financial transaction processing

export const transferFundsStrategy = createActionStrategy({
  topic: 'Transfer Funds Between Accounts',
  initialNode: createActionNode(
    // This action needs exclusive access to both accounts
    transferInitiate({ fromAccount, toAccount, amount }),
    {
      keyedSelectors: [
        accountSelectBalance(fromAccount),
        accountSelectBalance(toAccount)
      ],
      successNode: createActionNode(
        transferCommit(),
        {
          keyedSelectors: [
            accountSelectBalance(fromAccount),
            accountSelectBalance(toAccount)
          ]
        }
      )
    }
  )
});
```

#### 2. Prevent Race Conditions in Critical Operations
```typescript
// When multiple strategies might modify the same state simultaneously
export const inventoryManagementQuality = createQualityCard<InventoryState>({
  type: 'Update Inventory Level',
  reducer: (state, action) => ({
    ...state,
    inventory: updateInventoryLevel(state.inventory, action.payload)
  }),
  // Only add keyedSelectors when you need ownership control
  keyedSelectors: [
    inventorySelectLevel,
    inventorySelectReserved
  ]
});
```

#### 3. Cross-Service Coordination
```typescript
// When actions need to coordinate across different services/processes
export const distributedTaskQuality = createQualityCard<TaskState>({
  type: 'Coordinate Distributed Task',
  reducer: (state, action) => processDistributedTask(state, action),
  keyedSelectors: [
    taskSelectStatus,
    taskSelectLockId
  ], // Ownership needed for distributed coordination
  method: createMethodWithAgreement(({ action }) => {
    // This task might move off-premise to other services
    return moveTaskOffPremise(action.payload);
  }, 30000) // Extended timeout for distributed operations
});
```

### When NOT to Use the Ownership System

**Do not use ownership for:**

#### 1. Simple State Updates
```typescript
// ❌ Don't add keyedSelectors for simple operations
export const incrementCounterQuality = createQualityCard<CounterState>({
  type: 'Increment Counter',
  reducer: (state) => ({ ...state, count: state.count + 1 })
  // No keyedSelectors needed - simple atomic operation
});
```

#### 2. Read-Only Operations
```typescript
// ❌ Don't use ownership for pure read operations
export const displayUserInfoQuality = createQualityCard<UserState>({
  type: 'Display User Info',
  reducer: (state, action) => ({ ...state, lastDisplayed: Date.now() })
  // No keyedSelectors needed - just updating display timestamp
});
```

#### 3. Independent Operations
```typescript
// ❌ Don't use ownership when operations don't conflict
export const logEventQuality = createQualityCard<LogState>({
  type: 'Log Event',
  reducer: (state, action) => ({
    ...state,
    events: [...state.events, action.payload]
  })
  // No keyedSelectors needed - deckending to log is safe
});
```

### Setting Up the Ownership System

Only add the ownership concept when you have identified specific needs:

```typescript
// 1. Add ownership to your deck only when needed
const productionDeck = {
  muxium: createMuxiumConcept(),
  ownership: createOwnershipConcept(), // Only add when required
  accounts: createAccountsConcept(),
  transactions: createTransactionsConcept()
};

// 2. Initialize ownership mode in production
const muxium = muxification('ProductionDeck', productionDeck, {
  logging: false, // Disable in production
  storeDialog: false
});

// The ownership system will automatically handle coordination
```

### Production Ownership Patterns

#### Pattern 1: Gradual Ownership Adoption
```typescript
// Start without ownership, add only when needed
export const userAccountQuality = createQualityCard<UserState>({
  type: 'Update User Account',
  reducer: (state, action) => updateUserAccount(state, action),
  // Add keyedSelectors only when you identify race conditions
  ...(process.env.NODE_ENV === 'production' && needsOwnership ? {
    keyedSelectors: [userSelectBalance, userSelectStatus]
  } : {})
});
```

#### Pattern 2: Ownership for Critical Paths Only
```typescript
// Use ownership selectively for critical business operations
const isFinancialOperation = (qualityType: string) => 
  ['transfer', 'payment', 'refund'].some(op => qualityType.includes(op));

export const createFinancialQuality = <T>(config: QualityConfig<T>) => {
  return createQualityCard({
    ...config,
    // Only add ownership to financial operations
    ...(isFinancialOperation(config.type) ? {
      keyedSelectors: config.keyedSelectors
    } : {})
  });
};
```

#### Pattern 3: Feature Flag Ownership
```typescript
// Use feature flags to control ownership system usage
const ENABLE_OWNERSHIP = process.env.OWNERSHIP_ENABLED === 'true';

export const createProductionDeck = () => ({
  muxium: createMuxiumConcept(),
  ...(ENABLE_OWNERSHIP ? { ownership: createOwnershipConcept() } : {}),
  // ... other concepts
});
```

### Ownership System Best Practices

#### 1. Minimal Ownership Scope
```typescript
// ✅ Only lock what you need to lock
export const updateOrderQuality = createQualityCard<OrderState>({
  type: 'Update Order Status',
  reducer: (state, action) => updateOrderStatus(state, action),
  keyedSelectors: [
    orderSelectStatus, // Only lock status
    // Don't lock: orderSelectHistory, orderSelectMetadata (not critical)
  ]
});
```

## 2. Deckropriate Timeout Values
```typescript
// ✅ Set realistic timeouts for your operations
stage(({dispatch, d}) => {
  dispatch(d.orders.e.processOrder(orderData), {
    agreement: 10000 // 10 seconds for order processing
  });
});

// ❌ Don't use default timeout for long operations
stage(({dispatch, d}) => {
  dispatch(d.reports.e.generateMonthlyReport(params), {
    agreement: 300000 // 5 minutes for complex report generation
  });
});
```

#### 3. Graceful Failure Handling
```typescript
// ✅ Handle ownership conflicts gracefully
export const handleOwnershipConflictStrategy = createActionStrategy({
  topic: 'Handle Ownership Conflict',
  initialNode: createActionNode(
    processOrder(),
    {
      keyedSelectors: [orderSelectStatus],
      failureNode: createActionNode(
        retryLater(),
        {
          successNode: createActionNode(notifyUser())
        }
      )
    }
  )
});
```

### Monitoring Ownership in Production

```typescript
// Monitor ownership health and performance
export const ownershipMonitoringPrinciple: PrincipleFunction = ({
  observer,
  plan
}) => {
  plan('Ownership Monitoring', ({stage}) => [
    stage(({concepts}) => {
      const ownership = selectState<OwnershipState>(concepts, ownershipName);
      if (ownership) {
        // Monitor pending actions queue
        if (ownership.pendingActions.length > 10) {
          console.warn('High ownership queue length:', ownership.pendingActions.length);
        }
        
        // Monitor ledger size
        if (ownership.ownershipLedger.size > 100) {
          console.warn('Large ownership ledger:', ownership.ownershipLedger.size);
        }
      }
    })
  ]);
};
```

### Migration to Ownership

When you identify the need for ownership in an existing system:

```typescript
// 1. Identify critical operations first
const criticalOperations = identifyCriticalOperations(existingQualities);

// 2. Add keyedSelectors only to critical qualities
const migrateToOwnership = (quality: QualityCard<any>) => {
  if (criticalOperations.includes(quality.type)) {
    return {
      ...quality,
      keyedSelectors: generateKeyedSelectors(quality)
    };
  }
  return quality; // Leave non-critical qualities unchanged
};

// 3. Test thoroughly before production deployment
```

## Dynamic Concept Management

Stratimux supports dynamic concept management, allowing you to add and remove concepts from a running muxium at runtime. This powerful feature enables building systems that can adapt their capabilities based on changing requirements.

### Dynamic Muxium Configuration

```typescript
// Create a muxium with dynamic enabled
const muxium = muxification('Dynamic System', {}, {
  logging: true, 
  storeDialog: true, 
  dynamic: true  // Enable dynamic concept management
});
```

### Adding Concepts at Runtime

```typescript
import { addConceptsToAddQueThenBlockStrategy } from '../concepts/muxium/strategies/addConcept.strategy';
import { strategyBegin } from '../model/action/strategy/actionStrategyConsumers';

// Real example from addConcepts.test.ts
const plan = muxium.plan('Add Concepts Stage', ({stage, stageO, e__}) => [
  stageO(() => e__.muxiumKick()),
  stage(({concepts, dispatch, d, e}) => {
    console.log('Adding Counter Concept');
    expect(Object.keys(d).length).toBe(1); // Only muxium initially
    
    dispatch(
      strategyBegin(
        addConceptsToAddQueThenBlockStrategy(e, concepts, { 
          counter: createCounterConcept() 
        })
      ),
      { iterateStage: true }
    );
  }),
  stage(({d}) => {
    // Concept is now available in the deck
    expect(Object.keys(d).length).toBe(2); // muxium + counter
    
    // Can now use the newly added concept
    const strategy = countingStrategy(d as Deck<MuxiumDeck & CounterDeck>);
    if (strategy) {
      dispatch(strategyBegin(strategy));
    }
  })
]);
```

### Removing Concepts at Runtime

```typescript
import { 
  addConceptsToRemovalQueThenBlockStrategy,
  removeConceptsViaQueThenUnblockTopic 
} from '../concepts/muxium/strategies/removeConcept.strategy';

// Real example from removeConcepts.test.ts
const plan = muxium.plan('Remove Concepts Stage', ({stage, stageO, e__, k__}) => [
  stageO(() => e__.muxiumKick()),
  stage(({concepts, dispatch, e}) => {
    dispatch(
      strategyBegin(
        addConceptsToRemovalQueThenBlockStrategy(e, concepts, {
          counter: createCounterConcept()
        })
      ), 
      { iterateStage: true }
    );
  }),
  stage(({concepts, d}) => {
    const muxiumState = getMuxiumState(concepts);
    
    // Wait for removal strategy to complete
    if (muxiumState.lastStrategy === removeConceptsViaQueThenUnblockTopic) {
      let exists = false;
      forEachConcept(concepts, (concept) => {
        if (concept.name === counterName) {
          exists = true;
        }
      });
      
      expect(exists).toBe(false); // Concept removed
      expect(Object.keys(d).length).toBe(1); // Only muxium remains
      
      plan.conclude();
      muxium.close();
    }
  }, { selectors: [k__.lastStrategy] })
]);
```

### Dynamic Concept Management Patterns

#### Pattern 1: Feature Module Loading
```typescript
// Load concepts based on user permissions or feature flags
const loadUserFeatures = async (userRole: string) => {
  const concepts: Record<string, Concept<any, any>> = {};
  
  if (userRole === 'admin') {
    concepts.admin = await import('./admin.concept').then(m => m.createAdminConcept());
  }
  
  if (userRole === 'user') {
    concepts.userProfile = await import('./user.concept').then(m => m.createUserConcept());
  }
  
  return concepts;
};

// Add concepts dynamically based on user login
stage(({dispatch, e, concepts}) => {
  const userConcepts = await loadUserFeatures(currentUser.role);
  dispatch(
    strategyBegin(addConceptsToAddQueThenBlockStrategy(e, concepts, userConcepts))
  );
});
```

#### Pattern 2: Plugin System
```typescript
// Dynamic plugin loading system
interface Plugin {
  name: string;
  concept: Concept<any, any>;
  dependencies?: string[];
}

const loadPlugin = (plugin: Plugin) => {
  stage(({dispatch, e, concepts, d}) => {
    // Check dependencies are available
    const hasAllDeps = plugin.dependencies?.every(dep => 
      Object.keys(d).includes(dep)
    ) ?? true;
    
    if (hasAllDeps) {
      dispatch(
        strategyBegin(
          addConceptsToAddQueThenBlockStrategy(e, concepts, {
            [plugin.name]: plugin.concept
          })
        )
      );
    }
  });
};
```

#### Pattern 3: Resource Management
```typescript
// Remove concepts when no longer needed
const cleanupUnusedConcepts = () => {
  stage(({dispatch, e, concepts}) => {
    const unusedConcepts = identifyUnusedConcepts(concepts);
    
    if (unusedConcepts.length > 0) {
      dispatch(
        strategyBegin(
          addConceptsToRemovalQueThenBlockStrategy(e, concepts, unusedConcepts)
        )
      );
    }
  });
};
```

### Best Practices for Dynamic Concept Management

#### 1. Graceful Concept Addition
```typescript
// Always verify concept addition was successful
stage(({concepts, d}) => {
  const muxiumState = getMuxiumState(concepts);
  
  // Check if the add strategy completed successfully
  if (muxiumState.lastStrategy?.includes('addConcept')) {
    // Verify the concept is actually available
    if (d.newConcept) {
      console.log('Concept successfully added');
      // Proceed with using the new concept
    } else {
      console.error('Concept addition failed');
      // Handle failure case
    }
  }
});
```

#### 2. Safe Concept Removal
```typescript
// Ensure no pending operations before removal
const safeRemoveConcept = (conceptName: string) => {
  stage(({concepts, dispatch, e}) => {
    const concept = selectConcept(concepts, conceptName);
    
    if (concept && !hasPendingOperations(concept)) {
      dispatch(
        strategyBegin(
          addConceptsToRemovalQueThenBlockStrategy(e, concepts, {
            [conceptName]: concept
          })
        )
      );
    } else {
      console.warn(`Cannot remove ${conceptName}: has pending operations`);
    }
  });
};
```

#### 3. Dependency Management
```typescript
// Track concept dependencies to prevent orphaned states
const conceptDependencies = new Map<string, string[]>();

const addConceptWithDependencies = (name: string, concept: Concept<any, any>, deps: string[]) => {
  conceptDependencies.set(name, deps);
  
  // Add concept only if all dependencies are present
  stage(({d, dispatch, e, concepts}) => {
    const allDepsPresent = deps.every(dep => Object.keys(d).includes(dep));
    
    if (allDepsPresent) {
      dispatch(
        strategyBegin(
          addConceptsToAddQueThenBlockStrategy(e, concepts, { [name]: concept })
        )
      );
    }
  });
};
```

### Dynamic Concept Lifecycle Events

```typescript
// Monitor concept lifecycle events
const conceptLifecyclePrinciple: PrincipleFunction = ({ observer }) => {
  return observer.subscribe((concepts) => {
    const muxiumState = getMuxiumState(concepts);
    
    // Log concept additions
    if (muxiumState.lastStrategy?.includes('addConcept')) {
      console.log('Concept added:', muxiumState.lastStrategyData);
    }
    
    // Log concept removals
    if (muxiumState.lastStrategy?.includes('removeConcept')) {
      console.log('Concept removed:', muxiumState.lastStrategyData);
    }
  });
};
```

Dynamic concept management enables building highly flexible and adaptive systems that can evolve their capabilities at runtime while maintaining type safety and system integrity.

## Advanced Stage Planner Features

The Stage Planner provides sophisticated options for controlling execution flow, state observation, and performance optimization. These advanced features enable fine-grained control over how stages execute and respond to state changes.

### Stage Dispatch Options

Stage dispatch options provide precise control over action execution and stage flow.

#### Run Once Pattern
```typescript
// Real example from stageDispatchOptions.test.ts
stage(({concepts, dispatch, d}) => {
  const counter = selectState<CounterState>(concepts, counterName);
  console.log('Stage runs multiple times, action runs only once');
  
  // Action will only execute once despite multiple stage executions
  dispatch(d.counter.e.counterAdd(), {
    runOnce: true
  });
  
  // Check result and move to next stage when ready
  if (selectSlice(concepts, counterSelectCount) === 1) {
    dispatch(d.counter.e.counterSetCount({newCount: 5}), {
      iterateStage: true
    });
  }
})
```

#### Set Stage Explicitly
```typescript
// Jump to specific stage based on conditions
stage(({concepts, dispatch, d}) => {
  const count = selectSlice(concepts, counterSelectCount);
  
  if (count === 2) {
    // Jump directly to stage 2 (0-indexed)
    dispatch(d.counter.e.counterAdd(), {
      setStage: 2,
      throttle: 1 // Prevent action overlap
    });
  }
})
```

#### Throttle and Agreement
```typescript
// Control action timing and ownership
stage(({dispatch, d}) => {
  dispatch(d.counter.e.counterAdd(), {
    throttle: 1000,    // Wait 1 second between actions
    agreement: 5000    // Ownership timeout for concurrent access
  });
})
```

### Dynamic Stage Selector Management

Stages can dynamically update their selectors to respond to different state changes.

#### Set Stage Selectors
```typescript
// Real example from setStageOptions.test.ts
stage(({dispatch, d}) => {
  const strategy = countingStrategy(d);
  if (strategy) {
    dispatch(strategyBegin(strategy), {
      iterateStage: true,
      setStageSelectors: {
        stage: 1,                           // Target stage index
        selectors: [d.muxium.k.lastStrategy] // New selectors for that stage
      }
    });
  }
}, {selectors: [d__.muxium.k.lastStrategy]}), // Initial selectors

// Stage 1 now uses the new selectors
stage(({concepts, changes}) => {
  // This stage now only triggers on lastStrategy changes
  const muxiumState = getMuxiumState(concepts);
  if (muxiumState.lastStrategy === countingTopic) {
    console.log('Strategy completed:', changes?.length);
  }
}) // No initial selectors - set dynamically
```

#### Progressive Selector Addition
```typescript
// Real example from newPlanOptions.test.ts
stage(({dispatch, changes, d}) => {
  const selectors: KeyedSelector[] = [];
  
  if (count === 0) {
    selectors.push(planOptionsSelect.one);
    expect(changes?.length).toBe(0); // First run
  } else if (count === 1) {
    selectors.push(planOptionsSelect.one);
    selectors.push(planOptionsSelect.two);
    expect(changes?.length).toBe(1); // One selector triggered
  } else if (count === 2) {
    selectors.push(planOptionsSelect.one);
    selectors.push(planOptionsSelect.two);
    selectors.push(planOptionsSelect.three);
    expect(changes?.length).toBe(2); // Two selectors triggered
  }
  
  // Update stage selectors dynamically
  dispatch(d.experiment.e.experimentUpdateSelectors(), {
    setStageSelectors: {
      stage: 0, // Current stage
      selectors: selectors
    }
  });
})
```

### Stage Beat and Timing Control

The beat system provides sophisticated timing control combining throttle and debounce behaviors.

#### Basic Beat Configuration
```typescript
// Real example from stagePlannerBeat.test.ts
const plan = muxium.plan('Stage Planner Beat Test', ({stage, stageO, e__}) => [
  stageO(() => e__.muxiumKick()),
  
  stage(({concepts, dispatch, e}) => {
    if (selectSlice(concepts, muxiumSelectOpen)) {
      dispatch(e.muxiumKick(), {
        iterateStage: true,
      });
    }
  }, {beat: 105}), // First notification goes through, subsequent debounced for 105ms
  
  stage(({dispatch, d}) => {
    dispatch(d.counter.e.counterAdd(), {
      iterateStage: true
    });
  }, {beat: 105}),
  
  stage(({concepts, dispatch, d, e}) => {
    const state = selectState<CounterState>(concepts, counterName);
    if (state?.count === 9) {
      dispatch(e.muxiumPreClose({exit: false}), {
        iterateStage: true
      });
      plan.conclude();
    } else {
      dispatch(d.counter.e.counterAdd(), {
        throttle: 1 // Individual action throttling
      });
    }
  }, {beat: 105})
]);
```

#### Beat with Selector Changes
```typescript
// Real example from beatSelectorChanges.test.ts
stage(({concepts, changes}) => {
  // Beat ensures changes are accumulated and delivered together
  if (getMuxiumState(concepts).lastStrategy === topic) {
    expect(selectSlice(concepts, beatSelectorChangesSelectCountOne)).toBe(tally[0]);
    expect(selectSlice(concepts, beatSelectorChangesSelectCountTwo)).toBe(tally[1]);
    expect(selectSlice(concepts, beatSelectorChangesSelectCountThree)).toBe(tally[2]);
    // ... more selectors
    
    // All changes delivered together due to beat
    expect(changes?.length).toBe(tally.length);
  }
}, {beat: 7000}) // 7 second beat - accumulates changes
```

### Stage Priority Management

```typescript
// Real example from priority tests
const plan = muxium.plan('Priority Management', ({stage}) => [
  stage(({dispatch, d}) => {
    // High priority stage
    dispatch(d.experiment.e.experimentHighPriority(), {
      priority: 1000
    });
  }, {priority: 1000}),
  
  stage(({dispatch, d}) => {
    // Normal priority stage
    dispatch(d.experiment.e.experimentNormalPriority());
  }, {priority: 100}),
  
  stage(({dispatch, d}) => {
    // Low priority stage
    dispatch(d.experiment.e.experimentLowPriority());
  }, {priority: 1})
]);
```

### Mixed Plan Options

```typescript
// Real example combining multiple stage options
stage(({dispatch, d, changes}) => {
  if (changes?.length === expectedChanges) {
    dispatch(d.experiment.e.experimentAdvance(), {
      iterateStage: true,
      setStageSelectors: {
        stage: nextStage,
        selectors: getSelectorsForStage(nextStage)
      },
      throttle: 100,
      priority: calculatePriority(currentConditions)
    });
  }
}, {
  beat: 500,
  priority: 100,
  selectors: getCurrentSelectors()
})
```

### Stage Error Handling and Recovery

```typescript
// Handle stage failures gracefully
stage(({concepts, dispatch, d}) => {
  try {
    const result = performComplexOperation();
    dispatch(d.processing.e.processingSuccess(result), {
      iterateStage: true
    });
  } catch (error) {
    // Handle stage failure
    dispatch(d.processing.e.processingError({error: error.message}), {
      setStage: errorRecoveryStage
    });
  }
})
```

### Stage Performance Monitoring

```typescript
// Monitor stage execution performance
stage(({concepts, dispatch, stagePlanner}) => {
  const startTime = performance.now();
  
  performStageOperation();
  
  const executionTime = performance.now() - startTime;
  
  if (executionTime > 1000) {
    console.warn(`Stage took ${executionTime}ms to execute`);
    
    // Adjust stage options based on performance
    dispatch(d.monitoring.e.monitoringSlowStage({
      stage: stagePlanner.currentStage,
      executionTime
    }));
  }
})
```

### Stage Planner Best Practices

#### 1. Selector Optimization
```typescript
// ✅ Use specific selectors to minimize unnecessary stage executions
stage(({changes}) => {
  // Only triggers when specific values change
  if (changes?.some(c => c.keys === 'specificValue')) {
    // Handle specific change
  }
}, {selectors: [specificSelector]})

// ❌ Avoid broad selectors that trigger too frequently
stage(({changes}) => {
  // Triggers on any state change - inefficient
  handleAnyChange();
}, {selectors: [broadSelector]})
```

#### 2. Beat Configuration
```typescript
// ✅ Use beat for batch processing
stage(({changes}) => {
  // Process all accumulated changes together
  processBatchChanges(changes);
}, {beat: 1000}) // Accumulate changes for 1 second

// ❌ Don't use beat for immediate response needs
stage={({dispatch, d}) => {
  // Critical operations should not be delayed
  dispatch(d.emergency.e.emergencyResponse());
}, {beat: 1000}) // Bad - delays critical operations
```

#### 3. Stage Flow Control
```typescript
// ✅ Use conditional stage advancement
stage(({concepts, dispatch, d}) => {
  if (isReadyToAdvance(concepts)) {
    dispatch(d.flow.e.flowAdvance(), {iterateStage: true});
  } else {
    // Stay in current stage until ready
    dispatch(d.flow.e.flowWait(), {throttle: 1000});
  }
})
```

The Stage Planner's advanced features enable building sophisticated, responsive, and efficient applications that can adapt their behavior based on changing conditions while maintaining optimal performance.

## Asynchronous Strategy Patterns

Stratimux provides powerful patterns for handling asynchronous operations through strategies, method creators, and action controllers. These patterns enable complex asynchronous workflows while maintaining system coherence.

### Strategy Recursion

Strategy recursion enables iterative processing with automatic halting conditions.

#### Recursive Strategy Implementation
```typescript
// Real example from asynchronousRecursion.test.ts
export const experimentRecursivelyIterateId = <T extends Deck<ExperimentDeck>>(
  deck: Partial<T>, 
  list: string[]
): ActionStrategy | undefined => {
  if (deck.experiment) {
    const {
      experimentRecurseIterateId
    } = deck.experiment.e;

    // Base case: list is empty, strategy completes
    if (list.length === 0) {
      return undefined;
    }

    // Recursive case: process current item and continue with remainder
    const stepTwo = createActionNode(experimentRecurseIterateId(), {
      successNode: createActionNode(
        strategyRecurse(experimentRecursivelyIterateId(deck, list.slice(1)))
      ),
      successNotes: {
        preposition: 'Recursively',
        denoter: `Processing item: ${list[0]}`,
      },
    });

    const params: ActionStrategyParameters = {
      topic: experimentRecursivelyIterateIdTopic,
      initialNode: stepTwo,
    };

    return createStrategy(params);
  }
  return undefined;
};
```

#### Using Recursive Strategies
```typescript
// Real usage example
const plan = muxium.plan('Recursive Processing', ({stage, stageO, e__}) => [
  stageO(() => e__.muxiumKick()),
  
  stage(({dispatch, d}) => {
    const itemsToProcess = ['item1', 'item2', 'item3', 'item4'];
    
    dispatch(strategyBegin(
      experimentRecursivelyIterateId(d, itemsToProcess)
    ), {
      iterateStage: true
    });
  }),
  
  stage(({concepts}) => {
    const lastTopic = selectSlice(concepts, muxiumSelectLastStrategy);
    const experimentState = selectState<ExperimentState>(concepts, experimentName);
    
    // Check if recursion completed
    if (lastTopic === experimentRecursivelyIterateIdTopic) {
      expect(experimentState?.id).toBe(itemsToProcess.length);
      console.log('Recursive processing completed');
      plan.conclude();
    }
  })
]);
```

### Debounced Asynchronous Methods

Debouncing prevents excessive execution of asynchronous operations during rapid state changes.

#### Debounced Method Creator
```typescript
// Real example from experiment concept
export const experimentDebounceAsyncIterateIdThenReceiveInMethod = 
  createQualityCardWithPayload<ExperimentState, Data>({
    type: 'Experiment debounce async iterate ID then receive in Method via State',
    reducer: (state: ExperimentState) => ({
      id: state.id + 1
    }),
    methodCreator: () => createAsyncMethodDebounceWithState(
      ({controller, action, state}) => {
        setTimeout(() => {
          const payload = action.payload;
          if (action.strategy) {
            const data = strategyData_muxifyData<Data>(action.strategy, {
              id: state.id,
              setId: payload.setId
            });
            const strategy = strategySuccess(action.strategy, data);
            controller.fire(strategy);
          }
          controller.fire(action);
        }, 50);
      }, 
      500 // 500ms debounce delay
    )
  });
```

#### Debounced Strategy Pattern
```typescript
// Real example from debounce strategies
export const experimentDebounceIterateIdThenAddToData = <T extends Deck<ExperimentDeck>>(
  deck: Partial<T>, 
  id: number
): ActionStrategy | undefined => {
  if (deck.experiment) {
    const {
      experimentDebounceIterateIdThenReceiveInMethod
    } = deck.experiment.e;

    const stepTwo = createActionNode(
      experimentDebounceIterateIdThenReceiveInMethod({setId: id}), {
        successNotes: {
          preposition: 'then',
          denoter: 'Debounced Operation Complete',
        },
      }
    );

    return createStrategy({
      topic: experimentDebounceIterateIdThenAddToDataTopic,
      initialNode: stepTwo,
    });
  }
  return undefined;
};
```

#### Testing Debounced Operations
```typescript
// Real test pattern from debounceMethods.test.ts
test('Debounce method prevent excess count', (done) => {
  const plan = muxium.plan('Experiment debounce add one', ({stage}) => [
    stage(({dispatch, d}) => {
      // Rapid dispatch - only last should execute due to debouncing
      dispatch(strategyBegin(experimentDebounceAddOneStrategy(d)), {
        iterateStage: true
      });
    }),
    stage(({dispatch, d}) => {
      // Another rapid dispatch
      dispatch(strategyBegin(experimentDebounceAddOneStrategy(d)), {
        iterateStage: true
      });
    }),
    stage(({concepts}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      
      // Verify debouncing worked - should only increment once
      setTimeout(() => {
        expect(experimentState?.id).toBe(1); // Not 2, due to debouncing
        done();
      }, 1000);
    })
  ]);
});
```

### Throttled Asynchronous Methods

Throttling ensures operations execute at controlled intervals, preventing system overload.

#### Throttled Method Creator
```typescript
// Real example from experiment concept
export const experimentThrottleAsyncIterateIdThenReceiveInMethod = 
  createQualityCardWithPayload<ExperimentState, Data>({
    type: 'Experiment throttle async iterate ID then receive in Method via State',
    reducer: (state: ExperimentState) => ({
      id: state.id + 1
    }),
    methodCreator: () => createAsyncMethodThrottleWithState(
      ({controller, action, state}) => {
        setTimeout(() => {
          const payload = action.payload;
          if (action.strategy) {
            const data = strategyData_muxifyData<Data>(action.strategy, {
              id: state.id,
              setId: payload.setId
            });
            const strategy = strategySuccess(action.strategy, data);
            controller.fire(strategy);
          }
          controller.fire(action);
        }, 50);
      }, 
      500 // 500ms throttle interval
    )
  });
```

#### Throttled Strategy Testing
```typescript
// Real test from throttleMethods.test.ts
test('Throttle Method Test', (done) => {
  const plan = muxium.plan('Throttle Test', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(
          experimentThrottleIterateIdThenAddToData(d, experimentState.id)
        ), {iterateStage: true});
      }
    }),
    
    stage(({concepts}) => {
      const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
      
      if (lastStrategy === experimentThrottleIterateIdThenAddToDataTopic) {
        // Verify throttling worked correctly
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        expect(experimentState?.id).toBeGreaterThanOrEqual(1);
        
        setTimeout(() => done(), 1000);
      }
    })
  ]);
});
```

### Strategy Data Flow Patterns

#### Strategy Success with Data
```typescript
// Pass data between strategy steps
const processDataStrategy = <T extends Deck<ProcessingDeck>>(
  deck: Partial<T>, 
  inputData: any
): ActionStrategy | undefined => {
  if (deck.processing) {
    const stepTwo = createActionNode(
      processStep2(),
      {
        successNode: createActionNode(
          processStep3(),
          {
            successNotes: {
              preposition: 'finally',
              denoter: 'Data Processing Complete'
            }
          }
        ),
        successNotes: {
          preposition: 'then',
          denoter: 'Step 2 Complete'
        }
      }
    );

    const stepOne = createActionNode(
      processStep1(),
      {
        successNode: stepTwo,
        successNotes: {
          preposition: 'first',
          denoter: 'Step 1 Complete'
        }
      }
    );

    return createStrategy({
      topic: processDataTopic,
      initialNode: stepOne,
      data: inputData // Data flows through strategy
    });
  }
  return undefined;
};
```

### Action Controller Patterns

#### Controller with State Access
```typescript
// Real pattern from method creators
methodCreator: () => createAsyncMethodThrottleWithState(
  ({controller, action, state}) => {
    // Access current state
    const currentId = state.id;
    
    // Perform async operation
    performAsyncOperation(currentId).then((result) => {
      // Update strategy with result
      if (action.strategy) {
        const updatedStrategy = strategySuccess(action.strategy, result);
        controller.fire(updatedStrategy);
      }
      
      // Complete the action
      controller.fire(action);
    }).catch((error) => {
      // Handle errors
      if (action.strategy) {
        const failedStrategy = strategyFailed(action.strategy, error);
        controller.fire(failedStrategy);
      }
    });
  },
  throttleInterval
)
```

#### Controller Subscription Pattern
```typescript
// Subscribe to action completion
methodCreator: () => createAsyncMethod(({controller, action}) => {
  const subscription = controller.subscribe((firedAction) => {
    if (firedAction.type === 'Operation Complete') {
      console.log('Async operation completed:', firedAction.payload);
      subscription.unsubscribe();
    }
  });
  
  // Start async operation
  startAsyncOperation().then(() => {
    controller.fire(createOperationCompleteAction());
  });
})
```

### Strategy Determination

Use `strategyDetermine` to dynamically choose between action and strategy dispatch.

```typescript
// Real example from strategyDetermine.test.ts
stage(({dispatch, d}) => {
  // strategyDetermine automatically wraps single actions in strategies
  dispatch(strategyDetermine(d.counter.e.counterAdd()), {
    iterateStage: true
  });
}),

stage(({dispatch, d}) => {
  // Works with payload actions too
  dispatch(strategyDetermine(d.counter.e.counterSetCount({
    newCount: FINAL_COUNT
  })), {
    iterateStage: true
  });
}),

stage(({d}) => {
  // Verify both executed properly
  expect(d.counter.k.count.select()).toBe(FINAL_COUNT);
  plan.conclude();
})
```

### Error Handling in Async Strategies

```typescript
// Comprehensive error handling
const robustAsyncStrategy = <T extends Deck<ProcessingDeck>>(
  deck: Partial<T>
): ActionStrategy | undefined => {
  if (deck.processing) {
    const errorNode = createActionNode(
      handleError(),
      {
        successNotes: {
          preposition: 'finally',
          denoter: 'Error Handled'
        }
      }
    );

    const mainNode = createActionNode(
      processData(),
      {
        successNode: createActionNode(finalizeProcessing()),
        failureNode: errorNode,
        successNotes: {
          preposition: 'then',
          denoter: 'Processing Successful'
        },
        failureNotes: {
          preposition: 'but',
          denoter: 'Processing Failed'
        }
      }
    );

    return createStrategy({
      topic: robustProcessingTopic,
      initialNode: mainNode
    });
  }
  return undefined;
};
```

These asynchronous patterns enable building complex, responsive applications that can handle concurrent operations, manage timing constraints, and maintain system coherence even under high load conditions.

## Selector System and State Access

Stratimux provides multiple selector systems for accessing state, from legacy patterns to the modern unified selector approach. Understanding these patterns helps in choosing the right approach for different scenarios.

### Unified Selector System

The unified selector system provides a consistent API for all state access operations.

#### Creating Dynamic Selectors
```typescript
// Real example from unifiedSelector.test.ts
import { select } from '../model/selector';

stage(({concepts}) => {
  // Create concept-based keyed selector
  const conceptSelector = select.createConceptKeyedSelector<CounterState>(
    counterName, 
    'count'
  );
  
  // Create muxified keyed selector using concept index
  const muxifiedSelector = select.createMuxifiedKeyedSelector<CounterState>(
    concepts, 
    1,        // Concept index in muxium
    'count'   // State property
  ) as KeyedSelector;
  
  // Both selectors access the same state
  expect(select.slice(concepts, conceptSelector)).toBe(0);
  expect(select.slice(concepts, muxifiedSelector)).toBe(0);
  
  // Use consistent API across selector types
  const stateValue = select.state<CounterState>(concepts, counterName);
  expect(stateValue?.count).toBe(0);
});
```

#### Selector Performance Patterns
```typescript
// Cache frequently used selectors
const cachedSelectors = {
  userProfile: select.createConceptKeyedSelector<UserState>('user', 'profile'),
  userSettings: select.createConceptKeyedSelector<UserState>('user', 'settings'),
  systemStatus: select.createConceptKeyedSelector<SystemState>('system', 'status')
};

stage(({concepts}) => {
  // Efficient access using cached selectors
  const profile = select.slice(concepts, cachedSelectors.userProfile);
  const settings = select.slice(concepts, cachedSelectors.userSettings);
  const status = select.slice(concepts, cachedSelectors.systemStatus);
});
```

### Change Detection and Monitoring

The `onChange` system provides powerful state change monitoring capabilities.

#### Basic Change Monitoring
```typescript
// Real example from onChange.test.ts
const selectorRouter: Record<string, any> = {
  [muxiumSelectLastStrategy.keys]: (concepts: Concepts) =>
    console.log('Strategy changed:', selectSlice(concepts, muxiumSelectLastStrategy))
};

const plan = muxium.plan('Change Monitoring', ({stage, d__}) => [
  stage(({stagePlanner, concepts, dispatch, d}) => {
    // Monitor specific state changes
    if (selectSlice(concepts, muxiumSelectLastStrategy) === initializeTopic) {
      const strategy = countingStrategy(d);
      if (strategy) {
        dispatch(strategyBegin(strategy), {
          iterateStage: true
        });
      }
    }
  }, {selectors: [d__.muxium.k.lastStrategy]}),
  
  stage(({concepts, changes}) => {
    // Process accumulated changes
    changes?.forEach(keyed => {
      selectorRouter[keyed.keys] ? selectorRouter[keyed.keys](concepts) : null;
    });
    
    // Verify specific change occurred
    const counter = selectState<CounterState>(concepts, counterName);
    expect(counter?.count).toBe(1);
  })
]);
```

#### Advanced Change Processing
```typescript
// Process different types of changes
stage(({concepts, changes}) => {
  if (changes) {
    changes.forEach(change => {
      switch (change.keys) {
        case 'userProfile':
          handleUserProfileChange(concepts, change);
          break;
        case 'systemStatus':
          handleSystemStatusChange(concepts, change);
          break;
        case 'lastStrategy':
          handleStrategyChange(concepts, change);
          break;
        default:
          console.log('Unhandled change:', change.keys);
      }
    });
  }
}, {selectors: [
  userProfileSelector,
  systemStatusSelector,
  lastStrategySelector
]})
```

### Data Slice Selection

The data slice system enables efficient access to nested state properties.

#### Basic Data Slice Access
```typescript
// Real patterns from selectDataSlice.test.ts
stage(({concepts}) => {
  // Access nested properties efficiently
  const userData = selectSlice(concepts, createSelector(
    'user',
    (state: UserState) => state.profile.personalInfo
  ));
  
  // Access array elements
  const firstOrder = selectSlice(concepts, createSelector(
    'orders',
    (state: OrderState) => state.orderList[0]
  ));
  
  // Access computed values
  const orderTotal = selectSlice(concepts, createSelector(
    'orders',
    (state: OrderState) => state.orderList.reduce((sum, order) => sum + order.total, 0)
  ));
});
```

#### Memoized Selectors
```typescript
// Create memoized selectors for expensive computations
const expensiveComputationSelector = createSelector(
  'analytics',
  (state: AnalyticsState) => {
    // Expensive computation only runs when analytics state changes
    return computeComplexAnalytics(state.data);
  }
);

stage(({concepts}) => {
  // Result is cached until analytics state changes
  const analytics = selectSlice(concepts, expensiveComputationSelector);
  processAnalytics(analytics);
});
```

### Selector Composition Patterns

#### Combining Multiple Selectors
```typescript
// Compose selectors for complex state access
const userOrderSummarySelector = createSelector(
  ['user', 'orders'],
  (userState: UserState, orderState: OrderState) => {
    return {
      userId: userState.profile.id,
      userName: userState.profile.name,
      totalOrders: orderState.orderList.length,
      totalSpent: orderState.orderList.reduce((sum, order) => sum + order.total, 0)
    };
  }
);

stage(({concepts}) => {
  const summary = selectSlice(concepts, userOrderSummarySelector);
  displayUserSummary(summary);
});
```

#### Conditional Selectors
```typescript
// Selectors that adapt based on state
const adaptiveDataSelector = (concepts: Concepts) => {
  const userRole = selectSlice(concepts, userRoleSelector);
  
  switch (userRole) {
    case 'admin':
      return selectSlice(concepts, adminDataSelector);
    case 'user':
      return selectSlice(concepts, userDataSelector);
    default:
      return selectSlice(concepts, publicDataSelector);
  }
};

stage(({concepts}) => {
  const data = adaptiveDataSelector(concepts);
  processRoleBasedData(data);
});
```

### DECK Interface State Access

The DECK interface provides the most efficient and type-safe state access method.

#### Direct DECK Access
```typescript
// Most efficient - direct property access
stage(({d}) => {
  const count = d.counter.k.count.select();
  const userProfile = d.user.k.profile.select();
  const systemStatus = d.system.k.status.select();
  
  // Type-safe access with full IntelliSense
  expect(count).toBe(1);
  expect(userProfile.name).toBe('John Doe');
  expect(systemStatus).toBe('online');
});
```

#### Nested DECK Access for Muxified Concepts
```typescript
// Access muxified concept state
stage(({d}) => {
  // Outer concept state
  const outerState = d.complexConcept.k.outerProperty.select();
  
  // Inner muxified concept state
  const innerState = d.complexConcept.d.innerConcept.k.innerProperty.select();
  
  // Both are type-safe and performant
  processComplexState(outerState, innerState);
});
```

### Legacy Selector Patterns

#### Traditional State Selection
```typescript
// Legacy pattern - still supported but not recommended for new code
stage(({concepts}) => {
  // Manual concept lookup
  const counter = selectState<CounterState>(concepts, counterName);
  expect(counter?.count).toBe(1);
  
  // Manual selector application
  const count = selectSlice(concepts, counterSelectCount);
  expect(count).toBe(1);
});
```

#### Migration Strategy
```typescript
// Gradually migrate from legacy to DECK interface
stage(({concepts, d}) => {
  // Legacy approach
  const legacyCount = selectState<CounterState>(concepts, counterName)?.count;
  
  // Modern DECK approach
  const deckCount = d.counter.k.count.select();
  
  // Both should be identical
  expect(legacyCount).toBe(deckCount);
  
  // Prefer DECK interface for new code
  processCount(deckCount);
});
```

### Testing Patterns and Best Practices

Stratimux provides comprehensive testing patterns that ensure reliable application behavior. These patterns are derived from extensive test coverage across the framework's features.

### Basic Test Structure

#### Standard Muxium Test Pattern
```typescript
// Real pattern from framework tests
test('Feature Test Description', (done) => {
  const muxium = muxification('Test Muxium Name', {
    counter: createCounterConcept(),
    experiment: createExperimentConcept()
  }, {logging: true, storeDialog: true});

  const plan = muxium.plan('Test Plan Name', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()), // Initialize muxium
    
    stage(({concepts, dispatch, d}) => {
      // Test setup and initial actions
      expect(d.counter.k.count.select()).toBe(0);
      dispatch(d.counter.e.counterAdd(), {iterateStage: true});
    }),
    
    stage(({d}) => {
      // Verify results
      expect(d.counter.k.count.select()).toBe(1);
      
      // Cleanup
      setTimeout(() => {
        plan.conclude();
        muxium.close();
        done();
      }, 50);
    })
  ]);
});
```

### Strategy Testing Patterns

#### Testing Strategy Execution
```typescript
// Real example from strategy.test.ts
test('Strategy Execution Test', (done) => {
  const muxium = muxification('Strategy Test', {counter: createCounterConcept()});
  
  const plan = muxium.plan('Test Counting Strategy', ({stage, d__}) => [
    stage(({concepts, dispatch, d}) => {
      if (selectSlice(concepts, muxiumSelectLastStrategy) === initializeTopic) {
        const strategy = countingStrategy(d);
        if (strategy) {
          dispatch(strategyBegin(strategy), {iterateStage: true});
        } else {
          // Strategy creation failed
          expect(false).toBe(true);
          done();
        }
      }
    }, {selectors: [d__.muxium.k.lastStrategy]}),
    
    stage(({concepts}) => {
      const muxiumState = getMuxiumState(concepts);
      if (muxiumState.lastStrategy === countingTopic) {
        const counter = selectState<CounterState>(concepts, counterName);
        expect(counter?.count).toBe(1); // Strategy completed successfully
        done();
      }
    })
  ]);
});
```

#### Testing Strategy Failure Paths
```typescript
// Test strategy error handling
test('Strategy Failure Handling', (done) => {
  const plan = muxium.plan('Test Strategy Failures', ({stage}) => [
    stage(({dispatch, d}) => {
      // Dispatch strategy that should fail
      dispatch(strategyBegin(createFailingStrategy(d)), {
        iterateStage: true
      });
    }),
    
    stage(({concepts}) => {
      const muxiumState = getMuxiumState(concepts);
      
      // Verify failure was handled properly
      if (muxiumState.lastStrategy === failureHandlingTopic) {
        expect(muxiumState.badActions.length).toBeGreaterThan(0);
        done();
      }
    })
  ]);
});
```

### Asynchronous Operation Testing

#### Testing Debounced Methods
```typescript
// Real pattern from debounceMethods.test.ts
test('Debounce Method Test', (done) => {
  jest.setTimeout(30000); // Extend timeout for async operations
  
  const plan = muxium.plan('Debounce Test', ({stage}) => [
    stage(({dispatch, d}) => {
      // Rapid fire actions - should be debounced
      dispatch(strategyBegin(experimentDebounceAddOneStrategy(d)));
      dispatch(strategyBegin(experimentDebounceAddOneStrategy(d)));
      dispatch(strategyBegin(experimentDebounceAddOneStrategy(d)), {
        iterateStage: true
      });
    }),
    
    stage(({concepts}) => {
      const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
      
      if (lastStrategy === experimentDebounceAddOneTopic) {
        // Wait for debounce to complete
        setTimeout(() => {
          const state = selectState<ExperimentState>(concepts, experimentName);
          expect(state?.id).toBe(1); // Only one execution despite multiple dispatches
          done();
        }, 1000);
      }
    })
  ]);
});
```

#### Testing Throttled Methods
```typescript
// Real pattern from throttleMethods.test.ts
test('Throttle Method Test', (done) => {
  const plan = muxium.plan('Throttle Test', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(
          experimentThrottleIterateIdThenAddToData(d, experimentState.id)
        ), {iterateStage: true});
      }
    }),
    
    stage(({concepts}) => {
      const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
      
      if (lastStrategy === experimentThrottleIterateIdThenAddToDataTopic) {
        // Verify throttling worked correctly
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        expect(experimentState?.id).toBeGreaterThanOrEqual(1);
        
        setTimeout(() => done(), 1000);
      }
    })
  ]);
});
```

### Dynamic Concept Testing

#### Testing Concept Addition
```typescript
// Real pattern from addConcepts.test.ts
test('Add Concepts Test', (done) => {
  const muxium = muxification('Add Concepts Test', {}, {
    logging: true, 
    storeDialog: true, 
    dynamic: true // Enable dynamic concept management
  });
  
  const plan = muxium.plan('Add Concepts Stage', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    
    stage(({concepts, dispatch, d, e}) => {
      expect(Object.keys(d).length).toBe(1); // Only muxium initially
      
      dispatch(strategyBegin(
        addConceptsToAddQueThenBlockStrategy(e, concepts, { 
          counter: createCounterConcept() 
        })
      ), {iterateStage: true});
    }),
    
    stage(({concepts, d}) => {
      // Verify concept was added
      let exists = false;
      forEachConcept(concepts, (concept) => {
        if (concept.name === counterName) {
          exists = true;
        }
      });
      
      expect(exists).toBe(true);
      expect(Object.keys(d).length).toBe(2); // muxium + counter
      done();
    })
  ]);
});
```

#### Testing Concept Removal
```typescript
// Real pattern from removeConcepts.test.ts
test('Remove Concepts Test', (done) => {
  const muxium = muxification('Remove Concepts Test', {
    counter: createCounterConcept()
  }, {logging: true, storeDialog: true, dynamic: true});
  
  const plan = muxium.plan('Remove Concepts Stage', ({stage, stageO, e__, k__}) => [
    stageO(() => e__.muxiumKick()),
    
    stage(({concepts, dispatch, e}) => {
      dispatch(strategyBegin(
        addConceptsToRemovalQueThenBlockStrategy(e, concepts, {
          counter: createCounterConcept()
        })
      ), {iterateStage: true});
    }),
    
    stage(({concepts, d}) => {
      const muxiumState = getMuxiumState(concepts);
      
      if (muxiumState.lastStrategy === removeConceptsViaQueThenUnblockTopic) {
        let exists = false;
        forEachConcept(concepts, (concept => {
          if (concept.name === counterName) {
            exists = true;
          }
        }));
        
        expect(exists).toBe(false); // Concept removed
        expect(Object.keys(d).length).toBe(1); // Only muxium remains
        done();
      }
    }, { selectors: [k__.lastStrategy] })
  ]);
});
```

### Stage Planner Testing

#### Testing Stage Options
```typescript
// Real pattern from stageDispatchOptions.test.ts
test('Stage Dispatch Options Test', (done) => {
  let runCount = 0;
  
  const sub = muxium.subscribe((concepts) => {
    const muxiumState = getMuxiumState(concepts);
    
    if (muxiumState.badPlans.length > 0) {
      const badPlan = muxiumState.badPlans[0];
      const counter = selectState<CounterState>(concepts, counterName);
      
      expect(badPlan.stageFailed).toBe(2); // Specific stage failed
      expect(counter?.count).toBe(2); // State updated correctly before failure
      
      sub.unsubscribe();
      done();
    }
  });
  
  const plan = muxium.plan('Stage Options Test', ({stage}) => [
    stage(({dispatch, d}) => {
      dispatch(d.counter.e.counterAdd(), {iterateStage: true});
    }),
    
    stage(({concepts, dispatch, d}) => {
      runCount++;
      
      // Action runs only once despite multiple stage executions
      dispatch(d.counter.e.counterAdd(), {runOnce: true});
      
      if (selectSlice(concepts, counterSelectCount) === 2) {
        dispatch(d.counter.e.counterAdd(), {
          setStage: 2, // Jump to specific stage
          throttle: 1
        });
      }
    }),
    
    stage(({d}) => {
      // This stage should be reached
      expect(d.counter.k.count.select()).toBe(3);
    })
  ]);
});
```

#### Testing Beat Timing
```typescript
// Real pattern from stagePlannerBeat.test.ts
test('Stage Planner Beat Test', (done) => {
  jest.setTimeout(10000);
  
  let timerActive = false;
  const beat = 105;
  
  const plan = muxium.plan('Beat Test', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    
    stage(({concepts, dispatch, e}) => {
      timerActive = true;
      setTimeout(() => { timerActive = false; }, 1000);
      
      if (selectSlice(concepts, muxiumSelectOpen)) {
        dispatch(e.muxiumKick(), {iterateStage: true});
      }
    }, {beat}), // Beat controls timing
    
    stage(({dispatch, d}) => {
      dispatch(d.counter.e.counterAdd(), {iterateStage: true});
    }, {beat}),
    
    stage(({concepts, dispatch, d, e}) => {
      if (!timerActive) {
        const state = selectState<CounterState>(concepts, counterName);
        
        expect(state?.count).toBe(9); // Beat accumulated multiple changes
        done();
      } else {
        dispatch(d.counter.e.counterAdd(), {throttle: 1});
      }
    }, {beat})
  ]);
});
```

### Ownership System Testing

#### Testing Ownership Conflicts
```typescript
// Real pattern from ownership.test.ts
test('Ownership Test', (done) => {
  const plan = muxium.plan('Ownership Testing', ({stage}) => [
    stage(({concepts, dispatch, d}) => {
      const muxiumState = getMuxiumState(concepts);
      
      if (muxiumState.lastStrategy === ownershipSetOwnerShipModeTopic) {
        const ownership = selectState<OwnershipState>(concepts, ownershipName);
        
        if (ownership) {
          console.log('Ownership Ledger:', ownership.ownershipLedger);
          console.log('Pending Actions:', ownership.pendingActions);
          
          // Test ownership coordination
          expect(ownership.ownershipLedger.size).toBeGreaterThanOrEqual(0);
          expect(ownership.pendingActions.length).toBeGreaterThanOrEqual(0);
        }
        
        done();
      }
    })
  ]);
});
```

### Test Utilities and Helpers

#### Creating Test Concepts
```typescript
// Reusable test concept creation
const createTestConcept = <S, Q>(
  name: string, 
  state: S, 
  qualities: Q
) => {
  return createConcept(name, state, qualities, [], [], {
    test: true // Mark as test concept
  });
};

// Use in tests
const testCounter = createTestConcept(
  'testCounter',
  { count: 0 },
  { increment: createIncrementQuality() }
);
```

#### Test Data Generators
```typescript
// Generate test data for complex scenarios
const generateTestData = (complexity: 'simple' | 'complex') => {
  switch (complexity) {
    case 'simple':
      return { items: [1, 2, 3] };
    case 'complex':
      return { 
        items: Array.from({length: 100}, (_, i) => ({
          id: i,
          data: `item-${i}`,
          metadata: { created: Date.now() }
        }))
      };
  }
};
```

#### Async Test Helpers
```typescript
// Helper for async test timing
const waitForCondition = async (
  condition: () => boolean, 
  timeout: number = 5000
): Promise<boolean> => {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    if (condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  return false;
};

// Use in tests
test('Async Condition Test', async (done) => {
  // ... setup ...
  
  const success = await waitForCondition(() => 
    d.counter.k.count.select() === expectedValue
  );
  
  expect(success).toBe(true);
  done();
});
```

### Testing Best Practices

#### 1. Use Descriptive Test Names
```typescript
// ✅ Clear test purpose
test('Counter increments correctly when counterAdd action is dispatched', (done) => {
  // Test implementation
});

// ❌ Unclear test purpose
test('Counter test', (done) => {
  // Test implementation
});
```

#### 2. Extend Timeouts for Async Operations
```typescript
describe('Async Operations', () => {
  jest.setTimeout(30000); // 30 seconds for complex async tests  
  
  test('Debounced operations complete correctly', (done) => {
    // Async test implementation
  });
});
```

#### 3. Clean Up Resources
```typescript
// ✅ Proper cleanup
test('Resource Management Test', (done) => {
  const muxium = muxification('Test', concepts);
  
  const plan = muxium.plan('Test Plan', ({stage}) => [
    stage(({}) => {
      // Test logic
      
      // Always clean up
      setTimeout(() => {
        plan.conclude();
        muxium.close();
        done();
      }, 100);
    })
  ]);
});
```

#### 4. Test Both Success and Failure Paths
```typescript
// Test success path
test('Operation succeeds with valid input', (done) => {
  // Test successful operation
});

// Test failure path
test('Operation fails gracefully with invalid input', (done) => {
  // Test error handling
});
```

These testing patterns ensure comprehensive coverage of Stratimux applications, from basic functionality to complex asynchronous operations and error scenarios.

## Agent-Specific Usage Patterns and Best Practices

This section provides AI agents with battle-tested patterns for effective Stratimux development, based on real production usage and comprehensive test coverage.

### Drop-In Code Patterns for Agents

#### Pattern 1: Basic Counter Application
```typescript
// Complete working counter concept (v0.3.2)
export type CounterState = { count: number };
export const counterName = 'counter';

// Required type exports for v0.3.2
export type CounterAdd = Quality<CounterState>;
export type CounterSubtract = Quality<CounterState>;
export type CounterSetCount = Quality<CounterState, CounterSetCountPayload>;

export type CounterQualities = {
  counterAdd: CounterAdd,
  counterSubtract: CounterSubtract,
  counterSetCount: CounterSetCount,
};

const counterQualities = {
  counterAdd: createQualityCard<CounterState>({
    type: 'Counter Add',
    reducer: (state) => ({ count: state.count + 1 })
  }),
  counterSubtract: createQualityCard<CounterState>({
    type: 'Counter Subtract', 
    reducer: (state) => ({ count: state.count - 1 })
  }),
  counterSetCount: createQualityCardWithPayload<CounterState, CounterSetCountPayload>({
    type: 'Counter Set Count',
    reducer: (state, action) => ({ count: action.payload.newCount })
  })
};

export const createCounterConcept = () => createConcept<CounterState, CounterQualities>(
  counterName,
  { count: 0 },
  counterQualities
);

// Usage in muxium
const muxium = muxification('Counter App', {
  counter: createCounterConcept()
});

// Stage planner usage
const plan = muxium.plan('Counter Plan', ({staging, stage, d}) =>
  staging(() => [
    stage(({dispatch, d}) => {
      dispatch(d.counter.e.counterAdd(), {iterateStage: true});
    }),
    stage(({d}) => {
      expect(d.counter.k.count.select()).toBe(1);
      plan.conclude();
    })
  ])
);
```

#### Pattern 2: Async Processing with Controller
```typescript
// Async quality with action controller
export type ProcessingStart = Quality<ProcessingState, ProcessingPayload>;

export const processingStart = createQualityCardWithPayload<ProcessingState, ProcessingPayload>({
  type: 'Processing Start Async',
  reducer: (state, action) => ({
    ...state,
    status: 'processing',
    taskId: action.payload.taskId
  }),
  methodCreator: () => createAsyncMethod(({controller, action}) => {
    // Simulate async operation
    setTimeout(() => {
      const result = performComplexCalculation(action.payload);
      
      // Fire completion action
      controller.fire(createAction('Processing Complete', {
        payload: { result, taskId: action.payload.taskId }
      }));
    }, 1000);
  })
});
```

#### Pattern 3: Strategy with Data Flow
```typescript
// Multi-step strategy pattern
export const createDataProcessingStrategy = (inputData: DataPayload): ActionStrategy => {
  const stepTwo = createActionNode(
    processDataStep2(),
    {
      successNode: createActionNode(processDataComplete()),
      successNotes: { preposition: 'then', denoter: 'Processing Complete' }
    }
  );

  return createStrategy({
    topic: 'Data Processing Pipeline',
    initialNode: createActionNode(
      processDataStep1(),
      {
        successNode: stepTwo,
        successNotes: { preposition: 'first', denoter: 'Data Validated' }
      }
    ),
    data: inputData
  });
};

// Usage in stage planner
stage(({dispatch}) => {
  const strategy = createDataProcessingStrategy({ data: inputData });
  dispatch(strategyBegin(strategy), {iterateStage: true});
})
```

### Agent Development Guidelines

#### 1. Always Use v0.3.2 Patterns
```typescript
// ✅ Always export quality types
export type MyQuality = Quality<StateType, PayloadType?>;

// ✅ Always use explicit quality mapping
export type MyQualities = {
  qualityOne: QualityOneType,
  qualityTwo: QualityTwoType,
};

// ✅ Prefer createStages for complex plans
const plan = muxium.plan('My Plan', ({staging, stage}) =>
  staging(() => {
    // Compose stages here
    return stageArray;
  })
);
```

#### 2. State Access Best Practices
```typescript
// ✅ Use DECK interface for state access
stage(({d}) => {
  const count = d.counter.k.count.select();
  const user = d.user.k.profile.select();
});

// ✅ Use selectSlice for computed values
stage(({concepts}) => {
  const computedValue = selectSlice(concepts, myComputedSelector);
});

// ❌ Avoid manual concept lookups
stage(({concepts}) => {
  const counter = concepts.find(c => c.name === 'counter'); // Don't do this
});
```

#### 3. Error Handling Patterns
```typescript
// ✅ Always handle strategy failures
stage(({concepts, dispatch, d}) => {
  const muxiumState = getMuxiumState(concepts);
  
  // Check for strategy failures
  if (muxiumState.badPlans.length > 0) {
    console.log('Strategy failed:', muxiumState.badPlans[0]);
    dispatch(d.recovery.e.recoveryStart(), {iterateStage: true});
  }
});

// ✅ Add timeout handling for async operations
stage(({dispatch, d}) => {
  dispatch(d.processing.e.processingStart(), {
    iterateStage: true,
    agreement: 10000 // 10 second timeout
  });
});
```

#### 4. Testing Patterns for Agents
```typescript
// ✅ Always clean up resources
test('My Feature Test', (done) => {
  const muxium = muxification('Test', concepts);
  
  const plan = muxium.plan('Test Plan', ({stage}) => [
    stage(({}) => {
      // Test logic here
      
      // Always conclude and close
      setTimeout(() => {
        plan.conclude();
        muxium.close();
        done();
      }, 100);
    })
  ]);
});

// ✅ Test both success and failure paths
test('Operation Success', (done) => { /* test success */ });
test('Operation Failure', (done) => { /* test failure */ });
```

### Common Agent Pitfalls to Avoid

#### 1. Missing Type Exports (v0.3.2)
```typescript
// ❌ Missing type export
export const myQuality = createQualityCard({...});

// ✅ Include type export
export type MyQuality = Quality<StateType>;
export const myQuality = createQualityCard({...});
```

#### 2. Incorrect Package Usage
```typescript
// ❌ Old package name
import { muxification } from '@phuire/stratimux';

// ✅ New package name (v0.3.2+)
import { muxification } from 'stratimux';
```

#### 3. Stage Flow Issues
```typescript
// ❌ Missing iterateStage
stage(({dispatch, d}) => {
  dispatch(d.counter.e.counterAdd());
  // Stage will not advance!
});

// ✅ Proper stage advancement
stage(({dispatch, d}) => {
  dispatch(d.counter.e.counterAdd(), {iterateStage: true});
});
```

#### 4. Ownership System Misuse
```typescript
// ❌ Adding ownership unnecessarily
export const simpleQuality = createQualityCard({
  type: 'Simple Update',
  reducer: (state) => ({ ...state, updated: true }),
  keyedSelectors: [someSelector] // Not needed for simple operations
});

// ✅ Only use ownership when needed
export const criticalQuality = createQualityCard({
  type: 'Critical Update',
  reducer: (state) => ({ ...state, criticalValue: newValue }),
  keyedSelectors: [criticalSelector] // Only when race conditions are possible
});
```

### Agent Quick Reference

#### Essential Imports (v0.3.2)
```typescript
import { 
  muxification, 
  createConcept, 
  createQualityCard, 
  createQualityCardWithPayload,
  Quality,
  selectState,
  selectSlice,
  getMuxiumState
} from 'stratimux';
```

#### Essential Type Patterns
```typescript
// State type
export type MyState = { property: string };

// Quality types (required exports)
export type MyQuality = Quality<MyState>;
export type MyQualityWithPayload = Quality<MyState, PayloadType>;

// Qualities mapping (required pattern)
export type MyQualities = {
  myQuality: MyQuality,
  myQualityWithPayload: MyQualityWithPayload,
};

// Deck type
export type MyDeck = {
  myConcept: Concept<MyState, MyQualities>,
};
```

#### Stage Planner Template
```typescript
const plan = muxium.plan<MyDeck>('Plan Name', ({staging, stage, stageO, conclude, d}) =>
  staging(() => [
    stageO(() => d.muxium.e.muxiumKick()), // Wait for muxium open
    
    stage(({dispatch, d}) => {
      // Main logic
      dispatch(d.myConcept.e.myAction(), {iterateStage: true});
    }),
    
    stage(({d}) => {
      // Validation
      expect(d.myConcept.k.property.select()).toBe(expectedValue);
    }),
    
    conclude() // End the plan
  ])
);
```

This reference enables AI agents to implement Stratimux applications effectively using proven patterns and avoiding common pitfalls.
