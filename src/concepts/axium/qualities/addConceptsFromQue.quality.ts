import { Observable, Subject, Subscriber, catchError } from 'rxjs';
import { defaultMethodCreator, qualityToString } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { blockingMethodSubscription } from '../../../model/axium';

export const axiumAddConceptFromQueType: ActionType = 'Add Concepts from Axium Concept Que';
export const axiumAddConceptFromQue = prepareActionCreator(axiumAddConceptFromQueType);

function addConceptsFromQueReducer(state: AxiumState, action: Action) {
  const methodSubscribers = state.methodSubscribers;
  const addConceptsQue = state.addConceptQue;
  addConceptsQue.forEach((concept, index) => {
    concept.qualities.forEach(quality => {
      if (quality.methodCreator) {
        [quality.method, quality.subject] = quality.methodCreator(state.concepts$, concept.semaphore);
        quality.method.pipe(
          catchError((err: unknown, caught: Observable<Action>) => {
            if (state.logging) {
              console.error('METHOD ERROR', err);
            }
            return caught;
          }));
        quality.toString = qualityToString(quality);
        const methodSub = quality.method.subscribe((act: Action) => {
          const action$ = state.action$ as Subject<Action>;
          blockingMethodSubscription(action$, act);
        }) as Subscriber<Action>;
        methodSubscribers.push({name: concept.name, subscription: methodSub});
      }
    });
  });

  return {
    ...state,
    methodSubscribers,
    addConceptQue: []
  };
}

export const axiumAddConceptsFromQueQuality = createQuality(
  axiumAddConceptFromQueType,
  addConceptsFromQueReducer,
  defaultMethodCreator
);
