/*<$
For the asynchronous graph programming framework Stratimux, define the Action model file.
This file dictates the functionality of Actions within Stratimux.
$>*/
/*<#*/
import { AnyConcept, Concept, Concepts, LoadConcepts } from './concept';
import { ActionStrategy } from './actionStrategy';
import { KeyedSelector } from './selector';
import { MuxiumState } from '../concepts/muxium/muxium.concept';
import { failureConditions, strategyData_appendFailure } from './actionStrategyData';
import { Quality } from './quality';
import { MuxiumBadActionPayload, MuxiumQualities } from '../concepts/muxium/qualities';

export const nullActionType: ActionType = 'null';
// These need to be logical determined ahead of time.
//   Logical determinations such as these will be determined in the future via generation over hand placement.
const muxiumConcludeType: ActionType = 'Conclude';
const muxiumBadActionType: ActionType = 'Muxium received a Bad Action';
const muxiumSetBlockingModeType: ActionType = 'set Muxium to Blocking Mode';
const muxiumOpenType: ActionType = 'Open Muxium';

export type ActionType = string;
export type Action<T = void> = {
    type: ActionType;
    semaphore: [number, number, number, number];
    conceptSemaphore?: number;
    payload: T extends Record<string, unknown> ? T : undefined;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration: number;
    priority?: number;
    muxium?: string;
    origin?: string;
};

export type AnyAction = {
    type: ActionType;
    semaphore: [number, number, number, number];
    conceptSemaphore?: number;
    payload: any;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration: number;
    priority?: number;
    muxium?: string;
    origin?: string;
}

export type ActionCreatorType<T = void> =
  T extends Record<string, unknown> ?
    ActionCreatorWithPayload<T> :
    ActionCreator;

export type Actions<T = void> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends Quality<Record<string, unknown>, any, any> ?
    T[K]['actionCreator'] : ActionCreator;
};

export type ActionCreator = (
  options?: ActionOptions
) => Action;

export type ActionCreatorWithPayload<T extends Record<string, unknown>> = (
  payload: T,
  options?: ActionWithPayloadOptions<T>
) => Action<T>;

export type ActionOptions = {
    semaphore?: [number, number, number, number];
    conceptSemaphore?: number;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration?: number;
    priority?: number;
    muxium?: string;
    origin?: string;
};

export type ActionWithPayloadOptions<T = void> = {
    semaphore?: [number, number, number, number];
    conceptSemaphore?: number;
    payload?: T extends Record<string, unknown> ? T : undefined;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration?: number;
    priority?: number;
    muxium?: string;
    origin?: string;
};

const createPayload = <T extends Record<string, unknown>>(payload: T) => payload;

export function primeAction<T>(concepts: Concepts, action: Action<T>): Action<T> {
  const expired = action.expiration < Date.now();
  let semaphore: [number, number, number, number] = [-1, -1, -1, -1];
  if (!expired) {
    if (action.conceptSemaphore) {
      semaphore = getSemaphore(concepts, concepts[action.conceptSemaphore].name, action.type);
    } else {
      const conceptKeys = Object.keys(concepts);
      for (const i of conceptKeys) {
        const index = Number(i);
        semaphore = getSemaphore(concepts, concepts[index].name, action.type);
        if (semaphore[2] !== -1 && action.expiration) {
          break;
        }
      }
    }
  }
  if (semaphore[2] !== -1 && action.expiration) {
    let muxium;
    if (action.muxium) {
      muxium = action.muxium;
    } else {
      muxium = (concepts[0].state as MuxiumState<MuxiumQualities, LoadConcepts>).name;
    }
    const newAction = {
      ...action,
      semaphore: semaphore,
      muxium,
    } as Action<T>;
    if (newAction.strategy) {
      newAction.strategy.currentNode.action = newAction;
    }
    return newAction;
  }
  const badAction: Action<MuxiumBadActionPayload> = {
    type: muxiumBadActionType,
    payload: createPayload<MuxiumBadActionPayload>({badActions: [action]}),
    expiration: Date.now() + 5000,
    semaphore: getSemaphore(concepts, concepts[0].name, muxiumBadActionType)
  };
  if (action.strategy) {
    badAction.strategy = action.strategy;
    badAction.strategy.currentNode.action = badAction as Action<any>;
    if (expired) {
      badAction.strategy.data = strategyData_appendFailure(badAction.strategy, failureConditions.muxiumExpired);
    } else {
      badAction.strategy.data = strategyData_appendFailure(badAction.strategy, failureConditions.muxiumBadGeneration);
    }
  }
  return badAction as Action<any>;
}

/**
 * @param action A previously created action.
 * @returns Returns a newly recomposed Action with a updated expiration, takes into account agreement if present.
 */
export const refreshAction = (action: Action): Action => {
  const newAction = {
    ...action,
  };
  if (newAction.agreement) {
    newAction.expiration = Date.now() + newAction.agreement;
  } else {
    newAction.expiration = Date.now() + 5000;
  }
  return newAction;
};

