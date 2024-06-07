/*<$
For the asynchronous graph programming framework Stratimux, define the Deck Model File
$>*/
/*<#*/
import { Actions } from './action';
import { accessAxium, getAxiumState } from './axium';
import { Concept, Concepts, conceptsToString } from './concept';
import { Qualities } from './quality';

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
  }
}

export const accessDeck = <T>(concepts: Concepts): Deck<T> => (getAxiumState(concepts).deck as Deck<T>);

/*#>*/