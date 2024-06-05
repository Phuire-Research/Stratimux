/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality set a five property to true
$>*/
/*<#*/
import { quality } from '../../../model/quality';
import { ExperimentPlanOptionsState } from '../newPlanOptions.concept';

export const [
  experimentToggleAllSeven,
  experimentToggleAllSevenType,
  experimentToggleAllSevenQuality
] = quality.createSet<ExperimentPlanOptionsState>({
  type: 'experimentPriority Add value',
  reducer: (state) => ({
    ...state,
    one: !state.one,
    two: !state.two,
    three: !state.three,
    four: !state.four,
    five: !state.five,
    six: !state.six,
    seven: !state.seven
  }),
});
/*#>*/