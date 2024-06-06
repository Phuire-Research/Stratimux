/*<$
For the asynchronous graph programming framework Stratimux, define the Principle model file.
This file allows for user to define Principle Functions, as well as for the axium to initialize those functions
within its recursive run time.
$>*/
/*<#*/
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Concepts, ConceptsSubscriber } from './concept';
import { Action, Actions } from './action';
import { Planning } from './stagePlanner';
import { KeyedSelectors } from './selector';
import { BInterface, IsT } from './interface';
import { AxiumQualities } from '../concepts/axium/qualities';
import { Deck, accessDeck } from './deck';
import { AxiumDeck } from './axium';
import { access } from 'fs';

export type PrincipleInterface<T = void, C = void> = {
  observer: Subscriber<Action>,
  concepts_: Concepts,
  subscribe: ConceptsSubscriber,
  plan: Planning<T, C>,
  nextC: (concepts: Concepts) => void,
  nextA: (action: Action) => void,
  conceptSemaphore: number,
} & BInterface<T, C>;

export type PrincipleFunction<T = void, C = void> = (
  baseI: PrincipleInterface<T, C>
) => void;

export function createPrinciple$<T = void, C = void>(
  principleFunc: PrincipleFunction<T, C>,
  concepts_: Concepts,
  plan: Planning<T, C>,
  subscribe: ConceptsSubscriber,
  nextC: (concepts: Concepts) => void,
  nextA: (action: Action) => void,
  conceptSemaphore: number,
  d_: Deck<C>,
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
      d_,
      a_,
      s_,
      t_,
      conceptSemaphore
    });
  });
}

export function registerPrincipleSubscription<T extends Deck<AxiumDeck>>(
  observer: Subscriber<Action<unknown>>,
  deck: T,
  name: string,
  subscription: Subscription
) {
  const primedRegisterSubscriber = deck.axium.a.axiumRegisterSubscriber({ subscription, name });
  observer.next(primedRegisterSubscriber);
}

export const principle = ({
  createPrinciple$,
  registerPrincipleSubscription
});
/*#>*/