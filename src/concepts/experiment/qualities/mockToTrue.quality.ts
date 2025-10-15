/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will set mock to true.
$>*/
/*<#*/
import { defaultMethodCreator, Quality } from '../../../model/quality';
import { ExperimentState } from '../experiment.concept';
import { createQualityCard } from '../../../model/quality';

export type ExperimentMockToTrue = Quality<ExperimentState>;
export const experimentMockToTrue = createQualityCard<ExperimentState>({
  type: 'Experiment Mock To True',
  reducer: (state) => {
    return {
      mock: true
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/