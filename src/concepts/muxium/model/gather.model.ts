/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a model file that specifies the gather action node concept.
This concept allows for action nodes to be linked into a sequence based on a provided actions parameter.
Note this should be limited to actions that provably do not require error correction.
Otherwise you would want to use a Strategy Stitch instead.
$>*/
/*<#*/
import { ActionNode, ActionNodeOptions } from '../../../model/action/strategy/actionStrategy.type';
import { Action, AnyAction } from '../../../model/action/action.type';
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { createAction } from '../../../model/action/action';
import { Deck } from '../../../model/deck';
import { MuxiumDeck } from '../muxium.concept';

export type MuxiumGatherNode = {
  actions: Action[],
  last?: ActionNode,
}
/**
 * Must used to create a uniform sequence of actions, note that these actions can be primed with a payload.
 * @param actions Sequence of actions to be gathered.
 * @param options `optional` Must be a union of paired options correlated in order to the provided actions.
 * Noting that success nodes will be overridden if passed.
 * @param last `optional` This will be set as the gathered actions final step.
 * You may use this to continue a strategy after the gathered actions have concluded.
 * @returns ActionNode of muxiumStitch
 */
export const muxium_createGatherNode = (deck: Deck<MuxiumDeck>, props: MuxiumGatherNode, options?: ActionNodeOptions[]) => {
  const {
    actions,
    last,
  } = props;
  let first;
  let previous;
  const defaultOptions = {
    successNode: null,
    failureNode: null
  };
  for (const [i, act] of actions.entries()) {
    const opt = options ? options[i] : undefined;
    if (first === undefined) {
      first = createActionNode(act, opt ? opt : {...defaultOptions});
      previous = first;
    } else if (previous !== undefined) {
      const next = createActionNode(act, opt ? opt : {...defaultOptions});
      previous.successNode = next;
      previous = next;
    }
  }
  if (previous !== undefined && last !== undefined) {
    previous.successNode = last;
  }
  if (first) {
    return first;
  } else {
    const log = deck.muxium.e.muxiumLog() as AnyAction;
    log.payload = {message: 'NO ACTIONS WERE GATHERED VIA MUXIUM_CREATE_GATHER_NODE'};
    return createActionNode(log, {
      successNode: null,
      failureNode: null
    });
  }
};

export type MuxiumGatherStrategy = {
  actions: Action[],
  last?: ActionNode,
  topic?: string
}
/**
 * Creates a strategy that will execute a sequence of actions that can be primed with a payload.
 * @param actions Sequence of actions to be gathered.
 * @param last `optional` This will be set as the gathered actions final step.
 * @param topic `optional` Will set the topic of the returned strategy.
 * You may use this to continue a strategy after the gathered actions have concluded.
 * @param options `optional` Must be a union of paired options correlated in order to the provided actions.
 * Noting that success nodes will be overridden if passed.

 * @returns ActionStrategy of the provided actions to be executed in a sequence.
 */
export const muxium_createGatherStrategy = (deck: Deck<MuxiumDeck>, props: MuxiumGatherStrategy, options?: ActionNodeOptions[]) => {
  const stepFirst = muxium_createGatherNode(deck, props, options);
  return createStrategy({
    topic: props.topic ? props.topic : 'Muxium Gather Strategy for: ' + props.actions.map(act => act.type).join(', '),
    initialNode: stepFirst
  });
};
/*#>*/