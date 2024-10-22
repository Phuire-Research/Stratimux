/*<$
For the asynchronous graph programming framework Stratimux and a Experiment PlanOptions Concept, generate both possible selectors
$>*/
/*<#*/
import { experimentName } from '../../concepts/experiment/experiment.concept';
import { createConceptKeyedSelector } from '../../model/selector/selector';
import { KeyedSelector } from '../../model/selector/selector.type';
import { ExperimentPlanOptionsState } from './newPlanOptions.concept';

export const experimentPlanOptionsReadySelector: KeyedSelector =
  createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'ready');

export const experimentPlanOptionsValueSelector: KeyedSelector =
  createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'value');
/*#>*/