import { Observable, Subscriber, Subscription } from 'rxjs';
import { Concept } from './concept';
import { Action, primeAction } from './action';
import { axiumRegisterSubscriber } from '../concepts/axium/qualities/registerSubscription.quality';
import { UnifiedSubject } from './stagePlanner';

export type PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concept[],
  concept$: UnifiedSubject,
  semaphore: number,
) => void;

export function createPrinciple$(
  principleFunc: PrincipleFunction,
  concepts: Concept[],
  concepts$: UnifiedSubject,
  semaphore: number,
): Observable<Action> {
  return new Observable(function (obs: Subscriber<Action>) {
    principleFunc(obs, concepts, concepts$, semaphore);
  });
}

export function registerPrincipleSubscription(observer: Subscriber<Action>, concepts: Concept[], name: string, subscription: Subscription) {
  const primedRegisterSubscriber = primeAction(concepts, axiumRegisterSubscriber({ subscription, name }));
  observer.next(primedRegisterSubscriber);
}