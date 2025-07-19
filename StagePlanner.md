## Stage Planner
### Abstract
This is derived from the newly created MuxifiedSubject to handle the main point of vulnerability that a recursive machine carries. As the main point of dispatching new actions in the system would traditionally be informed via the subscription to listen to state changes. This Design Pattern allows one to safely dispatch in a tightly patterned subscription. This design pattern watches each stage for the potential of a runaway configuration which would normally prevent this machine from halting. But since the Muxified Turing Machine was created to be halting complete. The MuxifiedSubject internally watches each stage of your application independently and the actions that it dispatches via the supplied dispatch function. If a similar action is dispatched in rapid succession denoted by its type and no throttle option. That plan will conclude and be added to the muxium's badPlans property.

With the advent of **StratiDECK** and Higher Order Conceptual Composition, the Stage Planner has evolved to support sophisticated orchestration patterns across muxified concept higher order compositions. The new `staging` helper function enables scoped stage composition, allowing for enhanced reusability and type-safe coordination between outer concepts and their inner muxified dependencies.

Once attached to the badPlan property, it would be possible to reinitialize said stage via your concept's principle utilizing the stage's title. But places that burden of responsibility on the developer. As the scope of a Muxified Turing Machine is to be designed to specification and halt appropriately. We accept failure as likewise the ability to halt.

*"You stage a plan and a plan has multiple stages."*

## Working with the Stage Planner Paradigm
The added benefit of the creation of a plan to control the flow of actions. Allows the ability to create a series of stages to handle how the dispatch would be handled within a subscription, but with the added benefit of iterating through each stage your plan. A typical plan would typically be composed of an initialization, main run time, and likewise the ability to conclude. 3 acts if you will.

### StratiDECK Planning Interface
In v0.3.22, the Stage Planner introduces enhanced planning capabilities through the `Planner` interface, which provides access to comprehensive type-safe utilities:

```typescript
export type Planner<Q = void, C = void, S = void> = (uI: HInterface<Q, C, S> & {
  stage: typeof createStage<Q, C, S>
  stageO: typeof stageWaitForOpenThenIterate,
  conclude: typeof stageConclude,
  staging: typeof createStages<Q, C, S>  // NEW in v0.3.22
}) => PartialStaging<Q, C, S>[];
```

### Enhanced Plan Structure  
```typescript
// Enhanced Plan with v0.3.22 capabilities
export type Plan<Q = void, C = void, S = void> = {
  id: number;
  space: number;
  conceptSemaphore: number;
  conceptName: string;
  title: string;
  stages: Staging<Q, C, S>[],
  stage: number;
  stageFailed: number;
  beat: number;
  offBeat: number;
  timer: NodeJS.Timeout[];
  changeAggregator: Record<string, KeyedSelector>;
}
```
* **id** - Unique identifier for plan tracking and management
* **conceptSemaphore** - Semaphore for concept-specific plan coordination
* **conceptName** - Name of the associated concept for debugging and management
* **title** - Title of your plan, used to determine your plan within badPlans stored on the muxium if they fail
* **stage** - This is your stage index, starting at 0
* **stages** - Is an array of function that will be called upon each notification depending on the current stage index
* **stageFailed** - Is a fail safe mechanism to prevent action overflow due to branch prediction errors
* **beat/offBeat** - Timing control for stage execution throttling and debouncing
* **timer** - Active timers for stage scheduling and beat management
* **changeAggregator** - Accumulates selector changes for beat-based stages
### Stage Options
```typescript
export type dispatchOptions = {
  override?: boolean;
  specificOverride?: number;
  conceptOverride?: boolean;
  planOverride?: boolean;
  runOnce?: boolean;
  throttle?: number;
  iterateStage?: boolean;
  setStage?: number;
  setStageSelectors?: {
    stage: number,
    selectors: KeyedSelector[]
  };
  setStagePriority?: {
    stage: number,
    priority: number
  };
  setStageBeat?: {
    stage: number,
    beat: number
  };
  newSelectors?: KeyedSelector[];
  newPriority?: number;
  newBeat?: number;
}
```

