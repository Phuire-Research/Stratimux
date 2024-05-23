/*<$
For the asynchronous graph programming framework Stratimux, define the Principle model file.
This file allows for user to define Principle Functions, as well as for the axium to initialize those functions
within its recursive run time.
$>*/
/*<#*/
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Concepts } from './concept';
import { Action, Actions, primeAction } from './action';
import { axiumRegisterSubscriber } from '../concepts/axium/qualities/registerSubscription.quality';
import { UnifiedSubject } from './stagePlanner';
import { KeyedSelectors } from './selector';

export type PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concepts,
  concept$: UnifiedSubject,
  actions: Actions,
  keyedSelectors: KeyedSelectors
) => void;

export function createPrinciple$(
  principleFunc: PrincipleFunction,
  concepts: Concepts,
  concepts$: UnifiedSubject,
  actions: Actions,
  keyedSelectors: KeyedSelectors
): Observable<Action> {
  return new Observable(function (obs: Subscriber<Action>) {
    principleFunc(obs, concepts, concepts$, actions, keyedSelectors);
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