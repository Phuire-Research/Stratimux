# Stratimux Reference Guide

## Introduction

Stratimux is an asynchronous graph programming framework that implements a Muxified Turing Machine. This reference guide provides a comprehensive overview of the core concepts, patterns, and functionality based on analyzing the codebase and test files.

## Core Concepts

### Muxium

A Muxium is the governing concept that contains a set of concepts that formalize its functionality.

```typescript
// Creating a Debugging Muxium
const muxium = muxification('Your Muxium Name', {
  concept1: createConcept1(),
  concept2: createConcept2()
}, {logging: true, storeDialog: true});
```

```typescript
// Creating a Production Muxium
const muxium = muxification('Your Muxium Name', {
  concept1: createConcept1(),
  concept2: createConcept2()
}, {logging: false, storeDialog: false});
```

Key properties:
- **Name**: A unique identifier for the Muxium
- **Concepts**: A collection of concepts that make up the Muxium's functionality
- **Options**: Configuration options like logging and storeDialog

### Concept

A Concept is a fundamental building block composed of state, qualities, principles, and mode.

```typescript
// Concept definition
export type MUXState = {
  message: string
}

export const createMUXConcept = () => {
  return createConcept(
    'conceptName',
    { message: 'Initial state' },  // initial state
    {
      // qualities
      qualityOne,
      qualityTwo
    },
    [
      // principles
      conceptPrinciple,
    ],
  );
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

#### Quality With Payload

```typescript
export type CounterSetCountPayload = {
  newCount: number
}

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
export function countingStrategy<T extends Deck<CounterDeck>>(deck: Partial<T>): ActionStrategy | undefined {
  if (deck.counter) {
    const stepThree = createActionNode(deck.counter.e.counterAdd(), {
      successNotes: {
        preposition: 'and finally',
        denoter: 'One.',
      },
    });
    
    const stepTwo = createActionNode(deck.counter.e.counterSubtract(), {
      successNode: stepThree,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });
    
    const stepOne = createActionNode(deck.counter.e.counterAdd(), {
      successNode: stepTwo,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });

    return createStrategy({
      topic: 'Strategy Topic Name',
      initialNode: stepOne,
    });
  }
  return undefined;
}
```

Key components:
- **Action Nodes**: Individual steps in the strategy
- **Success/Failure Paths**: Each node can define what happens next on success or failure
- **Topic**: A unique identifier for the strategy
- **Initial Node**: The starting point of the strategy

### Stage Planner

Stage Planners divide application functionality into discrete stages and prevent action overflows.

```typescript
const plan = muxium.plan('Plan Name', ({stage, stageO, e__}) => [
  stageO(() => e__.muxiumKick()),
  stage(({concepts, dispatch, d}) => {
    if (isConceptLoaded(concepts, 'conceptName')) {
      dispatch(d.concept.e.someAction(), {
        iterateStage: true
      });
    }
  }),
  stage(({concepts}) => {
    // Check conditions and potentially conclude the plan
    plan.conclude();
  }, {beat: 100})  // Optional beat parameter for throttling/debouncing
]);
```

Key features:
- **Stages**: Ordered sequence of operations
- **Stage Options**: Configure behavior like beat (throttling/debouncing)
- **Iterate Stage**: Move to the next stage
- **Conclude**: End the plan execution

### Action Controller

Action Controllers handle asynchronous execution of actions.

```typescript
const controller = createActionController$(
  {action, deck, self}, 
  ({controller, action}) => {
    // Perform async operations
    controller.fire(action); // Complete the action
  }
);
```

Key functions:
- **Subscribe**: Listen for action completion
- **Fire**: Complete an action and move to next step
- **Expire**: Mark an action as failed

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

Stratimux provides multiple ways to access state, with the DECK interface offering the most direct approach:

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

// It never appears in muxified records of other concepts
concept.muxifiedRecord['muxium']  // This will never exist
```

This design ensures that Stratimux maintains a clear separation between user-defined concepts and system-level operations, providing both flexibility and stability.

## Migration Guide: Legacy to DECK Interface

