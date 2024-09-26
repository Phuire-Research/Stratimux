![Stratimux](https://github.com/Phuire-Research/Stratimux/blob/main/Stratimux.png?raw=true)
### *The Muxified Turing Machine - The Advent of the Strong Fast Computer in Plain Text, that Solves the "**impossible halting problem**" of Classic Turing Machines, in the Spirit of the Open Internet*

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
The easiest means of detecting if your application is starting to encounter such errors is to enable the dialog and logging options on your Muxium. To avoid running into these branch prediction errors. Attempt to limit your strategy assembly, qualities, and plans to be less than O(n^3). You will find that your functions will suddenly become probabilistic in their ability execution deterministically.

Thankfully, this is the reason for the atomic behavior of your qualities combined with strategies and plans. As you may shrink time complexity into a series of steps. Or better yet, if you are relying on accessing some parameters from your state. Be sure to flattened those data structures into something that can readily be accessed.

When in doubt simplify.

### [Stratimux is a Function as Operating System](https://dev.to/phuire/stratimux-is-a-function-as-operating-system-50ik)
### [TS Documentation](https://tsdocs.dev/docs/stratimux/0.1.52)
### Concept Index
* [Action Strategy](https://github.com/Phuire-Research/Stratimux/blob/main/ActionStrategy.md) - Data structure that allows for Stratimux to be provably terminating.
* [Muxium](https://github.com/Phuire-Research/Stratimux/blob/main/Muxium.md) - Governing concept that contains the set of concepts that formalizes each muxium.
* [Concept](https://github.com/Phuire-Research/Stratimux/blob/main/Concept.md) - Concepts are composed of state, qualities, principles, and mode.
* [Stage Planner](https://github.com/Phuire-Research/Stratimux/blob/main/StagePlanner.md) - Slices your application into different stages and prevents action overflows. 
* [Action Controller](https://github.com/Phuire-Research/Stratimux/blob/main/ActionController.md) - Allows methods to be performed asynchronously.
* [Strategy Data](https://github.com/Phuire-Research/Stratimux/blob/main/StrategyData.md) - Enables the Action Strategy pattern to perform as a "Universal Transformer." 
* [Data Oriented Functional Inheritance](https://github.com/Phuire-Research/Stratimux/blob/main/DataOrientedFunctionalInheritance.md) - Demonstrates "Muxification of Concepts," as a method of functional inheritance.
* [Spatial Ownership](https://github.com/Phuire-Research/Stratimux/blob/main/SpatialOwnership.md) - A single lock concept that can be within a single process or network of muxiums.

### Want to learn more?
* [PURF - White Paper](https://github.com/Phuire-Research/PURF) - Safe Recursive Improvement of AI
* [The Impossible Halting Turing Machine](https://github.com/Phuire-Research/Stratimux/blob/main/Index.md) - Original Paper for Stratimux
* [Muxified Turing Machine](https://github.com/Phuire-Research/Stratimux/blob/main/The-Muxified-Turing-Machine.md) - The governing concept for this entire framework.

## [Change Log](https://github.com/Phuire-Research/Stratimux/blob/main/CHANGELOG.md) ![Tests](https://github.com/Phuire-Research/Stratimux/actions/workflows/node.js.yml/badge.svg)

## DECK Interface
  * The new Deck Interface imposes several breaking changes:
    * Qualities and Concepts are now passed in as an Record versus an Array.
      * You will now have to name each concept as it exists in your Muxium
      * Qualities will only return a Quality Record versus returning the actionCreator, type, and quality as an array. (*Progressing*)
      * This enforces that all accessed actions in an Muxium will be primed by default alongside the *Deck Interface*
    * **Deck Interface**: Add the ability to access primed Actions, KeyedSelectors, and new isTypeValidator helper functions for action comparisons directly in principles, plans, and qualities.
      * { d: Deck<MuxiumDeck & More>(**DONE**) e: Actions(**DONE**), c: Comparators(**DONE**), k: KeyedSelectors(**DONE**) }
      * This will be accomplished via a specific type cast of a Actions, KeyedSelectors, and Comparators (via semaphore comparison) properties access directly from Principles, Plans, and Stages, or new **Access** helper that accepts Concepts.
      * Selectors will be created dynamically, but you may create advanced selectors that will be primed.
        * However you will need to prime new expert selectors for some deeply nested array/record look up via the same conceptSemaphore.
        * Same applies for IsT functions
      * Will not be extending this feature to Qualities. As you may already access the new Deck Interfaces via the new *Access* via a method supplied the most recent Concepts.
      * The **Deck** Interface is a collection of actions categorized by you chosen Concept names. (*Pending*)
    * **Access** - Is a new concept being muxified into the Muxium that can restrict what actions a foreign Muxium may have access to.
      * This is being implemented with Authentication in mind, since the only true vulnerability is the ability to load and unload concepts on an Muxium. **Note** that currently your Muxiums are only accessible within scope when implementing the advanced project template via Huirth. With this change will create the option to have varying degrees of access that is defined at the time of creation per Muxium.
      * Create an access function that returns ActionCreators and Selectors
        * These bundles will also feature a toJSON functionality so that they be hydrated on a Foreign Muxium.
### Additional 0.2.0 Refinements
* **Dynamic Muxium** - Made the add and remove functionality an opt in by default to improve security. Enabled via the muxification options by setting *dynamic* to true
* **strategyDetermine(action: Action, options)** Helper function that will return an action with a strategy attached. This is to reduce the amount of boilerplate when handling actions in methods. As we are forcing all actions returned by the method to have a strategy attached to ensure halting.
* Origin, Override, Hard Override
  * With these two additional concepts and variants muxified into the Muxium. These create the ability to enforce the sole existence of a single action from some plan. In higher levels of complexity due to priority there is a possibility of an Action intended to be dispatched a single time for some observation, may repeat between observations and still be qued. Pure Actions such as counterAdd are not impacted by this possibility. Thus this feature is truly for the Experts who may run into this issue and can be avoided via the beat parameter, but even within some complex set up...
  * Hard Override - This dispatch setting is effectively a destructive halt. And will conclude all active strategies currently in que from a given concept. Made for Experts who require a hard shift pending a specific observation and can account for the destructive halt.
    * *Someone cuts you off while driving and the coffee you are drinking flies from the cupholder onto the dash, but didn't crash.*

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
This paradigm affords for a powerful separation of concerns. And is the key feature that allows the User Interface concept that is currently in the processing of moving out of MVP. That affords for the easy isolation of client and server logic. With even the ease of handling server side rendering based on what concept your Brand is being muxified with: server or client.

Treat your concepts as libraries and modules. As that was the initial inspiration for this system. Beyond this initial release, there will be a growing library of Standardized Concepts for utilization within your Muxium. Including the ability to finally have an easy means of composing "Web Components," into your system. While enhancing upon their functionality, versus just the drop in. 
```typescript
import { Action, Mode, Quality, createConcept, PrincipleFunction } from 'stratimux';
import { uXqOfUXQuality } from './qualities/qOfUx.quality'
import { uXPrinciple } from './uX.principle'

export type UXState = {
  //
}

export const uXName = 'uX';

const uXQualities = {
  uXqOfUXExample
}

export const createUXState = (): UXState => {
  return {
    //
  };
};

export type UXDECk = {
  uX: Concept<UXState, typeof uXQualities>
}

export type UXPrinciple = PrincipleFunction<typeof uXQualities, MuxiumDeck & UXDeck, UXState>

// Pass any arguments needed for your concept
export const createUXConcept = (
//  state: Record<string, unknown>,
//  qualities?: Quality[],
//  principles?: PrincipleFunction[],
//  mode?: Mode[]
) => {
  return createConcept<UXState, typeof uXQualities>(
    uXName,
    createUXState(),
    uXQualities,
    [
      // Temporary, will be fixed for 0.2.0 release
      uXPrinciple as unknown as PrincipleFunction<typeof uXQualities>,
    ],
    mode
  );
};
```
### uXqOfUx.quality.ts
This isolates all the parts necessary for your actions to have impact within this system. Be mindful of your types, as even though they are not explicitly used within this system. They likewise better inform training data, and likewise act as unique identifiers if you are not setting the semaphore ahead of time.

The semaphore is the method of quality selection within the Muxium. This is to reduce the time complexity of each look up. And if you applications are purely static with no planned dynamic changes to the Muxium's conceptual load. This values can be hard coded ahead of time. This is one of the planned features for [Huirth](https://github.com/Phuire-Research/Huirth). In addition to other scaffolding improvements, AI assistance, and more.
```typescript
import {
  createQualityCardWithPayload,
  MuxifiedSubject,
  createMethodWithState,
  strategySuccess,
  strategyData_muxifyData,
  strategyFailed
} from 'stratimux';
import { UXState } from '../uX.concept';

function getRandomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export type uXqOfUxField = {
  state: UXState
};

// uXDeterminedQualities is a generated definition using the companion release of Huirth released alongside 0.2.0. Otherwise use any in the Qualities field
export const uXqOfUX = createQualityCardWithPayload<uXqOfUxField, uXDeterminedQualities>({
  type: 'uX allows for easy selection of your qualities, qOfUX is your quality, and Type is the distinction',
  reducer: (state: UXState) => ({...state}),
  methodCreator: () =>
  // Only if you need to access state, otherwise
  createMethodWithState<UXState>((action, state) => {
    if (action.strategy) {
      // P/NP?
      const even = Math.round(getRandomRange(1, 5)) % 2;
      if (even) {
        const strategy = strategySuccess(action.strategy, strategyData_muxifyData(action.strategy, {
          state
        }));
        return strategy;
      } else {
        const strategy = strategyFailed(action.strategy);
        return strategy;
      }
    }
    return action;
  })
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
Your concept's "main" function. This will be called after the muxium initializes. 
*Can decompose the entry Muxified Deck Interface into the follow options*
* observer - Using observer.next(someAction) will directly emit that action into the muxium's action stream.
* concepts_ - Is the initial load of concepts when your principle is initialized
* subscribe - Allows for subscription to any changes to concepts.
* plan - Direct access to the internal planning system of Stratimux. Provides an access to a Muxified Deck Interface.
* conceptSemaphore - This identifies the placement of your concept in the muxium's conceptual set. This is used to determine if your concept is loaded and access state via the selectMuxifiedState function.
* deck - d_, e_, c_, k_ - See deck interface section for details.

```typescript
import { Subscriber } from 'rxjs';
import {
  Action,
  Concepts,
  PrincipleFunction,
  MuxifiedSubject,
  getMuxiumState,
  primeAction,
  strategyBegin,
} from 'stratimux';
import { UXState, uXName } from './uX.concept';
import { uXSomeStrategy, uXSomeStrategyTopic } from './strategies/uXSome.strategy';

export const uXPrinciple: UXPrinciple = ({
  plan,
}) => {
  // There always needs to be atleast one subscriber or plan for the Muxium to be active.
  plan('uX Plan', ({stageO, stage, d__, stagePlanner}) => [
    // This will register this plan to the muxium, this allows for the muxium to close or remove your concept cleanly.
    stageO(() => (d__.muxium.e.muxiumRegisterStagePlanner({conceptName: uXName, stagePlanner}))),
    stage(({concepts, dispatch, k}) => {
      const state = k.state(concepts);
      if (state) {
        dispatch(strategyBegin(uXSomeStrategy()), {
          iterateStage: true
        });
      }
    }, {beat: 30}),
    stage((concepts) => {
      const {lastStrategy} = getMuxiumState(concepts);
      if (lastStrategy === uXSomeStrategyTopic) {
        stagePlanner.conclude();
      }
    }, {beat: 30})
  ]);
};
```

### uXSome.strategy.ts
When you are creating your strategies within this system of design. You are optimizing towards success, and majority of your strategies should be taking place within that mind set. Failure is just a chance to get back on track and see the end of some strategy, but likewise you have to account for that failure ahead of time.

This approach to algorithm design is the core strength of Stratimux, but likewise its weakness due to branch prediction. Therefore be mindful if your strategies behave in unexpected ways. The Stage Planner paradigm, especially the beat attribute should be your first go to. As chances are your logic is becoming to complex and you need to tone down when parts of your application are notified changes to state.
```typescript
import { ActionStrategy, muxiumKick, muxiumLog, createActionNode, createStrategy } from 'stratimux';
import { uXqOfUX } from '../qualities/qOfUx.quality';

export const uXSomeStrategyTopic = 'uX Some Error Correcting Strategy';
// Passing in your application's deck removes the burden of having to manage multiple imports. While maintaining type safety even in helper functions such as a strategy creator.
export const uXSomeStrategy = (deck: MuxiumDeck & UXDeck): ActionStrategy => {
  const stepSuccess = createActionNode(deck.d.muxium.e.muxiumLog());
  const stepFailure = createActionNode(deck.d.muxium..e.muxiumKick(), {
    successNode: stepSuccess,
  });
  const stepBegin = createActionNode(deck.uX.e.uXqOfUXExample(), {
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
Notice that beyond creating the muxium, there is no need for additional input. As the muxium is a recursive function. Your concepts are initialized internally via the principle that you have assigned to your concept. Note that you may still subscribe, stage, and dispatch actions into an muxium.
```typescript
import { muxification } from 'stratimux';
import { createUXConcept } from './concepts/uX/uX.concept';

(() => {
  const muxiumName = 'Name of your muxium';
  // First boolean sets logging to true.
  // Second set store dialog to true.
  //  This will log to the console the dialog of each successive ActionStrategy.
  //    And store the entire application context in the muxium's dialog.
  // The final boolean will allow the action stream to be logged to console for debugging purposes
  muxification(muxiumName, {uX: createUXConcept()}, {logging: true, storeDialog: true, logActionStream: true});
})();
```