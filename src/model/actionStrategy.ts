import { Action, createAction } from './action';

export const endOfActionStrategy: Action = createAction(
  '[ActionStrategy] EndOfActionStrategy',
);

/**
 * ActionNode
 * Control Structure used by ActionStrategy
 *
 * `NOTE` When creating Actions for action. There is no need to pass payload, or strategy parameters,
 *  as ActionStrategy takes care of that behind the scenes.
 *
 * @param action - Action to be dispatched.
 * @param successNode - Upon ActionStrategy.success() the Strategy will update itself to this node.
 * * If set to null, will default to EndOfActionStrategy on ActionStrategy.success().
 * @param failureNode - `optional` ActionStrategy.failed() will fire EndOfActionStrategy if left blank or set to null.
 * @param payload - `optional` Will carry this payload just for this node.
 */

export interface ActionNode {
  action: Action;
  successNode: ActionNode | null;
  failureNode?: ActionNode;
  payload?: unknown;
  decisionNodes?: ActionNode[];
}

/**
 * ActionStrategyParams
 * Interface of ActionStrategy Construction
 *
 * @param payload - Payload to be carried throughout the strategy.
 * @param initialNode - Starting point of your ActionStrategy
 */

export interface ActionStrategyParameters {
  payload?: unknown;
  initialNode: ActionNode;
}
export interface ActionStrategy {
  payload: unknown;
  currentNode: ActionNode;
  actionList: Array<string>;
  lastAction: Action;
  puntedStrategy?: ActionStrategy[];
}

export function createStrategy(
  params: ActionStrategyParameters,
): ActionStrategy {
  const payload: unknown = params.payload;
  const currentNode: ActionNode = params.initialNode;
  const actionList: Array<string> =
        params.initialNode !== null
          ? ['[INITIAL ACTION]: ' + params.initialNode.action.type]
          : ([] as Array<string>);
  const lastAction: Action = params.initialNode.action;

  return {
    payload,
    currentNode,
    actionList,
    lastAction,
  };
}

export const strategyBegin = (strategy: ActionStrategy): Action => {
  strategy.currentNode.action.strategy = {
    payload: strategy.payload,
    currentNode: strategy.currentNode,
    actionList: strategy.actionList,
    lastAction: strategy.lastAction,
  };
  if (strategy.currentNode.action !== null) {
    if (strategy.currentNode.payload) {
      strategy.currentNode.action.payload = strategy.currentNode.payload;
    }
    return strategy.currentNode.action;
  } else {
    return endOfActionStrategy;
  }
};

/**
 * strategySuccess(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
export const strategySuccess = (_strategy: ActionStrategy, data?: any) => {
  const strategy = { ..._strategy };
  // console.log('SUCCESS', strategy.payload);
  let nextAction: Action;
  if (strategy.currentNode.successNode !== null) {
    nextAction = strategy.currentNode.successNode.action;
    strategy.currentNode = strategy.currentNode.successNode;
  } else {
    strategy.actionList = [...strategy.actionList];
    strategy.actionList.push('END: ' + endOfActionStrategy);
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      nextStrategy.actionList = [
        ...strategy.actionList,
        `Begin: ${nextStrategy.currentNode.action.type}`,
      ];
      return strategyBegin(nextStrategy);
    }
    return endOfActionStrategy;
  }
  strategy.actionList = [...strategy.actionList];
  strategy.actionList.push('Success: ' + nextAction.type);
  strategy.lastAction = nextAction;
  nextAction = { ...nextAction };
  nextAction.strategy = {
    payload: strategy.payload,
    currentNode: strategy.currentNode,
    actionList: strategy.actionList,
    lastAction: strategy.lastAction,
  };
  if (data !== undefined) {
    nextAction.strategy.payload = data;
  }
  if (
    strategy.currentNode.payload !== null &&
        strategy.currentNode.payload !== undefined
  ) {
    nextAction.payload = strategy.currentNode.payload;
  }
  return nextAction;
};
/**
 * strategyFailed(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
export function strategyFailed(_strategy: ActionStrategy, data?: any) {
  let strategy = _strategy;
  let nextAction: Action;
  if (
    strategy.currentNode.failureNode !== null &&
        strategy.currentNode.failureNode !== undefined
  ) {
    nextAction = strategy.currentNode.failureNode.action;
    if (strategy.currentNode) {
      // Question, why does NGRX set these Properties to readonly?
      // This is a ridiculous workaround to get around that.
      strategy = { ...strategy };
      strategy.currentNode = { ...strategy.currentNode };
    }
    strategy.currentNode = strategy.currentNode.failureNode as ActionNode;
    if (
      strategy.currentNode.payload !== null &&
            strategy.currentNode.payload !== undefined
    ) {
      strategy.payload = strategy.currentNode.payload;
    }
  } else {
    strategy.actionList = [...strategy.actionList];
    strategy.actionList.push('END: ' + endOfActionStrategy);
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      nextStrategy.actionList = [
        ...strategy.actionList,
        `Begin: ${nextStrategy.currentNode.action.type}`,
      ];
      return strategyBegin(nextStrategy);
    }
    return endOfActionStrategy;
  }
  strategy.actionList = [...strategy.actionList];
  strategy.actionList.push('Failed: ' + strategy.lastAction.type);
  strategy.lastAction = { ...nextAction };
  nextAction = { ...nextAction };
  nextAction.strategy = {
    payload: strategy.payload,
    currentNode: strategy.currentNode,
    actionList: strategy.actionList,
    lastAction: strategy.lastAction,
  };
  if (data !== undefined) {
    nextAction.strategy.payload = data;
  }
  if (
    strategy.currentNode.payload !== null &&
        strategy.currentNode.payload !== undefined
  ) {
    nextAction.payload = strategy.currentNode.payload;
  }
  return nextAction;
}

/**
 * strategyDecide(strategy: ActionStrategy, index:number, data?: any)
 * Returns the DecisionNode of Index reassigns ActionStrategy to that Action's strategy parameter.
 * If no decisionNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
export const strategyDecide = (
  strategy: ActionStrategy,
  index: number,
  data?: any,
) => {
  let nextAction: Action;
  if (
    strategy.currentNode.decisionNodes !== null &&
        strategy.currentNode.decisionNodes !== undefined &&
        strategy.currentNode.decisionNodes?.length !== 0
  ) {
    nextAction = strategy.currentNode.decisionNodes[index].action;
    strategy.currentNode = strategy.currentNode.decisionNodes[index];
  } else {
    strategy.actionList = [...strategy.actionList];
    strategy.actionList.push('END: ' + endOfActionStrategy);
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      nextStrategy.actionList = [
        ...strategy.actionList,
        `Begin: ${nextStrategy.currentNode.action.type}`,
      ];
      return strategyBegin(nextStrategy);
    }
    return endOfActionStrategy;
  }
  strategy.actionList = [...strategy.actionList];
  strategy.actionList.push(`Decided: ${nextAction.type}, index: ${index}`);
  strategy.lastAction = nextAction;
  nextAction = { ...nextAction };
  nextAction.strategy = {
    payload: strategy.payload,
    currentNode: strategy.currentNode,
    actionList: strategy.actionList,
    lastAction: strategy.lastAction,
  };
  if (data !== undefined) {
    nextAction.strategy.payload = data;
  }
  if (
    strategy.currentNode.payload !== null &&
        strategy.currentNode.payload !== undefined
  ) {
    nextAction.payload = strategy.currentNode.payload;
  }
  return nextAction;
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
