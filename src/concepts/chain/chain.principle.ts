/*<$
For the asynchronous graph programming framework Stratimux and Chain Concept,
generate a principle that observes the chain's actionQue and dispatches
those actions in order upon each state notification.
$>*/
/*<#*/
import { Concepts } from '../../model/concept';
import { registerPrincipleSubscription } from '../../model/principle';
import { ChainPrinciple, ChainQualities, ChainState, chainName } from './chain.concept';
import { selectMuxifiedState } from '../../model/selector';
import { Action } from '../../model/action/action.type';

export const chainPrinciple: ChainPrinciple = ({
  observer,
  subscribe,
  nextC,
  nextA,
  conceptSemaphore,
  d_,
  plan
}) => {
  const subscription = subscribe((concepts: Concepts) => {
    const chainState = selectMuxifiedState<ChainState>(concepts, conceptSemaphore);
    if (chainState && chainState.actionQue.length > 0) {
      const newActionQue = [...chainState.actionQue];
      const nextAction = newActionQue.pop() as Action;
      chainState.actionQue = newActionQue;
      nextC(concepts);
      nextA(nextAction);
    }
  });
  registerPrincipleSubscription(observer, d_, chainName, subscription);
};
/*#>*/