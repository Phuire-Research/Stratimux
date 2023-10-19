import { MethodCreator, defaultReducer } from '../../../model/concept';
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
  }, 500);
});

export const timerEmitActionQuality = createQuality(
  experimentTimerEmitActionType,
  defaultReducer,
  experimentTimerEmitActionMethodCreator
);
