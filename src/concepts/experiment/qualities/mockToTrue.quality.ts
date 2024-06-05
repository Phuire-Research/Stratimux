/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will set mock to true.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { ExperimentState } from '../experiment.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  experimentMockToTrue,
  experimentMockToTrueType,
  experimentMockToTrueQuality,
] = createQualitySet<ExperimentState>({
  type: 'Experiment mock set to True',
  reducer: (state) => {
    return {
      ...state,
      mock: true
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/