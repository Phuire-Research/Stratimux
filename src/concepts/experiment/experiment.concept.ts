import { createConcept } from '../../model/concept';
import { Action } from '../../model/action';
import { checkInQuality } from './qualities/checkIn.quality';

export type ExperimentState = {
  actionQue: Action[],
}

export const experimentName = 'experiment';

const createExperimentState = (): ExperimentState => {
  return {
    actionQue: [],
  };
};

export const createOwnershipConcept = (isResponsibleForMode?: boolean) => {
  return createConcept(
    experimentName,
    createExperimentState(),
    [
      checkInQuality
    ],
    [
    ],
    []
  );
};