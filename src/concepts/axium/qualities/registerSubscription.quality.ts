/*<$
For the framework Stratimux and Axium Concept, generate a quality that will register a subscription to the concepts$ stream.
This allows for the clean closure of concepts that are removed or when the axium itself exits.
$>*/
/*<#*/
import { Subscription } from 'rxjs';
import { defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';

export type AxiumRegisterSubscriberPayload = {
    subscription: Subscription;
    name: string;
}
export const axiumRegisterSubscriberType: ActionType = 'register Subscriber to Axium\'s General Subscriber list';
export const axiumRegisterSubscriber =
  prepareActionWithPayloadCreator<AxiumRegisterSubscriberPayload>(axiumRegisterSubscriberType);

function axiumRegisterSubscriberReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<AxiumRegisterSubscriberPayload>(action);
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
  axiumRegisterSubscriberReducer,
  defaultMethodCreator
);
/*#>*/