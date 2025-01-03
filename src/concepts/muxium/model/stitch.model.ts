/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a model file that includes a create stitch node helper function.
This function allows for Strategy Stitches to be composed of only one action node.
While calling the muxium's stitch quality to silently move to the next node assigned to the end of that stitch.
$>*/
/*<#*/
import { createActionNode } from '../../../model/action/strategy/actionStrategy';
import { ActionNodeOptions } from '../../../model/action/strategy/actionStrategy.type';
import { Deck } from '../../../model/deck';
import { MuxiumDeck } from '../muxium.concept';

/**
 * Must be used within an ActionStrategyStitch with only one ActionNode provided.
 * @param options `optional` will set return ActionNode's options if provided.
 * @returns ActionNode of muxiumStitch
 */
export const muxium_createStitchNode = (deck: Deck<MuxiumDeck>, options?: ActionNodeOptions) =>
  (createActionNode(deck.muxium.e.muxiumStitch(), options ? options : {
    successNode: null,
    failureNode: null,
  }));
/*#>*/