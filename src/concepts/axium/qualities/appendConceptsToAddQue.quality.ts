import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { Action, ActionType, createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const axiumAppendConceptsToAddQueType: ActionType = 'Axium append Concepts to Add Concept Que';

export type AppendConceptsToAddQuePayload = {
    concepts: Concept[]
}

export function appendConceptsToAddQueReducer(state: AxiumState, action: Action) {
  const payload = action.payload as AppendConceptsToAddQuePayload;
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
  createDefaultMethodCreator
);