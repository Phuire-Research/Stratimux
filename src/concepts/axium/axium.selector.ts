/*<$
For the graph programming framework Stratimux and Axium Concept, generate a series of KeyedSelectors for the AxiumState.
$>*/
/*<#*/
import { KeyedSelector } from '../../model/selector';

export const axiumSelectOpen: KeyedSelector = {
  conceptName: 'axium',
  stateKeys: 'open',
};

export const axiumSelectLastStrategy: KeyedSelector = {
  conceptName: 'axium',
  stateKeys: 'lastStrategy',
};

export const axiumSelectLastStrategyData: KeyedSelector = {
  conceptName: 'axium',
  stateKeys: 'lastStrategyData',
};

export const axiumSelectLastStrategyDialog: KeyedSelector = {
  conceptName: 'axium',
  stateKeys: 'lastStrategyDialog',
};

export const axiumSelectBadPlans: KeyedSelector = {
  conceptName: 'axium',
  stateKeys: 'badPlans',
};

export const axiumSelectBadActions: KeyedSelector = {
  conceptName: 'axium',
  stateKeys: 'badActions',
};
/*#>*/