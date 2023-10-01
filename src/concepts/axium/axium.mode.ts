import { Subject } from 'rxjs';
import { Mode } from '../../model/concept';
import { Action, primeAction } from '../../model/action';
import { AxiumState } from './axium.concept';
import { axiumBadActionType } from './qualities/badAction.quality';
import { Concept } from '../../model/concept.js';
import { axiumSetBlockingModeType } from './qualities/setBlockingMode.quality';
import { axiumConcludeType } from './qualities/conclude.quality';
import { UnifiedSubject } from '../../model/unifiedSubject';

export const isActionable = (axiumState: AxiumState, action: Action): boolean => {
  let actionable = true;
  // We are logically determining these semaphore values by hand for now.
  if (
    // Logical Determination: axiumBadActionType
    action.semaphore[3] === 1 ||
    // Logical Determination: axiumConcludeType
    action.semaphore[3] === 3) {
    actionable = false;
    if (axiumState.logging && action.semaphore[3] === 1) {
      console.warn('Bad Action', action);
    }
  }
  return actionable;
};

export const permissiveMode: Mode = (
  [action, concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, UnifiedSubject]
) => {
  const axiumState = concepts[0].state as AxiumState;
  if (isActionable(axiumState, action)) {
    // Logical Determination: axiumSetBlockingModeType
    if (action.semaphore[3] !== 4) {
      if (action.semaphore[2] !== -1 && action.semaphore[2] === axiumState.generation) {
        let subject: Subject<Action>;
        if (concepts[action.semaphore[0]].qualities[action.semaphore[1]].method) {
          subject = concepts[action.semaphore[0]].qualities[action.semaphore[1]].subject as Subject<Action>;
          subject.next(action);
        }
        const reduce = concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer;
        const state = concepts[action.semaphore[0]].state;
        concepts[action.semaphore[0]].state = reduce(state, action);
        concepts$.next(concepts);
        axiumState.subConcepts$.next(concepts);
      } else {
        const nextAction = primeAction(concepts, action);
        // Logical Determination: axiumBadActionType
        if (nextAction.semaphore[3] === 1) {
          const payload = [action];
          nextAction.payload = payload;
        }
        if (nextAction.semaphore[2] === axiumState.generation) {
          action$.next(nextAction);
        }
      }
    } else {
      blockingMode([action, concepts, action$, concepts$]);
    }
  }
};

// Note that Methods are altered during this Mode if the Axium is created in a Synchronous Context
//  Thus the Reducer needs to Run before the Method
export const blockingMode: Mode = (
  [action, concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, UnifiedSubject]
) => {
  const axiumState = concepts[0].state as AxiumState;
  if (isActionable(axiumState, action)) {
    if (action.semaphore[2] !== -1 && action.semaphore[2] === axiumState.generation) {
      const reduce = concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer;
      const state = concepts[action.semaphore[0]].state;
      concepts[action.semaphore[0]].state = reduce(state, action);
      concepts$.next(concepts);
      let subject: Subject<Action>;
      if (concepts[action.semaphore[0]].qualities[action.semaphore[1]].method) {
        subject = concepts[action.semaphore[0]].qualities[action.semaphore[1]].subject as Subject<Action>;
        subject.next(action);
      }
    } else {
      const nextAction = primeAction(concepts, action);
      // Logical Determination: axiumBadActionType
      if (nextAction.semaphore[3] === 1) {
        const payload = {...action};
        nextAction.payload = payload;
      }
      if (nextAction.semaphore[2] === axiumState.generation) {
        blockingMode([
          nextAction,
          concepts,
          action$,
          concepts$
        ]);
      }
    }
  }
};