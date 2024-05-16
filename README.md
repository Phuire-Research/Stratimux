![Stratimux](https://github.com/Phuire-Research/Stratimux/blob/main/Stratimux.png?raw=true)
### *The Unified Turing Machine - The Mythical Strong Fast Computer in Plain Text, that Solves the "**impossible halting problem**" of Classic Turing Machines, in the Spirit of the Open Internet*

**Features:**
* Universal Transformer
* Autonomous Baseline Intelligence (ABI)
* Function as a Operating System
* Halting Complete
* Concept Libraries
* Action Oriented
* Single Network Lock (Mutex as Ownership)
* Asynchronous Graph Framework
* Composable Strategies
* Stage Planner (Hierarchal Planning/Higher Order Reasoning)
* Prioritization
* Change Detection
* Plain Text Dialog Output
* Hot Loading
* No Dependency Injection

### Getting Started
* [STRATIMUX PROJECT TEMPLATE](https://github.com/Phuire-Research/STRATIMUX-TEMPLATE)
* [Stratimux @ npm](https://www.npmjs.com/package/stratimux)
* [Huirth](https://github.com/Phuire-Research/Huirth) - User Interface MVP and Stratimux Project Sidekick Application, this will be decomposed into an advanced starter template and the concepts that allow for the user interface will be merged into this repository.
* [Stratimux Assistant](https://chat.openai.com/g/g-Io9NDT4Z0-stratimux-assistant) Work in progress GPT, rough sketch supplied information on this repository and a few articles about the project. Will flesh out more in the future.

### Advice when Encountering Branch Prediction Errors.
The easiest means of detecting if your application is starting to encounter such errors is to enable the dialog and logging options on your Axium. To avoid running into these branch prediction errors. Attempt to limit your strategy assembly, qualities, and plans to be less than O(n^3). You will find that your functions will suddenly become probabilistic in their ability execution deterministically.

Thankfully, this is the reason for the atomic behavior of your qualities combined with strategies and plans. As you may shrink time complexity into a series of steps. Or better yet, if you are relying on accessing some parameters from your state. Be sure to flattened those data structures into something that can readily be accessed.

When in doubt simplify.

### [Stratimux is a Function as Operating System](https://dev.to/phuire/stratimux-is-a-function-as-operating-system-50ik)
### [TS Documentation](https://tsdocs.dev/docs/stratimux/0.1.52)
### Concept Index
* [Action Strategy](https://github.com/Phuire-Research/Stratimux/blob/main/ActionStrategy.md) - Data structure that allows for Stratimux to be provably terminating.
* [Axium](https://github.com/Phuire-Research/Stratimux/blob/main/Axium.md) - Governing concept that contains the set of concepts that formalizes each axium.
* [Concept](https://github.com/Phuire-Research/Stratimux/blob/main/Concept.md) - Concepts are composed of state, qualities, principles, and mode.
* [Stage Planner](https://github.com/Phuire-Research/Stratimux/blob/main/StagePlanner.md) - Slices your application into different stages and prevents action overflows. 
* [Action Controller](https://github.com/Phuire-Research/Stratimux/blob/main/ActionController.md) - Allows methods to be performed asynchronously.
* [Strategy Data](https://github.com/Phuire-Research/Stratimux/blob/main/StrategyData.md) - Enables the Action Strategy pattern to perform as a "Universal Transformer." 
* [Data Oriented Functional Inheritance](https://github.com/Phuire-Research/Stratimux/blob/main/DataOrientedFunctionalInheritance.md) - Demonstrates "Unification of Concepts," as a method of functional inheritance.
* [Spatial Ownership](https://github.com/Phuire-Research/Stratimux/blob/main/SpatialOwnership.md) - A single lock concept that can be within a single process or network of axiums.

### Want to learn more?
* [PURF - White Paper](https://github.com/Phuire-Research/PURF) - Safe Recursive Improvement of AI
* [The Impossible Halting Turing Machine](https://github.com/Phuire-Research/Stratimux/blob/main/Index.md) - Original Paper for Stratimux
* [Unified Turing Machine](https://github.com/Phuire-Research/Stratimux/blob/main/The-Unified-Turing-Machine.md) - The governing concept for this entire framework.

## Change Log ![Tests](https://github.com/Phuire-Research/Stratimux/actions/workflows/node.js.yml/badge.svg)
### Consistency Update v0.1.70 5/16/2024
* Added new buffer method series that will delay the dispatch of some possible set of actions for a period of time.
### v0.1.69 5/15/2024
* Added priority to axium strategies.
* Improved consistency of logic due the above change.
* Exported **isAxiumOpen** helper function.
### Strategy Priority v0.1.68 5/15/2024
* Added priority to strategies, this priority will be assigned to each step issued by such.
  * With this change you may now have strategies jump all lines upon creation, ensuring some change prior to other action's taking effect.
  * Unless a ActionNode or incoming Action created by createActionNode has its own priority, then that takes precedents. But does not effect the Strategy's overall priority.
### **BREAKING** v0.1.67 5/13/2024
* Revamped the Action Creator Functions to follow behind the current creator with an **options** parameter design choice.
  * Note pure action creators will not provide an option for payload
* Cascaded priority to ActionStrategies to allow for planning priority ahead of time.
* Updated the PrincipleFunction documentation to have the semaphore parameter to now be conceptSemaphore. This allows for an easy drop in into the options parameter.
* Made createAxium utilize the same **options** design pattern.
### v0.1.65 5/13/2024
* Removed one more level of deepness from DotPath(6 levels now), projects should now compile without the excessively deep error.
### v0.1.64 5/13/2024
* Added Action Priority: This will allow action's assigned a priority of not 0 to be placed accordingly into the action ques.
* Adjusted DotPath type to improve type checking performance. Massively degrades with an additional level.
* Updated documentation to reflect recent changes
### Patch v0.1.62 5/09/2024
* Restored DotPath, a type used in the selector creators used to guide the creation of a dot path string.
### **BREAKING** Strong Fast Lock Step v0.1.62 5/08/2024
* Devised a means to ensure a lock step execution of incoming actions
  * Due to each stage being ran once regardless of their selector being changed, some plans may receive the wrong value if not determining if that stage has been ran for the first time. See priority.test.ts for the example: if (changes.length > 0) {//}
  * This also impacted the *axiumWaitForOpenThenIterate* helper function, but now works as intended via no longer checking for the latest lastStrategy change.
  * [*Note* Removed CI checks for 14.x and 16.x due to updating dependencies.](https://github.com/Phuire-Research/Stratimux/pull/213/commits/6b93c57fa2dab8869f1508970c44a8300ef444be)
### Strong Fast Time v0.1.61
* Created the new *axiumTimeOut* helper function
  * This will add a specified action to the axium tail property after some specified time.
  * This is used internally to handle the majority of asynchronous interactions
### Strong Fast **BREAKING** v0.1.59 5/06/24
* Removed the setTimeout trick in favor of a new tail property added to the axium concept, this paves the way for this pattern to be completely responsible for its own implementation.
  * **BREAKING** Method Subjects are now a tuple of [action: Action, async: Boolean]. This allows for the old setTimeout trick to be used in case the action stream isn't kicked into gear.
    * This change is only breaking if you have implemented your own custom methods, please see src/model/method.ts for reference.
* Ensured that plans that conclude with an active beat, will have their timers removed.
### v0.1.58 5/03/24
* Ensured that changes that happen between a stage's beat interval are accumulated
### v0.1.57 5/02/24
* Added the ability to set specific stages of their selectors, priority, and beat values.
  * Note that by setting these values, this will not force the internal priority selector cache mechanism to trigger. Use set for stages your are iterating to or changing due to some circumstance. The new stage options will force the priority selector cache to trigger.
* Quick pass updating the StagePlanner documentation in regards to stage selectors/priority/beat properties.
### v0.1.56 5/01/24
* May now properly update each plans intended KeyedSelectors to control when they are ran.
### v0.1.55 4/24/24
* Changed ActionNodeOptions to allow for successNode and failureNode to be left absent. Continued effort towards decreasing boilerplate.
* Refined original paper.
* Properly exporting the new ActionCreator and ActionCreatorWithPayload for specific createQualitySetX creator functions
### v0.1.53 4/23/24
* Added createQualitySet and createQualitySetWithPayload to reduce some boilerplate.
### v0.1.52 Patch 4/03/24
* Quick pass updating documentation
* Synced up createAxium, etc... To properly allow for the axium to log actions incoming in the action stream if set.
### **BREAKING Update v0.1.5** 4/02/24
* Unified the internal concept streams and created a new dedicated stream to inform most recent concepts
  * Note if you are assembling plans within a method, be sure to grab the **concepts$** from *getAxiumState*
* It is now a requirement you use the **stageWaitForOpenThenIterate(() => action)** helper function in your plans if you are depending on the last strategyTopic property on the axium concept.
* Added an addition logging property to reveal the internal action stream that can be set when creating your axium. This is separate from the prior logging feature.
* Method now utilize an internal actionConcept$ stream of type Subject<Concepts>. Method creators that utilize the UnifiedSubject will throw a type error and will need to be updated.
* **PATCH v0.1.51** Removed debugging console.logs
### **BREAKING Update v0.1.4** 3/28/24
* Removed the "on.expected" option from dispatch to reduce inner complexity of your stages
* Renamed **axium.stage** to **axium.plan** to be in line with industry terminology
  * The new plan set up requires a staging entity or the return from the new createStage helper function
    * This new entity enables you to change the priority in which your stages are informed per state change
  * You may now assign each stage its own separate beat versus the entire plan
    * Removes beat from the overall plan and now needs to be performed atomically
  * This overall change trims the total plans that are checked per state, but may still supply plans that trigger on all changes via empty array in entity or outright ignoring the value field via the createStage function
* Added nullReducer to disallow excessive observations from being triggered
* First pass updating StagePlanner documentation
### 3/05/24
* Minor DX release, properly exporting Axium type for inclusion in other frameworks.
### 12/14/23
* Set Stage can now properly be set to 0.
### 11/29/23
* Official Release
* Stage Planner Beat - No longer experimental, have fun! It's Stratimux is now a dancing algorithm recursive function.
### 11/27/23
* Added a new experimental parameter to staging. Beat, which is a duration that will "Throttle and debounce," state notifications to that specific plan.
### 11/26/23
* Updated naming conventions throughout. Counter is now CounterState. Strategies now export with their associated concept's prepended.
* Added parsing tokens. If curious about this functionality see the Huirth project. These tokens in combination with that project will upon its release. Allow for the ease of parsing Stratimux or other TypeScript projects into high quality training data.
### 11/17/23
* selectSlice now performing deep selections.
### 11/15/23
* Action Payloads must extend type: Record<string, unknown>  
   * This change is to provide a guarantee of advanced functionality in the current UI Proof of Concept.


```bash
npm i stratimux
```

### Project Structure
```
src/ index.ts
src/ concepts / uX / qualities / qOfUX.quality.ts
     concepts / uX / strategies / uXSome.strategy.ts
     concepts / uX / uX.concept.ts
     concepts / uX / uX.principle.ts
     tests / uX.test.ts
```

### uX.concept.ts
This paradigm affords for a powerful separation of concerns. And is the key feature that allows the User Interface concept that is currently in the processing of moving out of MVP. That affords for the easy isolation of client and server logic. With even the ease of handling server side rendering based on what concept your Brand is being unified with: server or client.

Treat your concepts as libraries and modules. As that was the initial inspiration for this system. Beyond this initial release, there will be a growing library of Standardized Concepts for utilization within your Axium. Including the ability to finally have an easy means of composing "Web Components," into your system. While enhancing upon their functionality, versus just the drop in. 
```typescript
import { Action, Mode, Quality, createConcept, PrincipleFunction } from 'stratimux';
import { uXqOfUXQuality } from './qualities/qOfUx.quality'
import { uXPrinciple } from './uX.principle'

export type UXState = {
  //
}

export const uXName = 'uX';

export const createUXState = (): UXState => {
  return {
    //
  };
};

// Pass any arguments needed for your concept
export const createUXConcept = (
//  state: Record<string, unknown>,
//  qualities?: Quality[],
//  principles?: PrincipleFunction[],
//  mode?: Mode[]
) => {
  return createConcept(
    uXName,
    createUXState(),
    [
      uXqOfUXQuality
    ],
    [
      uXPrinciple,
    ],
    mode
  );
};
```
### uXqOfUx.quality.ts
This isolates all the parts necessary for your actions to have impact within this system. Be mindful of your types, as even though they are not explicitly used within this system. They likewise better inform training data, and likewise act as unique identifiers if you are not setting the semaphore ahead of time.

The semaphore is the method of quality selection within the Axium. This is to reduce the time complexity of each look up. And if you applications are purely static with no planned dynamic changes to the Axium's conceptual load. This values can be hard coded ahead of time. This is one of the planned features for [Huirth](https://github.com/Phuire-Research/Huirth). In addition to other scaffolding improvements, AI assistance, and more.
```typescript
import {
  createQualitySetWithPayload,
  UnifiedSubject,
  createMethodWithState,
  strategySuccess,
  strategyData_unifyData,
  strategyFailed
} from 'stratimux';
import { UXState } from '../uX.concept';

function getRandomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export type uXqOfUxField = {
  state: UXState
};

// [ActionCreator/ActionCreatorWithPayload, ActionType, Quality]
export const [uXqOfUX, uXqOfUXType, uXqOfUXQuality] = createQualitySetWithPayload<uXqOfUxField>({
  type: 'uX allows for easy selection of your qualities, qOfUX is your quality, and Type is the distinction',
  reducer: (state: UXState) => ({...state}),
  methodCreator: (concepts$?: Subject<Concepts>, semaphore?: number) =>
  // Only if you need to access state, otherwise
  createMethodWithState<UXState>((action, state) => {
    if (action.strategy) {
      // P/NP?
      const even = Math.round(getRandomRange(1, 5)) % 2;
      if (even) {
        const strategy = strategySuccess(action.strategy, strategyData_unifyData(action.strategy, {
          state
        }));
        return strategy;
      } else {
        const strategy = strategyFailed(action.strategy);
        return strategy;
      }
    }
    return action;
  }, concepts$ as UnifiedSubject, semaphore as number)
});
/* Below are the default functions available for your quality */
// export const qOfUXQuality = createQuality(
//   qOfUXType,
//   defaultReducer(Informs)/nullReducer(Doesn't Inform),
// The method is optional and is an advanced behavior enabling the quality to be used in an ActionStrategy
//   defaultMethodCreator
// );
```

### uX.principle.ts
Your concept's "main" function. This will be called after the axium initializes. 
* observer - Using observer.next(someAction) will directly emit that action into the axium's action stream.
* _concepts - Is the initial load of concepts when your principle is initialized
* concepts$- Is the UnifiedSubject that controls the halting quality of Stratimux and informs principles, methods, and any general subscriber of state changes.
* semaphore - This identifies the placement of your concept in the axium's conceptual set. This is used to determine if your concept is loaded and access state via the selectUnifiedState function.

```typescript
import { Subscriber } from 'rxjs';
import {
  Action,
  Concepts,
  PrincipleFunction,
  UnifiedSubject,
  axiumRegisterStagePlanner,
  axiumSelectOpen,
  getAxiumState,
  primeAction,
  selectUnifiedState,
  strategyBegin,
  createStage,
  stageWaitForOpenThenIterate
} from 'stratimux';
import { UXState, uXName } from './uX.concept';
import { uXSomeStrategy, uXSomeStrategyTopic } from './strategies/uXSome.strategy';

export const uXPrinciple: PrincipleFunction = (
  _obs: Subscriber<Action>,
  _concepts: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number
) => {
  // There always needs to be atleast one subscriber or plan for the Axium to be active.
  const plan = concepts$.plan('uX Plan', [
    // This will register this plan to the axium, this allows for the axium to close or remove your concept cleanly.
    stageWaitForOpenThenIterate(() => (axiumRegisterStagePlanner({conceptName: uXName, stagePlanner: plan}))),
    createStage((concepts, dispatch) => {
      const state = selectUnifiedState<UXState>(concepts, semaphore);
      if (state) {
        dispatch(strategyBegin(uXSomeStrategy()), {
          iterateStage: true
        });
      }
    }, {beat: 30}),
    createStage((concepts) => {
      const {lastStrategy} = getAxiumState(concepts);
      if (lastStrategy === uXSomeStrategyTopic) {
        plan.conclude();
      }
    }, {beat: 30})
  ]);
};
```

### uXSome.strategy.ts
When you are creating your strategies within this system of design. You are optimizing towards success, and majority of your strategies should be taking place within that mind set. Failure is just a chance to get back on track and see the end of some strategy, but likewise you have to account for that failure ahead of time.

This approach to algorithm design is the core strength of Stratimux, but likewise its weakness due to branch prediction. Therefore be mindful if your strategies behave in unexpected ways. The Stage Planner paradigm, especially the beat attribute should be your first go to. As chances are your logic is becoming to complex and you need to tone down when parts of your application are notified changes to state.
```typescript
import { ActionStrategy, axiumKick, axiumLog, createActionNode, createStrategy } from 'stratimux';
import { uXqOfUX } from '../qualities/qOfUx.quality';

export const uXSomeStrategyTopic = 'uX Some Error Correcting Strategy';
export const uXSomeStrategy = (): ActionStrategy => {
  const stepSuccess = createActionNode(axiumLog());
  const stepFailure = createActionNode(axiumKick(), {
    successNode: stepSuccess,
  });
  const stepBegin = createActionNode(uXqOfUX(), {
    successNode: stepSuccess,
    failureNode: stepFailure
  });
  return createStrategy({
    topic: uXSomeStrategyTopic,
    initialNode: stepBegin
  });
};
```

### index.ts
Notice that beyond creating the axium, there is no need for additional input. As the axium is a recursive function. Your concepts are initialized internally via the principle that you have assigned to your concept. Note that you may still subscribe, stage, and dispatch actions into an axium.
```typescript
import { createAxium } from 'stratimux';
import { createUXConcept } from './concepts/uX/uX.concept';

(() => {
  const axiumName = 'Name of your axium';
  // First boolean sets logging to true.
  // Second set store dialog to true.
  //  This will log to the console the dialog of each successive ActionStrategy.
  //    And store the entire application context in the axium's dialog.
  // The final boolean will allow the action stream to be logged to console for debugging purposes
  createAxium(axiumName, [createUXConcept()], {logging: true, storeDialog: true, logActionStream: true});
})();
```