# Action Strategy
An alternative name for this Pattern that would be more Literal would be Action Tree Strategy. But even within that Scope the Composition of this Data Structure Includes the ability to Trace Back to Previous Nodes and Likewise via the DecisionNode parameter, the Ability to Describe an N-Tree.

The staked effect of this Data Structure is a Structure that is Capable of Mapping the Internal Structure of some Neural Network. But the Origination of this Design was for the Utilization of Programmers to Describe their Own Decision Making Process. As the Scope of this Pattern in Combination with a Stored ActionList is a Array that can be Flattened into a Sequential Series of Steps or a Paragraph. But was originally intended as a Method of Troubleshooting this Pattern in a Complex Computation Environment. That it happens to Match the Composition of a Paragraph was an Accidental Discovery at the Time of its Creation some Five Years Ago.

As the Original Pursuit of this Data Structure was to Inform the Data Parameter to Formalize a Transformation of Said Data over a Period of Steps. That this Structure is not Represented via this Framework. Is on Purpose, as the Framework is Designed to be Wholly Responsible for Itself and to allow for that Data to Transforms Across any number of Nodes on a Graph. Where the Final Destination for Such could be the Original Axium, the Client's Screen, or even the Database of Some Server.

The Reality of what the ActionStrategy Pattern Represents is the Higher Orders of Logic Mapped. As if we Examine the Increasing Levels of Complexity of any Given ActionStrategy. The Complexity by default is Squared. As Each Step in Combination with its Dynamic Nature has the Possibility of Failure if the Axium to is Operating on Changes its Composition. And is the Reason for the Spatial Ownership Pattern to supply some Baseline Coherency for the Possibility of Failure. Especially when performing Transformation off Premise in the Network of Nodes.

Would be the Equivalent of Attempting to Build Some Car in a Factory. But someone who was Building Another Car, had Taken the Door you were Intending on Attaching to that Car. Thus the Failure Mode of the Strategy would be to find that next Car Door, Otherwise the Car is Left on the Assembly Line or thankfully in the Scope of Programming. Just Ceases to Exist and all Previously Locked Data or Parts are Freed to use Via Other Processes.

This Represents the Intelligence of Doing. Versus the Classical attempt at Hand Written Intelligence of Expert Based Systems, that perform Knowledge Retrieval. But likewise this System can be Articulated the Same Way. Just like any of the Nodes that Represent some Strategy may be Some Artificial Intelligence, Human, the Simple Function Call of Some API, or even fully Decomposed into an Axium that Represents the Transparent How of that Doing.

Intelligence is a Complex Beast. And while there may be some Additional Helper Functions or Abstractions. This initial release is the Bare Bones System with no Hand Holding. As it is a Genuine new Form of Programming and an Entire Field of Study on its Own. The ActionStrategy Pattern Merely Relays to Some Pattern of Dynamic Decision Making that a Computer may Perform without the Probabilistic Limitation of Classical Non-Deterministic Turing Machines. And would be Viewed a Logically Deterministic by Categorization.

