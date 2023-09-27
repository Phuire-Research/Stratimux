import { createConcept } from '../../model/concept';
import { Action } from '../../model/action';
import { checkInQuality } from './qualities/checkIn.quality';
import { experimentPrinciple } from './experiment.principle';

export type ExperimentState = {
  actionQue: Action[],
}

export const experimentName = 'experiment';

const createExperimentState = (): ExperimentState => {
  return {
    actionQue: [],
  };
};

export const createExperimentConcept = () => {
  return createConcept(
    experimentName,
    createExperimentState(),
    [
      checkInQuality
    ],
    [
      experimentPrinciple
    ],
    []
  );
};