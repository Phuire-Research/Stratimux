/*<$
For the asynchronous graph programming framework Stratimux, define the Deck Model File
$>*/
/*<#*/
import { getMuxiumState } from './muxium/muxiumHelpers';
import { AnyConcept, Concept, Concepts, LoadConcepts, ConceptECK, ConceptDECK, AnyConceptDECK } from './concept/concept.type';
import { Comparators } from './interface';
import { Qualities } from './quality';
import { BundledSelectors, KeyedSelectors, Selectors } from './selector/selector.type';
import { Actions } from './action/action.type';
import { MuxiumDeck } from '../concepts/muxium/muxium.concept';

// Functional composition approach for Muxium-level deck access
// Muxium: { d: { Concept: { d, e, c, k } }, e, c, k }
export type Decks<BaseQ, BaseS, Extended> = {
  d: Deck<Extended>;
  e: Actions<BaseQ>;
  c: Comparators<BaseQ>;
  k: BundledSelectors<BaseS>;
};

// Functional Deck type - each concept has its own d, e, c, k without hierarchy
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Deck<C> = C extends LoadConcepts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? C extends void
    ? Record<string, AnyConceptDECK> // True any - lossy format
    : {
        [K in keyof C]: C[K] extends Concept<infer S, infer Q, infer D> ?
          ConceptDECK<S, Q, D> & Deck<MuxiumDeck>
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

export type ECK<S = Record<string, unknown>, Q = void> = {
  e: Actions<Q>;
  c: Comparators<Q>;
  k: BundledSelectors<S>;
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

// Functional deck activation with halting API
// Each concept gets its own { d: { e, c, k }, e, c, k } structure where 'd' contains
// functional composition of muxified qualities/properties without recursive hierarchies
export const activateDeck = <
  S extends Record<string, unknown> = Record<string, unknown>,
  Q = void,
  D extends LoadConcepts = Record<string, never>
>(
    concept: Concept<S, Q, D>,
    muxifiedConcepts: LoadConcepts = {} as LoadConcepts
  ): ConceptDECK<S, Q, D> => {
  // Build the 'd' structure with functional composition - halting API
  const deckComposition = {} as {
    [K in keyof D]: D[K] extends Concept<infer CS, infer CQ> ?
      ConceptECK<CS, CQ>
      : never
  };

  // Functionally compose each muxified concept's qualities/properties
  // No hierarchical structures - just functional access to e, c, k
  Object.keys(muxifiedConcepts).forEach(key => {
    const muxifiedConcept = muxifiedConcepts[key];
    if (muxifiedConcept) {
      const conceptECK: ConceptECK<Record<string, unknown>, unknown> = {
        e: muxifiedConcept.actions as Actions<unknown>,
        c: muxifiedConcept.comparators as Comparators<unknown>,
        k: {
          ...muxifiedConcept.selectors,
          ...muxifiedConcept.keyedSelectors,
        } as BundledSelectors<Record<string, unknown>> & Selectors<Record<string, unknown>>
      };
      (deckComposition as Record<string, ConceptECK<Record<string, unknown>, unknown>>)[key] = conceptECK;
    }
  });

  // Return the complete ConceptDECK structure with halting API
  return {
    d: deckComposition,
    e: concept.actions,
    c: concept.comparators,
    k: {
      ...concept.selectors,
      ...concept.keyedSelectors,
    } as BundledSelectors<S> & Selectors<S>,
  };
};
/*#>*/