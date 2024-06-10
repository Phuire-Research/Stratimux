/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will Add a value property from
the incoming action's payload
$>*/
/*<#*/
import { ExperimentState } from '../../../concepts/experiment/experiment.concept';
import { Action } from '../../../model/action';
import { quality } from '../../../model/quality';
import { select } from '../../../model/selector';
import { ExperimentPlanOptionsState } from '../newPlanOptions.concept';

export type ExperimentPlanOptionsAddValuePayload = {
  newValue: number
};

export const experimentPlanOptionsAddValue =
  quality.createWithPayload<ExperimentPlanOptionsState, ExperimentPlanOptionsAddValuePayload>({
    type: 'experimentPlanOptions Add value',
    reducer: (state, action) => {
      const { newValue } = action.payload;
      if (newValue) {
        return {
          ...state,
          value: newValue + state.value
        };
      }
      return {
        ...state,
      };
    },
  });
/*#>*/