## The Anatomy of an ActionStrategy
ActionNode Represents some Node that is Capable of being turned into some Action when Initialized by the ActionStrategy Consumer Functions. The Reason why these Functions are not part of the ActionStrategy itself. Is to allow for that Off Premise Interaction. As we could Write such a Program by way of a Series of Functions to be Called on Some Tree or Graph. But these Functions would have to be Serialized. As we take Advantage of the Semaphore Pattern throughout. To Reduce the Total Size of Each Payload. To that of the Most Important Qualities to enable this Functionality.
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
```
* Action - Is a Union Data Pattern to bind the Functionality of the ActionNode, ActionStrategy, and Action. This allows for Each Part to Be Responsible for Itself and to allow for Additional Functionality at Runtime.
* actionType - Is merely the Type of Action to be Created at Runtime, these should be Verbose as to their Intended Effect as it Informs the STRX Sentence Structure Body.
* payload - Is set to Unknown to allow for the Explicit Typecasting during consuming, Reducer, Method, or Principle.
* keyedSelectors - An Array of KeyedSelector that Locks some Property during the Run Lifetime of the Created Action.
* semaphore - First is Concept Index, Second is the Quality Index, and the Final is the Generation of Sets of Concepts currently stored on the Axium. *Explicitly setting this Value, Denotes a Primed Action.*
* agreement - Is time in Milliseconds of the Lock's Expiration time. Default is Currently 5000, but such will be reduced upon Testing and Feedback.
* decisionNodes - Is a Record of All Possible Decisions that the ActionNode may Take Depending upon Some Test. And should be seen as a Replacement for SuccessNode if Utilized.
* successNode - Is the Default chain of Actions. Can be Replaced by DecisionNodes to enable Additional Behaviors.
* failureNode - Is the Default Failure Mode of each Action. And will be Called if Ownership is Loaded in an Axium. Which will Free the Current Lock Supplied.
* preposition - Coincides with the STRX Sentence Structure. And is the Logical linking between the Previous Sentence and the Current ActionType.
* denoter - Also Enhances the STRX Sentence as either a Punctuation Mark or additional Description of the ActionType's Intended Effect.

*NOTE: Just like all optional Fields, except Action, these are Designed to be Set at Runtime if Dynamic or can be Prefilled if the Values are Known Prior.*
For Example if we are Using the Denoter to Inform the STRX Sentence of the Explicit Value an Action has Performed. Via the Method or Principle that can Call the Action's next ActionNode. Likewise is True for the Preposition, that can source its Selection Based on the Strategy's LastActionNode Value as an Example.

## The Anatomy of a ActionStrategy
The Strategy for Short as the Pattern that Inspired this was the Strategy Pattern, this is noting the Usage of Methods over that of Side Effects in this System. The ActionStrategy is a Union Data Type, that Stores the Binary-N-Graph/Tree's ActionNodes that Represents any Given ActionStrategy. We Set ActionNode directly versus some Helper Function, due to the Complex Nature of Creating these Dynamic Data Structures in the Sequential Written format of Modern Programming. This is Pending Some User Interface to allow for such to be Compositional or even the Creation of Such Strategies on the Fly via some Dynamic Mechanism including that of a LLM or New Emergent System. As currently this System is already Complex enough and the Introduction of some Cthulhu Esque Declaration of Nested ActionNodes would only further Complicate this Format of Programming. 

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
* topic - The Topic String or the Beginning Sentence of a STRX Dialog Paragraph. Also acts Stores itself temporarily upon Strategy Completion on the Axium as **lastStrategy**. We suggest using this field to determine when you strategies of concluding during testing, or when to dispatch some other Strategy.
* data - Is the Data to be Transform during the Lifetime of a Strategy when off Premise. Otherwise the Strategy solely Transforms the State of Each Concept by way of the Consuming Reducer.
* currentNode - Is the Current ActionNode of the Given Strategy
* actionList - Is the Store of All Actions and their Prepositions and Denoters that Formalizes a STRX Sentence. This Stores the Topic as the First Entry upon Strategy Creation.
* lastActionNode - Primarily functions to Clear Ownership upon each Successive Action from the Strategy. Likewise can be Used to Determine the Current Decision, or Preposition of the Current ActionNode at Runtime.
* puntedStrategy - This allows for Strategies to be Successively chained into One Another by First in, First Out Principle upon Each Strategy Conclusion.
* initialNode via ActionStrategyParameters - The Initial Node that is the Head that is Ran by the strategyBegin Consumer Function.

## Consumer Functions
```typescript
function createStrategy(params: ActionStrategyParameters): ActionStrategy;
function strategyBegin(strategy: ActionStrategy, data?: unknown): Action;
function strategySuccess(strategy: ActionStrategy, data?: unknown): Action;
function strategyFailed(strategy: ActionStrategy, data?: unknown): Action;
function strategyDecide(strategy: ActionStrategy, decideKey: string, data?: unknown): Action;
function puntStrategy(puntedStrategy: ActionStrategy, newStrategy: ActionStrategy): ActionStrategy;
```
* createStrategy - Creates a new Strategy and returns such to be activated by the strategyBegin Consumer Function. Data of Strategy may be Set Explicitly.
* strategyBegin - Returns the initial Action of the Strategy, updates the ActionList, and creates a Union binding between the ActionStrategy and newly created Action.
* strategySuccess - Initializes the successNode Action, otherwise if null will conclude the Strategy by returns the Conclude Action. If ActionNode or strategy.currentNode does not set its Preposition, will set such to "Success with"
* strategyFailed - Same as the above, but if the Preposition is not set, will set Such to "Failed With".
* strategyDecide - Decide Key will override or be placed after the Preposition if Set. And will be used to return the next ActionNode that the key corresponds to. If null, Conclude Action will be Returned.
* puntStrategy - Will Return a New Strategy with the Old Strategy within the puntedStrategy Field. That will Execute once the New Strategy Concludes. Must be Initialized again by strategyBegin.

*Note: The Data field sets only the Data of the Strategy, if One wants to edit or set the Payload. It should be done Explicitly via a Type Casting.*
The same is true when Accessing the Payload from a Reducer, Method, or Principle. As this System is purposefully Designed to Not Function by way of Nested Types such as the SomethingFactory<AnotherFactor<Factory>>. This was a Purposeful Design choice, if you find yourself doing such. Known this system is already complicated enough.
