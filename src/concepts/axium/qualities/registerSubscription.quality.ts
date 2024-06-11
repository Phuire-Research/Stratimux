/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will register a subscription to the concepts$ stream.
This allows for the clean closure of concepts that are removed or when the axium itself exits.
$>*/
/*<#*/
import { Subscription } from 'rxjs';
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualityCardWithPayload } from '../../../model/quality';
import { AxiumRegisterSubscriberPayload } from '.';

export const axiumRegisterSubscriber = createQualityCardWithPayload<AxiumState<unknown, unknown>, AxiumRegisterSubscriberPayload>({
  type: 'register Subscriber to Axium\'s General Subscriber list',
  reducer: (state, action) => {
    const payload = action.payload;
    const generalSubscribers = state.generalSubscribers;
    const subscription = payload.subscription;
    const name = payload.name;
    generalSubscribers.push({name, subscription});
    return {
      generalSubscribers,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/