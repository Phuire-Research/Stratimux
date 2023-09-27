import { Concept, defaultMethodCreator } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { Action, ActionType } from '../../../model/action';
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
  defaultMethodCreator
);
