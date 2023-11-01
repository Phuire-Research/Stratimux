import { Observable, Subject, debounceTime, switchMap, withLatestFrom } from 'rxjs';
import { Action, ActionType } from './action';
import { PrincipleFunction } from '../model/principle';
import { strategySuccess } from './actionStrategy';
import { map } from 'rxjs';
import { KeyedSelector } from './selector';
import { axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';
import { UnifiedSubject } from './stagePlanner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Reducer = (state: any, action: Action) => any;

export type Method = Observable<Action>;
export type Principle = Observable<Action>;

export type Mode = ([action, concept, action$, concepts$]: [
  Action,
  Concepts,
  Subject<Action>,
  UnifiedSubject,
]) => void;

export type MethodCreator = (concept$?: UnifiedSubject, semaphore?: number) => [Method, Subject<Action>];

export type Quality = {
  actionType: ActionType;
  reducer: Reducer;
  toString: () => string;
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
  semaphore: number;
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
    semaphore: -1,
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
 * This will unify concepts while prioritizing qualities later in the provided concepts list via recomposition.
 *  Then finally unify the emergent concept with final priority.
 */
export function unifyConcepts(
  concepts: Concept[],
  emergentConcept: Concept
): Concept {
  let newConcept = createConcept('', {});
  forEachConcept(concepts, (concept => {
    newConcept = unify(newConcept, concept);
  }));
  newConcept = unify(newConcept, emergentConcept);
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
defaultReducer.toString = () => ('Default Reducer');

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

  defaultMethod.toString = () => ('Default Method');
  return [defaultMethod, defaultSubject];
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

export const forEachConcept = (concepts: Concepts, each: (concept: Concept, semaphore?: number) => void) => {
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
      input = `${key}: CIRCULAR,\n`;
    }
    final += input;
  }
  final += '}';
  return final;
};

export const conceptToString = (concept: Concept): string => {
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

export const qualityToString = (quality: Quality) => () => {
  const actionType = quality.actionType;
  const r = quality.reducer.toString();
  const reducer = r === 'Default Reducer' ? r : 'Reducer';
  const method = quality.method?.toString();
  return (`\n{\nactionType: ${actionType},\nreducer: ${reducer},\nmethod: ${method}\n}`);
};