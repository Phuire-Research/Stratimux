/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality similar to muxium kick, except this is used when the Muxium is
currently in blocking mode. This allows for subscribers to be notified of any new configurations if set.
Or simply that the muxium is ready to receive actions.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { OpenPayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumOpen = createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, OpenPayload>({
  type: 'Open Muxium',
  reducer: (_, action) => {
    const {open} = action.payload;
    return {
      open
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/