/*<$
For the asynchronous graph programming framework Stratimux and a Experiment PlanOptions Concept, generate both possible selectors
$>*/
/*<#*/
import { experimentName } from '../../concepts/experiment/experiment.concept';
import { KeyedSelector, createConceptKeyedSelector } from '../../model/selectors/selector';
import { ExperimentPlanOptionsState } from './newPlanOptions.concept';

export const experimentPlanOptionsReadySelector: KeyedSelector =
  createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'ready');

export const experimentPlanOptionsValueSelector: KeyedSelector =
  createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'value');
/*#>*/