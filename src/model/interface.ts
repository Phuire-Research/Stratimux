/*<$
For the asynchronous graph programming framework Stratimux, define the Interface model file.
$>*/

import { AxiumQualities } from '../concepts/axium/qualities';
import { Action, Actions } from './action';
import { AxiumDeck } from './axium';
import { AnyConcept, Concept } from './concept';
import { Deck } from './deck';
import { KeyedSelectors } from './selector';

/*<#*/
/**
 * is Type Validator, utilizes semaphore in place of ActionType to provide a stringless abstraction for later purposes.
 */
export type Comparator = (action: Action) => boolean;

export type Comparators<T = void> = {
  [K in keyof T]: Comparator
};

export type PrimeComparator = (actionSemaphoreBucket: [number, number, number, number][]) => Comparator;

/**
 * This will curry the actionSemaphoreBucket into a function that will supply type validation without the utilization of string comparison.
 * @param actionSemaphoreBucket [number, number, number, number][]
 * @returns True of False if the action's semaphore matches the curried actionSemaphoreBucket
 * @throws 'ACTION SEMAPHORE BUCKET NOT PRIMED' If the actionSemaphoreBucket has not been primed in the axium.
 */
export const createComparator: PrimeComparator = (actionSemaphoreBucket) => (action) => {
  const semaphore = actionSemaphoreBucket[0];
  if (semaphore[0] && semaphore[0] !== -1) {
    return action.semaphore[0] === semaphore[0] && action.semaphore[1] === semaphore[1];
  } else {
    throw 'ACTION SEMAPHORE BUCKET NOT PRIMED';
  }
};

// Providing these interfaces to avoid overlap and denote some final order that should be maintained when orchestrating plans.
// If you have a plan within a plan. That plan should be represented by some function that you compose into that plan instead.
// Principle -> Plan Creation -> Stages
// BInterface -> HInterface -> UInterface
/**
 * Highest Order Interface
 * U in Stratimux represents the Universal Scale and limit of our physical existence.
 */
export type UInterface<Q = void, C = void, S = void> = {
  // Deck
  d: Deck<C extends void ? AxiumDeck : C>
  // Entry Actions
  e: Actions<Q>
  // Comparators
  c: Comparators<Q>
  // Keyed Selectors
  k: KeyedSelectors<S>
}

/**
 * [TODO] - IMPORTANT
 * Exception: Outer Interface
 * Provides access to all Interfaces via concepts
 * Limited by a whitelist provided by some access property supplied to the Axium
 */
export type OInterface<Q = void, C = void, S = void> = {
  d: Deck<C extends void ? AxiumDeck : C>
  e: Actions<Q>
  c: Comparators<Q>
  k: KeyedSelectors<S>
}

/**
 * Higher Order Interface
 */
export type HInterface<Q = void, C = void, S = void> = {
  d__: Deck<C extends void ? AxiumDeck : C>
  e__: Actions<Q>
  c__: Comparators<Q>
  k__: KeyedSelectors<S>
}

/**
 * Base Interface
 */
export type BInterface<Q = void, C = void, S = void> = {
  d_: Deck<C extends void ? AxiumDeck : C>,
  e_: Actions<Q>
  c_: Comparators<Q>
  k_: KeyedSelectors<S>
}
/*#>*/