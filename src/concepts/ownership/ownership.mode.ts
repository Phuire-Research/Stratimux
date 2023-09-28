import { Subject } from 'rxjs';
import { Action, createAction } from '../../model/action';
import { Concept } from '../../model/concept';
import { Mode } from '../../model/concept';
import { permissiveMode, blockingMode } from '../axium/axium.mode';
import { axiumSetBlockingModeType } from '../axium/qualities/setBlockingMode.quality';
import { checkIn, clearStubs, ownershipShouldBlock, updateAddToPendingActions } from '../../model/ownership';
import { axiumConcludeType } from '../axium/qualities/conclude.quality';
import { ActionStrategy, nullActionType, strategyFailed } from '../../model/actionStrategy';
import { UnifiedSubject } from '../../model/unifiedSubject';
import { AppendActionListToDialogPayload, axiumAppendActionListToDialogType } from '../axium/qualities/appendActionListToDialog.quality';
import { AxiumState } from '../axium/axium.concept';
import { Counter, counterName } from '../counter/counter.concept';
import { selectState } from '../../model/selector';
import { ExperimentState, experimentName } from '../experiment/experiment.concept';
import { OwnershipState, ownershipName } from './ownership.concept';

export const ownershipMode: Mode = (
  [_action, _concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, UnifiedSubject]
) => {
  let action = _action;
  let concepts = _concepts;
  let finalMode: Mode = permissiveMode;
  if (action.type === axiumSetBlockingModeType) {
    finalMode = blockingMode;
  }
  // Clear previous Action Stubs associated with Strategy
  if (action.strategy && action.strategy.currentNode.lastActionNode?.action?.stubs) {
    const lastAction = action.strategy.currentNode.lastActionNode.action;
    if (action.type === axiumConcludeType) {
      concepts = clearStubs(concepts, lastAction);
    } else if (action.semaphore[2] !== -1 ) {
      concepts = clearStubs(concepts, lastAction);
    }
  }
  // const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  // console.log('MODE', action.type, action.stubs, action.strategy?.topic, ownershipState.ownershipLedger);
  if (action.type !== axiumConcludeType && action.semaphore[2] !== -1) {
    // Check In Logic
    const shouldBlock = ownershipShouldBlock(concepts, action);
    // Quality Opted in Action
    if (shouldBlock && !action.keyedSelectors) {
    // Principle is then responsible to dispatch these actions;
      concepts = updateAddToPendingActions(concepts, action);
      concepts$.next(concepts);
    // Action that would take Ownership and is Blocked
    } else if (shouldBlock && action.keyedSelectors) {
      if (action.strategy) {
        if (action.strategy.currentNode.failureNode === null) {
        // This assumes that the Strategy does not account for the Block
          let nextAction = strategyFailed(action.strategy);
          // const lastAction = nextAction.strategy?.currentNode.action as Action;
          // concepts = clearStubs(concepts, lastAction);
          if (nextAction.type === axiumConcludeType) {
            nextAction = createAction(axiumAppendActionListToDialogType);
            nextAction.payload = {
              actionList: action.strategy.actionList,
              strategyTopic: action.strategy.topic
            } as AppendActionListToDialogPayload;
          }
          finalMode([nextAction, concepts, action$, concepts$]);
        } else {
        // This assumes that the Strategy is accounting for the Block
          [concepts, action] = checkIn(concepts, action);
          // console.log('Check Action Failed1', action);
          const nextAction = strategyFailed(action.strategy as ActionStrategy);
          // console.log('Check Action Failed', nextAction.strategy?.lastActionNode.action);
          concepts = updateAddToPendingActions(concepts, nextAction);
          concepts$.next(concepts);
        }
      } else {
      // Principle is then responsible to dispatch these actions;
        concepts = updateAddToPendingActions(concepts, action);
        concepts$.next(concepts);
      }
    // Action that would take Ownership but is Free
    } else if (action.keyedSelectors) {
      [concepts, action] = checkIn(concepts, action);
      finalMode([action, concepts, action$, concepts$]);
    } else {
    // Free to Run
      finalMode([action, concepts, action$, concepts$]);
    }
  } else if (action.type !== axiumConcludeType) {
    finalMode([action, concepts, action$, concepts$]);
  }
};
