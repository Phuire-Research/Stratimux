/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will asynchronously dispatch the next
action in the incoming strategy via an inner timer.
$>*/
/*<#*/
import { nullReducer } from '../../../model/quality';
import { createAsyncMethod } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { axiumConclude } from '../../axium/qualities/conclude.quality';
import { createQualityCard } from '../../../model/quality';

export const experimentTimerEmitAction = createQualityCard({
  type: 'Experiment create async method with timer, to return action',
  reducer: nullReducer,
  methodCreator: () => createAsyncMethod((controller, action) => {
    setTimeout(() => {
      if (action.strategy) {
        controller.fire(strategySuccess(action.strategy));
      } else {
        controller.fire(axiumConclude());
      }
    }, 50);
  })
});
/*#>*/