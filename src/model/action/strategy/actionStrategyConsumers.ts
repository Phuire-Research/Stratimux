/*<$
For the asynchronous graph programming framework Stratimux, define the ActionStrategy model file.
This file defines a series of consumer functions that accept an ActionStrategy and data parameter; that
then returns a new ActionStrategy based on the inputs.
$>*/
/*<#*/
import { muxiumConclude, muxiumConcludeType } from '../../../concepts/muxium/qualities/conclude.quality';
import { createAction } from '../action';
import { Action } from '../action.type';
import { ActionNode, ActionNotes, ActionStrategy } from './actionStrategy.type';
import { createSentence, mergeKeyedSelectors } from './actionStrategyHelpers';

export const strategyBegin = (strategy: ActionStrategy, data?: Record<string, unknown>): Action => {
  const currentNode = strategy.currentNode;
  let priority;
  if (currentNode.priority) {
    priority = currentNode.priority;
  } else if (strategy.priority) {
    priority = strategy.priority;
  }
  strategy.currentNode.action = createAction(
    currentNode.actionType,
    {
      payload: currentNode.payload,
      keyedSelectors: currentNode.keyedSelectors,
      agreement: currentNode.agreement,
      semaphore: currentNode.semaphore,
      conceptSemaphore: currentNode.conceptSemaphore,
      priority
    }
  );
  strategy.currentNode.action.strategy = {
    ...strategy,
    topic: strategy.topic,
    data: data ? data : strategy.data,
    currentNode: strategy.currentNode,
    actionList: strategy.actionList,
    priority: strategy.priority,
    step: strategy.step ? strategy.step + 1 : 1
  };
  if (strategy.currentNode.action !== null) {
    return strategy.currentNode.action;
  } else {
    return muxiumConclude();
  }
};

/**
 * strategySuccess(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
const strategyConsumer = (
  _strategy: ActionStrategy,
  nextNode: ActionNode | null,
  defaultPreposition: string,
  notes?: ActionNotes,
  data?: Record<string, unknown>
) => {
  const strategy = {..._strategy};
  let nextAction: Action<unknown>;
  const actionListEntry = createSentence(
    strategy.currentNode,
    notes !== undefined ? notes : {preposition: defaultPreposition},
  );
  if (nextNode !== null) {
    const origin = strategy.currentNode.action?.origin;
    let priority;
    if (nextNode.priority) {
      priority = nextNode.priority;
    } else if (strategy.priority) {
      priority = strategy.priority;
    }
    // Merge KeyedSelectors: carry forward from current action and add any from next node
    const keyedSelectors = mergeKeyedSelectors(
      strategy.currentNode.action?.keyedSelectors,
      nextNode.keyedSelectors
    );
    
    nextAction = createAction(
      nextNode.actionType,
      {
        payload: nextNode.payload,
        keyedSelectors,
        agreement: nextNode.agreement,
        semaphore: nextNode.semaphore,
        conceptSemaphore: nextNode.conceptSemaphore,
        priority,
        origin
      }
    );
    nextNode.action = nextAction;
    nextNode.lastActionNode = strategy.currentNode;
    nextAction.strategy = {
      ...strategy,
      topic: strategy.topic,
      data: data ? data : strategy.data,
      currentNode: nextNode,
      actionList: [...strategy.actionList, actionListEntry],
      step: strategy.step ? strategy.step + 1 : 1
    };
    return nextAction;
  } else {
    strategy.actionList = [...strategy.actionList, actionListEntry, '\n'];
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      // Punted strategy transition
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      nextStrategy.puntedStrategy = strategy.puntedStrategy;
      const nextEntry = `${nextStrategy.topic}.`;
      nextStrategy.actionList = [
        ...strategy.actionList,
        nextEntry,
      ];

      nextStrategy.stubs = strategy.stubs;
      nextStrategy.currentNode.lastActionNode = strategy.currentNode;
      const act = strategyBegin(nextStrategy);
      const keyedSelectors = mergeKeyedSelectors(
        strategy.currentNode.action?.keyedSelectors,
        act.keyedSelectors
      );
      act.keyedSelectors = keyedSelectors;
      act.origin = strategy.currentNode.action?.origin;
      return act;
    }
    const origin = strategy.currentNode.action?.origin;
    const conclude: ActionNode = {
      actionType: muxiumConcludeType,
      successNode: null,
      failureNode: null,
      lastActionNode: strategy.currentNode,
      priority: strategy.priority
    };
    conclude.action = createAction(conclude.actionType, {
      origin
    });
    conclude.action.priority = strategy.priority;
    conclude.action.strategy = {
      ...strategy,
      currentNode: conclude,
      data: data ? data : strategy.data,
      step: strategy.step ? strategy.step + 1 : 1
    };
    return conclude.action;
  }
};

/**
 * strategySuccess(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return Conclude instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
export const strategySuccess = (_strategy: ActionStrategy, data?: Record<string, unknown>) => {
  return strategyConsumer(
    _strategy,
    _strategy.currentNode.successNode,
    'Success with',
    _strategy.currentNode.successNotes,
    data
  );
};
/**
 * strategyFailed(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return Conclude instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
export function strategyFailed(_strategy: ActionStrategy, data?: Record<string, unknown>) {
  return strategyConsumer(
    _strategy,
    _strategy.currentNode.failureNode,
    'Failed with',
    _strategy.currentNode.failureNotes
  );
}

/**
 * strategyDecide(strategy: ActionStrategy, index:number, data?: any)
 * Returns the DecisionNode of Index reassigns ActionStrategy to that Action's strategy parameter.
 * If no decisionNode is found, will return Conclude instead.
 * @param decideKey - Selects from the decisionNodes Dictionary the next Action Node, also acts as the default preposition when assigned
 * to your Dialog's Sentence.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 * @param notes - OPTIONAL, if used will override the current ActionNotes, use this to be specific in regards to your decision.
 */
export const strategyDecide = (
  _strategy: ActionStrategy,
  decideKey: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, unknown>,
  notes?: ActionNotes
) => {
  if (_strategy.currentNode.decisionNodes) {
    const decisionNodes = _strategy.currentNode.decisionNodes as Record<string, ActionNode>;
    if (
      decisionNodes[decideKey] !== null
    ) {
      const nextNode = decisionNodes[decideKey];
      return strategyConsumer(
        _strategy,
        nextNode,
        decideKey,
        notes ? notes : _strategy.currentNode.decisionNotes,
        data
      );
    }
  }
  return strategyConsumer(
    _strategy,
    null,
    'No decision'
  );
};

/*#>*/