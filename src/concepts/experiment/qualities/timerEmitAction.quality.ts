/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will asynchronously dispatch the next
action in the incoming strategy via an inner timer.
$>*/
/*<#*/
import { MethodCreator, defaultReducer, nullReducer } from '../../../model/concept';
import { prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { createAsyncMethod } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { axiumConclude } from '../../axium/qualities/conclude.quality';

export const experimentTimerEmitActionType = 'Experiment create async method with timer, to return action';
export const experimentTimerEmitAction = prepareActionCreator(experimentTimerEmitActionType);

export const experimentTimerEmitActionMethodCreator: MethodCreator = () => createAsyncMethod((controller, action) => {
  setTimeout(() => {
    if (action.strategy) {
      controller.fire(strategySuccess(action.strategy));
    } else {
      controller.fire(axiumConclude());
    }
  }, 50);
});

export const timerEmitActionQuality = createQuality(
  experimentTimerEmitActionType,
  nullReducer,
  experimentTimerEmitActionMethodCreator
);
/*#>*/