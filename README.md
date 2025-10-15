![Stratimux](https://github.com/Phuire-Research/Stratimux/blob/main/Stratimux.png?raw=true)
### *The Muxified Turing Machine - The Advent of the Strong Fast Computer in Plain Text, that Solves the "**impossible halting problem**" of Classic Turing Machines, in the Spirit of the Open Internet*

**Features:**
* Universal Transformer
* StratiDECK Interface System (Higher Order Conceptual Composition)
* ICE - Intelligently Crystallized Executable
* Function as an Operating System
* Halting Complete
* Concept Libraries (Deck)
* Action Oriented (Smalltalk Cellular Messaging)
* Single Network Lock (Mutex as Ownership)
* Asynchronous Graph Framework
* Composable Strategies (ActionStrategy)
* Stage Planner (Higher Order Reasoning)
* Prioritization
* Change Detection
* Plain Text Dialog Output
* Hot Loading
* No Dependency Injection

### Getting Started
* [STRATIMUX PROJECT TEMPLATE](https://github.com/Phuire-Research/STRATIMUX-TEMPLATE)
* [Stratimux @ npm](https://www.npmjs.com/package/stratimux)
* [v0.3.22 Migration Guide](https://github.com/Phuire-Research/Stratimux/blob/main/MIGRATION-GUIDE-v0.3.2.md) - **Required for v0.3.22 upgrade**
* [Stratimux Agent Reference](https://github.com/Phuire-Research/Stratimux/blob/main/STRATIMUX-REFERENCE.md) - Drop in reference sheet for utilization of Stratimux for Agent Environments Unfamiliar with Stratimux.

### What is Muxification?
Muxification is a Multiplex of Quantitative and Qualitative Reasoning. Stratimux represents a Code as Proof of Concept for this new System. Where a Concept in this system is something in the pursuit of being fully measured, rather than nebulous or abstract. That goes a step further than traditional methods, including the ability to demuxify concepts.

### Advice when encountering branch prediction errors.
The easiest means of detecting if your application is starting to encounter such errors is to enable the dialog and logging options on your Muxium. To avoid running into these branch prediction errors. Attempt to limit your strategy assembly, qualities, and plans to be less than O(n^3). You will find that your functions will suddenly become probabilistic in their ability execution deterministically.

Thankfully, this is the reason for the atomic behavior of your qualities combined with strategies and plans. As you may shrink time complexity into a series of steps. Or better yet, if you are relying on accessing some parameters from your state. Be sure to flattened those data structures into something that can readily be accessed.

When in doubt simplify.

### Concept Index
* [Action Strategy](https://github.com/Phuire-Research/Stratimux/blob/main/ActionStrategy.md) - Data structure that allows for Stratimux to be provably terminating.
* [Muxium](https://github.com/Phuire-Research/Stratimux/blob/main/Muxium.md) - Governing concept that contains the set of concepts that formalizes each muxium.
* [Concept](https://github.com/Phuire-Research/Stratimux/blob/main/Concept.md) - Concepts are composed of state, qualities, principles, and mode.
* [Stage Planner](https://github.com/Phuire-Research/Stratimux/blob/main/StagePlanner.md) - Slices your application into different stages and prevents action overflows. 
* [Action Controller](https://github.com/Phuire-Research/Stratimux/blob/main/ActionController.md) - Allows methods to be performed asynchronously.
* [Strategy Data](https://github.com/Phuire-Research/Stratimux/blob/main/StrategyData.md) - Enables the Action Strategy pattern to perform as a "Universal Transformer." 
* [Higher Order Conceptual Composition](https://github.com/Phuire-Research/Stratimux/blob/main/HigherOrderConceptualComposition.md) - Advancing Logical Graph Programming towards the Unlimited Pursuit of Exploring Conceptual Space.
* [Spatial Ownership](https://github.com/Phuire-Research/Stratimux/blob/main/SpatialOwnership.md) - A single lock concept that can be within a single process or network of muxiums.

### Want to learn more?
* [The Impossible Halting Turing Machine](https://github.com/Phuire-Research/Stratimux/blob/main/Index.md) - Original Paper for Stratimux
* [Muxified Turing Machine](https://github.com/Phuire-Research/Stratimux/blob/main/The-Muxified-Turing-Machine.md) - The governing concept for this entire framework.:|

## Change Log ![Tests](https://github.com/Phuire-Research/Stratimux/actions/workflows/node.js.yml/badge.svg)
## ⚠️ v0.3.293 - Quality Type Naming Convention Standardization & Bidirectional Validation (BREAKING)
**Refining Patch**: Standardizes all quality type strings to follow the Verbose Split Naming Convention, enabling reliable bidirectional action validation across network boundaries.

### Breaking Change
**ALL quality type strings have been updated** to follow a consistent camelCase → Space-Separated Capitalized pattern. Projects that compare or reference action type strings will need updates.

**Example**:
```typescript
// BEFORE v0.3.293
type: 'Muxium received a Bad Action'  // Inconsistent
type: 'add Concepts from Que'          // Inconsistent

// AFTER v0.3.293
type: 'Muxium Bad Action'              // Consistent with variable name
type: 'Muxium Add Concepts From Que'   // Follows Verbose Split Pattern
```

### New Validation Utilities
Added bidirectional action validation for type-safe network communication:
```typescript
import { validateAndRecreateAction, validateActionBatch, isBadAction } from 'stratimux';

// Validate actions received over WebSocket
const validatedAction = validateAndRecreateAction(concepts, deck, incomingAction);
```

### Migration Required
**⚠️ [Migration Guide Required →](https://github.com/Phuire-Research/Stratimux/blob/main/MIGRATION-v0.3.293.md)**

Search your project for:
- Action type string comparisons (`if (action.type === '...')`)
- Switch statements on action types
- Test assertions checking type strings

**Impact**: Medium - Requires search and replace of action type references in consuming projects

---

## v0.3.292 - LocalPrinciple Pattern Introduction
**Minor Update**: Enables components to create local principles with bidirectional separation of concerns.

### New Helper Function
* **LocalPrinciple**: Components can now derive the PrincipleFunction interface from a Muxium instance
  - Maintains same programming model as global principles
  - Bidirectional separation prevents GC issues
  - Enables local stage planners within components
  ```typescript
  createLocalPrinciple('ComponentName', muxium, ({plan}) => {
    plan('Local Plan', ({stage}) => [/* stages */]);
  });
  ```

Note the usage of this extends the Utilization of our Principle Functions so that what we assign to our Concepts are our Global Principles. Wherein we may use this helper function to establish the same pattern in our components.

*Noting we can access the stage planner and more directly via the muxium already. This approach is designed to aid the organization of Stratimux in your Projects via it's specific pattern of design.*
---

## v0.3.291 - KeyedSelector Propagation Enhancement
**Patch Release**: Critical enhancement for ownership system's stake persistence through ActionStrategy chains.

### Key Change
* **KeyedSelector Cascade**: Actions now inherit and merge KeyedSelectors through all strategy transitions
  - Preserves ownership stakes across success/failure/decision branches
  - Maintains selector context through punted strategies and sequences
  - Ensures deterministic stake ordering throughout strategy execution

### Development Note
**⚠️ Ownership Individualization Requirement**: The Ownership concept must exist independently as a baseline concept on Muxiums requiring ownership coordination. Do not muxify ownership into other concepts.

```typescript
// Correct: Ownership as independent baseline concept
const muxium = muxification('YourApp', {
  yourConcept: createYourConcept(),
  ownership: createOwnershipConcept()  // ← Independent baseline
});

// Access ownership qualities from any concept via selectStratiDECK
const ownershipDeck = selectStratiDECK<OwnershipDeck>(deck, ownershipName);
const backtrackAction = ownershipDeck.e.ownershipBackTrack();
```

The StratiDECK system enables access to baseline concepts and their parts from anywhere in the composition hierarchy.

---

# **MAJOR** v0.3.29 - Bi-Directional Ownership System & Stage Integration
This major update completes the ownership system architecture initiated in v0.3.281, introducing **deterministic concurrency control** through stake-based coordination while finalizing the stage lifecycle management for ownership-aware applications.

## Breaking Changes
* **`stageO()` API Evolution**: Building on v0.3.281's foundation, now fully integrated with ownership
  ```typescript
  // v0.3.281 introduced
  stageO()           // Wait for ownership initialization (default)
  stageO(true)       // Explicitly skip ownership check
  
  // v0.3.29 completes the integration
  // Stages using ownership MUST use stageO() to ensure proper coordination
  ```

* **Terminology Alignment**: Framework-wide shift to compositional language
  - "Hierarchical" → "Uni-directional tree composition"
  - "Parent-child relationships" → "Uni-directional relationships"
  - Reflects the true nature of Stratimux's higher-order composition

## Key Features

### Bi-Directional Ownership System
* **Stake-Based Coordination**: Actions claim "stakes" at terminal positions with temporal priority (FIFO)
* **Opt-In Via KeyedSelectors**: Any action becomes ownership-aware by attaching selectors
* **Automatic Cascading**: KeyedSelectors propagate through entire ActionStrategy chains
* **O(depth) Performance**: ~10x improvement over naive checking algorithms
* **Deterministic Execution**: Same order across multiple runs, parallel branch support

### Critical Stream Preservation Fix
* **`switchMap` → `mergeMap`**: All async methods now preserve action streams
  - Enables true bi-directional action flow
  - Prevents orphaning of concurrent actions
  - Essential for ownership system's parallel execution

### Enhanced Stage Lifecycle (from v0.3.281)
* **Automatic Registration**: Stage planners self-register via StratiDECK
* **Dual Conclusion Patterns**: `conclude()` and `stagePlanner.conclude()`
* **Proper Cleanup**: Consistent lifecycle management with `muxiumUnregisterStagePlanner`

## Quick Start
```typescript
// 1. Opt actions into ownership
action.keyedSelectors = [createKeyedSelector('your.path')];

// 2. Make strategies ownership-aware
const actionNode = createActionNode(yourAction(), {
  failureNode: createActionNode(deck.ownership.e.ownershipBackTrack()),
  agreement: 10000,  // Time for coordination
  keyedSelectors: [selector]
});

// 3. Compose ownership into your muxium
const muxium = muxification('App', {
  yourConcept: createYourConcept(),
  ownership: createOwnershipConcept()  // Just add this
});
```

**[Full Documentation →](https://github.com/Phuire-Research/Stratimux/blob/main/STRATIMUX-0.3.29-CHANGELOG.md)**

### Updated Stratimux Reference Document
1. Added Advanced Two-Stage KeyedSelector Routing Pattern
2. `createMethodWithConcepts` Deck K Usage Pattern
## Renewed Action Origin v0.3.8 (Breaking)

Action origins have been renewed from array-based to structured object composition, providing more granular override control and automatic origin assignment for principles:

This renewed approach removes the **hardOverride** in favor of `conceptOverride`, `planOverride`, and `specificOverride`.

```typescript
// Before v0.3.8
const origin = createOrigin(['somePlan', 0]);
dispatch(action, { hardOverride: true });

// After v0.3.8
const origin = createOrigin({
  conceptName: 'someConcept',
  originType: 'somePlan', 
  specificType: 0
});

// Now with targeted override options
dispatch(action, { conceptOverride: true });   // Override by concept
dispatch(action, { planOverride: true });      // Override by plan type
dispatch(action, { specificOverride: 3 });     // Override the 3rd specific stage from 0

// Direct origin access in stages
stage(({ dispatch, origin, d }) => {
  const [concept, plan, stage] = origin.split('+');
  dispatch(d.concept.e.action(), { iterateStage: true });
});

// Automatic principle origin tracking
action.origin = createOrigin({
  conceptName: concept.name,
  originType: 'principle-' + concept.semaphore + '-' + i
});
```

# Stratimux v0.3.27: Circular StratiDECK Architecture

The v0.3.27 series introduces complete circular reference support in StratiDECK, enabling qualities to receive their own deck references and establishing the Muxium means of accessing the base set of Conceptual Decks throughout the Application.

## What's New
**📊 Type System Boundaries**: ECK constraint at Tier 2 for circular references

0. **🔄 Circular StratiDECK**: Complete circular reference system with Muxium returning to the Base Set via its own `d`, enabling all subsequent features
1. **🎯 Quality Deck Access**: Qualities now receive their current muxified deck while retaining their singleton functionality
2. **🔍 Dynamic Deck Selection**: `selectStratiDECK<C>()` takes advantage of the complete circular reference to enable ease of concept traversal outside of muxified decks

## Breaking Changes
- Quality signatures now include deck parameter for muxification
- Origin handling refined for head actions

**Key Features:**

### Complete Circular Reference Architecture
```typescript
// Qualities receive their own deck.d
const someQuality = createQuality({
  reducer: (state, action, deck) => {
    // muxium concept always contains the base deck of concepts without the muxified parts
    const muxifiedCircularKeyedSelectors = deck.d.someConcept.d.muxium.d.someConcept.d.partOfConcept.k;
    // It's important to note that functionally the deck passed has access to each concept that is muxified for the given deck.
    // But due to Typescript Restrictions and poor handling of this new Higher Order Associative Dynamic we have to break the reference via our eck system. This allows for concepts to be muxified into any other concept while retaining that concept's scope within the muxium.
    const muxifiedKeyedSelectors = deck.d.someConcept.d.partOfConcept.k;
    return { updated: true };
  }
});
```

### Type System Limitation with Higher-Order Composition
Specific note about working with the new selectStratiDECK System - this demonstrates the fundamental limitations of compositionally informed type systems:

```typescript
// Will Build
export type SomeConcept = Concept<SomeState, SomeQualities, SomeMuxifiedDecks>
export type SomeDeck = {
  someConcept: Concept<SomeState, SomeQualities, SomeMuxifiedDecks>
}

// Will NOT Build when Utilizing - Pure Entry Actions will be Assumed to have Payloads
export type SomeConcept = Concept<SomeState, SomeQualities, SomeMuxifiedDecks>
export type SomeDeck = {
  someConcept: SomeConcept
}
```
This will compile, but due to how the Parent-Child Relationship in these Systems are not Interoperable, you can't do the Common Sense Composition without losing Information.

### 📈 **v0.3.27 Series Updates**
- **v0.3.274**: Muxium no longer sets Origin that move to the Muxium's Head to that Origin
- **v0.3.273**: Strategy punt mechanism and updated Stratimux Reference
- **v0.3.272**: Async method unreferencing and StratiDECK export
- **v0.3.271**: Base implementation of deck emission to quality parts

### Refinement Muxify Concepts Q Property v0.3.261
# Stratimux v0.3.26: StratiDECK

The StratiDECK Higher Order Conceptual Compositional Architecture is now production-ready with enhanced type safety and refined APIs.

## What's New
- **🎯 Enhanced Selectors**: `k.getState()`, `k.getName()`, `k.getConcept<T>()` - clearer naming, better types
- **🔒 Type System**: Complete coverage for all muxified concept compositions  
- **🚀 Developer Experience**: No type casting needed for `nextA`, cleaner console output
- **📋 Stricter Requirements**: Concept names must match their listen names in concept load

## Breaking Changes
- Renamed selectors: `k.state()` → `k.getState()`, `k.name()` → `k.getName()`, `k.create()` → `k.getConcept()`
- Concept-listen name pairing now enforced

**[Full Release Notes →](https://github.com/Phuire-Research/Stratimux/releases/tag/v0.3.26)**

```typescript
// OLD (breaks at scale)
export type CounterQualities = typeof counterQualities;

// NEW (required for type safety)
export type CounterAdd = Quality<CounterState>;
export type CounterQualities = {
  counterAdd: CounterAdd,
  // ... explicit mapping required
};
```

### 📈 **Why the Boilerplate Increase?**
*Even though the abstraction adds more boilerplate, it becomes necessary when a concept acquires enough qualities - TypeScript starts to break down in its typings.* This change ensures type safety and reliability at scale.

### 📊 **Impact**
- **91 files changed** (+4,189 additions, -969 deletions)
- **All concepts**: Require explicit quality type interfaces
- **All tests**: Updated for new type patterns

**[Complete migration details and examples →](https://github.com/Phuire-Research/Stratimux/blob/main/MIGRATION-GUIDE-v0.3.22.md)**


Other typescript projects
```bash
npm i stratimux@latest
```

From the template template
```bash
npm run start
```


### Project Structure
```
src/ index.ts
src/ concepts / muX / qualities / qOfMux.quality.ts
     concepts / muX / strategies / muXSome.strategy.ts
     concepts / muX / muX.concept.ts
     concepts / muX / muX.principle.ts
     tests / example.test.ts
```

### muX.concept.ts
Treat your concepts as libraries, modules, and/or(anor) entire applications. As that was the initial inspiration for this system. Beyond this initial release, there will be a growing library of Standardized Concepts for utilization within your Muxiums. Including the ability to finally have an easy means of composing "Web Components," into your system. While enhancing upon their functionality, versus just the drop in. 

```typescript
import { Concept, createConcept, MuxiumDeck, PrincipleFunction, Quality } from 'stratimux';
import { muXqOfMux, MuXqOfMux } from './qualities/qOfMux.quality';
import { muXPrinciple } from './muX.principle';

export type MUXState = {
  message: string
}

export const muXName = 'muX';

export const createMUXState = (): MUXState => {
  return {
    message: 'Hello World!'
  };
};

// v0.3.22 REQUIRED: Explicit quality type mapping for type safety at scale
export type MUXQualities = {
  muXqOfMux: MuXqOfMux;
};

export type MUXDeck = {
  muX: Concept<MUXState, MUXQualities>;
};

export type MUXPrinciple = PrincipleFunction<MUXQualities, MuxiumDeck & MUXDeck, MUXState>;

export const createMuXConcept = () => {
  return createConcept(
    muXName,
    createMUXState(),
    {
      muXqOfMux
    } as MUXQualities,
    [
      muXPrinciple,
    ],
  );
};
```
### muXqOfMux.quality.ts
This isolates all the parts necessary for your actions to have impact within this system. Types are a qualitative description of the overall quality. As even though they are not explicitly used within this system. They likewise better inform training data, and likewise act as unique identifiers if you are accessing the action creators directly versus the DECK System.

Internally Stratimux uses semaphores as the method of quality routing within the Muxium. This is to reduce the time complexity of each look up. To further increase the speed of execution of your applications, utilize the supplied DECK Interfaces at each point of entry.
```typescript
import {
  createMethodWithState,
  strategySuccess,
  strategyFailed,
  createQualityCardWithPayload,
  strategyData_muxifyData,
  Quality
} from 'stratimux';
import { MUXDeck, MUXState, } from '../muX.concept';

type muXOfMuxPayload = {
  message: string
}

export type uXqOfUxField = {
  state: MUXState
};

function getRandomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// v0.3.22 REQUIRED: Export explicit quality type for concept type mapping
export type MuXqOfMux = Quality<MUXState, muXOfMuxPayload>;

export const muXqOfMux = createQualityCardWithPayload<MUXState, muXOfMuxPayload, MUXDeck>({
  type: 'muX allows for easy selection of your qualities, muXqOfMux is your quality, and Type is the distinction',
  reducer: (_, action) => {
    const {message} = action.payload;
    return {
      message
    };
  },
  methodCreator: () => createMethodWithState(({action, state}) => {
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
//   defaultReducer,
// The method is optional and is an advanced behavior
//   defaultMethodCreator
// );
```

### muX.principle.ts
Your concept's "main" function. This will be called after the muxium initializes. 

```typescript
import {
  getMuxiumState,
  strategyBegin,
  createStages
} from 'stratimux';
import { muXName, MUXPrinciple } from './muX.concept';
import { muXSomeStrategy, muXSomeStrategyTopic } from './strategies/muXSome.strategy';

export const muXPrinciple: MUXPrinciple = ({
  plan
}) => {
  // There always needs to be atleast one subscriber or plan for the Muxium to be active.
  const muxPlan = plan('muX Plan', ({stageO, stage, d__}) => [
    // This will register this plan to the muxium, this allows for the muxium to close or remove your concept cleanly.
    stageO(() => (d__.muxium.e.muxiumRegisterStagePlanner({conceptName: muXName, stagePlanner: muxPlan}))),
    stage(({concepts, dispatch, k, d}) => {
      const state = k.getState(concepts);
      const message = k.message.select();
      console.log(message);
      if (state) {
        dispatch(strategyBegin(muXSomeStrategy(d)), {
          iterateStage: true
        });
      }
    }, {beat: 30}),
    stage(({concepts, stagePlanner}) => {
      const {lastStrategy} = getMuxiumState(concepts);
      if (lastStrategy === muXSomeStrategyTopic) {
        stagePlanner.conclude();
      }
    })
  ]);  // v0.3.22 Advanced: Using createStages helper for improved scoped composition
  // *Note* when accessing your deck from outside of Stratimux, you will need to supply your Deck Type Interface to the plan to access such. This is a QoL Decision allowing for Stratimux to be adapted to any number of environments.
  const muxPlanWithStages = plan<MUXDeck>('muX Plan with createStages', ({d__}) => 
    createStages(({stageO, stage}) => {
      // By using createStages you gain access to scope encapsulation while maintaining type safety. 
      // This allows you to process which stages you would like to include in an open environment, 
      // versus having to perform sophisticated one-liners and reducing readability.
      const stageRegister = stageO(() => (d__.muxium.e.muxiumRegisterStagePlanner({conceptName: muXName, stagePlanner: muxPlanWithStages})));

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
    })
  );
};
```

### muXSome.strategy.ts
When you are creating your strategies within this system of design. You are optimizing towards success, and majority of your strategies should be taking place within that mind set. Failure is just a chance to get back on track and see the end of some strategy, but likewise you have to account for that failure ahead of time.

This approach to algorithm design is the core strength of Stratimux, but likewise its weakness due to branch prediction. Therefore be mindful if your strategies behave in unexpected ways. The Stage Planner paradigm, especially the beat attribute should be your first go to. As chances are your logic is becoming to complex and you need to tone down when parts of your application are notified changes to state.
```typescript
import { ActionStrategy, createActionNode, createStrategy, Deck, MuxiumDeck } from 'stratimux';
import { MUXDeck } from '../muX.concept';

export const muXSomeStrategyTopic = 'muX Some Error Correcting Strategy';
export const muXSomeStrategy = (d: Deck<MuxiumDeck & MUXDeck>): ActionStrategy => {
  const stepSuccess = createActionNode(d.muxium.e.muxiumLog());
  const stepFailure = createActionNode(d.muxium.e.muxiumKick(), {
    successNode: stepSuccess,
  });
  const stepBegin = createActionNode(d.muX.e.muXqOfMux({
    message: 'Muxification Hello World'
  }), {
    successNode: stepSuccess,
    failureNode: stepFailure
  });
  return createStrategy({
    topic: muXSomeStrategyTopic,
    initialNode: stepBegin
  });
};
```

### index.ts
Notice that beyond creating the muxium, there is no need for additional input. As the muxium is a recursive function. Your concepts are initialized internally via the principle that you have assigned to your concept. Note that you may still subscribe, stage, and dispatch actions into an muxium.
```typescript
import { muxification } from 'stratimux';
import { createMuXConcept } from './concepts/muX/muX.concept';

(() => {
  const muxiumName = 'Your Muxium';
  // Sets logging to true and store dialog to true
  //  This will log to the console the dialog of each successive ActionStrategy
  //  And store the entire application context in the muxium's dialog.
  muxification(muxiumName, {muX: createMuXConcept()}, {logging: true, storeDialog: true});
})();
```