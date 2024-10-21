/*<$
For the asynchronous graph programming framework Stratimux, define the ActionStrategy model file.
This file is what allows for Stratimux to be provably terminating.
As each strategy constitutes a finite set of symbols that must reach a conclusion.
Using this data structure we can constrain the Muxium's recursive functionality to the length
of the strategies that currently exist within it.
$>*/
/*<#*/
import { muxiumConclude, muxiumConcludeType } from '../../../concepts/muxium/qualities/conclude.quality';
import { createAction } from '../action';
import { Action, ActionType, nullActionType } from '../action.type';
import { OwnershipTicketStub } from '../../ownership';
import { KeyedSelector } from '../../selectors/selector';
import { ActionNode, ActionNodeOptions, ActionStrategy, ActionStrategyParameters } from './actionStrategy.type';

/**
 * Decomposes an action into an ActionNode to be later Recomposed.
 * @param action Action properties of KeyedSelector, Agreement, and Semaphore take priority over options.
 * @param options successNode and failureNodes are always required. If using decisionNodes, set both to null.
 * @returns ActionNode
 */
export function createActionNode(action: Action<any>, options?: ActionNodeOptions): ActionNode {
  if (options) {
    return {
      actionType: action.type,
      payload: action.payload,
      keyedSelectors: action.keyedSelectors ? action.keyedSelectors : options.keyedSelectors,
      conceptSemaphore: action.conceptSemaphore ? action.conceptSemaphore : options.conceptSemaphore,
      priority: action.priority ? action.priority : options.priority,
      agreement: action.agreement ? action.agreement : options.agreement,
      semaphore: action.semaphore ? action.semaphore : options.semaphore,
      successNode: options.successNode ? options.successNode : null,
      successNotes: options.successNotes,
      failureNode: options.failureNode ? options.failureNode : null,
      failureNotes: options.failureNotes,
      decisionNodes: options.decisionNodes,
      decisionNotes: options.decisionNotes,
      lastActionNode: options.lastActionNode
    };
  }
  return {
    actionType: action.type,
    payload: action.payload,
    successNode: null,
    failureNode: null
  };
}

/**
 * Note that this will be a new ActionNode and not the original created within the provided strategy.
 * @param strategy Will return a recomposed ActionNode of the provided strategy.
 * @returns ActionNode
 */
export const createActionNodeFromStrategy = (strategy: ActionStrategy): ActionNode => {
  const currentNode = strategy.currentNode;
  let action;
  if (currentNode.action) {
    action = {...currentNode.action};
  } else {
    action = createAction(
      currentNode.actionType,
      {
        payload: currentNode.payload,
        keyedSelectors: currentNode.keyedSelectors,
        agreement: currentNode.agreement,
        semaphore: currentNode.semaphore,
        conceptSemaphore: currentNode.conceptSemaphore,
        priority: currentNode.priority
      }
    );
  }
  return createActionNode(action, {
    successNode: currentNode.successNode,
    successNotes: currentNode.successNotes,
    failureNode: currentNode.failureNode,
    failureNotes: currentNode.failureNotes,
    decisionNodes: currentNode.decisionNodes,
    decisionNotes: currentNode.decisionNotes,
    lastActionNode: currentNode.lastActionNode
  });
};

export function createStrategy(
  params: ActionStrategyParameters,
): ActionStrategy {
  const data: Record<string, unknown> | undefined = params.data;
  const currentNode: ActionNode = params.initialNode;
  const priority = params.priority;
  currentNode.lastActionNode = {
    // This logically determines that all ActionNodes will have a Action associated.
    action: createAction(nullActionType),
    actionType: nullActionType,
    successNode: null,
    failureNode: null
  };
  const actionList: Array<string> = [params.topic + '.'];
  return {
    topic: params.topic,
    data,
    currentNode,
    actionList,
    priority,
    step: 0
  };
}

/*#>*/