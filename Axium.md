## Axium
The main point of Interaction and Named holder of a Set of Concepts. This was inspired by Axiom. But slightly changed towards the Concept by Act of Unifying Concepts. As a Counter to the Traditional Axiom which is based on Statements assumed to be True and Assumed to be Nonreducible. But can be Reduced to their Concepts. Therefore an Axium is the Set of Concepts and their Qualities that allow for the Emergence of New Concepts. The Advantage of this Approach excluding the createAxium Function. The Entirety of an Axium may be Decomposed to the Sum of its Parts. That way versus creating some new Arbitrary Construct of a FileSystem. We are in Competition as to whose FileSystem Concept is Best. As if someone improves upon a Concept you are working on in this System. Versus creating some new Library, you may take the Parts of that Concept into your own Version of it.

There is much to be Expanded upon this as a potential Platform of Doing. Where the goal would be the refinement towards Discovery and Stability of the most Utilized Concepts. So that may create some Standard Library of Concepts to be Shared. Versus the current Generalized Construct Paradigm that this has been designed as a Direct Counter to. Of that mass Repeated Reimplementation of Concepts as Constructs that cannot readily be Decomposed and Reconfigured. As what is interesting is the Discovery within this type of system of Universal Concepts and Qualities. By way of Matching Functionality where we would least expect it.

```typescript
export function createAxium(initialConcepts: Concept[], logging?: boolean, storeDialog?: boolean) : {
  subscribe: () => {},
  unsubscribe: () => {},
  close: () => {},
  dispatch: (action: Action) => {}
}
```

Note here an additional departure of what would be supplied to the Store is an Array of Concepts over that of a Constructed Dictionary of Features. As the typical check of what Action to choose at Run Time had been that of comparing the Type of Actions via a Reducer anor Effect via a string comparison. Here we are allowing for the additional buffer of knowing the Concepts and their Qualities ahead of Time. This populates the Action's Semaphore Tuple that corresponds the its Concept and Placement in the Array of Qualities that it Contains. However you may still dispatch Actions without the Semaphore supplied and this comparison is made Once to find that Semaphore at Run Time.

The Design decision here allows us to forgo the need for Dependency Injection. And later we will discuss Axium Qualities that would allow the change of Concepts Loaded or Generated into the Axium at Run Time. Which if one Chooses to alter the composition of the Axium, the generation is iterated upon. This Accomplishes one of the Primary Qualities that Satisfies the Specification Laid out by the Unified Turing Machine. Where by the Finite Symbol Reference Table is of a Logical Selection and permitting some Testable Ability to Halt. Is the Logical Deterministic Means of Solving the Halting Problem of the Classical Turing Machine. But this is only if we Accept that Concepts and their Qualities have an Amount of Completeness towards their Ability to Halt. That the inability to Halt, is a Specific Design Choice or Consequence of the Machine at some Point of Scale, not Yet Accounted For, or Done so on Purpose. As the Axium in Reality is just a Recursive Self Transforming Function.

```typescript
export type AxiumState {
  open: boolean;
  logging: boolean;
  dialog: string;
  storeDialog: boolean;
  lastStrategy: string;
  generation: number;
  modeIndex: number;
  defaultModeIndex: number;
  modeNames: string[]
  methodSubscribers: NamedSubscribers[];
  generalSubscribers: NamedSubscribers[];
  action$?: Subject<Action>;
  concepts$?: BehaviorSubject<Concept[]>;
  addConceptQue: Concept[],
  removeConceptQue: Concept[],
  subConcepts$: Subject<Concept[]>;
}
```
* open - This is utilized by Principles and External Subscribers to denote when they should initialize their Functionality. 
* logging - Controls whether the STRX Dialog Paragraphs are emitted upon Strategy Completion. In addition to other Debugging Procedures.
* dialog - Is the Internal Representation of the Strategies that the Axium has Ran.
* storeDialog - This is set to false By Default to save on Memory, but if stored, allows such to be Subscribed To.
* lastStrategy - Informs specifically the of the Last ActionStrategy Topic to have ran through the System. This is used via Testing or the Deployment of addition Strategies Upon Completion.
* generation - This iterates each time the Set of Concepts is Transformed. And if an Action is Received of the Wrong Generation. Will be Primed at Run Time, if not found this will emit a BadAction that if Logging is set to True. Will be Emitted to the Console alongside the invalidated Action as Payload.
* modeIndex - This determines which Mode is currently being ran from the lists of Modes stored on the Axium Concept.
* defaultModeIndex - This determines what Mode will be set by setDefaultMode. Of importance for Adding and Removing Strategies.
* modeNames - Is the paring of a Name that Correspond to Mode and their Respective Index that allow for the Mode to Altered at Run Time without String Comparison.
* methodSubscribers - Accumulates all Method Subscriptions for their Manipulation at Run Time.
* generalSubscribers - Same as Method Subscribers, but a Catch All including that of Principles and their Internal Subscriptions that would Ordinarily leave Principles as Hot and active in Memory if not Concluded upon Removal or Close.
* action$ - Is the internal Action Stream.
* concepts$ - Is the internal Concept[] Stream that Methods and Principles have Access To.
* addConceptQue - The Current Pattern to allow for Principles to Effect the Concepts within the Application. Rather than a Direct Subscription to the Action$, they listen to State Properties to control what Actions they Emit into the Stream. In this case a Set of Concepts to be Loaded into the Axium.
* removeConceptQue - The inverse of the Above to Remove Concepts.
* subConcepts - This is the Outer Subscription that other Axiums or Applications may have Access to. While in Blocking Mode, these Subscriptions are not Updated.

