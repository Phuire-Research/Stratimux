import { Subject } from 'rxjs';
import { Action } from '../../model/action';
import { Concept } from '../../model/concept';
import { Mode } from '../../model/concept';
import { permissiveMode, blockingMode } from '../axium/axium.mode';
import { axiumSetBlockingModeType } from '../axium/qualities/setBlockingMode.quality';
import { checkIn, clearStubs, ownershipShouldBlock, updateAddToPendingActions } from '../../model/ownership';
import { axiumConcludeType } from '../axium/qualities/conclude.quality';
import { strategyFailed } from '../../model/actionStrategy';
import { UnifiedSubject } from '../../model/unifiedSubject';

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
  if (action.strategy && action.strategy.lastActionNode.action) {
    const lastAction = action.strategy.lastActionNode.action;
    // Clear Stubs
    concepts = clearStubs(concepts, lastAction);
  }
  if (action.type !== axiumConcludeType) {
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
        if (action.strategy.currentNode.failureNode !== null) {
        // This assumes that the Strategy does not account for the Block
          finalMode([strategyFailed(action.strategy), concepts, action$, concepts$]);
        } else {
        // This assumes that the Strategy is accounting for the Block
          concepts = updateAddToPendingActions(concepts, strategyFailed(action.strategy));
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
  } else {
    finalMode([action, concepts, action$, concepts$]);
  }
};
