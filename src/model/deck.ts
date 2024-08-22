/*<$
For the asynchronous graph programming framework Stratimux, define the Deck Model File
$>*/
/*<#*/
import { Actions } from './action';
import { accessAxium, getAxiumState } from './axium';
import { AnyConcept, Concept, Concepts, conceptsToString } from './concept';
import { Comparators } from './interface';
import { Qualities } from './quality';
import { KeyedSelectors } from './selector';

export type Decks<BaseQ, BaseS, Extended> = {
  d: Deck<Extended>;
  e: Actions<BaseQ>
  c: Comparators<BaseQ>
  k: KeyedSelectors<BaseS>
  s: unknown
};

export type Deck<C> = {
  [K in keyof C]: {
    e: C[K] extends Concept<Record<string, unknown>, Qualities> ?
    C[K]['actions']
    :
    C[K] extends Concept<Record<string, unknown>, void> ?
    C[K]['actions']
    :
    C[K] extends AnyConcept ?
    C[K]['actions']
    :
    Actions<void>
    c: C[K] extends Concept<Record<string, unknown>, Qualities> ?
    C[K]['comparators']
    :
    C[K] extends Concept<Record<string, unknown>, void> ?
    C[K]['comparators']
    :
    C[K] extends AnyConcept ?
    C[K]['comparators']
    :
    Comparators<void>
    k: C[K] extends Concept<Record<string, unknown>, Qualities> ?
    C[K]['keyedSelectors']
    :
    C[K] extends Concept<Record<string, unknown>, void> ?
    C[K]['keyedSelectors']
    :
    C[K] extends AnyConcept ?
    C[K]['keyedSelectors']
    :
    KeyedSelectors<void>
    s: unknown
  }
}

export const accessDeck = <C>(concepts: Concepts): Deck<C> => (getAxiumState(concepts).deck.d as Deck<C>);

/*#>*/