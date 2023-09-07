import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Mode, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { endOfActionStrategyType, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { createPrinciple$ } from '../../../model/principle';
import { Action, ActionType, createAction } from '../../../model/action';
import { axiumBadActionType } from './badAction.quality';
import { createQuality } from '../../../model/concept';

export const axiumAddConceptFromQueType: ActionType = 'Axium Append Concepts to Add Concept Que';

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
          console.log('Hitting');
          if (
            action.strategy &&
            action.type !== endOfActionStrategyType &&
            action.type !== axiumBadActionType
          ) {
            // Allows for reducer next in sequence
            if (state.action$) {
              state?.action$.next(action);
            }
          }
        }) as Subscriber<Action>;
        methodSubscribers.push({key: concept.key, subscriber: methodSub});
      }
    });
  });

  return {
    ...state,
    // generation: state.generation + 1,
    methodSubscribers,
    addConceptQue: []
  };
}

export const addConceptsFromQueQuality = createQuality(
  axiumAddConceptFromQueType,
  addConceptsFromQueReducer,
  createDefaultMethodCreator
);
