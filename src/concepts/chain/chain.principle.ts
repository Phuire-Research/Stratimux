/*<$
For the framework Stratimux and Chain Concept, generate a principle that observes the chain's actionQue and dispatches
those actions in order upon each state notification.
$>*/
/*<#*/
import { Subscriber } from 'rxjs';
import { Concepts } from '../../model/concept';
import { Action } from '../../model/action';
import { PrincipleFunction, registerPrincipleSubscription } from '../../model/principle';
import { ChainState, chainName } from './chain.concept';
import { selectUnifiedState } from '../../model/selector';
import { AxiumState } from '../axium/axium.concept';
import { UnifiedSubject } from '../../model/stagePlanner';

export const chainPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number
) => {
  const subscription = concepts$.subscribe((concepts: Concepts) => {
    const chainState = selectUnifiedState<ChainState>(concepts, semaphore);
    if (chainState && chainState.actionQue.length > 0) {
      const newActionQue = [...chainState.actionQue];
      const nextAction = newActionQue.pop() as Action;
      chainState.actionQue = newActionQue;
      concepts$.next(concepts);
      const axiumState = concepts[0].state as AxiumState;
      axiumState.action$?.next(nextAction);
    }
  });
  registerPrincipleSubscription(observer, _concepts, chainName, subscription);
};
/*#>*/