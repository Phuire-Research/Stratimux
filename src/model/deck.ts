/*<$
For the asynchronous graph programming framework Stratimux, define the Deck Model File
$>*/
/*<#*/
import { Actions } from './action';
import { accessAxium, getAxiumState } from './axium';
import { Concept, Concepts, conceptsToString } from './concept';
import { Comparators } from './interface';
import { Qualities } from './quality';
import { KeyedSelectors } from './selector';

export type Deck<C> = {
  [K in keyof C]: {
    e: C[K] extends Concept<Record<string, unknown>, Qualities> ?
    C[K]['actions']
    :
    C[K] extends Concept<Record<string, unknown>, void> ?
    C[K]['actions']
    :
    C[K] extends Concept<any, any> ?
    C[K]['actions']
    :
    Actions<void>
    c: C[K] extends Concept<Record<string, unknown>, Qualities> ?
    C[K]['comparators']
    :
    C[K] extends Concept<Record<string, unknown>, void> ?
    C[K]['comparators']
    :
    C[K] extends Concept<any, any> ?
    C[K]['comparators']
    :
    Comparators<void>
    k: C[K] extends Concept<Record<string, unknown>, Qualities> ?
    C[K]['selectors']
    :
    C[K] extends Concept<Record<string, unknown>, void> ?
    C[K]['selectors']
    :
    C[K] extends Concept<any, any> ?
    C[K]['selectors']
    :
    KeyedSelectors<void>
    s: unknown
    // s: C[K] extends Concept<Record<string, unknown>, Qualities> ?
    // // Selectors<C[K]['state'], C[K]>
    // Selectors<C[K]['state']>
    // :
    // C[K] extends Concept<Record<string, unknown>, void> ?
    // // Selectors<C[K]['state'], C[K]>
    // Selectors<C[K]['state']>
    // :
    // C[K] extends Concept<any, any> ?
    // // Selectors<Record<string, unknown>, C[K]>
    // Selectors<Record<string, unknown>>
    // :
    // // Selectors<Record<string, unknown>, AnyConcept>
    // Selectors<Record<string, unknown>>
  }
}

export const accessDeck = <C>(concepts: Concepts): Deck<C> => (getAxiumState(concepts).deck as Deck<C>);

/*#>*/