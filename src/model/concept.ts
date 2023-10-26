import { Observable, Subject, debounceTime, switchMap, withLatestFrom } from 'rxjs';
import { Action, ActionType } from './action';
import { PrincipleFunction } from '../model/principle';
import { strategySuccess } from './actionStrategy';
import { map } from 'rxjs';
import { KeyedSelector } from './selector';
import { axiumConclude, axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';
import { UnifiedSubject } from './stagePlanner';
import { ActionController, createActionController$ } from './actionController';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Reducer = (state: any, action: Action) => any;

export type Method = Observable<Action>;
export type Principle = Observable<Action>;

export type Mode = ([action, concept, action$, concepts$]: [
  Action,
  Concept[],
  Subject<Action>,
  UnifiedSubject,
]) => void;

export type MethodCreator = (concept$?: UnifiedSubject, semaphore?: number) => [Method, Subject<Action>];

export type Quality = {
  actionType: ActionType;
  reducer: Reducer;
  methodCreator?: MethodCreator;
  method?: Method;
  subject?: Subject<Action>;
  keyedSelectors?: KeyedSelector[];
  meta?: Record<string,unknown>;
  analytics?: Record<string,unknown>;
};

export type Concept = {
  name: string;
  unified: string[];
  state: Record<string, unknown>;
  qualities: Quality[];
  principles?: PrincipleFunction[];
  mode?: Mode[];
  meta?: Record<string,unknown>;
};

export type Concepts = Record<number, Concept>;

export function createConcept(
  name: string,
  state: Record<string, unknown>,
  qualities?: Quality[],
  principles?: PrincipleFunction[],
  mode?: Mode[],
  meta?: Record<string,unknown>
): Concept {
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
  return {
    name,
    unified: [],
    state,
    qualities: qualities ? qualities : [],
    principles,
    mode,
    meta
  };
}

/**
 * This will remove any duplicate qualities, principles, and modes.
 * Note that for now the check for mode and principle are based on concept name and loaded index;
 */
function filterSimilarQualities(concept: Concept) {
  const newQualities: Quality[] = [];
  const newUnified: string[] = [];
  const newPrinciples: PrincipleFunction[] = [];
  const newMode: Mode[] = [];
  for (let i = 0; i < concept.qualities.length; i++) {
    let found = false;
    for (let j = 1; j < concept.qualities.length; j++) {
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
    for (let j = 1; j < concept.unified.length; j++) {
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
      for (let j = 1; j < concept.principles.length; j++) {
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
      for (let j = 1; j < concept.mode.length; j++) {
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

function unify(base: Concept, target: Concept): Concept {
  base.unified.push(target.name);
  base.state = {
    ...base.state,
    ...target.state,
  };
  base.qualities = [
    ...base.qualities,
    ...target.qualities,
  ];
  if (target.principles) {
    if (base.principles) {
      base.principles = [
        ...base.principles,
        ...target.principles
      ];
    } else {
      base.principles = [
        ...target.principles
      ];
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
  return base;
}
/**
 * Will document the usage of such after UI concept release.
 */
export function unifyConcepts(
  concepts: Concept[],
  emergentConcept: Concept
): Concept {
  let newConcept = createConcept('', {});
  concepts.forEach(concept => {
    newConcept = unify(newConcept, concept);
  });
  newConcept = unify(newConcept, emergentConcept);
  newConcept.name = emergentConcept.name;
  return filterSimilarQualities(newConcept);
}

/**
 * Naming pattern for unified concepts within STRX
 * unifiedName: base-target
 * @IMPORTANT concept folder must carry the same naming convention
 */

export function createQuality(
  actionType: ActionType,
  reducer: Reducer,
  methodCreator?: MethodCreator,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>,
): Quality {
  return {
    actionType,
    reducer,
    methodCreator,
    keyedSelectors,
    meta,
    analytics
  };
}

export function defaultReducer(state: unknown, _: Action) {
  return state;
}

export const defaultMethodCreator: MethodCreator = () : [Method, Subject<Action>] =>  {
  const defaultSubject = new Subject<Action>();
  const defaultMethod: Method = defaultSubject.pipe(
    map((action: Action) => {
      if (action.strategy) {
        return strategySuccess(action.strategy);
      }
      return {
        ...action,
        type: axiumConcludeType
      };
    }),
  );
  return [defaultMethod, defaultSubject];
};

export const isConceptLoaded = (concepts: Concept[], conceptName: string): boolean => {
  for (const concept of concepts) {
    if (concept.name === conceptName) {
      return true;
    }
  }
  return false;
};

export const areConceptsLoaded = (concepts: Concept[], conceptNames: string[]): boolean => {
  let allExists = true;
  for (const name of conceptNames) {
    let found = false;
    for (const concept of concepts) {
      if (name === concept.name) {
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
