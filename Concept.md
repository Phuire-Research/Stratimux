# Concept
A Concept is the solution to a long standing Frustration with the FLUX Architecture. That effectively if One Bought into that System. The System of Design did not Readily create a Method of Sharing your Feature Libraries. Likewise what are Features and why are Features not allowed to Interact with One Another? Therefore the solution is the Simplification of Generalized Terms to that of its Origin, a Concept. And by way of utilization of Conceptual Logic, we have allow for these Concepts to exist as Sets. Therefore creating a New Concept, by way of Unifying their Qualities via the ActionStrategy Pattern.

This easiest Example how One Might utilize this Unifying Paradigm, is the Interaction with the FileSystem. That One could be Transforming some Generated Data as of 2023, to then be Later Saved to the FileSystem as part of that ActionStrategy.

## What is the Difference between a Name of a Word and a Concept
A Concept represents a Bundling of Functionality within Some Graph Relationship. This can be Such as their Literal Associations, but likewise the Functionality of their Qualities to Perform Some Task, or Satisfy some State.
```
For Example:
Fire is created via some Flint, Stone, and Dry Brush.
Fire is Warm and Keeps Us from the Cold.
But Fire can Light your Hair on Fire.
As Your Hair is like the Dry Brush.
And Fires Burns and Hurts, but Keeps Us Warm.
So Create Fire with Responsibility.
```
The Above Demonstrates the Inherit Conceptual Quality of Human Language and Highlights those Concepts that may Cascade some State Changes into a Subject. Such as the Concept of Warmth, is something that can be a Quality of our Environment, Food, and Ourselves. But is something that we as Humans Evolved to even notice the Change of Taste based on Temperature. Is a Selected for Quality in the Scope of our Own Evolution. As a Quality differentiates itself from an Aspect as a Important Aspect to the Observer. Example otherwise is watching your Dog devour a Hot out of the Oven Chicken Breast without Concern.

## STRX Quality contains all Functionality that Pertain to an Action.
```typescript
export type Quality = {
  actionType: ActionType;
  reducer: Reducer;
  methodCreator?: MethodCreator;
  method?: Method;
  subject?: Subject<Action>;
  keyedSelectors?: KeyedSelector[]
};
```
* actionType - Is the Type of Action and Logical Explanation of Functionality
* reducer - Alters the State of a Concept
* methodCreator - Creates a Subject and Method that utilizes the Observer for Additional Control of Flow. Including that of Moving Actions off Premise, to be later remitted back into the Stream.
* method - Is the Implementation of the Strategy Pattern via the that of a Higher Order Function to enable additional Composability.
* subject - Used within the Mode to Inform the Method of an Action to be Consumed.
* keyedSelector - Ops the Quality or Actions into the Ownership Paradigm and likewise can be used to Select some Aspect of State from the Set of Concepts.

## The Programmed Definition of a Concept
```typescript
export type Concept = {
  name: string;
  state: unknown;
  qualities: Quality[];
  principles?: PrincipleFunction[];
  mode?: Mode[];
};
```
* name - The Identifier of the Concept to be used in Conjunction with Selection.
* state - Is the State of the Concept of Properties Identified by the Programmer to achieve Functionality.
* qualities - Is a List of Qualities that Relay to the Actions that Mechanize the Concept throughout your Applications.
* principles - Are Observers of State of your Application or that of External Mechanisms. That Emit some Action into the Axium based upon that Observation.
* mode - A Mode is a Function and point of Recursion of the Runtime that the Concept may utilize to Achieve a Specific Functionality necessary for that Concept. This should Rarely be Expanded Upon.

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
Concept's Principle, Governs a Specific Set of Instructions that would allow for the Functionality of Other Libraries not Designed Specifically for this System. Otherwise these act as Action Emitters of some Value being Watched off Premise or Subscribed to within the Axium.

Likewise this Contrasts other forms of Programming. As the Principle allows for the Entire Scope of the Axium to be Self Sustaining without the Interaction from External Resources. As the createAxium Function in Reality is the only Necessary Line that is Required to Enable this Functionality.

Therefore when one is Designing their Own Concepts. The Principle should be treated in the Same Capacity as the initialization of other Programming Approaches. The Main difference, is to dispatch Actions fro the Principle. You use the observer.next() Functionality to Pass that Action.

An additional Workflow to can be place to Complete Responsibility of the Principle on its Governing Concepts. Is a Simple Enabled Property that the Principle may be Subscribed to. This allows the Principle to Cancel any Internal Observations that would be Left Hot. During the Closing Functionality of the Axium.

As this Functionality lacks the addition of some Abstraction to Hand Hold the User. The Principle Function must be well Designed to Honor its Namesake.

Later we May Create Specific Types of Principles to handle the Nuances of Repeating the Same Functionality over and over again. But likewise that is not the Scope of this Release.

## Mode - The point of Recursion
```typescript
export type Mode = ([action, concept, action$, concepts$]: [
  Action,
  Concept[],
  Subject<Action>,
  BehaviorSubject<Concept[]>,
]) => void;
```
This is Similar to the Principle Function that is Lacking some Hand Holding Capacity. And if One is Creating new Modes to Govern the Flow of Actions within the Axium. One should be Mindful of the Implementation of permissiveMode, blockingMode, and ownershipMode. And should be Avoided, for the sake of Simplicity, but is allowed for the One's own explorations with the Concept.

Where ownershipMode Implements the prior as Some Final Mode. But if One were to use some Mode that would Otherwise Replace Ownership, but Require Such. One should Unify and Extend Ownership's Functionality and inform that it is no Longer Responsible for Itself. Including setting your Own Mode that extends ownershipMode and include such as Part of your Own Initialization Strategy for your Concept. As Ownership acts as a Guard Function Prior to Either of permissiveMode or blockingMode to be Ran and Reimplements those Functions Directly as finalMode.

This could be Accomplished via some Middleware Approach within the ActionStream. But the current Mechanism that Supplies Type Checking to Operators used via the Pipe Functionality of a Stream. Loses such if attempting to set by way of some Dynamically Ordered Array.

## Closing thoughts on this Approach of Concepts
The Design of this Approach is to be Open and Transparent of its Implementations to encourage some Exploration by Others. As the Goal is Decomposability as a Method of Discovery towards some Universal Function. Which would be Signified via Stable Concepts and Qualities that are Repeatedly Reused. And constitutes a Form of Efficiency upon Discovery. As the Truth of Intelligence, is that the Goal of Communication by way of Simplicity. Complexity may need be Required for some Highly Entropic Organization, but Simplicity is the Goal by way of Explainability.

As what point is some Intelligent Notion, without some Shared Reference? How can One Know if what they hold is True and Valid without Testing. As a Flawed Individual, I would always choose chance of Failure, over that of Perfection for the sake of Enhancing Understanding. As Intelligence is Complex, but likewise within that Complexity can One Find themselves without that Common point of Reference. And this is my Attempt to Establish Such.

Beyond the Scope of this Application. Would be a Method of being able to Translate these Concepts into any other Language as they come into Being. The Power of Intelligence comes from seeing the World as Mundane, but Respecting the Decisions made. As even in the Scope of this Work. I never Planned on Creating a Framework, nor a Logical System to Explain Such. I attempted to Extend Flux to Serve my own Purpose with that ActionStrategy Pattern. But at every turn, someone Else's Decision reared its Head that Hampered my ability to Articulate the Unified Turing Machine.

If my Own Work of Concepts gets in your Way. Have fun!