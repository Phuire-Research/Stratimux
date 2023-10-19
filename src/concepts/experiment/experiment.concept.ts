import { Mode, Quality, createConcept } from '../../model/concept';
import { Action } from '../../model/action';
import { PrincipleFunction } from '../../model/principle';

export type ExperimentState = {
  actionQue: Action[],
  mock: boolean,
}

export const experimentName = 'experiment';

export const createExperimentState = (): ExperimentState => {
  return {
    actionQue: [],
    mock: false
  };
};

export const createExperimentConcept = (
  state: unknown,
  qualities?: Quality[],
  principles?: PrincipleFunction[],
  mode?: Mode[]) => {
  return createConcept(
    experimentName,
    state,
    qualities,
    principles,
    mode
  );
};