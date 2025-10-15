/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will register a subscription to the concepts$ stream.
This allows for the clean closure of concepts that are removed or when the muxium itself exits.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { MuxiumRegisterSubscriberPayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumRegisterSubscriber = createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumRegisterSubscriberPayload>({
  type: 'Muxium Register Subscriber',
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