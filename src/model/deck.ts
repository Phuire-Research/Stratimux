/*<$
For the asynchronous graph programming framework Stratimux, define the Deck Model File
$>*/
/*<#*/
import { Actions } from './action';
import { accessAxium, getAxiumState } from './axium';
import { Concept, Concepts, conceptsToString } from './concept';
import { Qualities } from './quality';

export type Deck<T> = {
  [K in keyof T]: {
    a: T[K] extends Concept<Record<string, unknown>, Qualities> ?
    T[K]['actions']
    :
    T[K] extends Concept<Record<string, unknown>, void> ?
    T[K]['actions']
    :
    T[K] extends Concept<any, any> ?
    T[K]['actions']
    :
    Actions<void>
  }
}

export const accessDeck = <T>(concepts: Concepts): Deck<T> => (getAxiumState(concepts).deck as Deck<T>);

/*#>*/