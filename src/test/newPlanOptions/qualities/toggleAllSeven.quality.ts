/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality set a five property to true
$>*/
/*<#*/
import { Action, act } from '../../../model/action';
import { quality } from '../../../model/quality';
import { ExperimentPlanOptionsState } from '../newPlanOptions.concept';

export const experimentToggleAllSevenType = 'experimentPriority Add value';

export const experimentToggleAllSeven = act.prepareActionCreator(experimentToggleAllSevenType);

function experimentToggleAllSevenReducer(state: ExperimentPlanOptionsState, action: Action): ExperimentPlanOptionsState {
  return {
    ...state,
    one: !state.one,
    two: !state.two,
    three: !state.three,
    four: !state.four,
    five: !state.five,
    six: !state.six,
    seven: !state.seven
  };
}

export const experimentToggleAllSevenQuality = quality.create(
  experimentToggleAllSevenType,
  experimentToggleAllSevenReducer,
);
/*#>*/