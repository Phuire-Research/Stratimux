import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, defaultReducer } from '../../../model/concept';
import { Action } from '../../../model/action';
import { endOfActionStrategy, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { createAction } from '../../../model/action';
import { badAction } from './badAction.quality';
import { createQuality } from '../../../model/concept';

export const setDefaultMode: Action = createAction('Axium Set Default Mode');

export type SetDefaultModePayload = {
    concepts: Concept[]
}

const setDefaultModeSubject = new Subject<Action>();
const setDefaultModeMethod: Method = setDefaultModeSubject.pipe<Action>(
  map((action: Action) => {
    if (action.strategy) {
      return strategySuccess(action.strategy);
    }
    // console.log('Logging: ', action);
    return endOfActionStrategy;
  })
);
export function setDefaultModeReducer(state: AxiumState, _action: Action) {
  let methodSubscribers = state.methodSubscribers;
  methodSubscribers.forEach(keyed => keyed.subscriber.unsubscribe());
  methodSubscribers = [];
  const payload = _action.payload as SetDefaultModePayload;
  const concepts = payload.concepts;
  concepts.forEach(concept => {
    concept.qualities.forEach(quality => {
      if (quality.method) {
        const sub = quality.method.subscribe(action => {
          if (
            action.strategy &&
            action.type !== endOfActionStrategy.type &&
            action.type !== badAction.type
          ) {
            setTimeout(() => {
              state.action$?.next(action);
            }, 0);
          }
        });
        methodSubscribers.push({
          key: concept.key,
          subscriber: sub as Subscriber<Action>
        });
      }
    });
  });

  return {
    ...state,
    modeIndex: [1],
    methodSubscribers,
  };
}

export const setDefaultModeQuality = createQuality(
  setDefaultMode,
  setDefaultModeReducer,
  setDefaultModeMethod,
  setDefaultModeSubject
);
