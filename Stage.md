## Stage
This is derived from the newly created UnifiedSubject to handle the main point of vulnerability that a recursive machine carries. As the main point of dispatching new actions in the system would traditionally be informed via the subscription to listen to state changes. This Design Pattern allows one to safely dispatch in a tightly patterned subscription. This Design Pattern watches each Stage for the potential of a runaway configuration which would normally prevent this machine from Halting. But since the Unified Turing Machine was created to be Halting Complete. The UnifiedSubject internally watches each Stage of your application independently and the Actions that it Dispatches via the supplied Dispatch function. If a similar Action is Dispatched in Rapid Succession denoted by the Expiration that is attached to each newly Created Action. That Stage will Close and be added to the Axium's badStages property.

Once attached to the badStage property, it would be possible to reinitialize said Stage via your Concept's Principle utilizing the Stage's Title. But places that burden of Responsibility on the Developer. As the Scope of a Unified Turing Machine is to be designed to Specification to Halt Appropriately. We accept Failure as likewise the ability to Halt.

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
The added benefit of the Creation of Staging to control the flow of Actions, is also the ability to create an additional Abstraction to handle how the Dispatch would be Handled within a Subscription, but with the added benefit of iterating through each Step of a Stage your Applications. That these Steps would typically be an initialization, a main run time, and likewise the ability to close. 3 Acts if you will.

* dispatchOptions
* runOnce - If enabled on the Dispatch Options, this will permit only one dispatch of that action within its Stage.
* debounce - Required to prevent the Stage to be considered Bad if rerunning the Same Action within the same Step, specific Use Case is Tracking some Position over Time.
* setStep - This will set the Stage to a specific Step, useful if some Strategy Failed and the Staging needs to be reset to prepare for that Strategy again.
* incrementStep - Will increment the Current step of the Stage, this should be your default option for Dispatching Actions or Strategies to prevent Actions Overflow.
* on - Simple handler that will prevent dispatch until the Selected Value is set to what is Expected. Keep in mind this should also be occupied by a debounce, as this dispatch will run on each successful State Update.

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

Keep in mind behind the Scenes during a STRX runtime, there will be multiple Strategies running concurrently. Observe the runCount specified in this example. Please look to the STRX's Tests Folder.

As well that STRX is designed to be run primarily through the loaded Concepts and their Associated Principles. To prevent unexpected behaviors in your own Principles. Please utilize the supplied KeyedSelector for Axium's Open Property to begin the Stage of your Concepts.