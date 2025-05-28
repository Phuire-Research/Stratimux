/*<$
For the asynchronous graph programming framework Stratimux, define the Method Subscription model file.
This file defines the method subscriptions used for both the default and blocking modes of the muxium.
$>*/
/*<#*/
import {
  Subject,
} from 'rxjs';
import {
  Concepts,
} from '../concept/concept.type';
import { muxiumTimeOut } from '../time';
import { handlePriority, isPriorityValid } from '../priority';
import { Action, AnyAction } from '../action/action.type';
import { accessMuxium, getMuxiumState } from '../muxium/muxiumHelpers';
import { MuxiumOrigins } from '../muxium/muxium.type';

export const blockingMethodSubscription = (
  concepts: Concepts,
  tail: AnyAction[],
  action: Action
) => {
  if (
    action.strategy &&
    // Logical Determination: muxiumConcludeType
    action.semaphore[3] === 3
  ) {
    // Allows for reducer next in sequence
    const appendToDialog = accessMuxium(concepts).e.muxiumAppendActionListToDialog({
      actionList: action.strategy.actionList,
      strategyTopic: action.strategy.topic,
      strategyData: action.strategy.data,
    });
    if (isPriorityValid(action)) {
      appendToDialog.priority = action.priority;
      const state = getMuxiumState(concepts);
      handlePriority(state, action);
      handlePriority(state, appendToDialog);
    } else {
      action.origin = MuxiumOrigins.strategyTail;
      tail.push(action);
      tail.push(appendToDialog);
    }
  } else if (
    action.strategy &&
    // Logical Determination: muxiumBadType
    action.semaphore[3] !== 1
  ) {
    if (isPriorityValid(action)) {
      handlePriority(getMuxiumState(concepts), action);
    } else {
      tail.push(action);
    }
  }
};

export const defaultMethodSubscription = (
  concepts: Concepts,
  tail: Action<unknown>[],
  action$: Subject<Action>,
  action: Action,
  async: boolean
) => {
  if (
    action.strategy &&
    // Logical Determination: muxiumConcludeType
    action.semaphore[3] === 3
  ) {
    // Allows for reducer next in sequence
    const appendToDialog = accessMuxium(concepts).e.muxiumAppendActionListToDialog({
      actionList: action.strategy.actionList,
      strategyTopic: action.strategy.topic,
      strategyData: action.strategy.data
    });
    // setTimeout(() => {
    if (isPriorityValid(action)) {
      const state = getMuxiumState(concepts);
      handlePriority(state, action);
      appendToDialog.priority = action.priority;
      handlePriority(state, appendToDialog);
    } else {
      tail.push(action);
      tail.push(appendToDialog);
    }
    if (async) {
      muxiumTimeOut(concepts, () => {
        return accessMuxium(concepts).e.muxiumKick();
      }, 0);
    }
    // }, 0);
  } else if (
    action.strategy &&
    // Logical Determination: muxiumBadType
    action.semaphore[3] !== 1
  ) {
    if (isPriorityValid(action)) {
      handlePriority(getMuxiumState(concepts), action);
    } else {
      tail.push(action);
    }
    if (async) {
      muxiumTimeOut(concepts, () => {
        return accessMuxium(concepts).e.muxiumKick();
      }, 0);
    }
  }
};
/*#>*/