/*<$
For the asynchronous graph programming framework Stratimux generate the Experiment Concept that will be used in testing to confirm
different configurations of Stratimux to be provably terminating.
$>*/
/*<#*/
import { Mode, createConcept } from '../../model/concept/concept';
import { Action } from '../../model/action/action.type';
import { PrincipleFunction } from '../../model/principle';

export type ExperimentState = {
  actionQue: Action[],
  mock: boolean,
  id: number
}

export const experimentName = 'experiment';

export const createExperimentState = (): ExperimentState => {
  return {
    actionQue: [],
    mock: false,
    id: 0,
  };
};

export const createExperimentConcept = <S extends Record<string, unknown>, T = void>(
  state: S,
  qualities?: Record<string, unknown>,
  principles?: PrincipleFunction<any, any, any>[],
  mode?: Mode[]) => {
  return createConcept<S, T>(
    experimentName,
    state,
    qualities,
    principles,
    mode
  );
};
/*#>*/