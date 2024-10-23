/*<$
For the asynchronous graph programming framework Stratimux, define the ActionStrategy Consumers Advanced model file.
This provides additional functionality for the consumption of ActionStrategies not offered by the base Consumer Functions.
$>*/
/*<#*/
import { muxiumConclude } from '../../../concepts/muxium/qualities/conclude.quality';
import { Action, nullActionType } from '../action.type';
import { ActionNode, ActionStrategy } from './actionStrategy.type';
import { createActionNode, createStrategy } from './actionStrategy';
import { createSentence } from './actionStrategyHelpers';
import { strategyBegin } from './actionStrategyConsumers';

// Remember Water Boy
export const strategyPunt = (
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

export const strategySequence = (strategies: ActionStrategy[]): ActionStrategy | undefined => {
  if (strategies.length > 0) {
    const first = strategies[0];
    const list = [];
    for (let i = 1; i < strategies.length; i++) {
      list.push(strategies[i]);
    }
    first.puntedStrategy = list;
    return first;
  } else {
    return undefined;
  }
};

export const strategyBackTrack = (_strategy: ActionStrategy): Action => {
  const strategy = _strategy;
  if (strategy.currentNode.lastActionNode?.actionType !== nullActionType) {
    const newNode = strategy.currentNode.lastActionNode as ActionNode;
    if (newNode.action?.strategy?.actionList) {
      newNode.action.strategy.actionList = [
        ...newNode.action.strategy.actionList,
        strategy.actionList[strategy.actionList.length - 1],
      ];
      strategy.step = strategy.step ? strategy.step + 1 : 1;
    }
    return {...newNode.action} as Action;
  } else {
    return muxiumConclude({origin: _strategy.currentNode.action?.origin});
  }
};

export const strategyDetermine = <T extends Record<string, unknown>>(
  action: Action,
  options: {
    topic?: string,
    priority?: number,
    data?: T
  }): Action => {
  return strategyBegin(createStrategy({
    topic: options.topic ? options.topic : 'STRATEGY DETERMINED',
    initialNode: createActionNode(action),
    priority: options.priority,
    data: options.data
  }));
};

/**
 * The main functionality of this helper function is to allow for asynchronous recursion within your strategies.
 *  As the difficulty of working with async code within a node, is that you must use a then operation
 *    This simplifies the process of asynchronously depleting a list until your call the next strategy decision function.
 *      Likewise this should be used within the context of a method, not within a strategy creator function.
 * @param _strategy Target ActionStrategy.
 * @param control A depleting list should be either the payload or data passed into this function to allow this to be halting complete.
 * @param payload If set will set the payload for both action and the newly created ActionNode.
 * @param data If set will set the data on the ActionStrategy attached to the returned action.
 * @returns Action
 */
export const strategyRecurse =
  (_strategy: ActionStrategy, control: {payload?: Record<string, unknown>, data?: Record<string, unknown>}): Action<unknown> => {
    const strategy = {
      ..._strategy
    };
    const currentNode = {
      ..._strategy.currentNode
    };
    const action = {
      ...currentNode.action
    } as Action<any>;
    action.payload = control.payload ? control.payload : (_strategy.currentNode.action as Action).payload;
    currentNode.payload = control.payload ? control.payload : _strategy.currentNode.payload;
    currentNode.lastActionNode = _strategy.currentNode;
    strategy.data = control.data ? control.data : _strategy.data;
    strategy.actionList = [
      ...strategy.actionList,
      createSentence(
        _strategy.currentNode,
        _strategy.currentNode.successNotes,
      )
    ];
    currentNode.action = action;
    strategy.currentNode = currentNode;

    strategy.step = strategy.step ? strategy.step + 1 : 1;
    action.strategy = strategy;
    return action;
  };

/*#>*/