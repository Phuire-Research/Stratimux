/*<$
For the asynchronous graph programming framework Stratimux generate an Experiment Concept that will be used to test
the ability to change plan options at runtime.
$>*/
/*<#*/
import { createExperimentConcept } from '../../concepts/experiment/experiment.concept';
import { experimentPlanOptionsAddValue } from './qualities/addValue.quality';
import { experimentPlanOptionsIsReady } from './qualities/isReady.quality';
import { experimentToggleAllSeven } from './qualities/toggleAllSeven.quality';

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

const experimentPlanOptionsQualities = {
  experimentToggleAllSeven,
  experimentPlanOptionsAddValue,
  experimentPlanOptionsIsReady
};

export type ExperimentPlanOptionsQualities = typeof experimentPlanOptionsQualities;

export const createExperimentPlanOptionsConcept = () => createExperimentConcept<ExperimentPlanOptionsState, ExperimentPlanOptionsQualities>(
  createExperimentPlanOptionsState(),
  experimentPlanOptionsQualities,
  []
);
/*#>*/