The DECK Interface System represents the modern approach to accessing state and dispatching actions in Stratimux. This migration guide helps you transition from legacy patterns to the streamlined DECK interface.

### Why Migrate to DECK Interface?

The DECK interface provides:
- **Type Safety**: Direct TypeScript inference without manual type assertions
- **Performance**: Eliminates string-based concept lookups and name matching
- **Simplicity**: No need to import selectors or manage concept names
- **Consistency**: Muxified pattern for both state access and action dispatch
- **Maintainability**: Self-documenting code with clear property access

### Common Migration Pitfalls and Solutions

#### Pitfall 1: Forgetting to Add keyedSelectors
```typescript
// ❌ Problem: DECK interface returns undefined
export const myQuality = createQualityCard<MyState>({
  type: 'My Quality',
  reducer: (state) => ({ ...state, processed: true })
  // Missing keyedSelectors!
});

// ✅ Solution: Always include keyedSelectors
export const myQuality = createQualityCard<MyState>({
  type: 'My Quality',
  reducer: (state) => ({ ...state, processed: true }),
  keyedSelectors: [
    mySelectProcessed,
    mySelectValue,
    mySelectStatus
  ]
});
```

#### Pitfall 2: Inconsistent Concept Naming
```typescript
// ❌ Problem: Concept name doesn't match DECK property
const muxium = muxification('App', {
  userAccountManager: createUserConcept() // Different names!
});

stage(({d}) => {
  const user = d.userConcept.k.name.select(); // ❌ Wrong concept name
});

// ✅ Solution: Keep consistent naming
const muxium = muxification('App', {
  userConcept: createUserConcept()
});

stage(({d}) => {
  const user = d.userConcept.k.name.select(); // ✅ Correct
});
```

#### Pitfall 3: Mixing DECK and Legacy in Same Function
```typescript
// ❌ Problem: Inconsistent patterns cause confusion
stage(({concepts, d, dispatch}) => {
  const newValue = d.concept1.k.value.select();          // DECK
  const oldValue = selectSlice(concepts, concept2Selector); // Legacy
  
  dispatch(concept1Action.actionCreator());               // Legacy
  dispatch(d.concept2.e.action());                      // DECK
});

// ✅ Solution: Be consistent within functions
stage(({d, dispatch}) => {
  const newValue = d.concept1.k.value.select();    // All DECK
  const oldValue = d.concept2.k.value.select();    // All DECK
  
  dispatch(d.concept1.e.action1());                // All DECK
  dispatch(d.concept2.e.action2());                // All DECK
});
```

#### Pitfall 4: Not Updating Type Definitions
```typescript
// ❌ Problem: Missing DECK type exports
export const createMyConcept = () => {
  return createConcept(/* ... */);
};

// ✅ Solution: Always export DECK types
export const createMyConcept = () => {
  return createConcept(/* ... */);
};

export type MyConceptDeck = {
  myConcept: Concept<MyConceptState, typeof myConceptQualities>;
};
```

#### Pitfall 5: Over-Migrating Complex Selectors
```typescript
// ❌ Problem: Force-fitting complex selectors into DECK
stage(({d}) => {
  // This won't work for complex nested selections
  const complexValue = d.concept.k.deepNestedArray[0].property.select(); // ❌
});

// ✅ Solution: Keep complex selectors as legacy when appropriate
stage(({concepts, d}) => {
  // Simple values use DECK
  const simpleValue = d.concept.k.simpleProperty.select();
  
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
  const state = d.concept.k.state.select();
  
  // Old pattern - unnecessary with DECK
  if (state?.property && state?.ready) { // ❌ Redundant checks
    // process
  }
});

// ✅ Solution: Trust DECK interface type safety
stage(({d}) => {
  const property = d.concept.k.property.select();
  const ready = d.concept.k.ready.select();
  
  // Direct checks - DECK handles null safety
  if (property && ready) { // ✅ Clean and safe
    // process
  }
});
```

### Migration Success Patterns

