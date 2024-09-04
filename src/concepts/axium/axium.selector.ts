/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a series of KeyedSelectors for the AxiumState<unknown,unknown>.
$>*/
/*<#*/
import { LoadConcepts } from '../../model/concept';
import { KeyedSelector, createConceptKeyedSelector } from '../../model/selector';
import { AxiumState } from './axium.concept';

export const axiumSelectOpen: KeyedSelector = createConceptKeyedSelector<AxiumState<unknown, LoadConcepts>>('axium', 'open');

export const axiumSelectPrepareClose: KeyedSelector = createConceptKeyedSelector<AxiumState<unknown, LoadConcepts>>('axium', 'prepareClose');

export const axiumSelectAddConceptQue: KeyedSelector = createConceptKeyedSelector<AxiumState<unknown, LoadConcepts>>('axium', 'addConceptQue');

export const axiumSelectRemoveConceptQue: KeyedSelector = createConceptKeyedSelector<AxiumState<unknown, LoadConcepts>>('axium', 'removeConceptQue');

export const axiumSelectLastStrategy: KeyedSelector = createConceptKeyedSelector<AxiumState<unknown, LoadConcepts>>('axium', 'lastStrategy');

export const axiumSelectLastStrategyData: KeyedSelector = createConceptKeyedSelector<AxiumState<unknown, LoadConcepts>>('axium', 'lastStrategyData');

export const axiumSelectLastStrategyDialog: KeyedSelector = createConceptKeyedSelector<AxiumState<unknown, LoadConcepts>>('axium', 'lastStrategyDialog');

export const axiumSelectBadPlans: KeyedSelector = createConceptKeyedSelector<AxiumState<unknown, LoadConcepts>>('axium', 'badPlans');

export const axiumSelectBadActions: KeyedSelector = createConceptKeyedSelector<AxiumState<unknown, LoadConcepts>>('axium', 'badActions');
/*#>*/