* **dispatchOptions**
  * **override/s** - Control action priority handling and origin management for complex dispatching scenarios
  * **runOnce** - If enabled on the dispatch options, this will permit only one dispatch of that action within its stage
  * **throttle** - Required to prevent the stage to be considered bad if rerunning the same action within the same stage, specific use case is tracking some position over time. If enabled, this will only come into play after that action is first dispatched
  * **iterateStage** - Will increment to the next stage index, this should be your default option for dispatching actions or strategies to prevent action overflow
  * **setStage** - This will set the stage to a specific stage index, useful if some strategy failed and the staging needs to be reset to prepare for that strategy again. This will always override iterateStage
  * **setStageSelectors/Priority/Beat** - This will set a specific stage's selectors, but will not trigger a cache of the current priority selector order queue. This likewise applies to Priority/Beat
  * **newSelectors/Priority/Beat** - Will set the current stage's selectors/priority/beat

#### Stage Selectors
This utilizes Stratimux's KeyedSelectors to control when a stage would run as a built in form of change detection. Noting that once a stage is incremented or set, it will always run the first time. But may not receive the specific changes that the selector is actively looking for. The strength of this approach allows us to move beyond ECS into a system that is reactive and atomic that likewise allows for Stratimux to function as a FaaOS(Function as a Operating System).

Selectors can be dynamically updated using the `setStageSelectors` dispatch option, enabling sophisticated state observation patterns that adapt to changing application conditions.

#### Stage Priority
Of the main issues with utilizing a single point of observation, is that some plans you might devise should take precedence over others. For example the Muxium's own close principle has the highest priority of all observations and will force a shutdown of the entire Muxium upon observation. We have likewise provided the set and new stage options for the priority value to allow some intelligence to be at play, keeping in mind Stratimux is designed to act as a form of logical embodiment for this generation's probabilistic AI.

The priority system operates across three execution spaces (Inner, Base, Outer) to coordinate complex muxified concept higher order conceptual compositions effectively.

#### Stage Beat
The beat value each stage may have, is a new concept similar to the throttle and debounce found in reactive programming. Except here the first observation will run, and any subsequent observations will be delayed until just after the beat value expires. This ensures a constant stream of observations, while allowing for gaps of time that will instantly resume once the observation becomes relevant again, aggregating all changes that occurred between beats. Think Frames Per Second (FPS).

The beat system includes sophisticated change aggregation capabilities, collecting all selector changes during the beat period and providing them as a batch to the stage when it executes.

### Stage Planner Internals
```typescript
export type Dispatcher = (action: Action, options: dispatchOptions) => void;

export type Stage = (
  concepts: Concepts,
  dispatch: (action: Action, options: dispatchOptions, ) => void,
  changes?: KeyedSelector[]
) => void;

export type Staging = {
  stage: Stage;
  selectors: KeyedSelector[];
  priority?: number
  beat?: number,
};
export type PartialStaging = {
  stage: Stage;
  selectors?: KeyedSelector[];
  priority?: number
  beat?: number,
};

export const createStage = (stage: Stage, selector?: KeyedSelector[], priority?: number, beat?: number): Staging => {
  return {
    stage,
    selectors: selector ? selector : [],
    priority,
    beat
  };
};

export class MuxifiedSubject extends Subject<Concepts> {
  plan(title: string, stages: PartialStaging[]): StagePlanner {}
}
```
* Dispatcher - This is the supplied dispatch function that is made available each stage.
* Staging - A functional interface that informs input and output of each stage in your plan.
  * **concepts** - The most recent concepts
  * **dispatch** - Use to dispatch new actions and strategies into your muxium
  * **changes** - Informs which properties of the supplied KeyedSelectors for the current stage have changed.
* createStage - Helper function that guides assembly of a Staging entity
* MuxifiedSubject - This is a specialized subject for utilized within Stratimux to allow for this stage planner paradigm. This is made available via the muxification function and likewise within your principles via the concept$ property. Note that your plan will be an array of Staging entities created manually or via the createStage function.

## Example

### Stage Planner with the StratiDECK
This comprehensive example demonstrates the enhanced Stage Planner capabilities, including stage dispatch options, error handling, and the new `staging` helper for improved composition:

