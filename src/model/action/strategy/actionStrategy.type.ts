/*<$
For the asynchronous graph programming framework Stratimux, define the ActionStrategy Type model file.
$>*/
/*<#*/
import { Action, ActionType } from '../action.type';
import { OwnershipTicketStub } from '../../ownership';
import { KeyedSelector } from '../../selectors/selector';

/**
 * ActionNode - Control Structure used by ActionStrategy
 * @param action - Action to be dispatched.
 * @param successNode - Upon ActionStrategy.success() the Strategy will update itself to this node.
 * * If set to null, will default to Muxium Conclude Type on ActionStrategy.success().
 * @param failureNode - `optional` ActionStrategy.failed() will fire Muxium Conclude Type if left blank or set to null.
 * @param payload - `optional` Will set the payload of the action.
 * @param semaphore - `optional` This will prime the action to avoid look up at run time. Best practice use getSemaphore().
 * @param conceptSemaphore - `optional` Used for Muxified Qualities. Must be specified via that principle's passed semaphore value.
 * @param priority - `optional` Will allow the action to be placed in the body que accordingly.
 * @param agreement - `optional` Is time in milliseconds of the actions intended lifetime.
 * @param decisionNodes - `optional` The third or more option, may override success or failure in your workflows.
 * @param preposition - `optional` String that prefixes the ActionType when added to the Strategy's ActionList.
 * @param denoter - `optional` String that denotes the end of the ActionList sentence.
 *                               If placed dynamically, allows for the explicit appending of information at the end of the sentence
 * @ExampleSentence ${preposition: 'Via'} Muxium set Mode to ${denoter: 'Ownership Mode.'}
 * @Output Via Muxium set Mode to Ownership Mode.
 */
export interface ActionNode {
  action?: Action<unknown>;
  actionType: ActionType;
  payload?: Record<string, unknown>;
  conceptSemaphore?: number;
  priority?: number;
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
/**
 * Options list
 * @param successNode - Upon ActionStrategy.success() the Strategy will update itself to this node.
 * * If set to null, will default to Muxium Conclude Type on ActionStrategy.success().
 * @param failureNode - `optional` ActionStrategy.failed() will fire Muxium Conclude Type if left blank or set to null.
 * @param semaphore - `optional` This will prime the action to avoid look up at run time. Best practice use getSemaphore().
 * @param conceptSemaphore - `optional` Used for Muxified Qualities. Must be specified via that principle's passed semaphore value.
 * @param priority - `optional` Will allow the action to be placed in the body que accordingly.
 * @param agreement - `optional` Is time in milliseconds of the actions intended lifetime.
 * @param decisionNodes - `optional` The third or more option, may override success or failure in your workflows.
 * @param preposition - `optional` String that prefixes the ActionType when added to the Strategy's ActionList.
 * @param denoter - `optional` String that denotes the end of the ActionList sentence.
 *                               If placed dynamically, allows for the explicit appending of information at the end of the sentence
 * @ExampleSentence ${preposition: 'Via'} Muxium set Mode to ${denoter: 'Ownership Mode.'}
 * @Output Via Muxium set Mode to Ownership Mode.
 */
export interface ActionNodeOptions {
  keyedSelectors?: KeyedSelector[];
  conceptSemaphore?: number;
  priority?: number;
  semaphore?: [number, number, number, number];
  agreement?: number;
  decisionNodes?: Record<string, ActionNode>;
  decisionNotes?: ActionNotes;
  successNode?: ActionNode | null;
  successNotes?: ActionNotes;
  failureNode?: ActionNode | null;
  failureNotes?: ActionNotes;
  lastActionNode?: ActionNode;
}

/**
 * Use this as an argument, this should be a "Curried Function" with your arguments carried over.
 * */
export type ActionStrategyStitch = () => [ActionNode, ActionStrategy];
/**
 * Use this as an argument, as we lose type checking of your functions arguments,
 * due to the current implementation of Typescript argument generics.
 */
export type ActionStrategyCreator = (...arg0: unknown[]) => ActionStrategy;

/**
 * Will decorate the final Stratimux sentence
 * @preposition - Would append your string.
 * @denoter - Would include some string ending in punctuation.
 */
export interface ActionNotes {
  preposition?: string;
  denoter?: string;
}

/**
 * ActionStrategyParams
 * Interface of ActionStrategy Construction
 * @param data - Payload to be carried throughout the strategy.
 * @param initialNode - Starting point of your ActionStrategy
 */
export interface ActionStrategyParameters {
  topic: string;
  data?: Record<string, unknown>;
  initialNode: ActionNode;
  priority?: number;
}
export interface ActionStrategy {
  topic: string;
  data?: Record<string, unknown>;
  currentNode: ActionNode;
  actionList: Array<string>;
  puntedStrategy?: ActionStrategy[];
  stubs?: OwnershipTicketStub[];
  priority?: number;
  step?: number;
}

export type ActionStrategyTopic = string;
/*#>*/