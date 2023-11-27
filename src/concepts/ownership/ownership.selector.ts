/*<$
For the graph programming framework Stratimux and Ownership Concept, generate a series of KeyedSelectors for the ownership state.
$>*/
/*<#*/
import { KeyedSelector } from '../../model/selector';

export const ownershipSelectLedger: KeyedSelector = {
  conceptName: 'ownership',
  stateKeys: 'ownershipLedger'
};

export const ownershipSelectInitialized: KeyedSelector = {
  conceptName: 'ownership',
  stateKeys: 'initialized'
};
/*#>*/