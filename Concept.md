# Concept
A Concept is the solution to a long standing frustration with the FLUX architecture. That effectively if one bought into that system. The system of design did not readily create a method of sharing your feature libraries. Likewise what are features and why are features not allowed to interact with one another? Therefore the solution is the simplification of generalized terms to that of its origin, a concept. And by way of utilization of conceptual logic, we allow for these concepts to exist as sets. Therefore creating a new concept, by way of unifying their qualities via the ActionStrategy pattern as emergent phenomena.

This easiest example how One might utilize this unifying paradigm, is the interaction with the FileSystem. That one could be transforming some generated data as of 2023, to then be later saved to the FileSystem as part of that ActionStrategy.

## Why Concepts over Constructs?
A Concept represents a bundling of functionality within some graph relationship. This can be such as their literal associations, but likewise the functionality of their qualities to perform some task, or satisfy some state transformation.
```
Conceptual Symbolic Expression:
(Force + Flint + Stone) + Dry Brush + Air = Fire
Logic Conceptual Explanation:
Using Force with Flint and Stone. Creates Sparks towards Dry Brush and Air, ignites to create Fire.
```
The above demonstrates the inherit conceptual quality of human language and highlights those concepts that may cascade some state changes into a subject. Such as the concept of sparks created from flint, stone, and force. Is an act of unifying some concepts spatially to form that of sparks. Which carry some transformational quality that can be applied to dry brush and the friction from air to create ignition and thusly fire. If this seems simple, that is the point. As we are introducing this simplicity to afford for greater explainability of the world around us. This would be the advent of a Unified Conceptual Formula.

With our technology we may visit the exact Science that allows for this abstraction to exist. But for the majority, all that would matter is access to a developed library of knowledge that would facilitate such conceptualizations into reality for us. The goal is a system that is capable of: Car + Plane = Flying Car. And not only have such be created via some process, but the exact blueprints and the instructions for the rapid assembly to bring such into reality. Even better if we may simulate such before its creation and test to see if it is worthy to brought into reality in the first place.

The difficulty of constructs. Is that you cannot readily decompose their qualities and how they interact with their parts to make that construct. That there is some information loss in the construction process. As constructs are just concepts, just like everything else. We are merely working with the most simplified terms possible, for the opportunity of greater arrangement of sets. That constructs themselves can have qualities, but likewise using such in this system of study we would determine their decomposed parts. This is the pursuit of the new Unified Conceptual Science that is being formalized.

As in the scope of some rapid rise of generative information. This simplicity of concepts is the most fundamental mechanism to explain new information and discovery in any age. Insisting upon constructs, obfuscates concepts, and summarily the total bounds of what can be created. Would be similar to striking entire sets of numbers from equations is the most blunted example to the difference in approach.

## STRX Quality contains all Functionality that Pertain to an Action.
```typescript
export type Quality = {
  actionType: ActionType;
  reducer: Reducer;
  methodCreator?: MethodCreator;
  method?: Method;
  subject?: Subject<Action>;
  keyedSelectors?: KeyedSelector[];
  meta?: Record<string,unknown>;
  analytics?: Record<string,unknown>;
};
```
* actionType - Is the type of action and logical explanation of functionality
* reducer - Alters the state of a concept
* methodCreator - Creates a subject and method that utilizes the observer for additional control of flow. Including that of moving actions off premise, to be later remitted back into the action stream.
* method - Is the implementation of the strategy pattern via to facilitate higher order functionality to enable additional composability.
* subject - Used within the mode to inform the method of an action to be consumed.
* keyedSelector - Ops-in the quality or actions into the ownership paradigm and likewise can be used to select some aspect of state from the set of concepts.
* meta - Decorator property, this is for internal use.
* analytics - This field holds record entries such as time, cost, and success rate. This is for advanced systems that perform analytics to better describe ActionStrategies and their selection at run time.

## The Programmed Definition of a Concept
```typescript
export type Concept = {
  name: string;
  state: unknown;
  qualities: Quality[];
  principles?: PrincipleFunction[];
  mode?: Mode[];
  meta?: Record<string,unknown>;
};
```
* name - The identifier of the concept to be used in conjunction with selection.
* state - Is the state of the concept of properties identified by the programmer to achieve functionality.
* qualities - Is a list of qualities that relay to the actions that mechanize the concept throughout your applications.
* principles - Are observers of state of your application or that of external mechanisms. That emit some action into the axium based upon that observation.
* mode - A mode is a function and point of recursion of the runtime that the concept may utilize to achieve a specific functionality necessary for that concept. This should rarely be expanded upon.
* meta - Decorator property, this is for internal use.

