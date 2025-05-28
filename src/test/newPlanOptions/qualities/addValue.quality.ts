/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will Add a value property from
the incoming action's payload
$>*/
/*<#*/
import { Quality, quality } from '../../../model/quality';
import { ExperimentPlanOptionsState } from '../newPlanOptions.concept';

export type ExperimentPlanOptionsAddValuePayload = {
  newValue: number
};
export type ExperimentPlanOptionsAddValue =
  Quality<ExperimentPlanOptionsState, ExperimentPlanOptionsAddValuePayload>;
export const experimentPlanOptionsAddValue =
  quality.createWithPayload<ExperimentPlanOptionsState, ExperimentPlanOptionsAddValuePayload>({
    type: 'experimentPlanOptions Add value',
    reducer: (state, action) => {
      const { newValue } = action.payload;
      if (newValue) {
        return {
          value: newValue + state.value
        };
      }
      return {
      };
    },
  });
/*#>*/