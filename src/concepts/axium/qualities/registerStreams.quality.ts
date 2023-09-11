import { BehaviorSubject, map, Subject } from 'rxjs';
import { Concept, Method, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action.js';
import { strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const axiumRegisterStreamsType: ActionType = 'Axium Register Streams';

export type RegisterStreamsPayload = {
    action$: Subject<Action>;
    concepts$: BehaviorSubject<Concept[]>;
}

export function registerStreamsReducer(state: AxiumState, action: Action) {
  const payload = action.payload as RegisterStreamsPayload;
  return {
    ...state,
    action$: payload.action$,
    concepts$: payload.concepts$
  };
}

export const registerStreamsQuality = createQuality(
  axiumRegisterStreamsType,
  registerStreamsReducer,
  createDefaultMethodCreator
);
