/*<$
For the asynchronous graph programming framework Stratimux and Chain Concept,
generate a principle that observes the chain's actionQue and dispatches
those actions in order upon each state notification.
$>*/
/*<#*/
import { Subscriber } from 'rxjs';
import { Concepts } from '../../model/concept';
import { Action } from '../../model/action';
import { PrincipleFunction, registerPrincipleSubscription } from '../../model/principle';
import { ChainQualities, ChainState, chainName } from './chain.concept';
import { selectUnifiedState } from '../../model/selector';
import { AxiumState } from '../axium/axium.concept';
import { UnifiedSubject } from '../../model/stagePlanner';

export const chainPrinciple: PrincipleFunction<ChainQualities> = ({
  observer,
  subscribe,
  ax_,
  nextC,
  nextA,
  conceptSemaphore
}) => {
  const subscription = subscribe((concepts: Concepts) => {
    const chainState = selectUnifiedState<ChainState>(concepts, conceptSemaphore);
    if (chainState && chainState.actionQue.length > 0) {
      const newActionQue = [...chainState.actionQue];
      const nextAction = newActionQue.pop() as Action;
      chainState.actionQue = newActionQue;
      nextC(concepts);
      nextA(nextAction);
    }
  });
  registerPrincipleSubscription(observer, ax_, chainName, subscription);
};
/*#>*/