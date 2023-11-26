import { ActionNodeOptions, createActionNode } from '../../../model/actionStrategy';
import { axiumStitch } from '../qualities/stitch.quality';

/**
 * Must be used within an ActionStrategyStitch with only one ActionNode provided.
 * @param options `optional` will set return ActionNode's options if provided.
 * @returns ActionNode of axiumStitch
 */
export const axium_createStitchNode = (options?: ActionNodeOptions) =>
  ({...createActionNode(axiumStitch(), options ? options : {
    successNode: null,
    failureNode: null,
  })});