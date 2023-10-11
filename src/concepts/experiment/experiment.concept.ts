import { Mode, Quality, createConcept } from '../../model/concept';
import { Action } from '../../model/action';
import { PrincipleFunction } from '../../model/principle';

export type ExperimentActionQueState = {
  actionQue: Action[],
}

export const experimentName = 'experiment';

export const createExperimentActionQueState = (): ExperimentActionQueState => {
  return {
    actionQue: [],
  };
};

export const createExperimentConcept = (
  state: any,
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