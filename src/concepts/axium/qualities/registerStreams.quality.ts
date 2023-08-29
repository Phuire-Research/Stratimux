import { BehaviorSubject, map, Subject } from 'rxjs';
import { Concept, Method, Quality, Reducer, defaultReducer } from '../../../model/concept';
import { Action } from '../../../model/action.js';
import { endOfActionStrategy, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const registerStreams: Action = createAction('Axium Register Streams');

export type RegisterStreamsPayload = {
    action$: Subject<Action>;
    concepts$: BehaviorSubject<Concept[]>;
}

const registerStreamsSubject = new Subject<Action>();
const registerStreamsMethod: Method = registerStreamsSubject.pipe<Action>(
  map((action: Action) => {
    if (action.strategy) {
      return strategySuccess(action.strategy);
    }
    console.log('Logging: ', action);
    return endOfActionStrategy;
  })
);
export function registerStreamsReducer(state: AxiumState, action: Action) {
  const payload = action.payload as RegisterStreamsPayload;
  return {
    ...state,
    action$: payload.action$,
    concepts$: payload.concepts$
  };
}

export const registerStreamsQuality = createQuality(
  registerStreams,
  registerStreamsReducer,
  registerStreamsMethod,
  registerStreamsSubject
);
