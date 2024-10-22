/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, generate a series of KeyedSelectors for the ownership state.
$>*/
/*<#*/
import { createConceptKeyedSelector } from '../../model/selector/selector';
import { KeyedSelector } from '../../model/selector/selector.type';
import { OwnershipState } from './ownership.concept';

export const ownershipSelectLedger: KeyedSelector = createConceptKeyedSelector<OwnershipState>('ownership', 'ownershipLedger');

export const ownershipSelectInitialized: KeyedSelector = createConceptKeyedSelector<OwnershipState>('ownership', 'initialized');
/*#>*/