```typescript
// StratiDECK Stage Planner Example with enhanced typing and capabilities
test('Stage Planner Complete Example', (done) => {
  let runCount = 0;
  const muxium = muxification('Stage Planner Example', {
    counter: createCounterConcept()
  }, {logging: true, storeDialog: true});

  // Monitor for stage failures and bad plans
  const sub = muxium.subscribe((concepts) => {
    const muxiumState = getMuxiumState(concepts);
    if (muxiumState.badPlans.length > 0) {
      const badPlan = muxiumState.badPlans[0];
      const counter = selectState<CounterState>(concepts, counterName);
      console.log('Stage Failed - Plan:', badPlan.title, 'Failed Stage:', badPlan.stageFailed);
      
      plan.conclude();
      sub.unsubscribe();
      expect(badPlan.stageFailed).toBe(2);
      expect(counter?.count).toBe(2);
      setTimeout(() => done(), 500);
    }
  });

  // Enhanced v0.3.22 plan using modern patterns
  const plan = muxium.plan<CounterDeck>('v0.3.22 Stage Dispatch Options Demo', 
    ({staging, stage, stageO, d}) => staging(() => {
      // Stage 0: Initialization using stageO helper
      const initStage = stageO(() => d.muxium.e.muxiumKick());

      // Stage 1: Basic increment with runCount tracking
      const incrementStage = stage(({concepts, dispatch, d}) => {
        const counter = selectState<CounterState>(concepts, counterName);
        console.log('Stage 1 - Initial increment:', counter?.count, 'Run:', runCount);
        
        dispatch(d.counter.e.counterAdd(), {
          iterateStage: true
        });
      });

      // Stage 2: Conditional logic with runOnce and setStage
      const conditionalStage = stage(({concepts, dispatch, d}) => {
        runCount++;
        const counter = selectState<CounterState>(concepts, counterName);
        const currentCount = selectSlice(concepts, counterSelectCount);
        console.log('Stage 2 - Conditional logic:', counter?.count, 'Run:', runCount);

        // First action: increment once per state update only
        dispatch(d.counter.e.counterAdd(), {
          runOnce: true  // v0.3.22 enhanced: prevents action repetition
        });

        // Conditional stage jumping when count reaches 2
        if (currentCount === 2) {
          dispatch(d.counter.e.counterAdd(), {
            setStage: 2,    // Jump to stage 2 (third stage, 0-indexed)
            throttle: 1     // Prevent rapid-fire execution
          });
        }
      });

      // Stage 3: Demonstrates action overflow protection
      const overflowDemoStage = stage(({concepts, dispatch, d}) => {
        runCount++;
        const counter = selectState<CounterState>(concepts, counterName);
        console.log('Stage 3 - Overflow demonstration:', counter?.count, 'Run:', runCount);

        // This will cause action overflow (consecutive same actions)
        dispatch(d.counter.e.counterSubtract(), {
          // throttle: 500  // Uncommenting prevents overflow
        });

        // This dispatch is invalidated due to overflow protection
        dispatch(d.counter.e.counterAdd(), {});
        
        console.log(
          'Overflow protection active - subsequent actions in same stage are blocked'
        );
      });

      return [initStage, incrementStage, conditionalStage, overflowDemoStage];
    })
  );
});
```

### Advanced StratiDECK StagePlanner Features Demonstrated

This example showcases key v0.3.22 enhancements:

**1. Enhanced Stage Composition with `staging`:**
- Scoped stage creation with full type safety
- Improved readability and maintainability
- Better integration with muxified concept higher order compositions

**2. Advanced Dispatch Options:**
- `runOnce`: Prevents action repetition within stage executions
- `setStage`: Dynamic stage jumping for complex flow control
- `throttle`: Timing control to prevent rapid-fire actions
- `iterateStage`: Standard progression to next stage

**3. Built-in Overflow Protection:**
- Automatic detection of consecutive identical actions
- Graceful failure handling via `badPlans` mechanism
- Maintains system stability during recursive operations

**4. Enhanced Error Handling:**
- Failed plans are tracked with stage-specific information
- Clean recovery patterns for production applications
- Debugging support through plan titles and failure metadata

### Action Overflow Protection

To prevent action overflow, each stage monitors consecutive actions of the same type. The system maintains a sliding window of the most recent 5 actions per stage to detect potential infinite loops. This can be overwhelmed via `throttle: 0`, but such configurations should include stage advancement logic.

**Key Protection Mechanisms:**
- **Consecutive Action Detection**: Prevents same action type repetition
- **Throttle Controls**: Timing-based action spacing
- **runOnce Semantics**: Single execution per state change
- **Stage Advancement**: Controlled flow progression

