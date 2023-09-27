import { Subscriber } from 'rxjs';
import { defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';

export const axiumRegisterSubscriberType: ActionType = 'register Subscriber to Axium\'s General Subscriber list';

export type RegisterSubscriberPayload = {
    subscriber: Subscriber<Action>;
    name: string;
}

export function registerSubscriberReducer(state: AxiumState, action: Action) {
  const payload = action.payload as RegisterSubscriberPayload;
  const generalSubscribers = state.generalSubscribers;
  const subscriber = payload.subscriber;
  const name = payload.name;
  generalSubscribers.push({name, subscriber});
  return {
    ...state,
    generalSubscribers,
  };
}

export const registerSubscriberQuality = createQuality(
  axiumRegisterSubscriberType,
  registerSubscriberReducer,
  defaultMethodCreator
);
