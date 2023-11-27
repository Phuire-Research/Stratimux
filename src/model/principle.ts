/*<$
For the graph programming framework Stratimux, define the Principle model file.
This file allows for user to define Principle Functions, as well as for the axium to initialize those functions
within its recursive run time.
$>*/
/*<#*/
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Concepts } from './concept';
import { Action, primeAction } from './action';
import { axiumRegisterSubscriber } from '../concepts/axium/qualities/registerSubscription.quality';
import { UnifiedSubject } from './stagePlanner';

export type PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concepts,
  concept$: UnifiedSubject,
  semaphore: number,
) => void;

export function createPrinciple$(
  principleFunc: PrincipleFunction,
  concepts: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number,
): Observable<Action> {
  return new Observable(function (obs: Subscriber<Action>) {
    principleFunc(obs, concepts, concepts$, semaphore);
  });
}

export function registerPrincipleSubscription(observer: Subscriber<Action>, concepts: Concepts, name: string, subscription: Subscription) {
  const primedRegisterSubscriber = primeAction(concepts, axiumRegisterSubscriber({ subscription, name }));
  observer.next(primedRegisterSubscriber);
}
/*#>*/