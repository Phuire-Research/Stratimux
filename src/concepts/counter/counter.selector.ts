/*<$
For the graph programming framework Stratimux and Counter Concept, generate a KeyedSelector for the Counter's count state property.
$>*/
/*<#*/
import { KeyedSelector, createConceptKeyedSelector } from '../../model/selector';
import { CounterState } from './counter.concept';

export const counterSelectCount: KeyedSelector = createConceptKeyedSelector<CounterState>('counter', 'count');
/*#>*/