## Principle
``` typescript
export type PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concept[],
  concept$: Subject<Concept[]>,
) => void;

export function createPrinciple$(
  principleFunc: PrincipleFunction,
  concepts: Concept[],
  concepts$: Subject<Concept[]>,
): Observable<Action>;
```
Concept's principle, governs a specific set of instructions that would allow for the functionality of other libraries not designed specifically for this system. Otherwise these act as action emitters of some value being watched off premise or subscribed to within the axium.

Likewise this contrasts other forms of programming. As the principle allows for the entire scope of the axium to be self sustaining without the interaction from external resources. As the createAxium function in reality is the only necessary line that is required to enable this functionality.

Therefore when one is designing their own concepts. The principle should be treated in the same capacity as the initialization of other programming approaches. The main difference, is to dispatch actions from the principle either via the stage paradigm or the supplied observer. The use of observer.next() is to pass actions during initialization, but should instead stage when observing state to prevent action overflow.

An additional workflow to can be place to complete responsibility of the principle on its governing concepts. Is a simple enabled property that the principle may be subscribed to. This allows the principle to cancel any internal observations that would be left hot. During the closing functionality of the axium, or the removal of that governing concept.

As this functionality lacks the addition of some abstraction to hand hold the user. The principle function must be well designed to honor its namesake. But comes with all batteries included to avoid dependency injection.

Later we may create specific types of principles to handle the nuances of repeating the same functionality over and over again. But likewise that is not the scope of this release.

## Mode - The point of Recursion
```typescript
export type Mode = ([action, concept, action$, concepts$]: [
  Action,
  Concept[],
  Subject<Action>,
  BehaviorSubject<Concept[]>,
]) => void;
```
This is similar to the principle function that is lacking some hand holding capacity. And if one is creating new modes to govern the flow of actions within the axium. One should be mindful of the implementation of permissiveMode, blockingMode, and ownershipMode. And should be avoided, for the sake of enhancement, is allowed for the one's own explorations with the concept.

Where ownershipMode implements the blockingMode and some defaultMode as its final mode call. But if one were to use some mode that would otherwise replace ownership, but require such. One only needs to set the axium's defaultModeIndex to their newly added Mode. This can be accomplished via accessing axium's mode and state property of modeNames. Where the index of your modeName corresponds to the index that should be set to defaultModeIndex.

Otherwise if you are modifying or extending ownership's functionality and be sure to inform it that no longer responsible for itself. Including setting your own mode that extends ownershipMode and include such as part of your own initialization strategy for your concept. As ownership acts as a guard function prior to running either permissiveMode, blockingMode, or your newly set "defaultMode," or new ownershipMode to be ran that reimplements those functions directly as its own version of finalMode.

This could be accomplished via some middleware approach within the actionStream. But the current mechanism that supplies type checking a series fo operators used via the pipe functionality of a stream. Loses type validation if attempting to set by way of some dynamically ordered array.

## Closing thoughts on this Approach of Concepts
The design of this approach is to be open and transparent of its implementations to encourage some exploration by others. As the goal is decomposability as a method of discovery towards some universal concepts. Which would be signified via stable concepts and qualities that are repeatedly reused between unlike concepts. And constitutes a form of efficiency upon discovery. As the truth of intelligence, is that the goal of communication by way of simplicity. Complexity may need be required for some highly entropic organization, but simplicity is the goal by way of explainability.

As what point is some intelligent notion, without some shared reference? How can one know if what they hold is true and valid without testing. As a flawed individual, I would always choose chance of failure, over that of perfection for the sake of enhancing understanding. As intelligence is complex, but likewise within that complexity can one find themselves without that common point of reference. And this is my attempt to establish such. Noting that there are very few references throughout this work. And concepts take the center stage.

Beyond the scope of this application. Would be a method of being able to translate these concepts into any other language as they come into being. The power of intelligence comes from seeing the world as mundane, but respecting the decisions made. As even in the scope of this work. I never planned on creating a framework, nor a logical system to explain such. I attempted to extend FLUX to serve my own purpose with that ActionStrategy pattern. But at every turn, someone else's decision reared its head that hampered my ability to articulate the Unified Turing Machine.

If my Own Work of Concepts gets in your way. Have fun!

*It is interesting to note that there is no common symbol for concepts, but there is a concept for symbols*