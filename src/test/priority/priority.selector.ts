/*<$
For the graph programming framework Stratimux and a Experiment Priority Concept, generate both possible selectors
$>*/
/*<#*/
import { KeyedSelector, createConceptKeyedSelector } from '../../model/selector';
import { ExperimentPriorityState } from './priority.concept';

export const experimentPriorityReadySelector: KeyedSelector = createConceptKeyedSelector<ExperimentPriorityState>('axium', 'ready');

export const experimentPriorityValueSelector: KeyedSelector = createConceptKeyedSelector<ExperimentPriorityState>('axium', 'value');

/*#>*/