/*<$
For the asynchronous graph programming framework Stratimux, define the Concept model file.
This file defines the Concept abstraction that the Muxium uses to Transform its functionality.
A concept is composed of name, muxified, state, qualities, semaphore, principles, and some meta attributes if necessary.
$>*/
/*<#*/
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { PrincipleFunction } from '../model/principle';
import {
  KeyedSelector,
  KeyedSelectors,
  Selectors,
  createDummyKeyedSelectors,
  createDummySelectors,
} from './selector';
import { MuxifiedSubject } from './stagePlanner';
import { Comparators, createComparator } from './interface';
import { Qualities, Quality } from './quality';
import { Deck } from './deck';
import { Action, ActionCreator, ActionCreatorType, ActionCreatorWithPayload, Actions, ActionType } from './action/action.type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Reducer<
  S extends Record<string, unknown>,
  T = void
> = (state: S, action: Action<T>) => S | null;

export type SpecificReducer<S extends Record<string, unknown>, T = void, C = void> =
  (state: S, action: Action<T>, deck: Deck<C>) => Partial<S> | null;

export type Method<T = void> = Observable<[Action<T>, boolean]>;
export type Principle = Observable<Action>;
export type Self<T = void, C = void> = T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
export type ActionDeck<T = void, C = void> = {action: Action<T>, deck: Deck<C>, self: Self<T>};

export type Mode = ([action, concept, action$, concepts$]: [
  Action<unknown>,
  Concepts,
  Subject<Action>,
  MuxifiedSubject<any, any>,
]) => void;

export type MethodCreatorStep<S extends Record<string, unknown>, T = void, C = void> = () => MethodCreator<S, T, C>;

export type MethodCreator<S extends Record<string, unknown>, T = void, C = void> =
  (concept$: Subject<Concepts>, semaphore: number) => [Method<T>, Subject<ActionDeck<T, C>>];
// export type MethodCreator = (concept$?: MuxifiedSubject, semaphore?: number) => [Method, Subject<Action>];

type Muxified = {
  stateMap: string[];
  actionMap: string[];
};

export type Concept<S extends Record<string, unknown>, Q = void> = {
  name: string;
  muxifiedRecord: Record<string, Muxified>;
  state: S;
  actions: Actions<Q>;
  comparators: Comparators<Q>;
  keyedSelectors: KeyedSelectors<S>;
  selectors: Selectors<S>;
  qualities: Quality<Record<string, unknown>>[];
  q: Q extends Qualities ?
    Q
    :
    Qualities;
  semaphore: number;
  principles?: PrincipleFunction<Q, any, S>[];
  mode?: Mode[];
  meta?: Record<string,unknown>;
};

// export type AnyConcept = Concept<Record<string, unknown>, any> | Concept<Record<string, unknown>, void>;
export type AnyConcept =
  Concept<Record<string, unknown>, Qualities>
  |
  // Concept<Record<string, unknown>, void>
  // |
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  Concept<any, any>;

export type Concepts = Record<number, AnyConcept>;
export type LoadConcepts = Record<string, AnyConcept>;

export type ConceptDeck<T> = {
  [K in keyof T]:
    T[K] extends Concept<Record<string, unknown>, void> ?
      Concept<Record<string, unknown>, void>
      :
      T[K] extends Concept<Record<string, unknown>, Qualities> ?
      Concept<Record<string, unknown>, T[K]['q']>
      :
      Concept<Record<string, unknown>, any>
};

export type ConceptsSubscriber = (observerOrNext?: Partial<Observer<Concepts>> | ((value: Concepts) => void) | undefined) => Subscription;

export function createConcept<S extends Record<string, unknown>, Q = void>(
  name: string,
  state: S,
  _qualities?: Record<string, unknown>,
  principles?: PrincipleFunction<Q, any, S>[],
  mode?: Mode[],
  meta?: Record<string,unknown>,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      try {
        actions[q] = (_qualities[q] as Quality<any>).actionCreator;
        comparators[q] = createComparator((_qualities[q] as Quality<any>).actionSemaphoreBucket);
        qualities.push(_qualities[q] as Quality<Record<string, unknown>>);
      } catch (error) {
        console.error('ERROR @: ', q, _qualities[q]);
        // console.warn('Check: ', _qualities);
      }
    });
  }
  return {
    name,
    muxifiedRecord: {},
    state,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: actions as Actions<Q extends void ? any : Q>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comparators: comparators as Comparators<Q extends void ? any : Q>,
    keyedSelectors: createDummyKeyedSelectors(state),
    selectors: createDummySelectors(),
    qualities: qualities ? qualities : [],
    q: (_qualities ? _qualities : {}) as Q extends Qualities ? Q : Qualities,
    semaphore: -1,
    principles,
    mode,
    meta
  };
}

