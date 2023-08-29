import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Action } from './action';
import { PrincipleFunction } from '../model/principle';
import { endOfActionStrategy, strategySuccess } from './actionStrategy';
import { map } from 'rxjs';

export type Reducer = (state: any, action: Action) => any;

export type Method = Observable<Action>;
export type Principle = Observable<Action>;

export type Mode = ([action, concept, action$, concepts$]: [
    Action,
    Concept[],
    Subject<Action>,
    BehaviorSubject<Concept[]>,
]) => void;

export type Quality = {
    action: Action;
    reducer: Reducer;
    method?: Method;
    subject?: Subject<Action>;
};

export type Concept = {
  key: string;
  semaphore?: number;
  state: unknown;
  qualities: Quality[];
  principles?: PrincipleFunction[];
  mode?: Mode[];
};

// deno-lint-ignore no-explicit-any

export function createConcept(
  key: string,
  state: unknown,
  qualities: Quality[],
  principles?: PrincipleFunction[],
  mode?: Mode[],
): Concept {
  return {
    key,
    state,
    qualities,
    principles,
    mode,
  };
}

export function unifyConcepts(
  baseConcept: Concept,
  targetConcept: Concept,
  key?: string,
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

  return {
    key: key ? key : targetConcept.key,
    qualities: [...baseConcept.qualities, ...targetConcept.qualities],
    state: {
      ...baseConceptState,
      ...targetConceptState,
    },
    principles: [...baseConceptPrinciples, ...targetConceptPrinciples],
    mode: [...baseConceptMode, ...targetConceptMode],
  };
}

export function createQuality(
  action: Action,
  reducer: Reducer,
  method?: Method,
  subject?: Subject<Action>,
): Quality {
  return {
    action,
    reducer,
    method,
    subject,
  };
}

export function defaultReducer(state: unknown, _: Action) {
  return state;
}

export function createDefaultMethodSubject(): [Method, Subject<Action>] {
  const defaultSubject = new Subject<Action>();
  const defaultMethod: Method = defaultSubject.pipe<Action>(
    map((action: Action) => {
      if (action.strategy) {
        return strategySuccess(action.strategy);
      }
      return endOfActionStrategy;
    }),
  );
  return [defaultMethod, defaultSubject];
}
