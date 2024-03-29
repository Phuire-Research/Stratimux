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

### Getting Started
* [STRATIMUX PROJECT TEMPLATE](https://github.com/Phuire-Research/STRATIMUX-TEMPLATE)
* [logixUX](https://github.com/Phuire-Research/logixUX) - User Interface MVP and Stratimux Project Sidekick Application, this will be decomposed into an advanced starter template and the concepts that allow for the user interface will be merged into this repository.

### Advice when Encountering Branch Prediction Errors.
The easiest means of detecting if your application is starting to encounter such errors is to enable the dialog and logging options on your Axium. To avoid running into these branch prediction errors. Attempt to limit your strategy assembly, qualities, and plans to be less than O(n^3). You will find that your functions will suddenly become probabilistic in their ability execution deterministically.

Thankfully, this is the reason for the atomic behavior of your qualities combined with strategies and plans. As you may shrink time complexity into a series of steps. Or better yet, if you are relying on accessing some parameters from your state. Be sure to flattened those data structures into something that can readily be accessed.

When in doubt simplify.

### [TS Documentation](https://tsdocs.dev/docs/stratimux/0.1.1)
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
* Added parsing tokens. If curious about this functionality see the logixUX project. These tokens in combination with that project will upon its release. Allow for the ease of parsing Stratimux or other TypeScript projects into high quality training data.
### 11/17/23
* selectSlice now performing deep selections.
### 11/15/23
* Action Payloads must extend type: Record<string, unknown>  
   * This change is to provide a guarantee of advanced functionality in the current UI Proof of Concept.

## Working Branch: Carousel
While I did not want to release a major API change after an initial release. Working on logixUX revealed that there is a need to reduce the inner time complexity within the Axium itself. Carousel, is a rework on how selectors function, as well as a larger refactor on how stages work.

Effectively the UnifiedSubject will now memoize all potential state changes. And your stages will be able to pass selectors in creation to as a changed record. I'm taking my time with this update to ensure that everything is well tested within logixUX. Prior to breaking APIs.

With this change, I will be able to call the underlying pattern a solution to what bothered me about ECS(Entity Component Systems). As I designed Stratimux and the Unified Turing Machine to act as the foundation for simulation in conjunction with AI. It just so happens that it is currently simulating data transformations and through logixUX a complete UI system.

What I am currently addressing is something that has always bothered me in other frameworks and game engines. That once you have your system set up everything is always checked and has an inherit inefficiency built in due to such. With the above planned change, in O(n) I can determine what has changed and prune stages to what is needed. Likewise the same selectors keep the baseline complexity of accessing those changes to the same O(n). As selectors once defined, are a simple retrieval functions with no looping quality.

* *Update 3/05/24*
Releasing a minor update so that Stratimux can be introduced into other frameworks, as the reality of the current release. It that it is ready in a limited scale such as a simple state machine. The main issue with the current approach is a back pressure becomes an issue at higher complexity and starts interfering with branch prediction.
* *Update 12/28/23*  
Now that this branch is able to break implementations, the planned scope of this refactor has expanded to move allow this framework to be multithreaded out of the box. This new plan will take some time to implement and will be merged into main when ready.
* *Update 2/14/24*
On the working branch I have included a new nullReducer. This will allow for stratimux to be able to execute as state or stateless beyond initial set up.

----
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

The semaphore is the method of quality selection within the Axium. This is to reduce the time complexity of each look up. And if you applications are purely static with no planned dynamic changes to the Axium's conceptual load. This values can be hard coded ahead of time. This is one of the planned features for [logixUX](https://github.com/Phuire-Research/logixUX). In addition to other scaffolding improvements, AI assistance, and more.
### uXqOfUx.quality.ts
This isolates all the parts necessary for your actions to have impact within this system. Be mindful of your types, as even though they are not explicitly used within this system. They likewise better inform training data, and likewise act as unique identifiers if you are not setting the semaphore ahead of time.

The semaphore is the method of quality selection within the Axium. This is to reduce the time complexity of each look up. And if you applications are purely static with no planned dynamic changes to the Axium's conceptual load. This values can be hard coded ahead of time. This is one of the planned features for [logixUX](https://github.com/Phuire-Research/logixUX). In addition to other scaffolding improvements, AI assistance, and more.
```typescript
import {
  MethodCreator,
  Action,
  prepareActionCreator,
  createQuality,
  UnifiedSubject,
  createMethodWithState,
  strategySuccess,
  strategyData_unifyData,
  strategyFailed
} from 'stratimux';
import { UXState } from '../uX.concept';

export const uXqOfUXType = 'uX allows for easy selection of your qualities, qOfUX is your quality, and Type is the distinction';
export const uXqOfUX = prepareActionCreator(uXqOfUXType);
export type uXqOfUxField = {
  state: UXState
};

function getRandomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const uXqOfUXCreator: MethodCreator = (concepts$?: UnifiedSubject, semaphore?: number) =>
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
  }, concepts$ as UnifiedSubject, semaphore as number);

function uXqOfUXReducer(state: UXState, _: Action): UXState {
  return {
    ...state,
  };
}

export const uXqOfUXQuality = createQuality(
  uXqOfUXType,
  uXqOfUXReducer,
  uXqOfUXCreator
);
/* Below are the default functions available for your quality */
// export const qOfUXQuality = createQuality(
//   qOfUXType,
//   defaultReducer,
// The method is optional and is an advanced behavior
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
  strategyBegin
} from 'stratimux';
import { UXState, uXName } from './uX.concept';
import { uXSomeStrategy, uXSomeStrategyTopic } from './strategies/uXSome.strategy';

export const uXPrinciple: PrincipleFunction = (
  _obs: Subscriber<Action>,
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
      const state = selectUnifiedState<UXState>(concepts, semaphore);
      if (state) {
        dispatch(strategyBegin(uXSomeStrategy()), {
          iterateStage: true
        });
      }
    },
    (concepts) => {
      const {lastStrategy} = getAxiumState(concepts);
      if (lastStrategy === uXSomeStrategyTopic) {
        plan.conclude();
      }
    }
  // There always needs to be atleast one subscriber or plan for the Axium to be active.
  ], 30);
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
  const stepSuccess = createActionNode(axiumLog(), {
    successNode: null,
    failureNode: null
  });
  const stepFailure = createActionNode(axiumKick(), {
    successNode: stepSuccess,
    failureNode: null
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
  // Sets logging to true and store dialog to true
  //  This will log to the console the dialog of each successive ActionStrategy
  //  And store the entire application context in the axium's dialog.
  createAxium(axiumName, [createUXConcept()], true, true);
})();
```