In an action overflow state, the system will sequentially process overflow calls before advancing to subsequent dispatches, even within the same stage. The final `console.log()` output in the example demonstrates this behavior.

## Stage Planner within your Principle

### v0.3.22 Principle Integration Patterns

Stratimux is designed to operate primarily through loaded concepts and their associated principles. The Stage Planner integrates seamlessly with principle-driven architectures, providing structured workflows within concept lifecycles.

To ensure predictable behavior and prevent race conditions, utilize the muxium's `open` property selector to coordinate stage execution with system readiness:

```typescript
// Modern v0.3.22 principle-based stage planner
const conceptPrinciple: PrincipleFunction = (concept$, semaphore) => {
  const plan = concept$.plan('Principle Workflow Manager', ({staging, stage, stageO, d__, k__}) => 
    staging(() => {
      // Stage 0: Wait for muxium initialization
      const initStage = stageO(() => d__.muxium.e.muxiumKick());

      // Stage 1: Principle initialization logic
      const principleInitStage = stage(({concepts, dispatch, d}) => {
        if (selectSlice(concepts, muxiumSelectOpen)) {
          console.log('Muxium is open - initializing principle workflow');
          
          // Dispatch principle-specific initialization
          dispatch(d.myPrinciple.e.myPrincipleInitialize(), {
            iterateStage: true
          });
        }
      }, { 
        selectors: [muxiumSelectOpen],  // Only trigger on muxium open state changes
        priority: 100                   // High priority for initialization
      });

      // Stage 2: Main principle runtime logic
      const runtimeStage = stage(({concepts, dispatch, changes, d}) => {
        const myPrincipleState = selectState(concepts, 'myPrinciple');
        const muxiumState = getMuxiumState(concepts);
        
        // Enhanced change detection with v0.3.22 selectors
        if (changes?.some(change => change.keys.includes('initialized'))) {
          console.log('Principle state changed:', changes);
          
          // Execute principle-specific business logic
          dispatch(d.myPrinciple.e.myPrincipleExecuteWorkflow(), {
            iterateStage: true,
            throttle: 1000  // Prevent rapid execution
          });
        }
      }, { 
        selectors: [k__.myPrinciple.initialized, k__.lastStrategy],
        beat: 300  // Aggregate changes over 300ms
      });

      // Stage 3: Cleanup and conclusion
      const cleanupStage = stage(({concepts, stagePlanner}) => {
        const muxiumState = getMuxiumState(concepts);
        
        if (muxiumState.lastStrategy === 'myPrincipleWorkflowComplete') {
          console.log('Principle workflow completed successfully');
          stagePlanner.conclude();
        }
      }, { 
        selectors: [k__.lastStrategy] 
      });

      return [initStage, principleInitStage, runtimeStage, cleanupStage];
    })
  );

  return plan;
};
```

### Higher Order Conceptual Composition Integration

In v0.3.22's StratiDECK system, Stage Planners can coordinate between outer concepts and their muxified inner concept dependencies:

```typescript
// Muxified concept with Stage Planner coordination
const outerConcept = createConcept('dataProcessor', createDataProcessorState(), [], [
  // Principle integrates Stage Planner with muxified concepts
  (concept$, semaphore) => {
    const plan = concept$.plan('Process Coordination Plan', ({staging, stage, d, k}) => 
      staging(() => {
        const coordinationStage = stage(({concepts, dispatch, d}) => {
          // Access both outer and inner muxified concept states
          const outerState = selectState(concepts, 'dataProcessor');
          const innerCounterState = d.innerCounter.k.count.select();  // Muxified access
          
          if (outerState?.needsProcessing && innerCounterState > 0) {
            // Coordinate between outer concept logic and inner muxified concepts
            dispatch(d.innerCounter.e.counterProcessData(), {
              iterateStage: true
            });
          }
        }, { 
          selectors: [k.needsProcessing, d.innerCounter.k.count],
          priority: 50
        });

        return [coordinationStage];
      })
    );
    
    return plan;
  }
]);
```

### Key Principle Integration Benefits

**1. Structured Lifecycle Management:**
- Predictable initialization and cleanup phases
- State-driven progression through concept lifecycles
- Clean separation of concerns between concept logic and orchestration

