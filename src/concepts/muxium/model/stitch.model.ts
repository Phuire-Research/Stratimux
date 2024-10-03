/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a model file that includes a create stitch node helper function.
This function allows for Strategy Stitches to be composed of only one action node.
While calling the muxium's stitch quality to silently move to the next node assigned to the end of that stitch.
$>*/
/*<#*/
import { createAction } from '../../../model/action';
import { ActionNodeOptions, createActionNode } from '../../../model/actionStrategy';
import { muxiumStitch } from '../qualities/stitch.quality';

/**
 * Must be used within an ActionStrategyStitch with only one ActionNode provided.
 * @param options `optional` will set return ActionNode's options if provided.
 * @returns ActionNode of muxiumStitch
 */
export const muxium_createStitchNode = (options?: ActionNodeOptions) =>
  (createActionNode(createAction('Muxium Stitch'), options ? options : {
    successNode: null,
    failureNode: null,
  }));
/*#>*/