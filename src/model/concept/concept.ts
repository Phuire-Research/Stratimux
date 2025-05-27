/* eslint-disable @typescript-eslint/no-explicit-any */
/*<$
For the asynchronous graph programming framework Stratimux, define the Concept model file.
This file defines the Concept abstraction that the Muxium uses to Transform its functionality.
A concept is composed of name, muxified, state, qualities, semaphore, principles, and some meta attributes if necessary.
$>*/
/*<#*/
import { PrincipleFunction } from '../principle';
import { createDummyKeyedSelectors, createDummySelectors } from '../selector/selectorAdvanced';
import { Comparators, createComparator } from '../interface';
import { Qualities, Quality } from '../quality';
import { Actions } from '../action/action.type';
import { AnyConcept, Mode, LoadConcepts, ConceptECK, ConceptDECK, ConceptPrincipleFunction } from './concept.type';
import { KeyedSelectors, Selectors } from '../selector/selector.type';

export function createConcept<
  S extends Record<string, unknown>,
  Q = void,
  MuX extends LoadConcepts = Record<string, never>
>(
  name: string,
  state: S,
  _qualities?: Record<string, unknown>,
  principles?: ConceptPrincipleFunction<Q, S>[],
  mode?: Mode[],
  meta?: Record<string,unknown>,
): AnyConcept {
  if (mode) {
    mode.forEach((m, i) => {
      m.toString = () => `MODE: ${name} ${i}`;
    });
  }
  if (principles) {
    principles.forEach((p, i) => {
      p.toString = () => `PRINCIPLE: ${name} ${i}`;
    });
  }
  const actions: Record<string, unknown> = {};
  const comparators: Comparators<any> = {};
  const qualities: Quality<Record<string, unknown>>[] = [];
  if (_qualities) {
    Object.keys(_qualities).forEach(q => {
      const actionSemaphoreBucket: [[number, number, number, number]] = [[-1, -1, -1, -1]];
      const qualia: Quality<any> = {
        ..._qualities[q] as Quality<any>,
        actionSemaphoreBucket
      };
      try {
        actions[q] = qualia.bufferedActionCreator(actionSemaphoreBucket);
        comparators[q] = createComparator(actionSemaphoreBucket);
        qualities.push(qualia as Quality<Record<string, unknown>>);
      } catch (error) {
        console.error('ERROR @: ', q, qualia);
        // console.warn('Check: ', _qualities);
      }
    });
  }
  const deck = {
    d: {} as {
      [name: string]: ConceptECK<S, Q>
    },
    e: actions as Actions<Q extends void ? any : Q>,
    c: comparators as Comparators<Q extends void ? any : Q>,
    k: {} as KeyedSelectors<S> & Selectors<S>
  } as ConceptDECK<S, Q, MuX>;
  return {
    name,
    muxifiedRecord: {}, // Kept for backward compatibility
    state,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: deck.e,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comparators: deck.c,
    keyedSelectors: createDummyKeyedSelectors(state),
    selectors: createDummySelectors(),
    qualities: qualities ? qualities : [],
    q: (_qualities ? _qualities : {}) as Q extends Qualities ? Q : Qualities,
    semaphore: -1,
    principles,
    mode,
    meta,
    // Initialize the new deck property as empty object
    deck,
  };
}

/*#>*/