/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will Add a value property from
the incoming action's payload
$>*/
/*<#*/
import { Action, act } from '../../../model/action';
import { quality } from '../../../model/quality';
import { select } from '../../../model/selector';
import { ExperimentPriorityState } from '../priority.concept';

export type ExperimentPriorityAddValuePayload = {
  newValue: number
};

export const [
  experimentPriorityAddValue,
  experimentPriorityAddValueType,
  experimentPriorityAddValueQuality
] = quality.createSetWithPayload<ExperimentPriorityAddValuePayload>({
  type: 'experimentPriority Add value',
  reducer: (state: ExperimentPriorityState, action: Action): ExperimentPriorityState => {
    const { newValue } = select.payLoad<ExperimentPriorityAddValuePayload>(action);
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