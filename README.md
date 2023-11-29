![Stratimux](https://github.com/Phuire-Research/Stratimux/blob/main/Stratimux.png?raw=true)
### *The Unified Turing Machine - Plain Text Intelligence of Doing, that solves the **impossible halting problem** of classic turing machines, in the Spirit of the Open Internet*

**Features:**
* Universal Transformer
* Autonomous Baseline Intelligence (ABI)
* Halting Complete
* Concept Libraries
* Action Oriented
* Single Lock Graph Framework
* Composable Strategies
* Stage Planner
* Plain Text Dialog Output
* Hot Loading
* No Dependency Injection

Getting Started: [STRATIMUX PROJECT TEMPLATE](https://github.com/Phuire-Research/STRATIMUX-TEMPLATE)  
User Interface MVP and Stratimux Project Sidekick Application: [logixUX](https://github.com/Phuire-Research/logixUX)

## Change Log ![Tests](https://github.com/Phuire-Research/Stratimux/actions/workflows/node.js.yml/badge.svg)
### 11/29/23
* Official Release
* Stage Planner Beat - No longer experimental, have fun! It's Stratimux is now a dancing algorithm recursive function.
### 11/27/23
* Added a new experimental parameter to staging. Beat, which is a duration that will "Throttle and debounce," state notifications to that specific plan.
### 11/26/23
* Updated naming conventions throughout. Counter is now CounterState. Strategies now export with their associated concept's prepended.
* Added parsing tokens. If curious about this functionality see the logixUX project. These tokens in combination with that project will upon its release. Allow for the ease of parsing Stratimux or other TypeScript projects into high quality training data.
### 11/17/23
* selectSlice now performing deep selections.
### 11/15/23
* Action Payloads must extend type: Record<string, unknown>  
   * This change is to provide a guarantee of advanced functionality in the current UI Proof of Concept.

----
```bash
npm i stratimux
```
*Note if tsconfig.json is giving a type error for jest, be sure to open jest config after your **npm i***

For more examples: [https://github.com/Phuire-Research/Stratimux/tree/main/src/concepts](https://github.com/Phuire-Research/Stratimux/tree/main/src/concepts)

*Reminder:* This is a research project and while in a appropriate beta state. Some of aspects are bound to change, especially with the addition of more helper functions.
### Project Structure
```
src/ index.ts
src/ concepts / uX / qualities / qOfUX.quality.ts
     concepts / uX / strategies / sOfUX.strategy.ts
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

export const createUXState = (): ExperimentState => {
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

The semaphore is the method of quality selection within the Axium. This is to reduce the time complexity of each look up. And if you applications are purely static with no planned dynamic changes to the Axium's conceptual load. This values can be hard coded ahead of time. This is one of the planned features for [logixUX](https://github.com/Phuire-Research/logixUX). In addition to other scaffolding improvements, AI assistance, and more.
```typescript
import { MethodCreator, Action, prepareActionCreator, createQuality, UnifiedSubject, createMethodWithState, strategySuccess } from '../../../model/concept';

export type uXqOfUXType = 'uX allows for easy selection of your qualities, qOfUX is your quality, and Type is the distinction';
export const uXqOfUX = prepareActionCreator(uXqOfUXType);

const qOfUXCreator: MethodCreator = (concepts$?: UnifiedSubject, semaphore?: number) =>
  // Only if you need to access state, otherwise
  createMethodWithState<ExperimentState>((action, state) => {
    if (action.strategy) {
      const strategy = strategySuccess(action.strategy);
      return strategy;
    }
    return action;
  }, concepts$ as UnifiedSubject, semaphore as number);

function qOfUXReducer(state: ExperimentState, _: Action): ExperimentState {
  return {
    ...state,
  };
}

export const uXqOfUXQuality = createQuality(
  qOfUXType,
  qOfUXReducer,
  qOfUXCreator
);
/* Below are the default functions available for your quality */
// export const qOfUXQuality = createQuality(
//   qOfUXType,
//   defaultReducer,
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
import { Action, Concepts, PrincipleFunction, UnifiedSubject, registerPrincipleSubscription, selectUnifiedState } from '../../model/concept';
import { UXSTATE, uXName } from './uX.concept';

export const uXPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number
) => {
  const plan = concepts$.stage('uX Plan', [
    (concepts, dispatch) => {
      // This will register this plan to the axium, this allows for the axium to close or remove your concept cleanly.
      dispatch(primeAction(concepts, axiumRegisterStagePlanner({conceptName: uXName, stagePlanner: plan})), {
        on: {
          selector: axiumSelectOpen,
          expected: true,
        },
        iterateStage: true
      });
    },
    (concepts, dispatch) => {
      const state = selectUnifiedState(concepts, semaphore);
      if (state) {
        //
      }
    }
  ]);
};

```

### uXSome.strategy.ts
When you are creating your strategies within this system of design. You are optimizing towards success, and majority of your strategies should be taking place within that mind set. Failure is just a chance to get back on track and see the end of some strategy, but likewise you have to account for that failure ahead of time.

This approach to algorithm design is the core strength of Stratimux, but likewise its weakness due to branch prediction. Therefore be mindful if your strategies behave in unexpected ways. The Stage Planner paradigm, especially the beat attribute should be your first go to. As chances are your logic is becoming to complex and you need to tone down when parts of your application are notified changes to state.
```typescript
export const uXSomeStrategyTopic = 'uX Some Error Correcting Strategy'
export const uXSomeStrategy = (): ActionStrategy => {
  const stepSuccess = createActionNode(uXSomeConsecutiveAction(), {
    successNode: null,
    failureNode: null
  });
  const stepFailure = createActionNode(uXSomeErrorCorrectionAction(), {
    successNode: stepSuccess,
    failureNode: null
  });
  const stepBegin = createActionNode(uXSomeAction(), {
    successNode: stepSuccess,
    failureNode: stepFailure
  });
  return createStrategy({
    topic: uxStrategyTopic,
    initialNode: stepBegin
  })
};
```

### index.ts
```typescript
import { createAxium } from 'stratimux';
import { createUXConcept } from './concepts/uX/uX.concept'

(() => {
  const axiumName = '';
  // First boolean will set logging to true and store dialog to true will log errors to the console.
  //  Will likewise log each dialog of completed ActionStrategies.
  // The second will store the entire application dialog context in the axium's dialog.
  createAxium(axiumName, [createUXConcept()], true, true);
})();
```

# The Original Paper
* [The Impossible Halting Turing Machine](https://github.com/Phuire-Research/Stratimux/blob/main/Index.md)