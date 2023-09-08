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
 * @param payload - `optional` Will carry this payload just for this node.
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
  prepend?: string;
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

export function createStrategy(
  params: ActionStrategyParameters,
): ActionStrategy {
  const data: unknown = params.data;
  const currentNode: ActionNode = params.initialNode;
  const actionList: Array<string> =
          [`${params.key}.`,`${params.initialNode.actionType}.`];

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
  if (strategy.currentNode.successNode !== null) {
    const nextNode = strategy.currentNode.successNode;
    nextAction = createAction(
      nextNode.actionType,
      nextNode.payload,
      nextNode.agreement,
      nextNode.semaphore,
    );
    const nextEntry = nextNode.prepend ?
      `${nextNode.prepend} ${nextAction.type}.` :
      `Success ${nextAction.type}.`;
    nextAction.strategy = {
      ...strategy,
      key: strategy.key,
      data: data ? data : strategy.data,
      currentNode: nextNode,
      actionList: [...strategy.actionList, nextEntry],
      lastActionNode: strategy.currentNode,
    };
    return nextAction;
  } else {
    strategy.actionList = [...strategy.actionList];
    strategy.actionList.push('\n');
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      const nextEntry = nextStrategy.currentNode.prepend ?
        [`${nextStrategy.key}`, `${nextStrategy.currentNode.prepend} ${nextStrategy.currentNode.actionType}.`] :
        [`${nextStrategy.key}`, `${nextStrategy.currentNode.actionType}.`];
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
    const nextEntry = strategy.currentNode.failureNode?.prepend ?
      `${strategy.currentNode.failureNode.prepend} ${nextAction.type}.` :
      `Failed with ${nextAction.type}.`;
    strategy.actionList = [...strategy.actionList, nextEntry];
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
    strategy.actionList = [...strategy.actionList];
    strategy.actionList.push('\n');
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      const nextEntry = nextStrategy.currentNode.prepend ?
        [`${nextStrategy.key}`, `${nextStrategy.currentNode.prepend} ${nextStrategy.currentNode.actionType}.`] :
        [`${nextStrategy.key}`, `${nextStrategy.currentNode.actionType}.`];
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
  if (
    strategy.currentNode.decisionNodes !== null &&
        strategy.currentNode.decisionNodes !== undefined
  ) {
    nextAction = createAction(
      strategy.currentNode.decisionNodes[decideKey].actionType,
      strategy.currentNode.decisionNodes[decideKey].payload,
      strategy.currentNode.decisionNodes[decideKey].agreement,
      strategy.currentNode.decisionNodes[decideKey].semaphore
    );
    const nextNode = strategy.currentNode.decisionNodes[decideKey];
    strategy.actionList = [...strategy.actionList, `${decideKey} ${nextAction.type}.`];
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
    strategy.actionList = [...strategy.actionList];
    strategy.actionList.push('\n');
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      const nextEntry = nextStrategy.currentNode.prepend ?
        [`${nextStrategy.key}`, `${nextStrategy.currentNode.prepend} ${nextStrategy.currentNode.actionType}.`] :
        [`${nextStrategy.key}`, `${nextStrategy.currentNode.actionType}.`];
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
