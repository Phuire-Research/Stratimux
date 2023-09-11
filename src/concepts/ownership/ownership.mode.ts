import { Subject, BehaviorSubject } from 'rxjs';
import { Action } from '../../model/action';
import { Concept } from '../../model/concept';
import { Mode } from '../../model/concept';
import { defaultMode, blockingMode } from '../axium/axium.mode';
import { axiumSetBlockingModeType } from '../axium/qualities/setBlockingMode.quality';
import { OwnershipState, ownershipKey } from './ownership.concept';
import { selectSlice, selectState } from '../../model/selector';
import { OwnershipLedger, checkIn, clearStubs, ownershipShouldBlock, updateAddToPendingActions } from '../../model/ownership';
import { selectOwnershipLedger } from './ownership.selector';
import { ownershipCheckoutType } from './qualities/checkout.quality';
import { axiumConcludeType } from '../axium/qualities/conclude.quality';
import { strategyFailed } from '../../model/actionStrategy';

export const ownershipMode: Mode = (
  [_action, _concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, BehaviorSubject<Concept[]>]
) => {
  let action = _action;
  let concepts = _concepts;
  let finalMode: Mode = defaultMode;
  if (action.type === axiumSetBlockingModeType) {
    finalMode = blockingMode;
  }
  // Clear previous Action from Strategy
  if (action.strategy && action.strategy.lastActionNode.action) {
    const lastAction = action.strategy.lastActionNode.action;
    if (lastAction.stubs) {
      // Clear Stubs
      concepts = clearStubs(concepts, lastAction);
    }
  }
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
        finalMode([strategyFailed(action.strategy), concepts, action$, concepts$]);
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
};
