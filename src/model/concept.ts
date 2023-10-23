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

export type MethodCreator = (concept$?: UnifiedSubject) => [Method, Subject<Action>];

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
  state: unknown;
  qualities: Quality[];
  principles?: PrincipleFunction[];
  mode?: Mode[];
  meta?: Record<string,unknown>;
};

export function createConcept(
  name: string,
  state: unknown,
  qualities?: Quality[],
  principles?: PrincipleFunction[],
  mode?: Mode[],
  meta?: Record<string,unknown>
): Concept {
  return {
    name,
    state,
    qualities: qualities ? qualities : [],
    principles,
    mode,
    meta
  };
}

// Will document usage later
export function unifyConcepts(
  baseConcept: Concept,
  targetConcept: Concept,
  unifiedName: string
): Concept {
  const baseConceptState = baseConcept.state as object;
  const targetConceptState = targetConcept.state as object;
  let baseConceptPrinciples: PrincipleFunction[] = [];
  if (baseConcept.principles) {
    baseConceptPrinciples = baseConcept.principles;
  }
  let targetConceptPrinciples: PrincipleFunction[] = [];
  if (targetConcept.principles) {
    targetConceptPrinciples = targetConcept.principles;
  }
  let baseConceptMode: Mode[] = [];
  if (baseConcept.mode) {
    baseConceptMode = baseConcept.mode;
  }
  let targetConceptMode: Mode[] = [];
  if (targetConcept.mode) {
    targetConceptMode = targetConcept.mode;
  }
  let baseConceptMeta: Record<string,unknown> = {};
  if (baseConcept.meta) {
    baseConceptMeta = baseConcept.meta;
  }
  let targetConceptMeta: Record<string,unknown> = {};
  if (targetConcept.meta) {
    targetConceptMeta = targetConcept.meta;
  }

  return {
    name: unifiedName,
    qualities: [...baseConcept.qualities, ...targetConcept.qualities],
    state: {
      ...baseConceptState,
      ...targetConceptState,
    },
    principles: [...baseConceptPrinciples, ...targetConceptPrinciples],
    mode: [...baseConceptMode, ...targetConceptMode],
    meta: {...baseConceptMeta, ...targetConceptMeta}
  };
}

/**
 * Naming pattern for unified concepts within STRX
 * unifiedName: base-target
 * @IMPORTANT concept folder must carry the same naming convention
 */
export function unifyConceptNames(base: string, target: string) {
  return base + '-' + target;
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
