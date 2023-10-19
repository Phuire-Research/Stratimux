import { MethodCreator, defaultReducer } from '../../../model/concept';
import { prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { createAsyncMethodWithConcepts } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { axiumConclude } from '../../axium/qualities/conclude.quality';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { selectState } from '../../../model/selector';
import { ExperimentState, experimentName } from '../experiment.concept';

export const experimentTimerEmitActionWithConceptsType = 'Experiment create async method with timer and concepts, to return action';
export const experimentTimerEmitActionWithConcepts = prepareActionCreator(experimentTimerEmitActionWithConceptsType);

export const experimentTimerEmitActionWithConceptsMethodCreator: MethodCreator = (concepts$?: UnifiedSubject) =>
  createAsyncMethodWithConcepts((controller, action, concepts) => {
    setTimeout(() => {
      if (action.strategy) {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        const data = strategyData_unifyData(action.strategy, { mock: experimentState.mock });
        controller.fire(strategySuccess(action.strategy, data));
      } else {
        controller.fire(axiumConclude());
      }
    }, 500);
  }, concepts$ as UnifiedSubject);

export const timerEmitActionWithConceptsQuality = createQuality(
  experimentTimerEmitActionWithConceptsType,
  defaultReducer,
  experimentTimerEmitActionWithConceptsMethodCreator
);
