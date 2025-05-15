## Muxium
### Abstract
The main point of interaction and named holder of a set of concepts. This was inspired by axiom. But slightly changed towards the concept by act of unifying concepts, noting the "U." As a counter to the traditional axiom which is based on statements assumed to be true and likewise to be nonreducible. But can be reduced to their conceptual parts. Therefore an muxium is the set of concepts and their qualities that allow for the emergence of new concepts. The advantage of this approach excluding the muxification function. Is that the entirety of an muxium may be decomposed to The Sum of its parts. That way versus creating some new arbitrary construct of a FileSystem. We are in competition as to whose FileSystem concept is best. As if someone improves upon a concept you are working on in this system. Versus creating some new library, you may take the parts of that concept into your own version of it. Thanks to the decomposable nature of qualities and their organization via the ActionStrategy pattern.

#### Goal of this System
There is much to be expanded upon this as a potential platform of doing. Where the goal would be the refinement towards discovery and stability of the most utilized concepts. So that may create some standard library of concepts to be shared. Versus the current generalized construct paradigm that this has been designed as a direct counter to. Of that mass repeated reimplementation of concepts as constructs that cannot readily be decomposed and reconfigured. As what is interesting is the discovery within this type of system of universal concepts and qualities. By way of matching functionality where we would least expect it. Would be considered a universal function.

## Working with the Muxium
```typescript
export function muxification(
  name: string,
  initialConcepts: Concept[],
  logging?: boolean,
  storeDialog?: boolean,
  logActionStream?: boolean
): Muxium { }

export type Muxium = {
  subscribe: (observerOrNext?: Partial<Observer<Concepts>> | ((value: Concepts) => void) | undefined) => Subscription;
  unsubscribe: () => void;
  close: (exit?: boolean) => void;
  dispatch: (action: Action) => void;
  plan: (title: string, stages: Staging[]) => StagePlanner
}
```

Note here an additional departure of what would be supplied to the store is an array of concepts over that of a constructed dictionary of features. As the typical check of what action to choose at run Time had been that of comparing the type of actions via a reducer and/or effect via a string comparison. Here we are allowing for the additional buffer of knowing the concepts and their qualities ahead of time. This populates the action's semaphore tuple that corresponds the its concept and placement in the array of qualities that it contains. However you may still dispatch actions without the semaphore supplied and this comparison is made once to find that semaphore at run time.

The design decision here allows us to forgo the need for dependency injection. And later we will discuss muxium qualities that would allow the change of concepts loaded or generated into the muxium at run time. Which if one chooses to alter the composition of the Muxium, the generation is iterated upon. This accomplishes one of the primary qualities that satisfies the specification laid out by the Muxified Turing Machine. Where by the finite symbol reference table is of a logical selection and permitting some testable ability to halt. Is the logical deterministic means of solving the halting problem of the classical turing machine. But this is only if we accept that concepts and their qualities have an amount of completeness towards their ability to halt. That the inability to halt, is a specific design choice or consequence of the machine at some point of scale, not yet accounted for, or done so on purpose. For example: while(true). As the muxium in reality is just a recursive self transforming function, that removes the need for a loop.

