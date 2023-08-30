import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { endOfActionStrategy, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { Action, createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const appendConceptsToAddQue: Action =
    createAction('Axium append Concepts to Add Concept Que');

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
  appendConceptsToAddQue,
  appendConceptsToAddQueReducer,
  createDefaultMethodCreator
);