import { Observable, Subject, Subscriber, catchError } from 'rxjs';
import { defaultMethodCreator } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { blockingMethodSubscription } from '../../../model/axium';

export const axiumAddConceptFromQueType: ActionType = 'Add Concepts from Axium Concept Que';
export const axiumAddConceptFromQue = prepareActionCreator(axiumAddConceptFromQueType);

function addConceptsFromQueReducer(state: AxiumState, _ : Action) {
  const methodSubscribers = state.methodSubscribers;
  const addConceptsQue = state.addConceptQue;
  addConceptsQue.forEach(concept => {
    concept.qualities.forEach(quality => {
      if (quality.methodCreator) {
        [quality.method, quality.subject] = quality.methodCreator(state.subConcepts$);
        quality.method.pipe(
          catchError((err: unknown, caught: Observable<Action>) => {
            if (state.logging) {
              console.error('METHOD ERROR', err);
            }
            return caught;
          }));
        const methodSub = quality.method.subscribe((action: Action) => {
          const action$ = state.action$ as Subject<Action>;
          blockingMethodSubscription(action$, action);
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

export const addConceptsFromQueQuality = createQuality(
  axiumAddConceptFromQueType,
  addConceptsFromQueReducer,
  defaultMethodCreator
);
