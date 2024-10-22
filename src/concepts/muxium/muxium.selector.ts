/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a series of KeyedSelectors for the MuxiumState<unknown,unknown>.
$>*/
/*<#*/
import { LoadConcepts } from '../../model/concept/concept.type';
import { createConceptKeyedSelector } from '../../model/selector/selector';
import { KeyedSelector } from '../../model/selector/selector.type';
import { MuxiumState } from './muxium.concept';

export const muxiumSelectOpen: KeyedSelector = createConceptKeyedSelector<MuxiumState<unknown, LoadConcepts>>('muxium', 'open');

export const muxiumSelectPrepareClose: KeyedSelector = createConceptKeyedSelector<MuxiumState<unknown, LoadConcepts>>('muxium', 'prepareClose');

export const muxiumSelectAddConceptQue: KeyedSelector = createConceptKeyedSelector<MuxiumState<unknown, LoadConcepts>>('muxium', 'addConceptQue');

export const muxiumSelectRemoveConceptQue: KeyedSelector = createConceptKeyedSelector<MuxiumState<unknown, LoadConcepts>>('muxium', 'removeConceptQue');

export const muxiumSelectLastStrategy: KeyedSelector = createConceptKeyedSelector<MuxiumState<unknown, LoadConcepts>>('muxium', 'lastStrategy');

export const muxiumSelectLastStrategyData: KeyedSelector = createConceptKeyedSelector<MuxiumState<unknown, LoadConcepts>>('muxium', 'lastStrategyData');

export const muxiumSelectLastStrategyDialog: KeyedSelector = createConceptKeyedSelector<MuxiumState<unknown, LoadConcepts>>('muxium', 'lastStrategyDialog');

export const muxiumSelectBadPlans: KeyedSelector = createConceptKeyedSelector<MuxiumState<unknown, LoadConcepts>>('muxium', 'badPlans');

export const muxiumSelectBadActions: KeyedSelector = createConceptKeyedSelector<MuxiumState<unknown, LoadConcepts>>('muxium', 'badActions');
/*#>*/