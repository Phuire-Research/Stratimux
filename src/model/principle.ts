import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { Concept } from './concept';
import { Action, createAction, primeAction } from './action';
import { RegisterSubscriberPayload, axiumRegisterSubscriberType } from '../concepts/axium/qualities/registerSubscriber.quality';
import { axiumKey } from '../concepts/axium/axium.concept';

export type PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concept[],
  subConcept$: Subject<Concept[]>,
) => void;

export function createPrinciple$(
  principleFunc: PrincipleFunction,
  concepts: Concept[],
  concepts$: Subject<Concept[]>,
): Observable<Action> {
  return new Observable(function (obs: Subscriber<Action>) {
    principleFunc(obs, concepts, concepts$);
  });
}

export function registerPrincipleSubscription(observer: Subscriber<Action>, concepts: Concept[], subscriber: Subscription) {
  const primedRegisterSubscriber = primeAction(concepts, createAction(axiumRegisterSubscriberType));
  primedRegisterSubscriber.payload = { subscriber, key: axiumKey } as RegisterSubscriberPayload;
  observer.next(primedRegisterSubscriber);
}