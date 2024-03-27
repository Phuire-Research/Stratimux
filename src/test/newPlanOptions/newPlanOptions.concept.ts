import { createExperimentConcept } from '../../concepts/experiment/experiment.concept';
import { experimentToggleAllSevenQuality } from './qualities/toggleAllSeven.quality';

export type ExperimentPlanOptionsState = {
  one: boolean;
  two: boolean;
  three: boolean;
  four: boolean;
  five: boolean;
  six: boolean;
  seven: boolean;
}

export const createExperimentPlanOptionsState = (): ExperimentPlanOptionsState => ({
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
    experimentToggleAllSevenQuality
  ],
  []
);