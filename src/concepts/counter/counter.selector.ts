/*<$
For the asynchronous graph programming framework Stratimux and Counter Concept, generate a KeyedSelector for the Counter's count state property.
$>*/
/*<#*/
import { createConceptKeyedSelector } from '../../model/selector/selector';
import { KeyedSelector } from '../../model/selector/selector.type';
import { CounterState } from './counter.concept';

export const counterSelectCount: KeyedSelector = createConceptKeyedSelector<CounterState>('counter', 'count');
/*#>*/