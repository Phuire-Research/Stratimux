/*<$
For the asynchronous graph programming framework Stratimux, define the Access model file.
This file dictates the ability for an outside subscription to access Actions a foreign axium.
$>*/
/*<#*/

import { Actions } from './action';
import { Concepts } from './concept';
import { KeyedSelectors } from './selector';

// PUNT we will be attaching this to the Axium to create a public API. To restrict what actions a foreign Axium may access.
// Noting that the initial starting point for semaphores can be scrambled to a random value upon creation.
// Within some Auth Concept we could use this as a means of black listing probing actors
// Can also set the semaphore to a hash if we are truly in a sensitive situation then fall back to numbs in a private context.
// LARGE PUNT with the hash
function access(concepts: Concepts, conceptName: string): [Actions, KeyedSelectors] {
  return [
    {},
    {}
  ];
}
/*#>*/