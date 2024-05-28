/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will Add a value property from
the incoming action's payload
$>*/
/*<#*/
import { Action } from '../../../model/action';
import { quality } from '../../../model/quality';
import { select } from '../../../model/selector';
import { ExperimentPlanOptionsState } from '../newPlanOptions.concept';

export type ExperimentPlanOptionsAddValuePayload = {
  newValue: number
};

export const [
  experimentPlanOptionsAddValue,
  experimentPlanOptionsAddValueType,
  experimentPlanOptionsAddValueQuality
] = quality.createSetWithPayload<ExperimentPlanOptionsAddValuePayload>({
  type: 'experimentPlanOptions Add value',
  reducer: (state: ExperimentPlanOptionsState, action: Action) => {
    const { newValue } = select.payLoad<ExperimentPlanOptionsAddValuePayload>(action);
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