import { createExperimentConcept } from '../../concepts/experiment/experiment.concept';
import { experimentPriorityIsReadyQuality } from './qualities/isReady.quality';
import { experimentPriorityAddValueQuality } from './qualities/addValue.quality';

export type ExperimentPriorityState = {
  value: number;
  ready: boolean;
}

export const createExperimentPriorityState = (): ExperimentPriorityState => ({value: 0, ready: false});

export const createExperimentPriorityConcept = () => createExperimentConcept(
  createExperimentPriorityState(),
  [
    experimentPriorityIsReadyQuality,
    experimentPriorityAddValueQuality
  ],
  []
);