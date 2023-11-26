/*<$
For the framework Stratimux and Counter Concept, generate a KeyedSelector for the Counter's count state property.
$>*/
/*<#*/
import { KeyedSelector } from '../../model/selector';

export const counterSelectCount: KeyedSelector = {
  conceptName: 'counter',
  stateKeys: 'count',
};
/*#>*/