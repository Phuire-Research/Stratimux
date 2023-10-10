import { Concept, defaultMethodCreator } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { Action, ActionType } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';

export const axiumAppendConceptsToAddQueType: ActionType = 'append Concepts to Axium\'s Add Concept Que';

export type AppendConceptsToAddQuePayload = {
    concepts: Concept[]
}

export function appendConceptsToAddQueReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<AppendConceptsToAddQuePayload>(action);
  const addConceptQue = [
    ...payload.concepts
  ];
  return {
    ...state,
    addConceptQue,
  };
}

export const appendConceptsToAddQueQuality = createQuality(
  axiumAppendConceptsToAddQueType,
  appendConceptsToAddQueReducer,
  defaultMethodCreator
);