## The Anatomy of an Axium
* Action - Is a Dumb Object that is Supplied some Data as Payload or Performs some Transformation of State based on its Semaphore which is Inferred via Its Type. Is the Messaging Protocol of an Axium.
* Concept - A Grouping of Aspects via a Shared Concept
* Quality - Contains all Useful Aspects that Enable some Actions Unified Functionality within the Axium. 
* Method - Is Created from a Quality at Run Tim and is the Strategy Pattern's Method that Allows for the Complete ActionStrategy Work Flow. If in Redux, this would be referred to as an Effect, but instead here is the Primary point of Decision making that Handles the ActionStrategy Pattern.
* Reducer - Transforms the State after the Method Runs and is Placed on the Next Life Cycle of the Application, if in Blocking Mode However, this relationship is Reversed to Facilitate Synchronous Blocking Changes to the Axium.
* Mode - Is the Specific Point of Recursion that Defines the Axium's Functionality. This is where the Semaphores make their Selection of Qualities and their Methods and Reducers to be Ran.
* Principle - This is a Specific Observable that may be Subscribe to some Outside Source of Information. Otherwise is also supplied the Inner Concept[] Stream. And can make Decisions as to what Actions to Emit back into the Action Stream. These Subscriptions are Allocated within the GeneralSubscribers.

## Axium Qualities for Internal Use
Please avoid using these Qualities, but are providing explanations to Understand the Inner Workings of the Axium.
* addConceptsFromQue - This will be Ran from the Internal Axium Principle and take all Concepts added to said Que to Include within the Axium and Increment the Current Generation.
* appendActionListToDialog - Takes the Final Output of a Strategy and appends such into a STRX Dialog if storeDialog is set to True.
* badAction - If logging is set to true, this will Log any BadAction via its Payload of the Invalidated Action from the Created from the primeAction() Helper Function.
* conclude - This is a Pure Action that has no Reducer or Method. And will only be Issued upon the Conclusion of an ActionStrategy. If Ownership is part of the Concept Load. This allows for the Conclude to clear the Final Action's OwnershipLedger Entries aka Locks.
* initializePrinciples - Is a Delayed Action to allow for the Internal Set Up of the Axium at Run Time.
* open - Similar to Conclude, notifies Principles when the Axium is Open to their Emissions. Part of the Initialization, addConcept, and Removal Strategies.
* registerStreams - This simply allows for the Streams to be added to the Axium State and Later Initialize the currently loaded Principles. Part of the Initialization Strategy.
* removeConceptsViaQue - This will run via the Internal Axium Principle. Whenever there is an addition to this Remove Que.
* setBlockingMode - Sets the Mode to Blocking and Open to False. This would Notify any Principles to Cease detecting for Changes. This is Part of the Add and Remove Concept Strategies. And while Internal should only be used via Such.

## Useful Axium Qualities
* open - Sets Axium open Property by default to True if no Payload is Supplied. Must be used after setBlockingMode in a Strategy to Reenable Functionality of Principles and External Subscribers.
* log - Merely Logs the Action, is useful for Debugging ActionStrategies as it Logs Attached Strategy and any addition Action Qualities.
* close - This will will Cancel all Internal Subscriptions that the Axium has Access To. As well as All Steams will be Completed. The External close() Function that the createAxium supplies, dispatches this Action. Or can be Ran Specially via an Internal Principle towards its Governing Axium or that of another Axium that it is Subscribed to.
* setMode - If your Concept requires a Specific Modification to the Functionality of the Stream. This will Set the Mode Index to that Stream. Specifically this shouldn't have to be Used. But is Left to the User if they Run into such a Case.
* setDefaultModeIndex - Should be used if your Mode is to be Considered the Default Mode of your Application. For utilization within a Strategy after setMode. Be sure to a Run Time Search for your Concept Name and Mode, after your Concept is added via the addConcept Strategy found below. Be mindful that modeName is just your Concept Name and the creation of new Modes should be the Last Go To for your Apps Functionality.
* clearDialog - Clears the currently Stored STRX Dialog, may be used within a Strategy.

## Axium Strategies Concept Set Transformation
```typescript
function addConceptsToAddQueThenBlockStrategy(concepts: Concept[], newConcepts: Concept[]);
function addConceptsToRemovalQueThenBlockStrategy(concepts: Concept[], targetConcepts: Concept[]);
```
Note these Strategies can be Broken into Two Parts Responsibly, One to Be Ran via Method and the Other is Run from Subscribing Principle to Some Que.
* addConceptsToAddQueThenBlockStrategy - This will add newConcepts to the addConceptQue to be run the Stage of the Overall Strategy.
* addConceptsToRemovalQueThenBlockStrategy - This will add the targetConcepts to the Removal Que. To be later picked up within the Axium Principle.

*Note* That the Addition of the Axium Concept itself is an Addition Departure from the FLUX Architecture. This will be Refined over Time as Specifics Needs Grow and should be Seen as a Work in Progress. But, this should also be limited in its Functionality to Allow for the Addition of Concepts to Expand the total Functionality of the Axium Paradigm.

## Axium Modes
* Default Mode - This Mode uses the Simple Trick of setTimeout(() => {}, 0) to allow for the Axium to have some Non Blocking Behavior. As this Functionality Directly Engages with the Event Loop. In addition this Mode will Emit the internal Concepts to the Outer subConcept$ stream.
* Blocking Mode - This would be the Synchronous Mode Behavior of the Axium in order to Allow for Internal Modifications of the Axium's Set of Concepts. While Blocking the Potential of Outside Subscriptions to be notified of Additional State Changes of the Application. And thus Potential Conflicts of Dispatched actions during these changes. Even if Dispatched and the Concepts are Removed, these Actions would be Invalidated due to the Internal Semaphore Behavior.