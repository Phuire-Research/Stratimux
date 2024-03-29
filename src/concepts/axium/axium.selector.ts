/*<$
For the graph programming framework Stratimux and Axium Concept, generate a series of KeyedSelectors for the AxiumState.
$>*/
/*<#*/
import { KeyedSelector, createConceptKeyedSelector } from '../../model/selector';
import { AxiumState } from './axium.concept';

export const axiumSelectOpen: KeyedSelector = createConceptKeyedSelector<AxiumState>('axium', 'open');

export const axiumSelectPrepareClose: KeyedSelector = createConceptKeyedSelector<AxiumState>('axium', 'prepareClose');

export const axiumSelectAddConceptQue: KeyedSelector = createConceptKeyedSelector<AxiumState>('axium', 'addConceptQue');

export const axiumSelectRemoveConceptQue: KeyedSelector = createConceptKeyedSelector<AxiumState>('axium', 'removeConceptQue');

export const axiumSelectLastStrategy: KeyedSelector = createConceptKeyedSelector<AxiumState>('axium', 'lastStrategy');

export const axiumSelectLastStrategyData: KeyedSelector = createConceptKeyedSelector<AxiumState>('axium', 'lastStrategyData');

export const axiumSelectLastStrategyDialog: KeyedSelector = createConceptKeyedSelector<AxiumState>('axium', 'lastStrategyDialog');

export const axiumSelectBadPlans: KeyedSelector = createConceptKeyedSelector<AxiumState>('axium', 'badPlans');

export const axiumSelectBadActions: KeyedSelector = createConceptKeyedSelector<AxiumState>('axium', 'badActions');
/*#>*/