export function getSemaphore(concepts: Concepts, conceptName: string, actionType: ActionType): [number, number, number, number] {
  const muxiumState = concepts[0].state as MuxiumState<MuxiumQualities, LoadConcepts>;
  const cachedSemaphores = muxiumState.cachedSemaphores;
  const conceptMap = cachedSemaphores.get(conceptName);
  const special = getSpecialSemaphore(actionType);
  if (conceptMap) {
    const qualitySemaphore = conceptMap.get(actionType);
    if (qualitySemaphore) {
      qualitySemaphore[3] = special;
      return qualitySemaphore;
    }
  }
  return [0, 0, -1, special];
}

// For proper compilation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const forEachConcept = (concepts: Concepts, each: (concept: AnyConcept, semaphore?: number) => void) => {
  const conceptKeys = Object.keys(concepts);
  for (const i of conceptKeys) {
    const index = Number(i);
    each(concepts[index], concepts[index].semaphore);
  }
};

export function createCachedSemaphores(concepts: Concepts): Map<string, Map<string, [number, number, number, number]>> {
  const generation = (concepts[0].state as MuxiumState<MuxiumQualities, LoadConcepts>).generation;
  const newCachedSemaphores = new Map<string, Map<string, [number, number, number, number]>>();

  forEachConcept(concepts, ((concept, ci) => {
    const qualityMap = new Map<string, [number, number, number, number]>();
    concept.qualities.forEach((quality, qi) => {
      const semaphore: [number, number, number, number] = [ci as number, qi, generation, getSpecialSemaphore(quality.actionType)];
      quality.actionSemaphoreBucket.shift();
      quality.actionSemaphoreBucket.push(semaphore);
      // console.log(quality.actionType, semaphore);
      qualityMap.set(quality.actionType, semaphore);
    });
    newCachedSemaphores.set(concept.name, qualityMap);
  }));
  return newCachedSemaphores;
}

/**
 * This allows us to logically determine these values in code.
 * @returns The final value for the semaphore tuple.
 */
export function getSpecialSemaphore(type: ActionType) {
  switch (type) {
  case muxiumBadActionType: {
    return 1;
  }
  case nullActionType: {
    return 2;
  }
  case muxiumConcludeType: {
    return 3;
  }
  case muxiumSetBlockingModeType: {
    return 4;
  }
  // case muxiumOpenType: {
  //   return 5;
  // }
  default: {
    return 0;
  }
  }
}

export function createAction<T = void>(
  type: ActionType,
  options?: ActionWithPayloadOptions<T>,
): Action<T> {
  const special = getSpecialSemaphore(type);

  const semaphore = options?.semaphore !== undefined ? options.semaphore : [0, 0, -1, special] as [number, number, number, number];
  if (options) {
    const {
      payload,
      keyedSelectors,
      agreement,
      conceptSemaphore,
      priority,
      origin
    } = options;
    return {
      type,
      semaphore: options.semaphore ? options.semaphore : semaphore,
      payload: (payload ? payload  : {}) as T extends Record<string, unknown> ? T : undefined,
      keyedSelectors,
      agreement,
      expiration: Date.now() + (agreement !== undefined ? agreement : 5000),
      conceptSemaphore,
      priority,
      origin
    };
  } else {
    return {
      type,
      semaphore,
      expiration: Date.now() + 5000,
      payload: {} as T extends Record<string, unknown> ? T : undefined
    };
  }
}

export function prepareActionCreator(
  actionType: ActionType,
  actionSemaphoreBucket: [number, number, number, number][]
) {
  return (
    options?: ActionOptions
  ) => {
    if (options) {
      return createAction(actionType,
        {
          ...options,
          semaphore: actionSemaphoreBucket[0] ? actionSemaphoreBucket[0] : [-1, -1, -1, -1]
        }
      );
    }
    return createAction(
      actionType, {
        semaphore: actionSemaphoreBucket[0] ? actionSemaphoreBucket[0] : [-1, -1, -1, -1]
      }
    );
  };
}

export function prepareActionWithPayloadCreator<T extends Record<string, unknown>>(
  actionType: ActionType,
  actionSemaphoreBucket: [number, number, number, number][]
): ActionCreatorWithPayload<T> {
  return (
    payload: T,
    options?: ActionOptions
  ): Action<T> => {
    const opt: ActionWithPayloadOptions<T> = {
      ...options,
      payload: payload as T extends Record<string, unknown> ? T : undefined
    };
    return createAction<T>(
      actionType,
      {
        ...opt,
        semaphore: actionSemaphoreBucket[0] ? actionSemaphoreBucket[0] : [-1, -1, -1, -1]
      }
    );
  };
}

/**
 * Should only be used after if you can logically determine that the semaphores have been primed.
 * @returns boolean
 */
export function areSemaphoresEqual(first: Action, second: Action) {
  return first.semaphore[0] === second.semaphore[0] && first.semaphore[1] === second.semaphore[1];
}

export const act = ({
  prime: primeAction,
  refresh: refreshAction,
  getSemaphore,
  createCachedSemaphores,
  create: createAction,
  prepareActionCreator,
  prepareActionWithPayloadCreator,
  areSemaphoresEqual,
});
/*#>*/