```typescript
export type MuxiumState = {
  // Would be unique identifier on a network
  name: string;
  open: boolean;
  prepareClose: boolean;
  exit: boolean;
  conceptCounter: number;
  logging: boolean;
  logActionStream: boolean;
  dialog: string;
  storeDialog: boolean;
  lastStrategy: string;
  lastStrategyActionList: Array<string>;
  lastStrategyData: unknown;
  lastStrategyDialog: string;
  generation: number;
  cachedSemaphores: Map<string,Map<string,[number,number,number, number]>>
  modeIndex: number;
  defaultModeIndex: number;
  modeNames: string[]
  methodSubscribers: NamedSubscription[];
  principleSubscribers: NamedSubscription[];
  generalSubscribers: NamedSubscription[];
  stagePlanners: NamedStagePlanner[];
  action$: Subject<Action>;
  actionConcepts$: Subject<Concepts>;
  concepts$: MuxifiedSubject;
  addConceptQue: Concept[],
  removeConceptQue: Concept[],
  badPlans: Plan[];
  badActions: Action[];
  timer: NodeJS.Timeout[];
  timerLedger: Map<number, [(() => Action)[], number]>
  head: Action[];
  body: Action[];
  tail: Action[];
  tailTimer: NodeJS.Timeout[];
}
```
* name - This should be set to a unique network identifier, and/or the concept of your system.
* open - This is utilized by principles and external subscribers to denote when they should initialize their functionality.
* prepareClose - Flag to signal the muxium's internal close principle to initialize shut down process.
* exit - Controls whether close will have the process exit.
* conceptCounter - Simple counter to keep track of what numbered identifiers are safe to assign to concepts.
* logging - controls whether the Stratimux dialog paragraphs are emitted upon strategy completion. In addition to other debugging procedures.
* logActionStream - Forces the muxium to log each action incoming from the action$ stream.
* dialog - Is the internal representation of the strategies that the muxium has ran.
* storeDialog - This is set to false by default to save on memory, but if true will store each dialog, and allows such to be subscribed to.
* lastStrategy - Informs specifically the of the last ActionStrategy topic to have ran through the system. This is used via testing or the deployment of addition strategies upon completion.
* lastStrategyActionList - Temporary Store of the Last Strategy and it's associated ActionList. Many Uses, but start with Debugging while keeping in mind this formalizes a Stratimux Dialog as Paragraph.
* lastStrategyData - Paired with lastStrategy. Use to access thee last data of the previous strategy.
* lastStrategyDialog - Will only store the lastStrategy actionList as a dialog if storeDialog is set to true for performance reasons. This allows access of your strategies final action list as a verbose dialog.
* generation - This iterates each time the Set of Concepts is transformed. And if an action is received of the wrong generation. Will be primed at run time, if not found this will emit a badAction that if logging is set to True. Will be emitted to the console alongside the invalidated action as payload.
* cachedSemaphores - For internal use, is recalculated each time a concept is loaded or removed.
* modeIndex - This determines which Mode is currently being ran from the lists of modes stored on the muxium concept.
* defaultModeIndex - This determines what mode will be set by setDefaultMode. Of importance for adding and removing strategies.
* modeNames - Is the paring of a name that correspond to mode and their respective index that allow for the mode to altered at run time without string comparison.
* methodSubscribers - Accumulates all method subscriptions for their manipulation at run time.
* principleSubscribers - Aggregator that registers the subscription assigned to each loaded principle, this subscription passes actions directly to the action$ stream.
* generalSubscribers - Same as method subscribers, but a catch all including that of principles and their internal subscriptions that would ordinarily leave principles as hot and active in memory if not concluded upon removal or close.
* action$ - Is the internal action stream.
* actionConcepts$ - A simple subject that ensures that reducers, methods, and principles each have access to the most recent concepts.
* concepts$ - Is the internal concepts stream that informs plans and subscriptions to the muxium of changes to the loaded concepts, will not be notified in blocking mode.
* addConceptQue - The current pattern to allow for principles to effect the concepts within the application. Rather than a direct subscription to the action$, they listen to state properties to control what actions they emit into the stream. In this case a set of concepts to be loaded into the muxium.
* removeConceptQue - The inverse of the above to remove concepts.
* badPlans - Stores plans that have experienced action overflow.
* badActions - Keeps track of all actions that cannot be registered via the cachedSemaphores property.
* timer - This internal timer is set via the timerLedger, each subsequent call creating a new timer that is held as the only entry in this array.
* timerLedger - Is modified when using muxiumTimeOut, that will assign a callback function that returns an action to be used in a single setTimeout function.
* head - A single action is allowed to exist in the head and ensures that the muxium performs a lock step sequence of actions.
* body - Mostly updated via plans. Taking precedent to actions that are issued via ActionStrategies or the muxiumTimeOut functionality unless the correlated actions have some priority. Then such are assigned to the body que, ordering the body according to each action's priority or prior placement.
* tail - The final que to be called when body has been depleted. This is a low priority que that is informed via qualities via the muxiumTimeOut method.
* tailTimer - This timer will be enabled each time a tail entry has been assigned, but will be cleared each time an action enters the action stream.

## The Anatomy of an Muxium
* Action - Is a dumb object that is supplied some data as payload or performs some transformation of state based on its semaphore which is inferred via its type. Is the messaging protocol of an muxium.
* Concept - A grouping of aspects via a shared concept
* Quality - Contains all useful aspects that enable some actions muxified functionality within the muxium. 
* Method - Is created from a quality at run time and is the strategy pattern's method that allows for the complete ActionStrategy work flow. If in Redux, this would be referred to as an effect, but instead here is the primary point of decision making that handles the ActionStrategy pattern. Otherwise we utilize the principle for what would ordinarily be considered functional side effects.
* Reducer - Transforms the state after the method runs and is placed on the next life cycle of the application, if in blocking mode however, this relationship is reversed to facilitate synchronous blocking changes to the muxium.
* Mode - Is the specific point of recursion that defines the muxium's functionality. This is where the semaphores make their selection of a qualities methods and reducers at run time.
* Principle - This is a specific observable that may be subscribe to some outside source of information. Otherwise is also supplied the inner Concepts stream. And can make decisions as to what actions to emit back into the action stream. These subscriptions are allocated within the GeneralSubscribers.

