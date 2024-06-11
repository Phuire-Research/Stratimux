/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will set mock to true.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { ExperimentState } from '../experiment.concept';
import { createQualityCard } from '../../../model/quality';

export const experimentMockToTrue = createQualityCard<ExperimentState>({
  type: 'Experiment mock set to True',
  reducer: (state) => {
    return {
      mock: true
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/