# Action Strategy
### Abstract
An alternative name for this pattern that would be more literal would be: Action Tree Strategy. But even within that scope the composition of this data structure includes the ability to trace back to previous nodes and likewise via an additional **decisionNode** parameter, the ability to further expand the data pattern to describe an N-Tree or graph. That is finite in operation and concludes.

The staked effect of this data structure is one that is capable of mapping the internal structure of some Neural Network. But the origination of this design was for the utilization of programmers to describe their own decision making process. As the scope of this pattern in combination with a stored ActionList is a Array that can be flattened into a sequential series of steps or a paragraph. But was originally intended as a method of troubleshooting this pattern in a complex computation environment. That it happens to match the composition of a paragraph was an accidental discovery at the time of its creation some five years ago.

As the original pursuit of this data structure was to utilize the data parameter to formalize a transformation of said data over a period of steps. To map the exact transformation of data through an application, versus a series of factories. This chain like pattern of design is represented as a separate concept within this framework. As the framework is designed to be wholly responsible for itself. As the main issue would be the change of data that the chained behavior may be dependent upon. To allow for that data to transformation across any number of nodes on a graph, we introduced the spatial ownership design pattern. Where the final destination for such could be the original axium, the client's screen, or even the database of some server. This is a formalization of a greater than the sums approach to programming by way of composition, decomposition, and recomposition of sets of concepts, contained within some axium that interacts with other axiums.

### How STRX allows ActionStrategies to be a Data Oriented Format for Graph Computation.
Since STRX uses semaphores over strings types to formalize its own inner workings. The main functionality of strings throughout this system are for readability and being able to isolate some additional functionality at run time. Due to this approach, the net run time of a "Axium" is just a series of entities(actions), arrays (staged plans), trees(action strategy), and graphs(staged plans + punted/sequence strategies). That can be made numerically pure with a compilation process to set the semaphores ahead of time. Therefore this system is functionally just a graph programming framework that uses strings for user comprehension, and such can be stripped.

The only blocker in the scope of this current implementation, is that we find faulty actions, plans, and the concluding strategies via a type comparison. This can be further extrapolated away, but would save that work for a low level programming language. As the choice of Typescript in this project was due to familiarity and as the fastest path towards creating a MVP. This is mainly as a note for later as graph computation hits parity.

