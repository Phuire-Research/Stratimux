import { Action } from '../../../model/action';
import { ActionNode, ActionNodeOptions, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { axiumLog } from '../qualities/log.quality';

export type AxiumGatherNode = {
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
 * @returns ActionNode of axiumStitch
 */
export const axium_createGatherNode = (props: AxiumGatherNode, options?: ActionNodeOptions[]) => {
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
    const log = axiumLog();
    log.payload = {message: 'NO ACTIONS WERE GATHERED VIA AXIUM_CREATE_GATHER_NODE'};
    return createActionNode(log, {
      successNode: null,
      failureNode: null
    });
  }
};

export type AxiumGatherStrategy = {
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
export const axium_createGatherStrategy = (props: AxiumGatherStrategy, options?: ActionNodeOptions[]) => {
  const stepFirst = axium_createGatherNode(props, options);
  return createStrategy({
    topic: props.topic ? props.topic : 'Axium Gather Strategy for: ' + props.actions.map(act => act.type).join(', '),
    initialNode: stepFirst
  });
};