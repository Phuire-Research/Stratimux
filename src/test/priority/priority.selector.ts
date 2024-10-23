/*<$
For the asynchronous graph programming framework Stratimux and a Experiment Priority Concept, generate both possible selectors
$>*/
/*<#*/
import { experimentName } from '../../concepts/experiment/experiment.concept';
import { createConceptKeyedSelector } from '../../model/selector/selector';
import { KeyedSelector } from '../../model/selector/selector.type';
import { ExperimentPriorityState } from './priority.concept';

export const experimentPriorityReadySelector: KeyedSelector = createConceptKeyedSelector<ExperimentPriorityState>(experimentName, 'ready');

export const experimentPriorityValueSelector: KeyedSelector = createConceptKeyedSelector<ExperimentPriorityState>(experimentName, 'value');

/*#>*/