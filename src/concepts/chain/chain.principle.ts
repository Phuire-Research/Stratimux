import { Subscriber } from 'rxjs';
import { Concepts } from '../../model/concept';
import { Action } from '../../model/action';
import { PrincipleFunction, registerPrincipleSubscription } from '../../model/principle';
import { Chain, chainName } from './chain.concept';
import { selectState } from '../../model/selector';
import { AxiumState } from '../axium/axium.concept';
import { UnifiedSubject } from '../../model/stagePlanner';

export const chainPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number
) => {
  const subscription = concepts$.subscribe((concepts: Concepts) => {
    const chainState = selectState<Chain>(concepts, chainName);
    if (chainState.actionQue.length > 0) {
      // pass = false;
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
