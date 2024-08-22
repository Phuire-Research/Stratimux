/*<$
For the asynchronous graph programming framework Stratimux, define the Principle model file.
This file allows for user to define Principle Functions, as well as for the axium to initialize those functions
within its recursive run time.
$>*/
/*<#*/
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Concepts, ConceptsSubscriber, LoadConcepts } from './concept';
import { Action, Actions } from './action';
import { Planning } from './stagePlanner';
import { KeyedSelectors, Selectors } from './selector';
import { BInterface, Comparators } from './interface';
import { AxiumQualities } from '../concepts/axium/qualities';
import { Deck, accessDeck } from './deck';
import { access } from 'fs';
import { Qualities } from './quality';

export type PrincipleInterface<Q = void, C = void, S = void> = {
  observer: Subscriber<Action>,
  concepts_: Concepts,
  subscribe: ConceptsSubscriber,
  plan: Planning<Q, C, S>,
  nextC: (concepts: Concepts) => void,
  nextA: (action: Action) => void,
  conceptSemaphore: number,
} & BInterface<Q, C, S>;

export type PrincipleFunction<Q = void, C = void, S = void> = (
  baseI: PrincipleInterface<Q, C, S>
) => void;

export function createPrinciple$<Q = void, C = void, S = void>(
  principleFunc: PrincipleFunction<Q, C, S>,
  concepts_: Concepts,
  plan: Planning<Q, C, S>,
  subscribe: ConceptsSubscriber,
  nextC: (concepts: Concepts) => void,
  nextA: (action: Action) => void,
  conceptSemaphore: number,
  d_: Deck<C extends void ? LoadConcepts : C>,
  e_: Actions<Q extends Qualities ? Q : Qualities>,
  c_: Comparators<Q extends Qualities ? Q : Qualities>,
  k_: KeyedSelectors<S>,
  s_: Selectors<S>
): Observable<Action> {
  return new Observable(function (obs: Subscriber<Action>) {
    principleFunc({
      observer: obs,
      concepts_,
      plan,
      subscribe,
      nextC,
      nextA,
      d_,
      e_,
      c_,
      k_,
      s_,
      conceptSemaphore
    });
  });
}

export function registerPrincipleSubscription<T extends Deck<LoadConcepts>>(
  observer: Subscriber<Action<unknown>>,
  deck: T,
  name: string,
  subscription: Subscription
) {
  const primedRegisterSubscriber = deck.axium.e.axiumRegisterSubscriber({ subscription, name });
  observer.next(primedRegisterSubscriber);
}

export const principle = ({
  createPrinciple$,
  registerPrincipleSubscription
});
/*#>*/