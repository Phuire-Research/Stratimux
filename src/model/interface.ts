/*<$
For the asynchronous graph programming framework Stratimux, define the Interface model file.
$>*/

import { Action } from './action';
import { Actions } from './concept';
import { KeyedSelectors } from './selector';

/*<#*/
export type isT = (action: Action) => boolean;

export const createTypeValidator = (actionSemaphoreBucket: [number, number, number, number][]) => (action: Action) => {
  const semaphore = actionSemaphoreBucket[0];
  if (semaphore) {
    return action.semaphore[0] === semaphore[0] && action.semaphore[1] === semaphore[1];
  } else {
    throw 'ACTION SEMAPHORE BUCKET NOT PRIMED';
  }
};

export type uInterface<T> = {
  a: Actions<T>
  s: KeyedSelectors
  t: isT[]
}
/*#>*/