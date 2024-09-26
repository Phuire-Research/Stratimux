## Stage Planner
### Abstract
This is derived from the newly created MuxifiedSubject to handle the main point of vulnerability that a recursive machine carries. As the main point of dispatching new actions in the system would traditionally be informed via the subscription to listen to state changes. This Design Pattern allows one to safely dispatch in a tightly patterned subscription. This design pattern watches each stage for the potential of a runaway configuration which would normally prevent this machine from halting. But since the Muxified Turing Machine was created to be halting complete. The MuxifiedSubject internally watches each stage of your application independently and the actions that it dispatches via the supplied dispatch function. If a similar action is dispatched in rapid Succession denoted by its type and no throttle option. That plan will conclude and be added to the muxium's badPlans property.

Once attached to the badPlan property, it would be possible to reinitialize said stage via your concept's principle utilizing the stage's title. But places that burden of responsibility on the developer. As the scope of a Muxified Turing Machine is to be designed to specification and halt appropriately. We accept failure as likewise the ability to halt.

*"You stage a plan and a plan has multiple stages."*

## Working with the Stage Planner Paradigm
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
* title - Title of your plan, used to determine your plan within badPlans stored on the muxium if they fail.
* stage - This is your stage index, starting at 0.
* stages - Is an array of function that will be called upon each notification depending on the current stage index.
* stageFailed - Is a fail safe mechanism to prevent action overflow due to branch prediction errors.
### Stage Options
```typescript
export type dispatchOptions = {
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
* runOnce - If enabled on the dispatch options, this will permit only one dispatch of that action within its stage.
* throttle - Required to prevent the stage to be considered bad if rerunning the same action within the same stage, specific use case is tracking some position over time. If on is part of options, this will only come into play after that action is first dispatched.
* incrementStage - Will increment to the next stage index, this should be your default option for dispatching actions or strategies to prevent action overflow.
* setStage - This will set the stage to a specific stage index, useful if some strategy failed and the staging needs to be reset to prepare for that strategy again. This will always override iterateStage.
* setStageSelectors/Priority/Beat - This will set a specific stage's selectors, but will not trigger a cache of the current priority selector order que. This likewise applies to Priority/Beat
* newSelectors/Priority/Beat - Will set the current stage's selectors/priority/beat

#### Stage Selectors
This utilizes Stratimux's KeyedSelectors to control when a stage would run as a built in form of change detection. Noting that once a stage is incremented or set, it will always run the first time. But may not receive the specific changes that the selector is actively looking for. The strength of this approach allows us to move beyond ECS into a system that is reactive and atomic that likewise allows for Stratimux to function as a FaaOS(Function as a Operating System).

#### Stage Priority
Of the the main issues with utilizing a single point of observation, is that some plans you might devise should take precedence over others. For example the Muxium's own close principle has the highest priority of all observations and will force a shutdown of the entire Muxium upon observation. We have likewise provided the set and new stage options for the priority value to allow some intelligence to be at play, keeping in mind Stratimux is designed to act as a form of logical embodiment for this generation's probabilistic AI.

#### Stage Beat
The beat value each stage may have, is a new concept similar to the throttle and debounce found in reactive programming. Except here the first observation will run, and any subsequent observations will be delayed until just have the beat value expires. This ensures a constant stream of observations, while allowing for gaps of time that will instantly resume once the observation becomes relevant again, aggregating all changes that occurred between beats. Think Frames Per Second (FPS).

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
```typescript
let runCount = 0;
const muxium = muxification('muxiumStageDispatchOptionsTest', [createCounterConcept()], true);
const sub = muxium.subscribe((concepts) => {
  const muxiumState = concepts[0].state as MuxiumState;
  if (muxiumState.badPlans.length > 0) {
    const badPlan = muxiumState.badPlans[0];
    const counter = selectState<CounterState>(concepts, counterName);
    console.log('Stage Ran Away, badPlans.length: ', muxiumState.badPlans.length, 'Count: ', counter?.count);
    plan.conclude();
    sub.unsubscribe();
    expect(badPlan.stageFailed).toBe(2);
    expect(counter?.count).toBe(2);
    setTimeout(() => {done();}, 500);
  }
});
const plan = muxium.plan('Stage DispatchOptions Test',
  [
    createStage((concepts, dispatch) => {
      const counter = selectState<CounterState>(concepts, counterName);
      console.log('Stage 1 ', counter, runCount);
      dispatch(counterAdd(), {
        iterateStage: true
      });
    }),
    createStage((concepts, dispatch) => {
      runCount++;
      const counter = selectState<CounterState>(concepts, counterName);
      console.log('Stage 2 ', counter, runCount);
      // Sets count to 2 and only runs once per state update
      dispatch(counterAdd(), {
        runOnce: true
      });
      // Will wait until count is set to 2, then set the Stage Explicitly to the third Step counting from 0.
      if (selectSlice(concepts, counterSelectCount) === 2) {
        dispatch(counterAdd(), {
          setStage: 2,
          // Requires throttle, because the previous action is of the same type, but runs only once.
          throttle: 1
        });
      }
      // }
    }),
    createStage((concepts, dispatch) => {
      runCount++;
      const counter = selectState<CounterState>(concepts, counterName);
      console.log('Should run twice, Stage 3 ', counter, runCount);
      // Will cause an action overflow forcing the stage to close and add itself to badPlans
      dispatch(counterSubtract(), {
        // Enabling will cause this test to timeout via the subscription watching for badPlans to never be ran.
        // throttle: 500
        // This demonstrates the fault resistance of the Stage paradigm, despite Stratimux's recursive functionality.
      });
      // This dispatch will be invalidated and never dispatched due to the effect of action overflow of the above.
      dispatch(counterAdd(), {});
      console.log(
        'Will also run twice. 1st will be before "Stage Ran Away,"',
        'and after "Should run twice." The 2nd will be final console log output.'
      );
    })
  ]);
