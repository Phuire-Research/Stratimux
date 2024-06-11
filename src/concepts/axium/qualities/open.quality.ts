/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality similar to axium kick, except this is used when the Axium is
currently in blocking mode. This allows for subscribers to be notified of any new configurations if set.
Or simply that the axium is ready to receive actions.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { OpenPayload } from '.';

export const axiumOpen = createQualityCardWithPayload<AxiumState<unknown, unknown>, OpenPayload>({
  type: 'Open Axium',
  reducer: (_, action) => {
    const {open} = action.payload;
    return {
      open
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/