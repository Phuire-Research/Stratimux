import { createExperimentConcept } from '../../concepts/experiment/experiment.concept';
import { experimentPriorityIsReady } from './qualities/isReady.quality';
import { experimentPriorityAddValue } from './qualities/addValue.quality';

export type ExperimentPriorityState = {
  value: number;
  ready: boolean;
}

export const createExperimentPriorityState = (): ExperimentPriorityState => ({value: 0, ready: false});

const experimentPriorityQualities = {
  experimentPriorityIsReady,
  experimentPriorityAddValue
};

export type ExperimentPriorityQualities = typeof experimentPriorityQualities;

export const createExperimentPriorityConcept = () => createExperimentConcept<ExperimentPriorityQualities>(
  createExperimentPriorityState(),
  experimentPriorityQualities,
  []
);