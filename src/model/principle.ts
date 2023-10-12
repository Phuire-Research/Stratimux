import { Observable, Subscriber, Subscription } from 'rxjs';
import { Concept } from './concept';
import { Action, primeAction } from './action';
import { axiumRegisterSubscriber } from '../concepts/axium/qualities/registerSubscription.quality';
import { UnifiedSubject } from './stagePlanner';

export type PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concept[],
  concept$: UnifiedSubject,
) => void;

export function createPrinciple$(
  principleFunc: PrincipleFunction,
  concepts: Concept[],
  concepts$: UnifiedSubject,
): Observable<Action> {
  return new Observable(function (obs: Subscriber<Action>) {
    principleFunc(obs, concepts, concepts$);
  });
}

export function registerPrincipleSubscription(observer: Subscriber<Action>, concepts: Concept[], name: string, subscription: Subscription) {
  const primedRegisterSubscriber = primeAction(concepts, axiumRegisterSubscriber({ subscription, name }));
  observer.next(primedRegisterSubscriber);
}