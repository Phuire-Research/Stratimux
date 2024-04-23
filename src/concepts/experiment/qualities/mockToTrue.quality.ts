/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will set mock to true.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  experimentMockToTrue,
  experimentMockToTrueType,
  experimentMockToTrueQuality,
] = createQualitySet({
  type: 'Experiment mock set to True',
  reducer: (state: ExperimentState) => {
    return {
      ...state,
      mock: true
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/