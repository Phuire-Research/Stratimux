import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Action, ActionType, createAction } from './action';
import { PrincipleFunction } from '../model/principle';
import { endOfActionStrategyType, strategySuccess } from './actionStrategy';
import { map } from 'rxjs';
import { KeyedSelector } from './selector';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Reducer = (state: any, action: Action) => any;

export type Method = Observable<Action>;
export type Principle = Observable<Action>;

export type Mode = ([action, concept, action$, concepts$]: [
    Action,
    Concept[],
    Subject<Action>,
    BehaviorSubject<Concept[]>,
]) => void;

export type MethodCreator = (subConcept$: Subject<Concept[]>) => [Method, Subject<Action>];

export type Quality = {
    actionType: ActionType;
    semaphore: [number, number, number];
    reducer: Reducer;
    methodCreator?: MethodCreator;
    method?: Method;
    subject?: Subject<Action>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyedSelectors?: KeyedSelector[]
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
    mode
  };
}

// Worry about this Functionality Later
// export function unifyConcepts(
//   baseConcept: Concept,
//   targetConcept: Concept,
//   key?: string,
// ): Concept {
//   const baseConceptState = baseConcept.state as object;
//   const targetConceptState = targetConcept.state as object;
//   let baseConceptPrinciples: PrincipleFunction[] = [];
//   if (baseConcept.principles) {
//     baseConceptPrinciples = baseConcept.principles;
//   }
//   let targetConceptPrinciples: PrincipleFunction[] = [];
//   if (targetConcept.principles) {
//     targetConceptPrinciples = targetConcept.principles;
//   }
//   let baseConceptMode: Mode[] = [];
//   if (baseConcept.mode) {
//     baseConceptMode = baseConcept.mode;
//   }
//   let targetConceptMode: Mode[] = [];
//   if (targetConcept.mode) {
//     targetConceptMode = targetConcept.mode;
//   }

//   return {
//     key: key ? key : targetConcept.key,
//     qualities: [...baseConcept.qualities, ...targetConcept.qualities],
//     state: {
//       ...baseConceptState,
//       ...targetConceptState,
//     },
//     principles: [...baseConceptPrinciples, ...targetConceptPrinciples],
//     mode: [...baseConceptMode, ...targetConceptMode],
//   };
// }

export function createQuality(
  actionType: ActionType,
  reducer: Reducer,
  methodCreator?: MethodCreator,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyedSelectors?: KeyedSelector[]
): Quality {
  return {
    actionType,
    reducer,
    semaphore: [0, 0, -1],
    methodCreator,
    keyedSelectors
  };
}

export function defaultReducer(state: unknown, _: Action) {
  return state;
}

export const createDefaultMethodCreator: MethodCreator = () : [Method, Subject<Action>] =>  {
  const defaultSubject = new Subject<Action>();
  const defaultMethod: Method = defaultSubject.pipe<Action>(
    map((action: Action) => {
      if (action.strategy) {
        return strategySuccess(action.strategy);
      }
      return createAction(endOfActionStrategyType);
    }),
  );
  return [defaultMethod, defaultSubject];
};
