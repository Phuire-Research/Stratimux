/*<$
For the asynchronous graph programming framework Stratimux, define the Principle model file.
This file allows for user to define Principle Functions, as well as for the axium to initialize those functions
within its recursive run time.
$>*/
/*<#*/
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Actions, Concepts, Qualities, Quality } from './concept';
import { Action, primeAction } from './action';
import { axiumRegisterSubscriber } from '../concepts/axium/qualities/registerSubscription.quality';
import { UnifiedSubject } from './stagePlanner';
import { KeyedSelectors } from './selector';
import { isT, uInterface } from './interface';

export type PrincipleInterface<T> = {
  observer: Subscriber<Action>,
  _concepts: Concepts,
  concepts$: UnifiedSubject,
  conceptSemaphore: number,
} & uInterface<T>;

export type PrincipleFunction<T = void> = (
  uI: PrincipleInterface<T>
) => void;

export function createPrinciple$<T = void>(
  principleFunc: PrincipleFunction<T>,
  _concepts: Concepts,
  concepts$: UnifiedSubject,
  a: Actions<T>,
  s: KeyedSelectors,
  t: isT[],
  conceptSemaphore: number,
): Observable<Action> {
  return new Observable(function (obs: Subscriber<Action>) {
    principleFunc({observer: obs, _concepts, concepts$, a, s, t, conceptSemaphore});
  });
}

export function registerPrincipleSubscription(observer: Subscriber<Action>, concepts: Concepts, name: string, subscription: Subscription) {
  const primedRegisterSubscriber = primeAction(concepts, axiumRegisterSubscriber({ subscription, name }));
  observer.next(primedRegisterSubscriber);
}

export const principle = ({
  createPrinciple$,
  registerPrincipleSubscription
});
/*#>*/