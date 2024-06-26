/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will register a subscription to the concepts$ stream.
This allows for the clean closure of concepts that are removed or when the axium itself exits.
$>*/
/*<#*/
import { Subscription } from 'rxjs';
import { defaultMethodCreator } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type AxiumRegisterSubscriberPayload = {
    subscription: Subscription;
    name: string;
}

export const [
  axiumRegisterSubscriber,
  axiumRegisterSubscriberType,
  axiumRegisterSubscriberQuality
] = createQualitySetWithPayload<AxiumRegisterSubscriberPayload>({
  type: 'register Subscriber to Axium\'s General Subscriber list',
  reducer: (state: AxiumState, action) => {
    const payload = selectPayload<AxiumRegisterSubscriberPayload>(action);
    const generalSubscribers = state.generalSubscribers;
    const subscription = payload.subscription;
    const name = payload.name;
    generalSubscribers.push({name, subscription});
    return {
      ...state,
      generalSubscribers,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/