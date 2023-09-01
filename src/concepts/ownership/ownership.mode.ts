import { Subject, BehaviorSubject } from 'rxjs';
import { Action } from '../../model/action';
import { Concept } from '../../model/concept';
import { Mode } from '../../model/concept';
import { defaultMode, blockingMode } from '../axium/axium.mode';
import { setBlockingMode } from '../axium/qualities/setBlockingMode.quality';

export const ownershipMode: Mode = (
  [action, concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, BehaviorSubject<Concept[]>]
) => {
  console.log('hit', action);
  let finalMode: Mode = defaultMode;
  if (action.type === setBlockingMode.type) {
    finalMode = blockingMode;
  }
  // Check In Logic
  if (action.keyedSelectors) {
    // concepts$.next(concepts);
    finalMode([action, concepts, action$, concepts$]);
  } else {
    finalMode([action, concepts, action$, concepts$]);
  }
};
