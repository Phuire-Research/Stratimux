/*<$
For the asynchronous graph programming framework Stratimux, define the Interface model file.
$>*/

import { Action, Actions } from './action/action.type';
import { LoadConcepts } from './concept/concept.type';
import { Deck, Stratideck } from './deck';
import { Quality } from './quality';
import { BundledSelectors } from './selector/selector.type';

/*<#*/
/**
 * is Type Validator, utilizes semaphore in place of ActionType to provide a stringless abstraction for later purposes.
 */
export type Comparator = (action: Action) => boolean;

export type Comparators<T = void> = {
  [K in keyof T]: Comparator
};

export type PrimeComparator = (quality: Quality<Record<string, unknown>>) => Comparator;

/**
 * This will curry the actionSemaphoreBucket into a function that will supply type validation without the utilization of string comparison.
 * @param actionSemaphoreBucket [number, number, number, number][]
 * @returns True of False if the action's semaphore matches the curried actionSemaphoreBucket
 * @throws 'ACTION SEMAPHORE BUCKET NOT PRIMED' If the actionSemaphoreBucket has not been primed in the muxium.
 */
export const createComparator: PrimeComparator = (quality: Quality<Record<string, unknown>>) => (action) => {
  const identity = quality.qualityIdentity;
  return identity === action.identity;
};

// Providing these interfaces to avoid overlap and denote some final order that should be maintained when orchestrating plans.
// If you have a plan within a plan. That plan should be represented by some function that you compose into that plan instead.
// Principle -> Plan Creation -> Stages
// BInterface -> HInterface -> UInterface
/**
 * Highest Order Interface
 * U in Stratimux represents the Universal Scale and limit of our physical existence.
 * Fixed to preserve specific concept types through functional composition
 */
export type UInterface<Q = void, C = void, S = void> = {
  // Deck - preserves specific concept types instead of degrading to AnyConcept
  d: Deck<C>
  // Entry Actions
  e: Actions<Q>
  // Comparators
  c: Comparators<Q>
  // Keyed Selectors
  k: BundledSelectors<S>,
}

/**
 * [TODO] - IMPORTANT
 * Exception: Outer Interface
 * Provides access to all Interfaces via concepts
 * Limited by a whitelist provided by some access property supplied to the Muxium
 */
export type OInterface<Q = void, C = void, S = void> = {
  d: Deck<C>
  e: Actions<Q>
  c: Comparators<Q>
  k: BundledSelectors<S>
}

/**
 * Higher Order Interface
 */
export type HInterface<Q = void, C = void, S = void> = {
  d__: Deck<C>
  e__: Actions<Q>
  c__: Comparators<Q>
  k__: BundledSelectors<S>,
}

/**
 * Base Interface
 */
export type BInterface<Q = void, C = void, S = void> = {
  d_: Deck<C>
  e_: Actions<Q>
  c_: Comparators<Q>
  k_: BundledSelectors<S>,
}
/*#>*/