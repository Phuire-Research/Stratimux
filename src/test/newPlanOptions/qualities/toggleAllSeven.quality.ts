/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality set a five property to true
$>*/
/*<#*/
import { Quality, quality } from '../../../model/quality';
import { ExperimentPlanOptionsState } from '../newPlanOptions.concept';

export type ExperimentToggleAllSeven = Quality<ExperimentPlanOptionsState>;
export const experimentToggleAllSeven = quality.create<ExperimentPlanOptionsState>({
  type: 'experimentPriority Add value',
  reducer: (state) => ({
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