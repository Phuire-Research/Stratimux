/*<$
For the asynchronous graph programming framework Stratimux, define the Selector Index model file.
This file imports all non-trivial selector functionality bundled into a 'select' object.
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