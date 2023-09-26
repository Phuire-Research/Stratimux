import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { Concept } from './concept';
import { Action, createAction, primeAction } from './action';
import { RegisterSubscriberPayload, axiumRegisterSubscriberType } from '../concepts/axium/qualities/registerSubscriber.quality';
import { UnifiedSubject } from './unifiedSubject';

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

export function registerPrincipleSubscription(observer: Subscriber<Action>, concepts: Concept[], name: string, subscriber: Subscription) {
  const primedRegisterSubscriber = primeAction(concepts, createAction(axiumRegisterSubscriberType));
  primedRegisterSubscriber.payload = { subscriber, name } as RegisterSubscriberPayload;
  observer.next(primedRegisterSubscriber);
}