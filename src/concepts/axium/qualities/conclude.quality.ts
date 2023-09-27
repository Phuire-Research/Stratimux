import { ActionType } from '../../../model/action';

/**
 * axiumConcludeType
 * This is a special Quality that does not have a Reducer or Method
 * Instead what this allows for is special functionality within the Axium and Ownership Concepts
 * Is used for appending ActionList to Dialog
 * And used to clear Ownership of its Previous ActionNode and is handled by ActionStrategy
 * This should not be used Directly
 */
export const axiumConcludeType: ActionType = 'Conclude';
