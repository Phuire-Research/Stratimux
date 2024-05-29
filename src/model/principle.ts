/*<$
For the asynchronous graph programming framework Stratimux, define the Principle model file.
This file allows for user to define Principle Functions, as well as for the axium to initialize those functions
within its recursive run time.
$>*/
/*<#*/
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Concepts, ConceptsSubscriber } from './concept';
import { Action, Actions, primeAction } from './action';
import { axiumRegisterSubscriber } from '../concepts/axium/qualities/registerSubscription.quality';
import { Planner, Planning, UnifiedSubject } from './stagePlanner';
import { KeyedSelectors } from './selector';
import { BInterface, IsT } from './interface';

export type PrincipleInterface<T = void> = {
  observer: Subscriber<Action>,
  concepts_: Concepts,
  subscribe: ConceptsSubscriber,
  plan: Planning,
  nextC: (concepts: Concepts) => void,
  nextA: (action: Action) => void,
  conceptSemaphore: number,
} & BInterface<T>;

export type PrincipleFunction<T = void> = (
  baseI: PrincipleInterface<T>
) => void;

export function createPrinciple$<T = void>(
  principleFunc: PrincipleFunction<T>,
  concepts_: Concepts,
  plan: Planning,
  subscribe: ConceptsSubscriber,
  nextC: (concepts: Concepts) => void,
  nextA: (action: Action) => void,
  conceptSemaphore: number,
  a_: Actions<T>,
  s_: KeyedSelectors,
  t_: IsT[]
): Observable<Action> {
  return new Observable(function (obs: Subscriber<Action>) {
    principleFunc({
      observer: obs,
      concepts_,
      plan,
      subscribe,
      nextC,
      nextA,
      a_,
      s_,
      t_,
      conceptSemaphore
    });
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