/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will Add a value property from
the incoming action's payload
$>*/
/*<#*/
import { Quality, quality } from '../../../model/quality';
import { ExperimentPriorityState } from '../priority.concept';

export type ExperimentPriorityAddValuePayload = {
  newValue: number
};

export type ExperimentPriorityAddValue = Quality<ExperimentPriorityState, ExperimentPriorityAddValuePayload>;
export const experimentPriorityAddValue = quality.createWithPayload<ExperimentPriorityState, ExperimentPriorityAddValuePayload>({
  type: 'experimentPriority Add value',
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