import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action } from '../../../model/action';
import { endOfActionStrategy, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const registerSubscriber: Action = createAction('Axium Register Subscriber');

export type RegisterSubscriberPayload = {
    subscriber: Subscriber<Action>;
    key: string;
}

export function registerSubscriberReducer(state: AxiumState, action: Action) {
  const payload = action.payload as RegisterSubscriberPayload;
  const generalSubscribers = state.generalSubscribers;
  const subscriber = payload.subscriber;
  const key = payload.key;
  generalSubscribers.push({key, subscriber});
  return {
    ...state,
    generalSubscribers,
  };
}

export const registerSubscriberQuality = createQuality(
  registerSubscriber,
  registerSubscriberReducer,
  createDefaultMethodCreator
);
