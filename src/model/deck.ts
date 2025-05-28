/*<$
For the asynchronous graph programming framework Stratimux, define the Deck Model File
$>*/
/*<#*/
import { getMuxiumState } from './muxium/muxiumHelpers';
import { AnyConcept, Concept, Concepts, LoadConcepts, ConceptECK, ConceptDECK, AnyConceptDECK as ImportedAnyConceptDECK } from './concept/concept.type';
import { Comparators } from './interface';
import { BundledSelectors, KeyedSelectors, Selectors } from './selector/selector.type';
import { Actions } from './action/action.type';
import { MuxiumDeck } from '../concepts/muxium/muxium.concept';

// Using the user's provided AnyConceptDECK for the void case.
// This is the type that was in the user's original file for Deck<void>
export type AnyConceptDECK = {
  d: any;
  e: Actions<any>;
  c: Comparators<any>;
  k: BundledSelectors<any> & Selectors<any>; // Assuming Selectors from ConceptDECK
};

export type ECK<S = Record<string, unknown>, Q = void> = {
  e: Actions<Q>;
  c: Comparators<Q>;
  k: BundledSelectors<S>;
};

// Higher Order Functional Composition approach for Muxium-level deck access
// Muxium: { d: { Concept: { d, e, c, k } }, e, c, k }
export type Stratideck<BaseQ, BaseS, Extended> = {
  d: Deck<Extended>;
  e: Actions<BaseQ>;
  c: Comparators<BaseQ>;
  k: BundledSelectors<BaseS>;
};

// Functional Deck type - each concept has its own d, e, c, k without hierarchy as such loses compositional information.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Deck<C> = C extends LoadConcepts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? C extends void
    ? Record<string, AnyConceptDECK> // True any - lossy format
    : {
        [K in keyof C]: C[K] extends Concept<infer S, infer Q, infer D> ?
          ConceptDECK<S, Q, D & Deck<MuxiumDeck>>
          : Deck<MuxiumDeck>
      }
  : Deck<MuxiumDeck>;

// Concept-level deck structure: { d: { e, c, k }, e, c, k }
// The 'd' contains flattened access to muxified qualities/properties
export type ConceptDeck<D extends LoadConcepts> = {
  [K in keyof D]: D[K] extends Concept<infer S, infer Q, Record<string, never>> ?
    ECK<S, Q>
    : never
};

export const accessDeck = <C>(concepts: Concepts): Deck<C> => (getMuxiumState(concepts).deck.d as unknown as Deck<C>)  ;

export const accessECK = <S = Record<string, unknown>, Q = void>(concept: AnyConcept): ECK<S, Q> => {
  return {
    e: concept.actions as Actions<Q>,
    c: concept.comparators as Comparators<Q>,
    k: {
      ...concept.selectors,
      ...concept.keyedSelectors,
    } as BundledSelectors<S>,
  };
};

// Extract flat ECK structures from the new deck system
// This provides access to muxified concept qualities through the deck composition
export const demuxifyDeck = <S = Record<string, unknown>, Q = void>(
  concept: AnyConcept
): {name: string, eck: ECK<S, Q>}[] => {
  const final: {name: string, eck: ECK<S, Q>}[] = [];

  // Use the deck system instead of muxifiedRecord
  if (concept.deck && concept.deck.d) {
    const deckKeys = Object.keys(concept.deck.d);
    deckKeys.forEach(name => {
      const conceptECK = concept.deck.d[name];
      if (conceptECK) {
        const eck: ECK<S, Q> = {
          e: conceptECK.e as Actions<Q>,
          c: conceptECK.c as Comparators<Q>,
          k: conceptECK.k as BundledSelectors<S>
        };
        final.push({
          name,
          eck
        });
      }
    });
  }

  return final;
};
/*#>*/