import { Subscriber, Subscription } from 'rxjs';
import { defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';

export type RegisterSubscriberPayload = {
    subscription: Subscription;
    name: string;
}
export const axiumRegisterSubscriberType: ActionType = 'register Subscriber to Axium\'s General Subscriber list';
export const axiumRegisterSubscriber =
  prepareActionWithPayloadCreator<RegisterSubscriberPayload>(axiumRegisterSubscriberType);

export function registerSubscriberReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<RegisterSubscriberPayload>(action);
  const generalSubscribers = state.generalSubscribers;
  const subscription = payload.subscription;
  const name = payload.name;
  generalSubscribers.push({name, subscription});
  return {
    ...state,
    generalSubscribers,
  };
}

export const axiumRegisterSubscriberQuality = createQuality(
  axiumRegisterSubscriberType,
  registerSubscriberReducer,
  defaultMethodCreator
);
