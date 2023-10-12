import { Subscriber, Subject } from 'rxjs';
import { Concept } from '../../model/concept';
import { Action } from '../../model/action';
import { PrincipleFunction, registerPrincipleSubscription } from '../../model/principle';
import { Chain, chainName } from './chain.concept';
import { selectState } from '../../model/selector';
import { AxiumState } from '../axium/axium.concept';

export const chainPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concept[],
  concepts$: Subject<Concept[]>,
) => {
  const subscription = concepts$.subscribe((concepts: Concept[]) => {
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
