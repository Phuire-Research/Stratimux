/*<$
For the asynchronous graph programming framework Stratimux generate the Experiment Concept that will be used in testing to confirm
different configurations of Stratimux to be provably terminating.
$>*/
/*<#*/
import { LoadConcepts, Mode } from '../../model/concept/concept.type';
import { createConcept } from '../../model/concept/concept';
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

export const createExperimentConcept = <S extends Record<string, unknown>, Q = void, C = void>(
  state: S,
  qualities?: Record<string, unknown>,
  principles?: PrincipleFunction<Q, C, S>[],
  mode?: Mode[]) => {
  return createConcept<S, Q, C extends void ? LoadConcepts : C extends LoadConcepts ? C : LoadConcepts>(
    experimentName,
    state,
    qualities,
    principles,
    mode
  );
};
/*#>*/