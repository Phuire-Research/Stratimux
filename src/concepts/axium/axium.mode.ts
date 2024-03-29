/*<$
For the graph programming framework Stratimux and Axium Concept, generate the two default modes required for the Axium to function.
$>*/
/*<#*/
import { Subject } from 'rxjs';
import { Concepts, Mode } from '../../model/concept';
import { Action, primeAction } from '../../model/action';
import { AxiumState } from './axium.concept';
import { UnifiedSubject } from '../../model/stagePlanner';
import { AxiumBadActionPayload } from './qualities/badAction.quality';

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
  [action, concepts, action$, concepts$] : [Action, Concepts, Subject<Action>, UnifiedSubject]
) => {
  const axiumState = concepts[0].state as AxiumState;
  if (isActionable(axiumState, action)) {
    // Logical Determination: axiumSetBlockingModeType
    if (action.semaphore[3] !== 4) {
      if (action.semaphore[2] === axiumState.generation && action.expiration > Date.now()) {
        let subject: Subject<Action>;
        if (concepts[action.semaphore[0]].qualities[action.semaphore[1]].method) {
          subject = concepts[action.semaphore[0]].qualities[action.semaphore[1]].subject as Subject<Action>;
          subject.next(action);
        }
        const reduce = concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer;
        const state = {...concepts[action.semaphore[0]].state};
        const newState = reduce(state, action);
        if (newState !== null) {
          const newConcepts = {...concepts};
          const newConcept = {...newConcepts[action.semaphore[0]]};
          newConcepts[action.semaphore[0]] = newConcept;
          newConcepts[action.semaphore[0]].state = newState;

          concepts$.next(newConcepts);
        }
      } else {
        const nextAction = primeAction(concepts, action);
        // Logical Determination: axiumBadActionType
        if (nextAction.semaphore[3] === 1) {
          const payload: AxiumBadActionPayload = {badActions: [action]};
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
  [action, concepts, action$, concepts$] : [Action, Concepts, Subject<Action>, UnifiedSubject]
) => {
  const axiumState = concepts[0].state as AxiumState;
  if (isActionable(axiumState, action)) {
    if (action.semaphore[2] === axiumState.generation && action.expiration > Date.now()) {
      const reduce = concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer;
      const state = {...concepts[action.semaphore[0]].state};
      const newState = reduce(state, action);
      if (newState !== null) {
        const newConcepts = {...concepts};
        const newConcept = {...newConcepts[action.semaphore[0]]};
        newConcepts[action.semaphore[0]] = newConcept;
        newConcepts[action.semaphore[0]].state = newState;
        axiumState.concepts$.nextBlocking(newConcepts);
      }
      let subject: Subject<Action>;
      if (concepts[action.semaphore[0]].qualities[action.semaphore[1]].method) {
        subject = concepts[action.semaphore[0]].qualities[action.semaphore[1]].subject as Subject<Action>;
        // if (action.strategy?.topic === 'Counting Strategy') {
        //   console.log('Method Subject', action);
        // }
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
/*#>*/