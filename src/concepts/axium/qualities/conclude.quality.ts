/*<$
For the framework Stratimux and Axium Concept, generate a quality that will conclude a strategy.
This is the primary quality that allows for Stratimux to be provably terminating and/or halting complete.
Functionally. This is a pure action with no method or reducer. That will instead activate its functionality
within each qualities method if specified. As well as ownership if loaded in the Axium's concept set.
$>*/
/*<#*/
import { ActionType, prepareActionCreator } from '../../../model/action';

/**
 * axiumConcludeType
 * This is a special Quality that does not have a Reducer or Method
 * Instead what this allows for is special functionality within the Axium and Ownership Concepts
 * Is used for appending ActionList to Dialog
 * And used to clear Ownership of its Previous ActionNode and is handled by ActionStrategy
 * This should not be used Directly
 */
export const axiumConcludeType: ActionType = 'Conclude';
export const axiumConclude = prepareActionCreator(axiumConcludeType);
/*#>*/