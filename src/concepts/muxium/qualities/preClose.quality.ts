/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a quality that will trigger the muxium's closing process via
its close principle that is observing the prepareClose state property.
$>*/
/*<#*/
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { MuxiumPreClosePayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumPreClose = createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumPreClosePayload>({
  type: 'Muxium Pre Close',
  reducer: (state, action) => ({
    prepareClose: true,
    exit: action.payload.exit
  })
});
/*#>*/