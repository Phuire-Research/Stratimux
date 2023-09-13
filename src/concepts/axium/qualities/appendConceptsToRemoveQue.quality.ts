import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { Action, ActionType, createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const axiumAppendConceptsToRemoveQueType: ActionType = 'append Concepts to Axium\'s Remove Concept Que';

export type AppendConceptsToRemoveQuePayload = {
    concepts: Concept[]
}

export function appendConceptsToRemoveQueReducer(state: AxiumState, action: Action) {
  const payload = action.payload as AppendConceptsToRemoveQuePayload;
  let removeQue = state.removeConceptQue;
  removeQue = [
    ...removeQue,
    ...payload.concepts
  ];
  return {
    ...state,
    removeConceptQue: removeQue
  };
}

export const appendConceptsToRemoveQueQuality = createQuality(
  axiumAppendConceptsToRemoveQueType,
  appendConceptsToRemoveQueReducer,
  createDefaultMethodCreator
);
