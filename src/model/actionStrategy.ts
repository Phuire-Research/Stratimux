import { axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';
import { Action, ActionType, createAction } from './action';
import { OwnershipTicketStub } from './ownership';
import { KeyedSelector } from './selector';

const nullActionType: ActionType = 'null';
/**
 * ActionNode
 * Control Structure used by ActionStrategy
 *
 * `NOTE` When creating Actions for action. There is no need to pass payload, or strategy parameters,
 *  as ActionStrategy takes care of that behind the scenes.
 *
 * @param action - Action to be dispatched.
 * @param successNode - Upon ActionStrategy.success() the Strategy will update itself to this node.
 * * If set to null, will default to Axium Conclude Type on ActionStrategy.success().
 * @param failureNode - `optional` ActionStrategy.failed() will fire Axium Conclude Type if left blank or set to null.
 * @param payload - `optional` Will set the payload of the action.
 * @param semaphore - `optional` This will prime the action to avoid look up at run time. Best practice use getSemaphore().
 * @param agreement - `optional` Is time in milliseconds of the actions intended lifetime.
 * @param decisionNodes - `optional` The third or more option, may override success or failure in your workflows.
 * @param preposition - `optional` String that prefixes the ActionType when added to the Strategy's ActionList.
 * @param denoter - `optional` String that denotes the end of the ActionList sentence.
 *                               If placed dynamically, allows for the explicit appending of information at the end of the sentence
 * @ExampleSentence ${preposition: 'Via'} Axium set Mode to ${denoter: 'Ownership Mode.'}
 *  @Output Via Axium set Mode to Ownership Mode.
 */

export interface ActionNode {
  action?: Action;
  actionType: ActionType;
  payload?: unknown;
  semaphore?: [number, number, number];
  agreement?: number;
  decisionNodes?: Record<string, ActionNode>;
  successNode: ActionNode | null;
  failureNode?: ActionNode;
  preposition?: string;
  denoter?: string;
}

/**
 * ActionStrategyParams
 * Interface of ActionStrategy Construction
 *
 * @param payload - Payload to be carried throughout the strategy.
 * @param initialNode - Starting point of your ActionStrategy
 */

export interface ActionStrategyParameters {
  key: string;
  data?: unknown;
  initialNode: ActionNode;
}
export interface ActionStrategy {
  key: string;
  data: unknown;
  currentNode: ActionNode;
  actionList: Array<string>;
  lastActionNode: ActionNode;
  keyedSelector?: KeyedSelector[];
  ticketStubs?: OwnershipTicketStub[];
  puntedStrategy?: ActionStrategy[];
}

function isNotPunctuated(str: string): boolean {
  const punctuatedList = ['.', ',', '?', '!', ';'];
  let notPunctuated = true;
  for (const punctuated of punctuatedList) {
    if (str.charAt(0) === punctuated) {
      notPunctuated = false;
      break;
    }
  }
  return notPunctuated;
}

function createSentence(actionNode: ActionNode, decisionKey?: string): string {
  const preposition = actionNode.preposition ? `${actionNode.preposition} ` : '';
  const decision = decisionKey ? `${decisionKey} ` : '';
  const body = `${actionNode.actionType}`;
  let denoter = '.';
  if (actionNode.denoter) {
    if (isNotPunctuated(actionNode.denoter)) {
      denoter = ` ${actionNode.denoter}`;
    } else {
      denoter = actionNode.denoter;
    }
  }
  return preposition + decision + body + denoter;
}

export function createStrategy(
  params: ActionStrategyParameters,
): ActionStrategy {
  const data: unknown = params.data;
  const currentNode: ActionNode = params.initialNode;
  const actionList: Array<string> = [params.key + '.'];

  return {
    key: params.key,
    data,
    currentNode,
    actionList,
    lastActionNode: {
      actionType: nullActionType,
      successNode: null
    },
  };
}

export const strategyBegin = (strategy: ActionStrategy, data?: unknown): Action => {
  strategy.currentNode.action = createAction(
    strategy.currentNode.actionType,
    strategy.currentNode.payload,
    strategy.currentNode.agreement
  );
  strategy.currentNode.action.strategy = {
    ...strategy,
    key: strategy.key,
    data: data ? data : strategy.data,
    currentNode: strategy.currentNode,
    actionList: strategy.actionList,
    lastActionNode: strategy.lastActionNode,
  };
  if (strategy.currentNode.action !== null) {
    return strategy.currentNode.action;
  } else {
    return createAction(axiumConcludeType);
  }
};

/**
 * strategySuccess(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const strategySuccess = (_strategy: ActionStrategy, data?: any) => {
  const strategy = { ..._strategy };
  // console.log('SUCCESS', strategy.payload);
  let nextAction: Action;
  const actionListEntry = createSentence(
    strategy.currentNode,
    strategy.currentNode.preposition ? undefined : 'Success with'
  );
  if (strategy.currentNode.successNode !== null) {
    const nextNode = strategy.currentNode.successNode;
    nextAction = createAction(
      nextNode.actionType,
      nextNode.payload,
      nextNode.agreement,
      nextNode.semaphore,
    );
    nextAction.strategy = {
      ...strategy,
      key: strategy.key,
      data: data ? data : strategy.data,
      currentNode: nextNode,
      actionList: [...strategy.actionList, actionListEntry],
      lastActionNode: strategy.currentNode,
    };
    return nextAction;
  } else {
    strategy.actionList = [...strategy.actionList, actionListEntry, '\n'];
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      const nextEntry = `${nextStrategy.key}.`;
      nextStrategy.actionList = [
        ...strategy.actionList,
        ...nextEntry,
      ];
      return strategyBegin(nextStrategy);
    }
    const conclude: ActionNode = {
      actionType: axiumConcludeType,
      successNode: null,
    };
    conclude.action = createAction(conclude.actionType);
    conclude.action.strategy = {
      ...strategy,
      currentNode: conclude,
      lastActionNode: strategy.currentNode,
    };
    return conclude.action;
  }
};
/**
 * strategyFailed(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function strategyFailed(_strategy: ActionStrategy, data?: any) {
  const strategy = {..._strategy};
  let nextAction: Action;
  const actionListEntry = createSentence(
    strategy.currentNode,
    strategy.currentNode.preposition ? undefined : 'Failed with'
  );
  if (
    strategy.currentNode.failureNode !== null &&
        strategy.currentNode.failureNode !== undefined
  ) {
    nextAction = createAction(
      strategy.currentNode.failureNode.actionType,
      strategy.currentNode.failureNode.payload,
      strategy.currentNode.agreement,
      strategy.currentNode.semaphore
    );
    strategy.actionList = [...strategy.actionList, actionListEntry];
    nextAction = { ...nextAction };
    nextAction.strategy = {
      ...strategy,
      key: strategy.key,
      data: strategy.data,
      currentNode: strategy.currentNode,
      actionList: strategy.actionList,
      lastActionNode: strategy.currentNode,
    };
    return nextAction;
  } else {
    strategy.actionList = [...strategy.actionList, actionListEntry, '\n'];
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      const nextEntry = `${nextStrategy.key}.`;
      nextStrategy.actionList = [
        ...strategy.actionList,
        ...nextEntry,
      ];
      return strategyBegin(nextStrategy);
    }
    const conclude: ActionNode = {
      actionType: axiumConcludeType,
      successNode: null,
    };
    conclude.action = createAction(conclude.actionType);
    conclude.action.strategy = {
      ...strategy,
      currentNode: conclude,
      lastActionNode: strategy.currentNode,
    };
    return conclude.action;
  }
}

/**
 * strategyDecide(strategy: ActionStrategy, index:number, data?: any)
 * Returns the DecisionNode of Index reassigns ActionStrategy to that Action's strategy parameter.
 * If no decisionNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
export const strategyDecide = (
  strategy: ActionStrategy,
  decideKey: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
) => {
  let nextAction: Action;
  const decisionNodes = strategy.currentNode.decisionNodes as Record<string, ActionNode>;
  const actionListEntry = createSentence(
    strategy.currentNode,
    decideKey
  );
  if (
    decisionNodes[decideKey] !== null
  ) {
    nextAction = createAction(
      decisionNodes[decideKey].actionType,
      decisionNodes[decideKey].payload,
      decisionNodes[decideKey].agreement,
      decisionNodes[decideKey].semaphore
    );
    const nextNode = decisionNodes[decideKey];
    strategy.actionList = [...strategy.actionList, actionListEntry];
    nextAction.strategy = {
      ...strategy,
      key: strategy.key,
      data: data ? data : strategy.data,
      currentNode: nextNode,
      actionList: strategy.actionList,
      lastActionNode: strategy.currentNode,
    };
    return nextAction;
  } else {
    strategy.actionList = [...strategy.actionList, actionListEntry, '\n'];
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      const nextEntry = `${nextStrategy.key}.`;
      nextStrategy.actionList = [
        ...strategy.actionList,
        ...nextEntry,
      ];
      return strategyBegin(nextStrategy);
    }
    const conclude: ActionNode = {
      actionType: axiumConcludeType,
      successNode: null,
    };
    conclude.action = createAction(conclude.actionType);
    conclude.action.strategy = {
      ...strategy,
      currentNode: conclude,
      lastActionNode: strategy.currentNode,
    };
    return conclude.action;
  }
};
// Remember Water Boy
export const puntStrategy = (
  puntedStrategy: ActionStrategy,
  newStrategy: ActionStrategy,
) => {
  let puntList: ActionStrategy[] = [];
  if (puntedStrategy.puntedStrategy !== undefined) {
    puntList = [...puntedStrategy.puntedStrategy, puntedStrategy];
  } else {
    puntList.push(puntedStrategy);
  }
  newStrategy.puntedStrategy = puntList;
  return newStrategy;
};
