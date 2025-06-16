/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate the two default modes required for the Muxium to function.
$>*/
/*<#*/
import { Subject } from 'rxjs';
import { ActionDeck, Concepts, Mode } from '../../model/concept/concept.type';
import { primeAction } from '../../model/action/action';
import { MuxiumDeck, MuxiumState } from './muxium.concept';
import { MuxifiedSubject } from '../../model/stagePlanner/stagePlanner';
import { getMuxiumState } from '../../model/muxium/muxiumHelpers';
import { MuxiumBadActionPayload } from './qualities';
import { updateAtomicSelects } from '../../model/selector/selectorAdvanced';
import { accessDeck, Deck } from '../../model/deck';
import { Action, AnyAction } from '../../model/action/action.type';

export const isActionable = (muxiumState: MuxiumState<any, any>, action: Action): boolean => {
  let actionable = true;
  // We are logically determining these semaphore values by hand for now.
  if (
    // Logical Determination: muxiumConcludeType
    action.semaphore[3] === 3) {
    actionable = false;
  }
  return actionable;
};

export const permissiveMode: Mode = (
  [action, concepts, action$, concepts$] : [Action, Concepts, Subject<Action>, MuxifiedSubject]
) => {
  const muxiumState = getMuxiumState(concepts);
  if (isActionable(muxiumState, action)) {
    // Logical Determination: muxiumSetBlockingModeType
    if (action.semaphore[3] !== 4) {
      // const deck = (muxiumState.deck.d as any)[concepts[action.semaphore[0]].name] ?
      //   (muxiumState.deck.d as any)[concepts[action.semaphore[0]].name].d as Deck<void>
      //   :
      //   (muxiumState.deck.d as any) as Deck<void>;
      const deck = (concepts[action.semaphore[0]].deck.d) as Deck<void>;
      if (action.semaphore[2] === muxiumState.generation && action.expiration > Date.now()) {
        const self = concepts[action.semaphore[0]].qualities[action.semaphore[1]].actionCreator;
        let subject: Subject<ActionDeck>;
        if (concepts[action.semaphore[0]].qualities[action.semaphore[1]].method) {
          subject = concepts[action.semaphore[0]].qualities[action.semaphore[1]].subject as Subject<ActionDeck>;
          subject.next({action, deck, self});
        }
        const reduce = concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer;
        const state = {...concepts[action.semaphore[0]].state};
        const newState = reduce(state, action, deck);
        if (newState !== null) {
          const newConcepts = {...concepts};
          const newConcept = {...newConcepts[action.semaphore[0]]};
          newConcepts[action.semaphore[0]] = newConcept;
          newConcepts[action.semaphore[0]].state = {
            ...newConcepts[action.semaphore[0]].state,
            ...newState
          };
          const ks = updateAtomicSelects(newConcepts, newConcept.keyedSelectors, newState, action);
          muxiumState.actionConcepts$.next(newConcepts);
          concepts$.next(newConcepts, ks);
        }
      } else {
        const nextAction = primeAction(concepts, action) as AnyAction;
        // Logical Determination: muxiumBadActionType
        if (nextAction.semaphore[3] === 1) {
          const payload: MuxiumBadActionPayload = {badActions: [action]};
          nextAction.payload = payload;
        }
        if (nextAction.semaphore[2] === muxiumState.generation) {
          action$.next(nextAction);
        }
      }
    } else {
      blockingMode([action, concepts, action$, concepts$]);
    }
  } else if (action.semaphore[3] !== 3) {
    const badAction = accessDeck<MuxiumDeck>(concepts).muxium.e.muxiumBadAction({
      badActions: [
        action
      ]
    });
    action$.next(badAction as unknown as Action);
  }
};

// Note that Methods are altered during this Mode if the Muxium is created in a Synchronous Context
//  Thus the Reducer needs to Run before the Method
export const blockingMode: Mode = (
  [action, concepts, action$, concepts$] : [Action, Concepts, Subject<Action>, MuxifiedSubject]
) => {
  const muxiumState = getMuxiumState(concepts);
  if (isActionable(muxiumState, action)) {
    if (action.semaphore[2] === muxiumState.generation && action.expiration > Date.now()) {
      const reduce = concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer;
      const state = {...concepts[action.semaphore[0]].state};
      // const deck = (muxiumState.deck.d as any)[concepts[action.semaphore[0]].name] ?
      //   (muxiumState.deck.d as any)[concepts[action.semaphore[0]].name].d as Deck<void>
      //   :
      //   (muxiumState.deck.d as any) as Deck<void>;
      const deck = (concepts[action.semaphore[0]].deck.d as any) as Deck<void>;

      const self = concepts[action.semaphore[0]].qualities[action.semaphore[1]].actionCreator;
      const newState = reduce(state, action, deck);
      if (newState !== null) {
        const newConcepts = {...concepts};
        const newConcept = {...newConcepts[action.semaphore[0]]};
        newConcepts[action.semaphore[0]] = newConcept;
        newConcepts[action.semaphore[0]].state = {
          ...newConcepts[action.semaphore[0]].state,
          ...newState
        };
        const ks = updateAtomicSelects(newConcepts, newConcept.keyedSelectors, newState, action);
        muxiumState.actionConcepts$.next(newConcepts);
        muxiumState.concepts$.nextBlocking(newConcepts, ks);
      }
      let subject: Subject<ActionDeck>;
      if (concepts[action.semaphore[0]].qualities[action.semaphore[1]].method) {
        subject = concepts[action.semaphore[0]].qualities[action.semaphore[1]].subject as Subject<ActionDeck>;
        subject.next({action, deck, self});
      }
    } else {
      const nextAction = primeAction(concepts, action) as AnyAction;
      // Logical Determination: muxiumBadActionType
      if (nextAction.semaphore[3] === 1) {
        const payload = {...action};
        nextAction.payload = payload;
      }
      if (nextAction.semaphore[2] === muxiumState.generation) {
        blockingMode([
          nextAction,
          concepts,
          action$,
          concepts$
        ]);
      }
    }
  } else if (action.semaphore[3] !== 3) {
    const badAction = accessDeck<MuxiumDeck>(concepts).muxium.e.muxiumBadAction({
      badActions: [
        action
      ]
    });
    action$.next(badAction as unknown as Action);
  }
};
/*#>*/