import { Concept, defaultMethodCreator } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';

export type AppendConceptsToRemoveQuePayload = {
    concepts: Concept[]
}
export const axiumAppendConceptsToRemoveQueType: ActionType = 'append Concepts to Axium\'s Remove Concept Que';
export const axiumAppendConceptsToRemoveQue =
  prepareActionWithPayloadCreator<AppendConceptsToRemoveQuePayload>(axiumAppendConceptsToRemoveQueType);

export function appendConceptsToRemoveQueReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<AppendConceptsToRemoveQuePayload>(action);
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

export const axiumAppendConceptsToRemoveQueQuality = createQuality(
  axiumAppendConceptsToRemoveQueType,
  appendConceptsToRemoveQueReducer,
  defaultMethodCreator
);
