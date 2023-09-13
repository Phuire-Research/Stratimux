import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Mode, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { createPrinciple$ } from '../../../model/principle';
import { Action, ActionType, createAction } from '../../../model/action';
import { axiumBadActionType } from './badAction.quality';
import { createQuality } from '../../../model/concept';
import { blockingMethodSubscription } from '../../../model/axium';

export const axiumAddConceptFromQueType: ActionType = 'Add Concepts from Axium Concept Que';

export type AddConceptsFromQuePayload = {
    action$: Subject<Action>;
}

function addConceptsFromQueReducer(state: AxiumState, _ : Action) {
  const methodSubscribers = state.methodSubscribers;
  const addConceptsQue = state.addConceptQue;
  addConceptsQue.forEach(concept => {
    concept.qualities.forEach(quality => {
      if (quality.methodCreator) {
        [quality.method, quality.subject] = quality.methodCreator(state.subConcepts$);
        const methodSub = quality.method.subscribe((action: Action) => {
          const action$ = state.action$ as Subject<Action>;
          blockingMethodSubscription(action$, action);
        }) as Subscriber<Action>;
        methodSubscribers.push({key: concept.key, subscriber: methodSub});
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
  createDefaultMethodCreator
);
