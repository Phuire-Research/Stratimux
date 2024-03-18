import { createExperimentConcept } from '../../concepts/experiment/experiment.concept';
import { experimentPriorityIsReadyQuality } from './qualities/isReady.quality';
import { experimentPrioritySetValueQuality } from './qualities/setValue.quality';

export type ExperimentPriorityState = {
  value: number;
  ready: boolean;
}

export const createExperimentPriorityState = (): ExperimentPriorityState => ({value: 0, ready: false});

export const createExperimentPriorityConcept = () => createExperimentConcept(
  createExperimentPriorityState(),
  [
    experimentPriorityIsReadyQuality,
    experimentPrioritySetValueQuality
  ],
  []
);