#### Pattern 1: Progressive Enhancement
```typescript
// Start with hybrid approach, gradually move to full DECK
class MigrationProgressTracker {
  private migrationPhase = 'hybrid';
  
  handleStateAccess(concepts: Concepts, d: Deck<any>) {
    switch (this.migrationPhase) {
      case 'legacy':
        return selectState(concepts, conceptName);
      case 'hybrid':
        return d.concept?.k?.state?.select() ?? selectState(concepts, conceptName);
      case 'deck':
        return d.concept.k.state.select();
    }
  }
}
```

#### Pattern 2: Feature Flag Migration
```typescript
// Use feature flags for gradual rollout
const USE_DECK_INTERFACE = process.env.NODE_ENV === 'development';

stage(({concepts, d}) => {
  const getValue = USE_DECK_INTERFACE 
    ? () => d.concept.k.value.select()
    : () => selectSlice(concepts, conceptSelector);
    
  const value = getValue();
  // Use value...
});
```

#### Pattern 3: Backward Compatibility Layer
```typescript
// Create compatibility helpers during migration
function createCompatibleSelector<T>(
  deckAccessor: () => T,
  legacyAccessor: () => T
): () => T {
  return () => {
    try {
      const deckResult = deckAccessor();
      return deckResult !== undefined ? deckResult : legacyAccessor();
    } catch {
      return legacyAccessor();
    }
  };
}

// Usage
stage(({concepts, d}) => {
  const getValue = createCompatibleSelector(
    () => d.concept.k.value.select(),
    () => selectSlice(concepts, valueSelector)
  );
  
  const value = getValue();
});
```

### Migration Validation and Quality Assurance

#### Pre-Migration Code Analysis
```typescript
// Automated analysis script to assess migration readiness
interface MigrationReadinessReport {
  conceptsWithoutKeyedSelectors: string[];
  complexSelectorUsage: {file: string, pattern: string}[];
  legacyPatternCount: {
    selectState: number;
    selectSlice: number;
    selectObject: number;
  };
  migrationPriority: 'high' | 'medium' | 'low';
}

function analyzeMigrationReadiness(sourceFiles: string[]): MigrationReadinessReport {
  // Implementation would scan files for patterns
  return {
    conceptsWithoutKeyedSelectors: ['experimentConcept', 'timerConcept'],
    complexSelectorUsage: [
      {file: 'complex-stage.ts', pattern: 'createMuxifiedKeyedSelector'},
      {file: 'nested-access.ts', pattern: 'selectSlice with array access'}
    ],
    legacyPatternCount: {
      selectState: 45,
      selectSlice: 32,
      selectObject: 12
    },
    migrationPriority: 'high'
  };
}
```

#### Migration Quality Gates
```typescript
// Quality gate checks before migration approval
interface QualityGate {
  name: string;
  check: () => Promise<boolean>;
  description: string;
  required: boolean;
}

const migrationQualityGates: QualityGate[] = [
  {
    name: 'Type Safety',
    check: async () => {
      // Run TypeScript compiler to check for type errors
      const result = await runCommand('npx tsc --noEmit');
      return result.exitCode === 0;
    },
    description: 'All TypeScript types must compile without errors',
    required: true
  },
  {
    name: 'Test Coverage',
    check: async () => {
      const coverage = await runCoverageAnalysis();
      return coverage.percentage >= 80;
    },
    description: 'Test coverage must maintain 80% or higher',
    required: true
  },
  {
    name: 'Performance Benchmark',
    check: async () => {
      const benchmarks = await runPerformanceBenchmarks();
      return benchmarks.regressionPercentage < 5;
    },
    description: 'Performance must not regress more than 5%',
    required: false
  },
  {
    name: 'Bundle Size',
    check: async () => {
      const bundleAnalysis = await analyzeBundleSize();
      return bundleAnalysis.sizeReduction > 0;
    },
    description: 'Bundle size should reduce or stay same',
    required: false
  }
];
```

