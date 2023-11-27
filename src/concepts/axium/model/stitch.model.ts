/*<$
For the graph programming framework Stratimux and Axium Concept, generate a model file that includes a create stitch node helper function.
This function allows for Strategy Stitches to be composed of only one action node.
While calling the axium's stitch quality to silently move to the next node assigned to the end of that stitch.
$>*/
/*<#*/
import { ActionNodeOptions, createActionNode } from '../../../model/actionStrategy';
import { axiumStitch } from '../qualities/stitch.quality';

/**
 * Must be used within an ActionStrategyStitch with only one ActionNode provided.
 * @param options `optional` will set return ActionNode's options if provided.
 * @returns ActionNode of axiumStitch
 */
export const axium_createStitchNode = (options?: ActionNodeOptions) =>
  (createActionNode(axiumStitch(), options ? options : {
    successNode: null,
    failureNode: null,
  }));
/*#>*/