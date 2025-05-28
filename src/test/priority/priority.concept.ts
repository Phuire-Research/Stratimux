import { createExperimentConcept } from '../../concepts/experiment/experiment.concept';
import { ExperimentPriorityIsReady, experimentPriorityIsReady } from './qualities/isReady.quality';
import { ExperimentPriorityAddValue, experimentPriorityAddValue } from './qualities/addValue.quality';

export type ExperimentPriorityState = {
  value: number;
  ready: boolean;
}

export const createExperimentPriorityState = (): ExperimentPriorityState => ({value: 0, ready: false});

const experimentPriorityQualities = {
  experimentPriorityIsReady,
  experimentPriorityAddValue
};

export type ExperimentPriorityQualities = {
  experimentPriorityIsReady: ExperimentPriorityIsReady,
  experimentPriorityAddValue: ExperimentPriorityAddValue
};

export const createExperimentPriorityConcept = () => createExperimentConcept<ExperimentPriorityState, ExperimentPriorityQualities>(
  createExperimentPriorityState(),
  experimentPriorityQualities,
  []
);