#### Post-Migration Monitoring
```typescript
// Monitor migration health in production
class MigrationHealthMonitor {
  private metrics = {
    deckAccessErrors: 0,
    performanceImprovements: [] as number[],
    userReportedIssues: 0
  };

  monitorDeckAccess() {
    // Wrap DECK access with error tracking
    return {
      safeSelect: <T>(accessor: () => T, fallback?: T): T => {
        try {
          const result = accessor();
          return result !== undefined ? result : fallback as T;
        } catch (error) {
          this.metrics.deckAccessErrors++;
          console.warn('DECK access error:', error);
          return fallback as T;
        }
      }
    };
  }

  generateHealthReport() {
    return {
      migrationHealth: this.metrics.deckAccessErrors < 10 ? 'healthy' : 'warning',
      avgPerformanceGain: this.calculateAverage(this.metrics.performanceImprovements),
      issueRate: this.metrics.userReportedIssues / this.getTotalUsers(),
      recommendations: this.generateRecommendations()
    };
  }

  private generateRecommendations(): string[] {
    const recommendations = [];
    
    if (this.metrics.deckAccessErrors > 5) {
      recommendations.push('Review DECK interface usage for undefined access patterns');
    }
    
    if (this.metrics.performanceImprovements.length === 0) {
      recommendations.push('Measure and track performance improvements from migration');
    }
    
    return recommendations;
  }
}
```

#### Migration Rollback Procedures
```typescript
// Automated rollback system for failed migrations
interface RollbackPlan {
  conceptName: string;
  backupBranch: string;
  affectedFiles: string[];
  dependentConcepts: string[];
  rollbackSteps: RollbackStep[];
}

interface RollbackStep {
  action: 'revert_file' | 'restore_imports' | 'update_types' | 'run_tests';
  target: string;
  validation: () => Promise<boolean>;
}

class MigrationRollbackManager {
  async executeRollback(plan: RollbackPlan): Promise<boolean> {
    console.log(`Starting rollback for ${plan.conceptName}...`);
    
    for (const step of plan.rollbackSteps) {
      try {
        await this.executeRollbackStep(step);
        
        const isValid = await step.validation();
        if (!isValid) {
          console.error(`Rollback step failed validation: ${step.action}`);
          return false;
        }
      } catch (error) {
        console.error(`Rollback step failed: ${step.action}`, error);
        return false;
      }
    }
    
    console.log(`Rollback completed successfully for ${plan.conceptName}`);
    return true;
  }

  private async executeRollbackStep(step: RollbackStep): Promise<void> {
    switch (step.action) {
      case 'revert_file':
        await this.revertFile(step.target);
        break;
      case 'restore_imports':
        await this.restoreImports(step.target);
        break;
      case 'update_types':
        await this.updateTypes(step.target);
        break;
      case 'run_tests':
        await this.runTests(step.target);
        break;
    }
  }
}
```

#### Migration Documentation Generator
```typescript
// Generate comprehensive migration documentation
interface MigrationDocumentation {
  conceptName: string;
  migrationDate: Date;
  changes: {
    importsRemoved: string[];
    deckPatternsAdded: string[];
    performanceImprovements: number;
    testUpdates: string[];
  };
  troubleshooting: {
    commonIssues: string[];
    solutions: string[];
  };
}

function generateMigrationDoc(concept: string): MigrationDocumentation {
  return {
    conceptName: concept,
    migrationDate: new Date(),
    changes: {
      importsRemoved: [
        'selectState from ../model/selector/selector',
        'selectSlice from ../model/selector/selector',
        `${concept}Name from ./${concept}.concept`,
        `${concept}State from ./${concept}.concept`
      ],
      deckPatternsAdded: [
        `d.${concept}.k.property.select() for state access`,
        `d.${concept}.e.action() for action dispatch`
      ],
      performanceImprovements: 15, // percentage
      testUpdates: [
        'Simplified test setup with DECK patterns',
        'Removed selector imports in test files',
        'Updated assertion patterns'
      ]
    },
    troubleshooting: {
      commonIssues: [
        'Undefined DECK properties',
        'Type inference problems',
        'Missing keyedSelectors'
      ],
      solutions: [
        'Ensure keyedSelectors are included in quality definitions',
        'Export proper DECK type definitions',
        'Use optional chaining for conditional concept access'
      ]
    }
  };
}
```