#### The Exponential/Higher Order Complexity of a Binary Tree
![The Exponential Higher Order Complexity of a Binary Tree](https://github.com/Phuire-Research/STRX/blob/main/TreeExponetial.png?raw=true)
The Reality of what the ActionStrategy Pattern represents despite deceiving simplicity, is the direct mapping of higher orders of logic. As if we examine the increasing levels of complexity of any given ActionStrategy. The complexity by default is squared or doubling. As each step in combination with its dynamic nature has the possibility of failure. If the axium has the ownership concept loaded and a value of state has a lock, or via some other test that can be supplied within the governing method. It is interesting to Note how this relationship is obfuscated via mathematics, but plain in conceptual logic. That of a mechanical greater than the sums relationship. "As if you attempt to square one, you get one. And if you square the number of branches, you get four, but at the one that is the head of the tree. And represents a doubling, but likewise ignores the possibility of additional branches beyond the two."

This demonstrates the need for an additional level of control to handle this higher order/exponential quality. And the reason for the spatial ownership pattern to supply some baseline coherency for the possibility of failure of each action. This is due to how a strategy can run alongside in sequence with other actions/strategies that can transform values that the strategy is dependent upon. These other actions can be independently dispatched from some other subscription via an observation into the action stream. This is especially likely when performing transformations off premise in a network of axiums.

"Would be the equivalent of attempting to build some car in a factory. But someone who was building another car, had taken the door you were intending on attaching to that car. Thus the failure mode of the strategy would be to find that next car door if not present, otherwise the car is left on the assembly line, or thankfully in the scope of programming. Just ceases to exist and all previously locked data or parts are freed to be used via other processes."

This represents the intelligence of doing directly. Versus the classical attempt at hand written intelligence of expert based systems as the closest analog, are flat by comparison. That perform knowledge retrieval in conjunction with some conditional logic to attempt to simulate human reasoning. In contrast this system of doing is composable and able to unify concepts via the ActionStrategy pattern. As these concepts can utilize some quality that may be of Artificial Intelligence, human interaction, function call of some API, or even another axium. That represents the transparent how of that doing in order to transform data. Noting that explainability is a side effect of this verbose nature that is comparable to paragraphs.

Intelligence is a complex beast. And while there may be some additional helper functions or abstractions. This release represents a minimum viable product. As it is a genuine new form of programming and an entire field of study on its own. The ActionStrategy pattern merely relays to some pattern of dynamic decision making that a computer may perform without the probabilistic limitation of classical non-deterministic Turing Machines. And would be viewed as "Logically Deterministic" by categorization. And enable to creation of "Autonomous Baseline Intelligence," which would function like clockwork with a defined conclusion.

## The Anatomy of an ActionNode
ActionNode represents some node that is capable of being turned into some action when initialized by the ActionStrategy consumer funCtions. The reason why these functions are not part of the ActionStrategy itself. Is to allow for that off premise interaction. As we could write such as a program by way of a series of functions to be called on Some tree or graph. But these functions would have to be serialized. As we take advantage of the semaphore pattern throughout. In order to reduce the Total size of each message and time till their discovery of functionality at runtime. 
```typescript
export interface ActionNode {
  action?: Action;
  actionType: ActionType;
  payload?: unknown;
  keyedSelectors?: KeyedSelector[];
  semaphore?: [number, number, number];
  agreement?: number;
  decisionNodes?: Record<string, ActionNode>;
  successNode: ActionNode | null;
  failureNode: ActionNode | null;
  preposition?: string;
  denoter?: string;
}

// Used via the createActionNode function.
export interface ActionNodeOptions {
  keyedSelectors?: KeyedSelector[];
  semaphore?: [number, number, number, number];
  agreement?: number;
  decisionNodes?: Record<string, ActionNode>;
  decisionNotes?: ActionNotes;
  successNode: ActionNode | null;
  successNotes?: ActionNotes;
  failureNode: ActionNode | null;
  failureNotes?: ActionNotes;
  lastActionNode?: ActionNode;
}
```
* action - Is an union data pattern to bind the functionality of the ActionNode, ActionStrategy, and Action. This allows for each part to be responsible for itself and to allow for additional functionality at runtime.
* actionType - Is merely the type of action to be created at runtime, these should be verbose as to their intended effect as it informs the STRX sentence structure's body.
* payload - Is set to unknown to allow for the explicit typecasting during consumption, reducer, method, or principle. Be sure to import actions directly to ensure payload type safety in the reducer. This is a logical determination in line with Javascript core functionality.
* keyedSelectors - An Array of KeyedSelector that locks some property during the life time of the created action.
* semaphore - First is concept's index, second is the quality's index, and the final is the generation of the sets of concepts currently stored on the Axium. *Explicitly setting this value, denotes a primed action without additional look up at runtime.*
* agreement - Is time in milliseconds of the lock's expiration time. Default is currently 5000, but such will be reduced upon testing and feedback.
* decisionNodes - Is a record of all possible decisions that the ActionNode may take depending upon some test. And should be seen as a replacement for SuccessNode if utilized. This is what makes the ActionStrategy capable of complexity beyond squared.
* successNode - Is the default chain of actions. Can be replaced by decisionNodes to enable additional behaviors.
* failureNode - Is the default failure mode of each action. And will be called if ownership is loaded in an axium. If null the ActionStrategy will conclude which will free the current lock supplied. Otherwise it will be added to the pendingActions que. 
* preposition - Coincides with the STRX sentence structure. And is the logical linking between the previous sentences and the current ActionType.
* denoter - Also enhances the STRX sentence as either a punctuation mark or additional description of the ActionType's intended effect.

*NOTE: Just like all optional fields, except action, these are designed to be set at runtime if dynamic or can be prefilled if the values are known prior.*
For Example if we are using the denoter to inform the STRX sentence of the explicit value an action has performed. Via the method or principle that can call the action's next ActionNode. Likewise is True for the preposition, that can source its selection Based on the strategy's LastActionNode Value as an Example.

## The Anatomy of a ActionStrategy
The strategy for short as the pattern that Inspired this was the original strategy design pattern, this is noting the usage of methods over that of side effects in this system. The ActionStrategy is a union data type, that stores the binary-N-graph/tree's ActionNodes that represents any given ActionStrategy. We set ActionNode directly versus some helper function, due to the complex nature of creating these dynamic data structures in the sequential written format of modern programming. This is pending some user interface to allow for such to be compositional or even the creation of such strategies on the fly via some dynamic mechanism including that of a LLM or new emergent system. As currently this system is already complex enough and the introduction of some Cthulhu esque declaration of nested ActionNodes would only further complicate this format of programming.

As this is an enhancement to the traditional understanding of higher order functions. If such needs that specific flow, you may recall the LastActionNode. Or use such explicitly within a reducer, or principle. Noting that the method is already composed to transform the handling of the ActionStrategy itself. The difference here is the direct blunt nature. As even with higher order functions, the nesting is the same Structure at run time, but likewise lacks the exponential quality of decision making of this pattern.

```typescript
export interface ActionStrategyParameters {
  topic: string;
  data?: unknown;
  initialNode: ActionNode;
}
export interface ActionStrategy {
  topic: string;
  data?: unknown;
  currentNode: ActionNode;
  actionList: Array<string>;
  lastActionNode: ActionNode;
  puntedStrategy?: ActionStrategy[];
}
```
* topic - The topic string or the beginning sentence of a STRX dialog paragraph. Also stores itself temporarily upon strategy completion on the Axium as **lastStrategy**. We suggest using this field to determine when your strategies of concluding during testing, or when to dispatch some other strategy.
* data - Is the data to be transform during the lifetime of a strategy when off premise. Otherwise the strategy solely transforms the state of each concept by way of the consuming reducer.
* currentNode - Is the current ActionNode of the given strategy.
* actionList - Is the store of all actions and their prepositions and denoters that formalizes a STRX sentence. This stores the topic as the first entry upon strategy creation.
* lastActionNode - Primarily functions to clear ownership upon each successive action from the strategy. Likewise can be used to determine the current decision, or preposition of the current ActionNode at runtime.
* puntedStrategy - This allows for strategies to be successively chained into one another by first in, first Out principle upon each strategy conclusion.
* initialNode via ActionStrategyParameters - The initial node that is the head that is ran by the strategyBegin consumer function.

## Consumer Functions
```typescript
function createStrategy(params: ActionStrategyParameters): ActionStrategy;
function createActionNode(action: Action, options: ActionNodeOptions): ActionNode;
function strategyBegin(strategy: ActionStrategy, data?: unknown): Action;
function strategySuccess(strategy: ActionStrategy, data?: unknown): Action;
function strategyFailed(strategy: ActionStrategy, data?: unknown): Action;
function strategyDecide(strategy: ActionStrategy, decideKey: string, data?: unknown): Action;
function strategyPunt(puntedStrategy: ActionStrategy, newStrategy: ActionStrategy): ActionStrategy;
function strategySequence(strategies: ActionStrategy): ActionStrategy | undefined;
```
* createStrategy - Creates a new strategy and returns such to be activated by the strategyBegin consumer function. Data of strategy may be set explicitly.
* createActionNode - Used in conjunction with createStrategy, keep in mind that ActionNodes must be defined in reversed order. As sequentially the only means to add each to either the Success/Failure/Decision nodes is if they are predefined. Creates a new ActionNode that decomposes the supplied Action, this ensures type safety with the action's payload. ActionNodeOptions assigns which ActionNodes will be next within the final ActionStrategy.
* strategyBegin - Returns the initial action of the strategy, updates the ActionList, and creates a union binding between the ActionStrategy and newly created action.
* strategySuccess - Initializes the successNode action, otherwise if null will conclude the Strategy by returning the conclude action. If ActionNode or Strategy's currentNode does not set its preposition, will set such to "Success with"
* strategyFailed - Same as the above, but if the preposition is not set, will set such to "Failed With". And is the default ActionNode called if a lock is dictated while ownership is loaded.
* strategyDecide - Decide key will override or be placed after the preposition if set. And will be used to return the next ActionNode that the key corresponds to. If null, conclude action will be returned.
* strategyPunt - Will return a new strategy with the old strategy within the puntedStrategy Field. That will execute once the new strategy concludes via the consuming functions. That will call strategyBegin on first index of puntedStrategies if present, then remove such from the list, and successNode/decisionNode/failureNode all point to null.
* strategySequence - This will take a list of ActionStrategies and return the first strategy with the rest placed in order in the puntedStrategy property. These will fire upon each possible conclusion of the included strategies.

*Note: The data field sets only the data of the strategy, if one wants to edit or set the payload. It should be done explicitly the createActionNode function and set by that specific action creator. Do note you may edit the payload once the new ActionNode is created.*
The same is true when accessing the payload from a reducer, method, or principle. As this system is purposefully designed to not function by way of nested types such as:
```
SomethingFactory<AnotherFactor<Factory>>
```
This was a purposeful design choice, if you find yourself doing such. Known this system is already complicated enough.

## Helper Functions for Standard Method Creators
*You still need to create a function of type MethodCreator to use these Helpers. :MethodCreator = () =>  methodCreator*
```typescript
export const createMethod =
  (method: (action: Action) => Action): [Method, Subject<Action>] => {}
export const createMethodWithConcepts =
  (method: (action: Action) => Action, concepts$: UnifiedSubject): [Method, Subject<Action>] => {}
export const createAsyncMethod =
  (asyncMethod: (controller: ActionController, action: Action) => void): [Method, Subject<Action>] => {}
export const createAsyncMethodWithConcepts =
  (asyncMethodWithConcepts: (controller: ActionController, action: Action, concepts: Concept[]) => void, concepts$: UnifiedSubject)
    : [Method, Subject<Action>] => {}
export const createMethodDebounce =
  (method: (action: Action) => Action, duration: number): [Method, Subject<Action>] => {}
export const createMethodDebounceWithConcepts =
  (methodWithConcepts: (action: Action, concepts: Concept[]) => Action, concepts$: UnifiedSubject, duration: number)
    : [Method, Subject<Action>] => {}
export const createAsyncMethodDebounce =
  (asyncMethod: (controller: ActionController, action: Action) => void, duration: number): [Method, Subject<Action>] => {}
export const createAsyncMethodDebounceWithConcepts =
  (asyncMethodWithConcepts: (controller: ActionController, action: Action, concepts: Concept[]) =>
    void, concepts$: UnifiedSubject, duration: number): [Method, Subject<Action>] => {}
```
* createMethod - Your standard method, be sure to handle the action.strategy via one of the strategy decision functions, in addition to passing the action if there is no attached strategy.
* createMethodWithConcepts - This will allow your method to have the most recent concepts to be accessed via the asyncMethod function.
* createAsyncMethod - Handled differently than the rest, you will have to use the passed controller to fire your actions back into the action stream.
* createAsyncMethodWithConcepts - Will also have access to the most recent concepts.

*Note if you are implementing your own debounceAction, pay attention to how these method helpers work. They are handling a passed conclude from debounceAction within their map/switchMap*
* createMethodDebounce - After the first action, this will filter actions within the duration to be set to the conclude action.
* createMethodDebounceWithConcepts - Will filter actions within the duration while providing access to the most recent concepts. 
* createAsyncMethodDebounce - Will not disengage the initial ActionController, but will allow debounced actions to pass through when filtered as conclude actions. And will fire the first action upon its own conditions are met asynchronously.
* createAsyncMethodDebounceWithConcepts - Filters and then first the first action once conditions are met, and provides access to the most recent concepts.