import { Subject, BehaviorSubject } from 'rxjs';
import { Action } from '../../model/action';
import { Concept } from '../../model/concept';
import { Mode } from '../../model/concept';
import { defaultMode, blockingMode } from '../axium/axium.mode';
import { axiumSetBlockingModeType } from '../axium/qualities/setBlockingMode.quality';
import { OwnershipState, ownershipKey } from './ownership.concept';
import { selectSlice, selectState } from '../../model/selector';
import { OwnershipLedger, checkIn } from '../../model/ownership';
import { selectOwnershipLedger } from './ownership.selector';

export const ownershipMode: Mode = (
  [_action, _concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, BehaviorSubject<Concept[]>]
) => {
  let action = _action;
  let concepts = _concepts;
  console.log('hit', action);
  let finalMode: Mode = defaultMode;
  if (action.type === axiumSetBlockingModeType) {
    finalMode = blockingMode;
  }
  // Check In Logic
  const keys = concepts[action.semaphore[0]].qualities[action.semaphore[1]].keyedSelectors;
  if (keys !== undefined) {
    const ownershipState = selectState<OwnershipState>(concepts, ownershipKey);
    const ownershipLedger = ownershipState.ownershipLedger;
    let shouldBlock = false;
    for (let i = 0; i < keys.length; i++) {
      if (ownershipLedger.has(`${keys[i].conceptKey} ${keys[i].stateKeys}`)) {
        shouldBlock = true;
        break;
      }
    }
    if (shouldBlock && !action.keyedSelectors) {
      // Principle is then responsible to dispatch these actions;
      ownershipState.pendingActions.push(action);
      concepts$.next(concepts);
    } else if (action.keyedSelectors) {
      [concepts, action] = checkIn(concepts, action);
      finalMode([action, concepts, action$, concepts$]);
    } else {
      finalMode([action, concepts, action$, concepts$]);
    }
  } else if (action.keyedSelectors) {
    [concepts, action] = checkIn(concepts, action);
    finalMode([action, concepts, action$, concepts$]);
  } else {
    finalMode([action, concepts, action$, concepts$]);
  }
};
