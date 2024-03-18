/*<$
For the graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will set a value property to
the incoming action's payload
$>*/
/*<#*/
import { Action, act } from '../../../model/action';
import { concept } from '../../../model/concept';
import { select } from '../../../model/selector';
import { ExperimentPriorityState } from '../priority.concept';

export const experimentPrioritySetValueType = 'experimentPriority set value';

export type ExperimentPrioritySetValuePayload = {
  newValue: number
};

export const experimentPrioritySetValue =
  act.prepareActionWithPayloadCreator<ExperimentPrioritySetValuePayload>(experimentPrioritySetValueType);

function experimentPrioritySetValueReducer(state: ExperimentPriorityState, action: Action): ExperimentPriorityState {
  const { newValue } = select.payLoad<ExperimentPrioritySetValuePayload>(action);
  if (newValue) {
    return {
      ...state,
      value: newValue
    };
  }
  return {
    ...state,
  };
}

export const experimentPrioritySetValueQuality = concept.createQuality(
  experimentPrioritySetValueType,
  experimentPrioritySetValueReducer,
);
/*#>*/