**2. Enhanced Observability:**
- Fine-grained change detection through selector-based stages
- Debugging support via plan titles and stage metadata
- Performance monitoring through beat aggregation

**3. Fault Tolerance:**
- Graceful failure handling through badPlans mechanism
- Recovery patterns for production environments
- Isolation of failures to specific stages/plans

**4. Coordination Capabilities:**
- Multi-concept orchestration through shared selectors
- Priority-based execution ordering for complex dependencies
- Dynamic stage management for adaptive behaviors
## How Stage Priority Effects Actions

### v0.3.22 Enhanced Priority System

The v0.3.22 priority system operates across three execution spaces (Inner, Base, Outer) to coordinate complex muxified concept higher order compositions effectively. When actions are dispatched into the action stream, they enter a sophisticated queuing system that respects both stage priorities and action-specific priorities.

### Priority Inheritance and Overrides

By default, any priority assigned to a stage will be inherited by actions dispatched from that stage. This ensures that high-priority stages maintain their precedence throughout the execution chain. However, v0.3.22 provides fine-grained control over this behavior:

```typescript
// Modern v0.3.22 priority patterns with enhanced control

// High observation priority, but neutral action priority
const priorityObserverStage = stage(({dispatch, e}) => {
  const action = e.muxiumKick();
  action.priority = 0;  // Explicit neutral priority
  
  dispatch(action, {
    iterateStage: true
  });
}, {priority: 100});  // Stage has high observation priority

// Normal observation priority, but high action priority  
const priorityActionStage = stage(({dispatch, e}) => {
  const action = e.muxiumKick();
  action.priority = 100;  // Explicit high action priority
  
  dispatch(action, {
    iterateStage: true
  });
});  // No stage priority - uses default

// Dynamic priority adjustment based on conditions
const adaptivePriorityStage = stage(({concepts, dispatch, d}) => {
  const systemLoad = selectSlice(concepts, systemLoadSelector);
  const action = d.processing.e.processData();
  
  // Adjust priority based on system conditions
  if (systemLoad > 0.8) {
    action.priority = 200;  // High priority for critical operations
  } else {
    action.priority = 50;   // Normal priority for routine operations
  }
  
  dispatch(action, {
    iterateStage: true,
    throttle: systemLoad > 0.9 ? 2000 : 500  // Adaptive throttling
  });
}, {priority: 150});  // High observation priority for system monitoring
```

### Advanced Priority Coordination

The v0.3.22 priority system enables sophisticated coordination patterns:

**1. Multi-Space Priority Coordination:**
```typescript
// Coordinate priorities across Inner, Base, and Outer spaces
const multiSpacePlan = muxium.plan('Multi-Space Coordination', ({staging, stage, d}) => 
  staging(() => {
    // Inner space: High-frequency, low-priority operations
    const innerStage = stage(({dispatch, d}) => {
      dispatch(d.dataProcessor.e.processChunk(), {
        iterateStage: true
      });
    }, {priority: 10});  // Lower priority for batch processing

    // Base space: Normal application logic
    const baseStage = stage(({dispatch, d}) => {
      dispatch(d.application.e.handleUserRequest(), {
        iterateStage: true
      });
    }, {priority: 50});  // Standard priority for user interactions

    // Outer space: Critical system operations
    const outerStage = stage(({dispatch, d}) => {
      dispatch(d.system.e.handleCriticalError(), {
        iterateStage: true
      });
    }, {priority: 200});  // Highest priority for critical operations

    return [innerStage, baseStage, outerStage];
  })
);
```

**2. Dynamic Priority Management:**
```typescript
// Dynamic priority adjustment through dispatch options
const dynamicPriorityStage = stage(({concepts, dispatch, d}) => {
  const currentLoad = selectSlice(concepts, systemLoadSelector);
  const userCount = selectSlice(concepts, activeUserCountSelector);
  
  // Calculate dynamic priority based on system state
  const calculatedPriority = Math.min(200, 50 + (userCount * 5) + (currentLoad * 100));
  
  dispatch(d.resourceManager.e.allocateResources(), {
    iterateStage: true,
    newPriority: calculatedPriority  // v0.3.22: Dynamic priority assignment
  });
});
```

### Priority Queue Behavior

