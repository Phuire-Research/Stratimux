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
  
  // k: Constant selectors for state access
  const count = k.count(concepts);
  
  // c: Comparators (not shown in example)
  // Used for stringless comparison
});
```

Components:
- **d (deck)**: Access to all concepts' functionality
- **e (entry)**: Direct actions for the current concept
- **c (comparators)**: Stringless comparison for action types
- **k (keyed selectors)**: State selectors

## Data Flow

1. **Actions** are created from qualities and dispatched
2. **Methods** handle side effects
3. **Reducers** update state
4. **Selectors** access state
5. **Stage Planners** orchestrate sequences of operations
6. **Strategies** define complex action flows with error handling

## Common Patterns

### Creating a New Concept

```typescript
// State type
export type MyConceptState = {
  property: string
};

// Create initial state
export const createMyConceptState = (): MyConceptState => ({
  property: 'initial value'
});

// Define qualities
const qualities = {
  myQuality1,
  myQuality2
};

// Export concept type for deck
export type MyConceptDeck = {
  myConcept: Concept<MyConceptState, typeof qualities>;
};

// Export principle type for type safety
export type MyConceptPrinciple = PrincipleFunction<typeof qualities, MuxiumDeck & MyConceptDeck, MyConceptState>;

// Create and export the concept creator
export const createMyConceptConcept = () => {
  return createConcept(
    'myConceptName',
    createMyConceptState(),
    qualities,
    [myConceptPrinciple]
  );
};
```

### Creating a Strategy

```typescript
export function myStrategy<T extends Deck<MyConceptDeck>>(deck: Partial<T>): ActionStrategy | undefined {
  if (deck.myConcept) {
    const finalStep = createActionNode(deck.myConcept.e.someAction());
    
    const initialStep = createActionNode(deck.myConcept.e.anotherAction(), {
      successNode: finalStep,
      failureNode: null // Or another recovery node
    });

    return createStrategy({
      topic: 'My Strategy Topic',
      initialNode: initialStep
    });
  }
  return undefined;
}
```

### Using Stage Planners

```typescript
// In a principle
const myPlan = plan<MyConceptDeck>('My Plan', ({staging, stageO, stage, d__}) => staging(() => {
  // Register the plan with the muxium
  const stageRegister = stageO(() => (d__.muxium.e.muxiumRegisterStagePlanner({
    conceptName: 'myConceptName', 
    stagePlanner: myPlan
  })));

  // Dispatch a strategy
  const stageDispatch = stage(({concepts, dispatch, k, d}) => {
    const state = k.state(concepts);
    if (state) {
      dispatch(strategyBegin(myStrategy(d)), {
        iterateStage: true
      });
    }
  }, {beat: 30});  // Optional beat configuration

  // Check for completion
  const stageFinalize = stage(({concepts, stagePlanner}) => {
    const {lastStrategy} = getMuxiumState(concepts);
    if (lastStrategy === 'My Strategy Topic') {
      stagePlanner.conclude();
    }
  });

  return [stageRegister, stageDispatch, stageFinalize];
}));
```

## Best Practices

1. **Concept Organization**: Treat concepts as libraries/modules with clear responsibilities
2. **Quality Design**: Keep qualities focused on single state transformations
3. **Strategy Composition**: Build complex workflows from simpler strategies
4. **Error Handling**: Always define success and failure paths in strategies
5. **State Access**: Use selectors for type-safe state access
6. **Beat Configuration**: Use beat parameters to control stage execution timing
7. **Deck Interface**: Always use the DECK interface for type safety
8. **Simplify Logic**: If strategies behave unpredictably, simplify logic and time complexity

## Limitations and Considerations

1. **Branch Prediction Errors**: Be mindful of complex strategies (O(n³) and beyond)
2. **Flattened Data Structures**: Prefer flattened data structures for better performance
3. **Debugging**: Enable dialog and logging options to diagnose issues

## Glossary

- **Muxification**: A multiplex of quantitative and qualitative reasoning
- **Concept**: A building block composed of state, qualities, principles, and mode
- **Quality**: Function that defines actions to update state and side effects
- **Strategy**: Composed action sequence with error correction paths
- **Stage Planner**: System to divide application into discrete stages
- **Action Controller**: Handler for asynchronous execution
- **DECK Interface**: Direct Entry with Constant Keys for type safety
- **Principle**: Initialization function for concepts
- **Selector**: Function to extract specific data from state
- **Action Node**: Individual step in a strategy
- **Reducer**: Pure function to transform state based on actions
- **Method**: Function to handle side effects

## Conclusion

Stratimux provides a sophisticated approach to application development with its unique mix of functional programming, reactive architecture, and error-correcting strategies. By organizing code into concepts, qualities, and strategies, it enables building complex systems while maintaining clarity and error resilience.
