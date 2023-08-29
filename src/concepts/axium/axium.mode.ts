import { Subject } from 'rxjs';
import { Mode } from '../../model/concept';
import { Action, primeAction } from '../../model/action';
import { AxiumState, _axium } from './axium.concept';
import { selectState } from '../../model/selector';
import { badAction, badActionQuality } from './qualities/badAction.quality';
import { Concept } from '../../model/concept.js';
import { BehaviorSubject } from 'rxjs';

export const defaultMode: Mode = (
  [action, concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, BehaviorSubject<Concept[]>]
) => {
  const Axium = concepts[0].state as AxiumState;
  if (action.semaphore[2] !== -1 && action.semaphore[2] === Axium.generation) {
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
    const axiumState = concepts[0].state as AxiumState;
    axiumState.subConcepts$.next(concepts);
  } else {
    // console.log('DEFAULT TESTING 2', action.type, action.semaphore, AxiumState.generation);
    const nextAction = primeAction(concepts, action);
    if (nextAction.type === badAction.type) {
      const payload = {...action};
      nextAction.payload = payload;
    }
    if (nextAction.semaphore[2] === Axium.generation)
    {action$.next(nextAction);}
  }
};

// Note that Methods are altered during this Mode if the Axium is created in a Synchronous Context
//  Thus the Reducer needs to Run before the Method
export const blockingMode: Mode = (
  [action, concepts, action$, concepts$] : [Action, Concept[], Subject<Action>, BehaviorSubject<Concept[]>]
) => {
  const Axium = concepts[0].state as AxiumState;
  if (action.semaphore[2] !== -1 && action.semaphore[2] === Axium.generation) {
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
    if (nextAction.type === badAction.type) {
      const payload = {...action};
      nextAction.payload = payload;
    }
    if (nextAction.semaphore[2] === Axium.generation) {
      blockingMode([
        nextAction,
        concepts,
        action$,
        concepts$
      ]);
    }
  }
};