export function createQuality<S extends Record<string, unknown>, T = void, C = void>(
  actionType: ActionType,
  actionSemaphoreBucket: [number, number, number, number][],
  actionCreator: ActionCreatorType<T>,
  reducer: SpecificReducer<S, T, C>,
  methodCreator?: MethodCreatorStep<S, T, C>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>,
): Quality<S, T, C> {
  return {
    actionType,
    actionCreator,
    actionSemaphoreBucket,
    reducer,
    methodCreator,
    keyedSelectors,
    meta,
    analytics
  };
}
/**
 * This will remove any duplicate qualities, principles, and modes.
 * Note that for now the check for mode and principle are based on concept name and loaded index;
 */
function filterSimilarQualities(concept: AnyConcept) {
  const newQualities: Quality<Record<string, unknown>>[] = [];
  const newMuxified: Record<string, Muxified> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPrinciples: PrincipleFunction<Qualities, any, Record<string, unknown>>[] = [];
  const newMode: Mode[] = [];
  for (let i = 0; i < concept.qualities.length; i++) {
    let found = false;
    for (let j = i + 1; j < concept.qualities.length; j++) {
      if (concept.qualities[i].actionType === concept.qualities[j].actionType) {
        found = true;
        break;
      }
    }
    if (!found) {
      newQualities.push(concept.qualities[i]);
    }
  }
  concept.qualities = newQualities;
  const muxifiedKeys = Object.keys(concept.muxifiedRecord);
  for (let i = 0; i < muxifiedKeys.length; i++) {
    let found = false;
    for (let j = i + 1; j < muxifiedKeys.length; j++) {
      if (muxifiedKeys[i] === muxifiedKeys[j]) {
        found = true;
        break;
      }
    }
    if (!found) {
      newMuxified[muxifiedKeys[i]] = concept.muxifiedRecord[muxifiedKeys[i]];
    }
  }
  concept.muxifiedRecord = newMuxified;
  if (concept.principles) {
    for (let i = 0; i < concept.principles.length; i++) {
      let found = false;
      for (let j = i + 1; j < concept.principles.length; j++) {
        if (concept.principles[i].toString() === concept.principles[j].toString()) {
          found = true;
          break;
        }
      }
      if (!found) {
        newPrinciples.push(concept.principles[i]);
      }
    }
    concept.principles = newPrinciples;
  }
  if (concept.mode) {
    for (let i = 0; i < concept.mode.length; i++) {
      let found = false;
      for (let j = i + 1; j < concept.mode.length; j++) {
        if (concept.mode[i].toString() === concept.mode[j].toString()) {
          found = true;
          break;
        }
      }
      if (!found) {
        newMode.push(concept.mode[i]);
      }
    }
    concept.mode = newMode;
  }
  return concept;
}

