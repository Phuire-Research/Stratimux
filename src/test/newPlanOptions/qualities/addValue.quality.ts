/*<$
For the graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will Add a value property from
the incoming action's payload
$>*/
/*<#*/
import { Action, act } from '../../../model/action';
import { concept } from '../../../model/concept';
import { select } from '../../../model/selector';
import { ExperimentPlanOptionsState } from '../newPlanOptions.concept';

export const experimentPlanOptionsAddValueType = 'experimentPlanOptions Add value';

export type ExperimentPlanOptionsAddValuePayload = {
  newValue: number
};

export const experimentPlanOptionsAddValue =
  act.prepareActionWithPayloadCreator<ExperimentPlanOptionsAddValuePayload>(experimentPlanOptionsAddValueType);

function experimentPlanOptionsAddValueReducer(state: ExperimentPlanOptionsState, action: Action): ExperimentPlanOptionsState {
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
}

export const experimentPlanOptionsAddValueQuality = concept.createQuality(
  experimentPlanOptionsAddValueType,
  experimentPlanOptionsAddValueReducer,
);
/*#>*/