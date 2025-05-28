# QOL 0.3.11 - createStages Helper Function

## Key Changes from Commit 514e4d3

### New Helper Function: createStages
**Added to Stage Planner** called `createStaging` or accessed as `"staging"` in the plan callback deconstruction.

### New Type Interface Updates
**Planner Type Enhancement:**
```typescript
export type Planner<Q = void, C = void, S = void> = (uI: HInterface<Q, C, S> & {
  stage: typeof createStage<Q, C, S>
  stageO: typeof stageWaitForOpenThenIterate,
  conclude: typeof stageConclude,
+ staging: typeof createStages<Q, C, S>  // NEW
}) => PartialStaging<Q, C, S>[];
```

### Implementation in stagePlannerHelpers.ts
**New Function Definition:**
```typescript
export const createStages = <
  Q = void,
  C = void,
  S = void
>(cb: () => Staging<Q, C, S>[]):
  Staging<Q, C, S>[] => cb();
```

### Updated Plan Creator
**stagePlannerPlan.ts updates:**
```typescript
import { createStage, createStages, stageConclude, stageWaitForOpenThenIterate } from './stagePlannerHelpers';

// Function signature update:
export function createPlan<Q,C,S>(
  // ... existing parameters
  } as BundledSelectors<any>,
  stage: createStage,
  stageO: stageWaitForOpenThenIterate,
  conclude: stageConclude,
+ staging: createStages  // NEW
});
```

### Export Updates
**Added to main index.ts exports:**
```typescript
export {
  stageWaitForOpenThenIterate,
  stageWaitForOwnershipThenIterate,
  createStage,
+ createStages  // NEW
} from './model/stagePlanner/stagePlannerHelpers';
```

### Usage Example in README
**Enhanced MuX Principle example showing two approaches:**

**Traditional approach:**
```typescript
const muxPlan = plan('muX Plan', ({stageO, stage, d__}) => [
  stageO(() => (d__.muxium.e.muxiumRegisterStagePlanner({conceptName: muXName, stagePlanner: muxPlan}))),
  stage(({concepts, dispatch, k, d}) => {
    // stage logic
  }, {beat: 30}),
  stage(({concepts, stagePlanner}) => {
    // finalization logic
  })
]);
```

**New staging approach:**
```typescript  
const muxPlan = plan<MUXDeck>('muX Plan', ({staging, stageO, stage, d__}) => staging(() => {
  // By using the staging helper function you gain access to scope encapsulation 
  // while maintaining type safety
  const stageRegister = stageO(() => (d__.muxium.e.muxiumRegisterStagePlanner({conceptName: muXName, stagePlanner: muxPlan})))

  const stageDispatch = stage(({concepts, dispatch, k, d}) => {
    const state = k.state(concepts);
    if (state) {
      dispatch(strategyBegin(muXSomeStrategy(d)), {
        iterateStage: true
      });
    }
  }, {beat: 30});

  const stageFinalize = stage(({concepts, stagePlanner}) => {
    const {lastStrategy} = getMuxiumState(concepts);
    if (lastStrategy === muXSomeStrategyTopic) {
      stagePlanner.conclude();
    }
  });

  return [stageRegister, stageDispatch, stageFinalize];
}));
```

### Benefits
- **Scope Encapsulation**: Simple encapsulated environment to compose stages
- **Type Safety**: Maintained while reducing one-liners and additional imports  
- **Readability**: Process stages in an open environment versus sophisticated one-liners
- **Flexibility**: Choose between traditional approach or new staging helper

### Version Update
- Package version updated from `0.3.1` to `0.3.11`

## Performance Note
Test results show this working at 660 iterations and breaking at 661, demonstrating the cost of abstraction while maintaining functionality.