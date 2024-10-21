/*<$
For the asynchronous graph programming framework Stratimux and a Experiment Priority Concept, generate both possible selectors
$>*/
/*<#*/
import { experimentName } from '../../concepts/experiment/experiment.concept';
import { KeyedSelector, createConceptKeyedSelector } from '../../model/selectors/selector';
import { ExperimentPriorityState } from './priority.concept';

export const experimentPriorityReadySelector: KeyedSelector = createConceptKeyedSelector<ExperimentPriorityState>(experimentName, 'ready');

export const experimentPriorityValueSelector: KeyedSelector = createConceptKeyedSelector<ExperimentPriorityState>(experimentName, 'value');

/*#>*/