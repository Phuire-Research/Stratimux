/*<$
For the framework Stratimux generate the Experiment Concept that will be used in testing to confirm
different configurations of Stratimux to be provably terminating.
$>*/
/*<#*/
import { Mode, Quality, createConcept } from '../../model/concept';
import { Action } from '../../model/action';
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

export const createExperimentConcept = (
  state: Record<string, unknown>,
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
/*#>*/