/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a quality that will conclude a strategy.
This is the primary quality that allows for Stratimux to be provably terminating and/or halting complete.
Functionally. This is a pure action with no method or reducer. That will instead activate its functionality
within each qualities method if specified. As well as ownership if loaded in the Muxium's concept set.
$>*/
/*<#*/

import { prepareActionCreator } from '../../../model/action/action';
import { ActionType } from '../../../model/action/action.type';
import { getSpecialSemaphore } from '../../../model/action/actionSemaphore';

/**
 * muxiumConcludeType
 * This is a special Quality that does not have a Reducer or Method
 * Instead what this allows for is special functionality within the Muxium and Ownership Concepts
 * Is used for appending ActionList to Dialog
 * And used to clear Ownership of its Previous ActionNode and is handled by ActionStrategy
 * This should not be used Directly
 */
export const muxiumConcludeType: ActionType = 'Conclude';
export const muxiumConclude = prepareActionCreator(
  muxiumConcludeType,
  [[-1, -1, -1, getSpecialSemaphore(muxiumConcludeType)]]
);
/*#>*/