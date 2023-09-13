import { Subject } from 'rxjs';
import { Mode } from '../../model/concept';
import { Action, primeAction } from '../../model/action';
import { AxiumState, createAxiumConcept } from './axium.concept';
import { selectState } from '../../model/selector';
import { axiumBadActionType, badActionQuality } from './qualities/badAction.quality';
import { Concept } from '../../model/concept.js';
import { BehaviorSubject } from 'rxjs';
import { axiumSetBlockingModeType } from './qualities/setBlockingMode.quality';
import { axiumConcludeType } from './qualities/conclude.quality';

export const isActionable = (axiumState: AxiumState, action: Action): boolean => {
  let actionable = true;
  if (
    action.type === axiumBadActionType &&
    action.type === axiumConcludeType) {
    actionable = false;
    if (axiumState.logging && action.type === axiumBadActionType) {
      console.warn('Bad Action', action);
    }
  }
  return actionable;
};

export const permissiveMode: Mode = (
  [action, concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, BehaviorSubject<Concept[]>]
) => {
  const axiumState = concepts[0].state as AxiumState;
  if (isActionable(axiumState, action)) {
    if (action.type !== axiumSetBlockingModeType) {
      if (action.semaphore[2] !== -1 && action.semaphore[2] === axiumState.generation) {
        // console.log('DEFAULT INNER: ', action.type);
        // console.log(concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer)
        let subject: Subject<Action>;
        if (concepts[action.semaphore[0]].qualities[action.semaphore[1]].method) {
          subject = concepts[action.semaphore[0]].qualities[action.semaphore[1]].subject as Subject<Action>;
          subject.next(action);
        }
        const reduce = concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer;
        const state = concepts[action.semaphore[0]].state;
        concepts[action.semaphore[0]].state = reduce(state, action);
        // console.log('Default Mode Check Length: ', concepts.length)
        concepts$.next(concepts);
        axiumState.subConcepts$.next(concepts);
      } else {
        // console.log('DEFAULT TESTING 2', action.type, action.semaphore, AxiumState.generation);
        const nextAction = primeAction(concepts, action);
        if (nextAction.type === axiumBadActionType) {
          const payload = {...action};
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
  [action, concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, BehaviorSubject<Concept[]>]
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
      if (nextAction.type === axiumBadActionType) {
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