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
import { selectState } from '../../model/selector';
import { OwnershipState, ownershipName } from './ownership.concept';
import { counterSetCountType } from '../counter/qualities/setCount.quality';

export const ownershipMode: Mode = (
  [_action, _concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, UnifiedSubject]
) => {
  let action = _action;
  let concepts = _concepts;
  let finalMode: Mode = permissiveMode;
  if (action.type === axiumSetBlockingModeType) {
    finalMode = blockingMode;
  }
  if (action.type !== axiumConcludeType && action.semaphore[2] !== -1) {
    // Check In Logic
    const shouldBlock = ownershipShouldBlock(concepts, action);
    if (shouldBlock) {
      if (action.strategy) {
        if (action.strategy.currentNode.failureNode === null) {
        // This assumes that the Strategy does not account for the Block
          let nextAction = strategyFailed(action.strategy);
          // const lastAction = nextAction.strategy?.currentNode.action as Action;
          // concepts = clearStubs(concepts, lastAction);
          if (nextAction.type === axiumConcludeType) {
            concepts = clearStubs(concepts, nextAction.strategy as ActionStrategy);
            nextAction = createAction(axiumAppendActionListToDialogType);
            nextAction.payload = {
              actionList: action.strategy.actionList,
              strategyTopic: action.strategy.topic
            } as AppendActionListToDialogPayload;
          }
          finalMode([nextAction, concepts, action$, concepts$]);
        } else {
        // This assumes that the Strategy is accounting for the Block
          // console.log('Check Action Failed1', action);
          [concepts, action] = checkIn(concepts, action);
          const nextAction = strategyFailed(action.strategy as ActionStrategy);
          concepts = updateAddToPendingActions(concepts, nextAction);
          concepts$.next(concepts);
        }
      }  else {
      // Principle is then responsible to dispatch these actions;
        concepts = updateAddToPendingActions(concepts, action);
        concepts$.next(concepts);
      }
    // } else if (action.keyedSelectors) {
    } else if (action.strategy) {
      [concepts, action] = checkIn(concepts, action);
      finalMode([action, concepts, action$, concepts$]);
    } else {
    // Free to Run
      finalMode([action, concepts, action$, concepts$]);
    }
  } else if (action.type !== axiumConcludeType) {
    finalMode([action, concepts, action$, concepts$]);
  }

  if (action.strategy?.stubs && action.type === axiumConcludeType) {
    concepts = clearStubs(concepts, action.strategy);
    concepts$.next(concepts);
  }
  const ownership = selectState<OwnershipState>(concepts, ownershipName);
};
