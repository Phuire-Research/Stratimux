import { createExperimentConcept } from '../../concepts/experiment/experiment.concept';
import { experimentPlanOptionsAddValueQuality } from './qualities/addValue.quality';
import { experimentPlanOptionsIsReadyQuality } from './qualities/isReady.quality';
import { experimentToggleAllSevenQuality } from './qualities/toggleAllSeven.quality';

export type ExperimentPlanOptionsState = {
  value: number;
  ready: boolean;
  one: boolean;
  two: boolean;
  three: boolean;
  four: boolean;
  five: boolean;
  six: boolean;
  seven: boolean;
}

export const createExperimentPlanOptionsState = (): ExperimentPlanOptionsState => ({
  value: 0,
  ready: false,
  one: false,
  two: false,
  three: false,
  four: false,
  five: false,
  six: false,
  seven: false
});

export const createExperimentPlanOptionsConcept = () => createExperimentConcept(
  createExperimentPlanOptionsState(),
  [
    experimentToggleAllSevenQuality,
    experimentPlanOptionsAddValueQuality,
    experimentPlanOptionsIsReadyQuality
  ],
  []
);