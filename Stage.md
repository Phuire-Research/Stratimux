## Stage
This is derived from the newly created UnifiedSubject to handle the main point of vulnerability that a recursive machine carries. As the main point of dispatching new actions in the system would traditionally be informed via the subscription to listen to state changes. This Design Pattern allows one to safely dispatch in a tightly patterned subscription. This design pattern watches each stage for the potential of a runaway configuration which would normally prevent this machine from halting. But since the Unified Turing Machine was created to be halting complete. The UnifiedSubject internally watches each stage of your application independently and the actions that it dispatches via the supplied dispatch function. If a similar action is dispatched in rapid Succession denoted by its type and no debounce option. That Stage will close and be added to the axium's badStages property.

Once attached to the badStage property, it would be possible to reinitialize said stage via your concept's principle utilizing the stage's title. But places that burden of responsibility on the developer. As the scope of a Unified Turing Machine is to be designed to specification and halt appropriately. We accept failure as likewise the ability to halt.

```typescript
export type Staged = {
  title: string;
  stages: Staging[],
  step: number;
}

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

export type Dispatcher = (action: Action, options: dispatchOptions) => void;
export type Staging = (
  concepts: Concept[],
  dispatch: (action: Action, options: dispatchOptions) => void
) => void;
export type Stage = (id: number) => () => void;

export class UnifiedSubject extends Subject<Concept[]> {
  stage(title: string, stages: Staging[]) {}
}
```
The added benefit of the creation of staging to control the flow of actions, is also the ability to create an additional abstraction to handle how the dispatch would be handled within a subscription, but with the added benefit of iterating through each step of a stage your applications. That these steps would typically be an initialization, a main run time, and likewise the ability to close. 3 acts if you will.

* dispatchOptions
* runOnce - If enabled on the dispatch options, this will permit only one dispatch of that action within its stage.
* debounce - Required to prevent the stage to be considered bad if rerunning the same action within the same step, specific use case is tracking some position over time.
* setStep - This will set the stage to a specific step, useful if some strategy failed and the staging needs to be reset to prepare for that strategy again.
* incrementStep - Will increment the current step of the stage, this should be your default option for dispatching actions or strategies to prevent action overflow.
* on - Simple handler that will prevent dispatch until the selected value is set to what is expected. Keep in mind this should also be occupied by a debounce, as this dispatch will run on each successful state update.

## Example

```typescript
let runCount = 0;

// Sets logging to True
const axium = createAxium([createCounterConcept()], true);

const staged = axium.stage('Stage DispatchOptions Test',
[
    (concepts, dispatch) => {
    const counter = selectState<Counter>(concepts, counterName);
    console.log('Stage 1 ', counter, runCount);
    // Sets count to 1
    dispatch(counterAdd(), {
        iterateStep: true
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
        setStep: 2,
        // runOnce: true,
        debounce: 0,
        on: {
        selector: counterSelectCount,
        expected: 2
        }
    });
    // }
    }, (concepts, dispatch) => {
    runCount++;
    const counter = selectState<Counter>(concepts, counterName);
    console.log('Stage 3 ', counter, runCount);
    // Will overflow causing the stage to close and add itself to bad Stages
    dispatch(counterSubtract(), {
        // Enabling will prevent close and cause this test to timeout
        // debounce: 500
    });
    }
]);

const sub = axium.subscribe((concepts) => {
    const axiumState = concepts[0].state as AxiumState;
    // This will run once the last step of the stage we created overflows, this is for demonstration purposes only.
    if (axiumState.badStages.length > 0) {
        const badStage = axiumState.badStages[0];
        const counter = selectState<Counter>(concepts, counterName);
        console.log('Stage Ran Away, badStages.length: ', axiumState.badStages.length, 'Count: ', counter.count);
        expect(badStage.stepFailed).toBe(2);
        expect(counter.count).toBe(2);
        sub.unsubscribe();
    }
});
```

Keep in mind behind the scenes during a STRX runtime, there will be multiple strategies running concurrently. Observe the runCount specified in this example. Please look to the STRX's tests folder.

As well that STRX is designed to be run primarily through the loaded concepts and their associated principles. To prevent unexpected behaviors in your own principles. Please utilize the supplied KeyedSelector for axium's open property to begin the stage of your concepts.