function muxify<T extends Qualities, K extends Qualities>(
  base: Concept<Record<string, unknown>, T>,
  target: Concept<Record<string, unknown>, K> | AnyConcept
): Concept<Record<string, unknown>, T & K> {
  if (target.name !== '') {
    base.muxifiedRecord[target.name] = {
      actionMap: Object.keys(target.actions),
      stateMap: Object.keys(target.state)
    };
  }
  base.muxifiedRecord = {
    ...base.muxifiedRecord,
    ...target.muxifiedRecord
  };
  base.state = {
    ...base.state,
    ...target.state,
  };
  base.qualities = [
    ...base.qualities,
    ...target.qualities,
  ];
  base.actions = {
    ...base.actions,
    ...target.actions
  };
  base.comparators = {
    ...base.comparators,
    ...target.comparators
  };
  base.keyedSelectors = {
    ...base.keyedSelectors,
    ...target.keyedSelectors
  };
  if (target.principles) {
    if (base.principles) {
      const principles = [
        ...base.principles,
        ...target.principles
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any;
      base.principles = principles;
    } else {
      const principles = [
        ...target.principles
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any;
      base.principles = principles;
    }
  }
  if (target.mode) {
    if (base.mode) {
      base.mode = [
        ...base.mode,
        ...target.mode
      ];
    } else {
      base.mode = [
        ...target.mode
      ];
    }
  }
  if (target.meta) {
    if (base.meta) {
      base.meta = {
        ...base.meta,
        ...target.meta
      };
    } else {
      base.meta = {
        ...target.mode
      };
    }
  }
  return base as Concept<Record<string, unknown>, T & K>;
}
/**
 * This will muxify concepts while prioritizing qualities later in the provided concepts list via recomposition.
 *  Then finally muxify the emergent concept with final priority.
 */
export function muxifyConcepts<S extends Record<string, unknown>, T extends Qualities>(
  concepts: AnyConcept[],
  emergentConcept: AnyConcept
): AnyConcept {
  const dummy: Record<string, unknown> = {};
  let newConcept = createConcept<typeof dummy, T>('', dummy);
  forEachConcept(concepts, (concept => {
    newConcept = muxify(newConcept, concept);
  }));
  newConcept = muxify(newConcept, emergentConcept);
  const newMuxifiedRecord: Record<string, Muxified> = {};
  Object.keys(newConcept.muxifiedRecord).forEach(name => {
    if (name !== emergentConcept.name) {
      newMuxifiedRecord[name] = newConcept.muxifiedRecord[name];
    }
  });
  newConcept.muxifiedRecord = newMuxifiedRecord;
  newConcept.name = emergentConcept.name;
  if (newConcept.mode) {
    newConcept.mode.forEach((m, i) => {
      m.toString = () => `MODE: ${newConcept.name} ${i}`;
    });
  }
  if (newConcept.principles) {
    newConcept.principles.forEach((p, i) => {
      p.toString = () => `PRINCIPLE: ${newConcept.name} ${i}`;
    });
  }
  return filterSimilarQualities(newConcept as AnyConcept) as Concept<S, T>;
}

export const getMuxifiedName = (concepts: Concepts, semaphore: number): string | undefined => (concepts[semaphore]?.name);

// Will return -1 if not found
export const getConceptSemaphore = (concepts: Concepts, conceptName: string): number => {
  // eslint-disable-next-line consistent-return
  forEachConcept(concepts, (concept, semaphore) => {
    if (concept.name === conceptName) {
      return semaphore;
    }
  });
  return -1;
};

export const isConceptLoaded = (concepts: Concepts, conceptName: string): boolean => {
  const conceptKeys = Object.keys(concepts);
  for (const i of conceptKeys) {
    const index = Number(i);
    if (concepts[index].name === conceptName) {
      return true;
    }
  }
  return false;
};

export const areConceptsLoaded = (concepts: Concepts, conceptNames: string[]): boolean => {
  let allExists = true;
  const conceptKeys = Object.keys(concepts);
  for (const name of conceptNames) {
    let found = false;
    for (const i of conceptKeys) {
      const index = Number(i);
      if (name === concepts[index].name) {
        found = true;
        break;
      }
    }
    if (!found) {
      allExists = false;
      break;
    }
  }
  return allExists;
};

export const forEachConcept = (concepts: Concepts, each: (concept: AnyConcept, semaphore: number) => void) => {
  const conceptKeys = Object.keys(concepts);
  for (const i of conceptKeys) {
    const index = Number(i);
    each(concepts[index], index);
  }
};

const stateToString = (state: Record<string, unknown>): string => {
  let final = '{\n';
  const keys = Object.keys(state);
  for (const key of keys) {
    let input = '';
    try {
      input += `${key}: ${JSON.stringify(state[key])},\n`;
    } catch (err) {
      input = `${key}: [CIRCULAR],\n`;
    }
    final += input;
  }
  final += '}';
  return final;
};

export const conceptToString = (concept: AnyConcept): string => {
  let output = '';
  output += `{\nname: ${concept.name},`;
  const muxifiedKeys = Object.keys(concept.muxifiedRecord);
  if (muxifiedKeys.length > 0) {
    output += `\nmuxified: ${muxifiedKeys},`;
  }
  output += `\nqualities: [ ${concept.qualities.toString()}\n],`;
  output += `\nstate: ${stateToString(concept.state)}, `;
  if (concept.principles) {
    output += `\nprinciples: [ ${concept.principles.map(p => p.toString()).join(',')} ]`;
  }
  if (concept.mode) {
    output += `\nmode: [ ${concept.mode.map(m => m.toString()).join(',')} ]`;
  }
  if (concept.meta) {
    output += `\nmeta: ${JSON.stringify(concept.meta)}`;
  }
  output += '\n}';
  return output;
};

export const conceptsToString = (concepts: Concepts): string => {
  const conceptStringArray: string[] = [];
  forEachConcept(concepts, (concept) => {
    conceptStringArray.push(conceptToString(concept));
  });
  conceptStringArray.push(']');
  return '[\n' + conceptStringArray.join(',\n');
};

export const qualityToString = (quality: Quality<Record<string, unknown>>) => () => {
  const actionType = quality.actionType;
  const r = quality.reducer.toString();
  const reducer = r === 'Default Reducer' ? r : 'Reducer';
  const method = quality.method?.toString();
  return (`\n{\nactionType: ${actionType},\nreducer: ${reducer},\nmethod: ${method}\n}`);
};

export const concept = {
  create: createConcept,
  muxify: muxifyConcepts,
  isLoaded: isConceptLoaded,
  areLoaded: areConceptsLoaded,
  forEach: forEachConcept,
  toString: conceptToString,
  toStringConcepts: conceptsToString,
  toStringQuality: qualityToString,
};
/*#>*/