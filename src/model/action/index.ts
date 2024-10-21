/*<$
For the asynchronous graph programming framework Stratimux, define the Action Index file.
This file creates an object that collects all action oriented functions required for Stratimux.
$>*/
/*<#*/
import {
  createAction,
  prepareActionCreator,
  prepareActionWithPayloadCreator,
  primeAction,
  refreshAction
} from './action';

import {
  areSemaphoresEqual,
  createCachedSemaphores,
  getSemaphore,
} from './actionSemaphore';

export const act = ({
  prime: primeAction,
  refresh: refreshAction,
  getSemaphore,
  createCachedSemaphores,
  create: createAction,
  prepareActionCreator,
  prepareActionWithPayloadCreator,
  areSemaphoresEqual,
});
/*#>*/