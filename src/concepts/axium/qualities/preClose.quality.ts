/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will trigger the axium's closing process via
its close principle that is observing the prepareClose state property.
$>*/
/*<#*/
import { AxiumState } from '../axium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { AxiumPreClosePayload } from '.';
import { LoadConcepts } from '../../../model/concept';

export const axiumPreClose = createQualityCardWithPayload<AxiumState<unknown, LoadConcepts>, AxiumPreClosePayload>({
  type: 'Prepare Close Axium',
  reducer: (state, action) => ({
    prepareClose: true,
    exit: action.payload.exit
  })
});
/*#>*/