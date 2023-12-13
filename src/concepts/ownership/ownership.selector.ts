/*<$
For the graph programming framework Stratimux and Ownership Concept, generate a series of KeyedSelectors for the ownership state.
$>*/
/*<#*/
import { KeyedSelector, createConceptKeyedSelector } from '../../model/selector';
import { OwnershipState } from './ownership.concept';

export const ownershipSelectLedger: KeyedSelector = createConceptKeyedSelector<OwnershipState>('ownership', 'ownershipLedger');

export const ownershipSelectInitialized: KeyedSelector = createConceptKeyedSelector<OwnershipState>('ownership', 'initialized');
/*#>*/