## Muxium Qualities for Internal Use
Please avoid using these qualities, but are providing explanations to understand the inner workings of the muxium.
* muxiumAddConceptsFromQue - This will be ran from the internal muxium principle and take all concepts added to said que to include within the muxium and increment the current generation.
* muxiumAppendActionListToDialog - Takes the final output of a strategy and appends such into a Stratimux dialog if storeDialog is set to True.
* muxiumBadAction - If logging is set to true, this will log any BadAction via its payload of the invalidated action that is created from the primeAction() helper function.
* muxiumConclude - This is a pure action that has no reducer or method. And will only be issued upon the conclusion of an ActionStrategy. If ownership is part of the concept load. This allows for the conclude to clear the final action's locks via its OwnershipLedger Entries.
* muxiumInitializePrinciples - Is a delayed action to allow for the internal set up of the muxium at run time.
* muxiumOpen - Similar to conclude, notifies principles when the muxium is open to their emissions. Part of the initialization, addConcept, and removeConcept strategies.
* muxiumClose - This will will cancel all internal subscriptions that the muxium has access to. As well as all Steams will be completed. The external close() function that the muxification supplies, dispatches this action. Or can be ran specially via an internal principle towards its governing muxium or that of another muxium that it is subscribed to.
* muxiumRemoveConceptsViaQue - This will run via the internal muxium principle. Whenever there is an addition to this remove que.

## Use With Care
*These are part of the add and remove concept strategies. And while internal could be used if required.*
* muxiumSetBlockingMode - Sets the mode to blocking and open to False. This would notify any principles to cease detecting for changes. This is part of the add and remove concept strategies. And while internal could be used if required.
* muxiumSetDefaultMode - Sets the modeIndex to the defaultModeIndex and open to True. This informs principles that it is clear to detect changes.

## Useful Muxium Qualities
* muxiumOpen - Sets muxium open property by default to True if no payload is supplied. Must be used after setBlockingMode in a strategy to reenable functionality of principles and external subscribers.
* muxiumLog - Merely Logs the action, is useful for debugging ActionStrategies as it logs attached Strategy, its current ActionList, and any addition action qualities.
* muxiumPreClose - Will prompt the muxium to close and disengage all active subscriptions, while notifying subscribers that their concept has been removed.
* muxiumSetMode - If your concept requires a specific modification to the functionality of the stream. This will set the mode index to that stream. Specifically this shouldn't have to be used. But is left to the developer if they run into such a case.
* muxiumSetDefaultModeIndex - Should be used if your mode is to be considered the default mode of your application. For utilization within a strategy after setMode. Be sure to a run time search for your concept name and mode, after your concept is added via the addConcept strategy found below. Be mindful that modeName is just your Concept Name and the creation of new Modes should be the last go To for your applications functionality.
* muxiumClearDialog - Clears the currently stored Stratimux dialog, may be used within a strategy.
* muxiumClearBadActionTypeFromBadActionList - This is to allow for plans to take into account for expired actions and clear such.
* muxiumClearBadStrategyTopicFromBadActionList - Allows plans to accounts for specific ActionStrategy topics that might find themselves in badActions and clear such.
* muxiumClearBadPlanFromBadPlanList - This additionally allows for concepts to take into account potentially failed plans that are set by muxium.plan(). Via their topic as payload and clears such.
* muxiumKick - This is a pure action that will just trigger the next function via the MuxifiedSubject to prime subscribers or stages. Noting that the downside of Stratimux's halting quality, is you have to kick it into gear if it hasn't received an action recently for your staged Plans to operate as intended.
* muxiumRegisterTimeOut - This will call the muxiumTimeOut function on the incoming payload's act and timeOut properties. Then will succeed a strategy if present.

## Muxium Strategies Concept Set Transformation
```typescript
function addConceptsToAddQueThenBlockStrategy(concepts: Concepts, newConcepts: Concept[]);
function addConceptsToRemovalQueThenBlockStrategy(concepts: Concepts, targetConcepts: Concept[]);
```
Note these strategies can be broken into two parts responsibly, one to be ran via method and the other is run from subscribing principle to some que.
* addConceptsToAddQueThenBlockStrategy - This will add newConcepts to the addConceptQue to be run the stage of the overall strategy.
* addConceptsToRemovalQueThenBlockStrategy - This will add the targetConcepts to the removal que. To be later Picked up within the muxium principle.

*Note* That the addition of the muxium concept itself is an addition departure from the FLUX architecture. This will be refined over time as specifics needs grow and should be seen as a work in progress. But, this should also be limited in its functionality to allow for the addition of concepts to expand the total functionality of the Muxium paradigm.

## Muxium Modes
* Permissive Mode - This Mode enables the usage of asynchronous tasks via the setTimeout(() => {}, 0) trick. While maintaining non blocking behavior through the muxium tail property that stores actions first in first out que. In addition this mode will emit the internal concepts to the base and outer plans.
* Blocking Mode - This mode forces synchronous mode behavior of the muxium in order to allow for internal modifications of the muxium's set of concepts. While blocking the potential of outside subscriptions to be notified of additional state changes of the application. And thus potential conflicts of dispatched actions during these changes. Even if dispatched and the concepts are removed, these actions will added to the badActions list.