**Key Priority Principles:**
- **Priority Inheritance**: Actions inherit stage priority by default
- **Explicit Override**: `action.priority = N` overrides stage priority
- **Zero Priority Bypass**: `action.priority = 0` skips priority queue processing
- **Undefined Fallback**: `action.priority = undefined` reverts to stage priority

**Queue Processing Order:**
1. **Critical Actions** (priority ≥ 200): Immediate processing
2. **High Priority** (priority 100-199): Fast-track processing
3. **Normal Priority** (priority 50-99): Standard queue processing
4. **Low Priority** (priority 1-49): Background processing
5. **Zero Priority** (priority = 0): Bypass queue entirely

### Best Practices for Priority Management

**1. Reserve High Priorities for Critical Operations:**
```typescript
// ✅ Good: High priority for system-critical operations
stage(({dispatch, e}) => {
  dispatch(e.systemShutdown(), {iterateStage: true});
}, {priority: 300});  // Reserved for critical system operations
```

**2. Use Adaptive Priorities for Resource Management:**
```typescript
// ✅ Good: Adaptive priority based on system conditions
stage(({concepts, dispatch, d}) => {
  const priority = calculatePriorityBasedOnLoad(concepts);
  const action = d.processing.e.processTask();
  action.priority = priority;
  
  dispatch(action, {iterateStage: true});
});
```

**3. Coordinate Multi-Concept Priorities:**
```typescript
// ✅ Good: Coordinated priorities across concept boundaries
const coordinatedPlan = staging(() => {
  const uiStage = stage(({dispatch, d}) => {
    dispatch(d.ui.e.updateDisplay(), {iterateStage: true});
  }, {priority: 75});  // UI updates

  const dataStage = stage(({dispatch, d}) => {
    dispatch(d.data.e.processData(), {iterateStage: true});
  }, {priority: 25});  // Background data processing

  return [uiStage, dataStage];  // UI gets priority over background tasks
});
```

## Conclusion

### The Evolution of Stage Planning in v0.3.22

The Stage Planner represents one of Stratimux's most powerful paradigms for managing complex application workflows. With v0.3.22's StratiDECK enhancements, it has evolved into a sophisticated orchestration system capable of coordinating Higher Order Conceptual Compositions with precision and reliability.

### Key Achievements in v0.3.22

**1. Enhanced Composition Capabilities:**
- The `staging` helper function enables scoped stage composition
- Improved type safety and developer experience
- Better integration with muxified concept higher order compositions

**2. Advanced Flow Control:**
- Sophisticated dispatch options (`runOnce`, `setStage`, `throttle`)
- Dynamic selector management for adaptive behavior
- Beat-based timing control for performance optimization

**3. Robust Error Handling:**
- Built-in overflow protection prevents infinite loops
- Graceful failure recovery through badPlans mechanism
- Comprehensive debugging support for production environments

**4. Multi-Space Coordination:**
- Priority-based execution across Inner, Base, and Outer spaces
- Seamless integration with muxified concept dependencies
- Scalable patterns for complex application architectures

### The Stage Planner as Universal Orchestrator

In the context of Higher Order Conceptual Composition, the Stage Planner serves as a universal orchestrator, enabling:

- **Temporal Coordination**: Sequencing operations across time
- **Spatial Coordination**: Managing interactions across concept boundaries  
- **Priority Coordination**: Balancing competing resource demands
- **Error Coordination**: Handling failures across system boundaries

### Future-Proof Architecture

The StatiDECK Stage Planner is designed for extensibility and adaptation:

- **Modular Design**: Stages can be composed, reused, and extended
- **Type Safety**: Full TypeScript integration ensures reliability
- **Performance Optimization**: Beat aggregation and priority queuing maximize efficiency
- **Fault Tolerance**: Built-in resilience patterns ensure system stability

### Best Practices Summary

1. **Use `staging` for Complex Plans**: Leverage the scoped composition helper for better organization
2. **Implement Proper Error Handling**: Always monitor `badPlans` for production applications
3. **Optimize with Beat Timing**: Use beat values to aggregate changes and improve performance
4. **Coordinate with Priorities**: Design priority schemes that reflect business criticality
5. **Integrate with Principles**: Embed Stage Planners in concept principles for lifecycle management

The Stage Planner transforms Stratimux from a reactive framework into a comprehensive orchestration platform, capable of managing the most complex StratiDECK Architectures while maintaining the simplicity and elegance that makes Stratimux unique.
