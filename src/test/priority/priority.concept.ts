import { createExperimentConcept } from '../../concepts/experiment/experiment.concept';
import { experimentPriorityIsReadyQuality } from './qualities/isReady.quality';
import { experimentPriorityAddValueQuality } from './qualities/addValue.quality';

export type ExperimentPriorityState = {
  value: number;
  ready: boolean;
}

export const createExperimentPriorityState = (): ExperimentPriorityState => ({value: 0, ready: false});

const experimentPriorityQualities = {
  experimentPriorityIsReadyQuality,
  experimentPriorityAddValueQuality
};

export type ExperimentPriorityQualities = typeof experimentPriorityQualities;

export const createExperimentPriorityConcept = () => createExperimentConcept<ExperimentPriorityQualities>(
  createExperimentPriorityState(),
  experimentPriorityQualities,
  []
);