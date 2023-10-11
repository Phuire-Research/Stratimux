## Stage
### Abstract
This is derived from the newly created UnifiedSubject to handle the main point of vulnerability that a recursive machine carries. As the main point of dispatching new actions in the system would traditionally be informed via the subscription to listen to state changes. This Design Pattern allows one to safely dispatch in a tightly patterned subscription. This design pattern watches each stage for the potential of a runaway configuration which would normally prevent this machine from halting. But since the Unified Turing Machine was created to be halting complete. The UnifiedSubject internally watches each stage of your application independently and the actions that it dispatches via the supplied dispatch function. If a similar action is dispatched in rapid Succession denoted by its type and no debounce option. That plan will conclude and be added to the axium's badPlans property.

Once attached to the badPlan property, it would be possible to reinitialize said stage via your concept's principle utilizing the stage's title. But places that burden of responsibility on the developer. As the scope of a Unified Turing Machine is to be designed to specification and halt appropriately. We accept failure as likewise the ability to halt.

*"You stage a plan and a plan has multiple stages."*

## Working with the Stage Paradigm
The added benefit of the creation of a plan to control the flow of actions. Allows the ability to create a series of stages to handle how the dispatch would be handled within a subscription, but with the added benefit of iterating through each stage your plan. A typical plan would typically be composed of an initialization, main run time, and likewise the ability to conclude. 3 acts if you will.
```typescript
// Multiple Stages are a Plan
export type Plan = {
  title: string;
  stage: number;
  stages: Staging[],
  stageFailed: number;
}
```
* title - Title of your plan, used to determine your plan within badPlans stored on the axium if they fail.
* stage - This is your stage index, starting at 0.
* stages - Is an array of function that will be called upon each notification depending on the current stage index.
* stageFailed - Is a fail safe mechanism to prevent action overflow due to branch prediction errors.
### Stage Options
```typescript
export type dispatchOptions = {
  runOnce?: boolean;
  debounce?: number;
  setStep?: number;
  iterateStep?: boolean;
  on?: {
    selector: KeyedSelector,
    expected: any
  },
}

```
* dispatchOptions
* runOnce - If enabled on the dispatch options, this will permit only one dispatch of that action within its stage.
* debounce - Required to prevent the stage to be considered bad if rerunning the same action within the same stage, specific use case is tracking some position over time. If on is part of options, this will only come into play after that action is first dispatched.
* incrementStage - Will increment to the next stage index, this should be your default option for dispatching actions or strategies to prevent action overflow.
* setStage - This will set the stage to a specific stage index, useful if some strategy failed and the staging needs to be reset to prepare for that strategy again. This will always override iterateStage.
* on - Simple handler that will prevent dispatch until the selected value is set to what is expected. Keep in mind this should also be occupied by a debounce, as this dispatch will run on each successful state update. This should be utilized alongside iterateStage, setStage, or debounce to prevent action overflow.
 
### Internals
```typescript
export type Dispatcher = (action: Action, options: dispatchOptions) => void;
export type Staging = (
  concepts: Concept[],
  dispatch: (action: Action, options: dispatchOptions) => void
) => void;
export class UnifiedSubject extends Subject<Concept[]> {
  stage(title: string, stages: Staging[]) {}
}
```
* Dispatcher - This is the supplied dispatch function that is made available each stage.
* Staging - The interface that you will be interacting with when setting up your stages, noting placement of concepts and the dispatch function.
* UnifiedSubject - This is a specialized subject for utilized within STRX to allow for this staging paradigm. This is made available via the createAxium function and likewise within your principles via the concept$ property. Note that your plan will be an array of functions even with just one stage.

## Example
```typescript
let runCount = 0;
const axium = createAxium('axiumStageDispatchOptionsTest', [createCounterConcept()], true);
const sub = axium.subscribe((concepts) => {
  const axiumState = concepts[0].state as AxiumState;
  if (axiumState.badPlans.length > 0) {
    const badPlan = axiumState.badPlans[0];
    const counter = selectState<Counter>(concepts, counterName);
    console.log('Stage Ran Away, badPlans.length: ', axiumState.badPlans.length, 'Count: ', counter.count);
    plan.conclude();
    sub.unsubscribe();
    expect(badPlan.stageFailed).toBe(2);
    expect(counter.count).toBe(2);
    setTimeout(() => {done();}, 500);
  }
});
const plan = axium.stage('Stage DispatchOptions Test',
  [
    (concepts, dispatch) => {
      const counter = selectState<Counter>(concepts, counterName);
      console.log('Stage 1 ', counter, runCount);
      dispatch(counterAdd(), {
        iterateStage: true
      });
    }, (concepts, dispatch) => {
      runCount++;
      const counter = selectState<Counter>(concepts, counterName);
      console.log('Stage 2 ', counter, runCount);
      // Sets count to 2 and only runs once per state update
      dispatch(counterAdd(), {
        runOnce: true
      });
      // Will wait until count is set to 2, then set the Stage Explicitly to the third Step counting from 0.
      dispatch(counterAdd(), {
        setStage: 2,
        on: {
          selector: counterSelectCount,
          expected: 2
        },
        // Requires debounce, because the previous action is of the same type, but runs only once.
        debounce: 1
      });
      // }
    }, (concepts, dispatch) => {
      runCount++;
      const counter = selectState<Counter>(concepts, counterName);
      console.log('Should run twice, Stage 3 ', counter, runCount);
      // Will cause an action overflow forcing the current stage to conclude and add the plan to badPlans
      dispatch(counterSubtract(), {
        // Enabling will cause this test to timeout via the subscription watching for badPlans to never be ran.
        // debounce: 500
        // This demonstrates the fault resistance of the Stage paradigm, despite STRX's recursive functionality.
      });
      // This dispatch will be invalidated and never dispatched due to the effect of action overflow of the above.
      dispatch(counterAdd(), {});
      console.log(
        'Will also run twice. 1st will be before "Stage Ran Away,"',
        'and after "Should run twice." The 2nd will be final console log output.'
      );
    }
  ]);
```
To prevent action overflow, each stage is paying attention to consecutive actions of the same type. In an action overflow state, sequentially the overflow will call the same dispatch before called the next dispatch even if within the same stage.

Keep in mind behind the scenes during a STRX runtime, there will be multiple strategies running concurrently. Observe the runCount specified in this example. Please look to the STRX's tests folder.

## Stage within your Principle
STRX is designed to be ran primarily through its loaded concepts and their associated principles. To prevent unexpected behaviors in your own principles. Please utilize the supplied KeyedSelector for axium's open property to begin the stage of your concepts.
```typescript
const plan = concept$.stage('Principle Stage Example', [
  (___, dispatch) => {
    dispatch(someAction(), {
      iterateStage: true,
      on: {
        selector: axiumSelectOpen,
        expected: true
      },
    });
  },
  (concepts, dispatch) => {
    // Your principle's run time logic.
  }
]);
```
