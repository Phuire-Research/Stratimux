/*<$
For the asynchronous graph programming framework Stratimux, define the Action model file.
This file dictates the functionality of Actions within Stratimux.
$>*/
/*<#*/
import { Concept, Concepts } from './concept';
import { ActionStrategy } from './actionStrategy';
import { KeyedSelector } from './selector';
import { AxiumState } from '../concepts/axium/axium.concept';
import { AxiumBadActionPayload } from '../concepts/axium/qualities/badAction.quality';
import { failureConditions, strategyData_appendFailure } from './actionStrategyData';

export const nullActionType: ActionType = 'null';
// These need to be logical determined ahead of time.
//   Logical determinations such as these will be determined in the future via generation over hand placement.
const axiumConcludeType: ActionType = 'Conclude';
const axiumBadActionType: ActionType = 'Axium received a Bad Action';
const axiumSetBlockingModeType: ActionType = 'set Axium to Blocking Mode';
const axiumOpenType: ActionType = 'Open Axium';

export type ActionType = string;
export type Action = {
    type: ActionType;
    semaphore: [number, number, number, number];
    conceptSemaphore?: number;
    payload?: Record<string, unknown>;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration: number;
    axium?: string;
    priority?: number;
};

export type ActionOptions = {
    semaphore?: [number, number, number, number];
    conceptSemaphore?: number;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration?: number;
    axium?: string;
    priority?: number;
};

export type ActionWithPayloadOptions<T extends Record<string, unknown>> = {
    semaphore?: [number, number, number, number];
    conceptSemaphore?: number;
    payload?: T;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration?: number;
    axium?: string;
    priority?: number;
};

const createPayload = <T extends Record<string, unknown>>(payload: T) => payload;

export function primeAction(concepts: Concepts, action: Action): Action {
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
    let axium;
    if (action.axium) {
      axium = action.axium;
    } else {
      axium = (concepts[0].state as AxiumState).name;
    }
    const newAction = {
      ...action,
      semaphore: semaphore,
      axium,
    };
    if (newAction.strategy) {
      newAction.strategy.currentNode.action = newAction;
    }
    return newAction;
  }
  const badAction: Action = {
    type: axiumBadActionType,
    payload: createPayload<AxiumBadActionPayload>({badActions: [action]}),
    expiration: Date.now() + 5000,
    semaphore: getSemaphore(concepts, concepts[0].name, axiumBadActionType)
  };
  if (action.strategy) {
    badAction.strategy = action.strategy;
    badAction.strategy.currentNode.action = badAction;
    if (expired) {
      badAction.strategy.data = strategyData_appendFailure(badAction.strategy, failureConditions.axiumExpired);
    } else {
      badAction.strategy.data = strategyData_appendFailure(badAction.strategy, failureConditions.axiumBadGeneration);
    }
  }
  return badAction;
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
  const axiumState = concepts[0].state as AxiumState;
  const cachedSemaphores = axiumState.cachedSemaphores;
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
const forEachConcept = (concepts: Concepts, each: (concept: Concept, semaphore?: number) => void) => {
  const conceptKeys = Object.keys(concepts);
  for (const i of conceptKeys) {
    const index = Number(i);
    each(concepts[index], concepts[index].semaphore);
  }
};

export function createCacheSemaphores(concepts: Concepts): Map<string, Map<string, [number, number, number, number]>> {
  const generation = (concepts[0].state as AxiumState).generation;
  const newCachedSemaphores = new Map<string, Map<string, [number, number, number, number]>>();

  forEachConcept(concepts, ((concept, ci) => {
    const qualityMap = new Map<string, [number, number, number, number]>();
    concept.qualities.forEach((quality, qi) => {
      qualityMap.set(quality.actionType, [ci as number, qi, generation, 0]);
    });
    newCachedSemaphores.set(concept.name, qualityMap);
  }));
  return newCachedSemaphores;
}

/**
 * This allows us to logically determine these values in code.
 * @returns The final value for the semaphore tuple.
 */
function getSpecialSemaphore(type: ActionType) {
  switch (type) {
  case axiumBadActionType: {
    return 1;
  }
  case nullActionType: {
    return 2;
  }
  case axiumConcludeType: {
    return 3;
  }
  case axiumSetBlockingModeType: {
    return 4;
  }
  // case axiumOpenType: {
  //   return 5;
  // }
  default: {
    return 0;
  }
  }
}

export function createAction<T extends Record<string, unknown>>(
  type: ActionType,
  options?: ActionWithPayloadOptions<T>,
): Action {
  const special = getSpecialSemaphore(type);
  const semaphore = options?.semaphore !== undefined ? options.semaphore : [0, 0, -1, special] as [number, number, number, number];
  if (options) {
    const {
      payload,
      keyedSelectors,
      agreement,
      conceptSemaphore,
      priority
    } = options;
    return {
      type,
      semaphore,
      payload,
      keyedSelectors,
      agreement,
      expiration: Date.now() + (agreement !== undefined ? agreement : 5000),
      conceptSemaphore,
      priority
    };
  } else {
    return {
      type,
      semaphore,
      expiration: Date.now() + 5000,
    };
  }
}

export type ActionCreator = (
    options?: ActionOptions
  ) => Action;

export function prepareActionCreator(actionType: ActionType) {
  return (
    options?: ActionOptions
  ) => {
    return createAction(
      actionType,
      options
    );
  };
}

export function prepareActionWithPayloadCreator<T extends Record<string, unknown>>(actionType: ActionType) {
  return (
    payload: T,
    options?: ActionOptions
  ): Action => {
    const opt: ActionWithPayloadOptions<T> = {
      ...options,
      payload
    };
    return createAction(
      actionType,
      opt
    );
  };
}
export type ActionCreatorWithPayload<T extends Record<string, unknown>> = (
    payload: T,
    options?: ActionWithPayloadOptions<T>
  ) => Action;

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
  createCacheSemaphores,
  create: createAction,
  prepareActionCreator,
  prepareActionWithPayloadCreator,
  areSemaphoresEqual,
});
/*#>*/