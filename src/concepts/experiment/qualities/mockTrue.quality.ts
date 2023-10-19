import { defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';

export const experimentMockTrueType = 'Experiment mock set to True';

export const experimentMockTrue = prepareActionCreator(experimentMockTrueType);

export function checkInStrategyReducer(state: ExperimentState, action: Action): ExperimentState {
  return {
    ...state,
    mock: true
  };
}

export const mockToTrueQuality = createQuality(
  experimentMockTrueType,
  checkInStrategyReducer,
  defaultMethodCreator
);
