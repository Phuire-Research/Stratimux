/*<$
For the asynchronous graph programming framework Stratimux, define the Concept model file.
This file defines the Concept abstraction that the Axium uses to Transform its functionality.
A concept is composed of name, unified, state, qualities, semaphore, principles, and some meta attributes if necessary.
$>*/
/*<#*/
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { Action, ActionCreator, ActionCreatorType, ActionCreatorWithPayload, ActionType, Actions } from './action';
import { PrincipleFunction } from '../model/principle';
import { strategySuccess } from './actionStrategy';
import { map } from 'rxjs';
import { KeyedSelector, KeyedSelectors } from './selector';
import { axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';
import { UnifiedSubject } from './stagePlanner';
import { IsT } from './interface';
import { Qualities, Quality } from './quality';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Reducer = (state: any, action: Action) => any;

export type Method = Observable<[Action, boolean]>;
export type Principle = Observable<Action>;

export type Mode = ([action, concept, action$, concepts$]: [
  Action,
  Concepts,
  Subject<Action>,
  UnifiedSubject,
]) => void;

export type MethodCreator = (concept$: Subject<Concepts>, semaphore: number) => [Method, Subject<Action>];
// export type MethodCreator = (concept$?: UnifiedSubject, semaphore?: number) => [Method, Subject<Action>];

export type Concept<T = void> = {
  name: string;
  unified: string[];
  state: Record<string, unknown>;
  actions: Actions<T>;
  selectors: KeyedSelectors;
  typeValidators: IsT[]
  qualities: Quality<unknown>[];
  q: Record<string, unknown>;
  semaphore: number;
  principles?: PrincipleFunction<T>[];
  mode?: Mode[];
  meta?: Record<string,unknown>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyConcept = Concept<any>;

export type Concepts = Record<number, AnyConcept>;

export type ConceptDeck = Record<string, Concept<any>>;

export type ConceptsSubscriber = (observerOrNext?: Partial<Observer<Concepts>> | ((value: Concepts) => void) | undefined) => Subscription;

export function createConcept<T = void>(
  name: string,
  state: Record<string, unknown>,
  _qualities?: Record<string, unknown>,
  principles?: PrincipleFunction<T>[],
  mode?: Mode[],
  meta?: Record<string,unknown>,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Concept<T> {
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
  const qualities: Quality<unknown>[] = [];
  if (_qualities) {
    Object.keys(_qualities).forEach(q => {
      try {
        actions[q] = (_qualities[q] as Quality<unknown>).actionCreator;
        qualities.push(_qualities[q] as Quality<unknown>);
      } catch (error) {
        console.error('ERROR @: ', q, _qualities[q]);
        // console.warn('Check: ', _qualities);
      }
    });
  }
  return {
    name,
    unified: [],
    state,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: actions as Actions<T extends void ? any : T>,
    selectors: {},
    typeValidators: [],
    qualities: qualities ? qualities : [],
    q: _qualities ? _qualities : {},
    semaphore: -1,
    principles,
    mode,
    meta
  };
}

export function createQuality<T = void>(
  actionType: ActionType,
  actionSemaphoreBucket: [number, number, number, number][],
  actionCreator: ActionCreatorType<T>,
  reducer: Reducer,
  methodCreator?: MethodCreator,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>,
): Quality<T> {
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
  const newQualities: Quality<unknown>[] = [];
  const newUnified: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPrinciples: PrincipleFunction<any>[] = [];
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
  for (let i = 0; i < concept.unified.length; i++) {
    let found = false;
    for (let j = i + 1; j < concept.unified.length; j++) {
      if (concept.unified[i] === concept.unified[j]) {
        found = true;
        break;
      }
    }
    if (!found) {
      newUnified.push(concept.unified[i]);
    }
  }
  concept.unified = newUnified;
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

function unify<T extends Qualities, K extends Qualities>(base: Concept<T>, target: Concept<K>): Concept<T & K> {
  if (target.name !== '') {
    base.unified.push(target.name);
  }
  base.unified = [
    ...base.unified,
    ...target.unified
  ];
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
  return base as Concept<T & K>;
}
/**
 * This will unify concepts while prioritizing qualities later in the provided concepts list via recomposition.
 *  Then finally unify the emergent concept with final priority.
 */
export function unifyConcepts<T extends Qualities>(
  concepts: AnyConcept[],
  emergentConcept: AnyConcept
): Concept<T> {
  let newConcept = createConcept<T>('', {});
  forEachConcept(concepts, (concept => {
    newConcept = unify(newConcept, concept);
  }));
  newConcept = unify(newConcept, emergentConcept);
  newConcept.unified = newConcept.unified.filter(name => name !== emergentConcept.name);
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
  return filterSimilarQualities(newConcept);
}

export const getUnifiedName = (concepts: Concepts, semaphore: number): string | undefined => (concepts[semaphore]?.name);

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
  if (concept.unified.length > 0) {
    output += `\nunified: ${concept.unified},`;
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
  unify: unifyConcepts,
  isLoaded: isConceptLoaded,
  areLoaded: areConceptsLoaded,
  forEach: forEachConcept,
  toString: conceptToString,
  toStringConcepts: conceptsToString,
  toStringQuality: qualityToString,
};
/*#>*/