```
To prevent action overflow, each stage is paying attention to consecutive actions of the same type. Noting that this can likewise be overwhelmed via a throttle set to 0. If throttle 0 is utilized, the current stage should change.

Keep in mind behind the scenes during a Stratimux runtime, there will be multiple strategies running concurrently. Observe the runCount specified in this example. Please look to the Stratimux's tests folder.

To save on potential memory bloat we are only keeping track of the most recent valid 5 actions per stage to prevent action overflow. This may change in the future pending some stage that requires a larger bandwidth of actions. Likewise the amount of actions in each stage should be limited regardless.

Lastly, in an action overflow state, sequentially the overflow will call the same dispatch before calling the next dispatch even if within the same stage. Pay attention to the example above and the final console.log() output.

## Stage Planner within your Principle
Stratimux is designed to be ran primarily through its loaded concepts and their associated principles. To prevent unexpected behaviors in your own principles. Please utilize the supplied KeyedSelector for muxium's open property to begin the stage of your concepts.
```typescript
const plan = concept$.plan('Principle Stage Example', [
  createStage((concepts, dispatch) => {
    // If muxium is currently open
    if (select.slice(concepts, muxiumSelectOpen)) {
      dispatch(someAction(), {
        iterateStage: true,
      });
    }
  // Plan will only run if the open property on the main muxium concept has changed.
  }, [muxiumSelectOpen]),
  createStage((concepts, dispatch) => {
    // Your principle's run time logic.
  })
]);
```
## How Stage Priority effects Actions
Whenever an action is dispatched into the action stream. They are checked into an action que system. By default any priority assigned to a stage, will likewise associate that to an action. This assumes that the stage itself is taking priority in observation and action when set.

If you require a high priority observation, but want the action ques to deplete accordingly without effecting such. Set the action's priority to 0. This will cause the internal checks to skip over handling that action's priority. Otherwise if such is set to undefined, then the dispatching stage's priority will once again be set.

```typescript
// Will have high observation priority, but no action priority.
createStage((_, dispatch) => {
  const action = muxiumKick();
  action.priority = 0;
  dispatch(action, {
    iterateStage: true
  });
}, {priority: 100})

// No observation priority, but high action priority.
createStage((_, dispatch) => {
  const action = muxiumKick();
  action.priority = 100;
  dispatch(action, {
    iterateStage: true
  });
})
```