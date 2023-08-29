import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, defaultReducer } from '../../../model/concept';
import { endOfActionStrategy, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { Action, createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const appendConceptsToRemoveQue: Action =
    createAction('Axium append Concepts to Remove Concept Que');

export type AppendConceptsToRemoveQuePayload = {
    concepts: Concept[]
}

const appendConceptsToRemoveQueSubject = new Subject<Action>();
const appendConceptsToRemoveQueMethod: Method = appendConceptsToRemoveQueSubject.pipe<Action>(
  map((action: Action) => {
    if (action.strategy) {
      return strategySuccess(action.strategy);
    }
    return endOfActionStrategy;
  })
);
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
  appendConceptsToRemoveQue,
  appendConceptsToRemoveQueReducer,
  appendConceptsToRemoveQueMethod,
  appendConceptsToRemoveQueSubject
);
