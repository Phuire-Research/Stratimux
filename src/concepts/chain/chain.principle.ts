import { Subscriber, Subject } from 'rxjs';
import { Concept } from '../../model/concept';
import { Action, createAction, primeAction } from '../../model/action';
import { PrincipleFunction } from '../../model/principle';
import { Chain, chainName } from './chain.concept';
import { selectState } from '../../model/selector';
import { AxiumState } from '../axium/axium.concept';
import {
  RegisterSubscriberPayload, axiumRegisterSubscriberType,
} from '../axium/qualities/registerSubscriber.quality';

export const chainPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concept[],
  concepts$: Subject<Concept[]>,
) => {
  // let pass = true;
  // setInterval(() => {
  //     pass = true;
  // }, 50);
  const subscriber = concepts$.subscribe((concepts: Concept[]) => {
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
  const primedRegisterSubscriber = primeAction(_concepts, createAction(axiumRegisterSubscriberType));
  primedRegisterSubscriber.payload = {
    subscriber,
    name: chainName,
  } as RegisterSubscriberPayload;
  observer.next(primedRegisterSubscriber);
};
