/*<$
For the asynchronous graph programming framework Stratimux, define the Selector model file.
This file will contain a series of selectors that can be used to engage with different parts of the Muxium Conceptual Set.
$>*/
/*<#*/
import { updateMuxifiedKeyedSelector } from '../..';
import {
  createAdvancedKeys,
  createConceptKeyedSelector,
  createMuxifiedKeyedSelector,
  selectConcept,
  selectMuxifiedState,
  selectPayload,
  selectSet,
  selectSlice,
  selectState
} from './selector';

export const select = ({
  createMuxifiedKeyedSelector,
  createConceptKeyedSelector,
  createAdvancedKeys,
  updateMuxifiedKeyedSelector,
  state: selectState,
  set: selectSet,
  payload: selectPayload,
  slice: selectSlice,
  concept: selectConcept,
  muxifiedState: selectMuxifiedState,
});
/*#>*/