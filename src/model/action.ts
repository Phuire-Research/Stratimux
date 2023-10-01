import { Concept } from './concept';
import { ActionStrategy } from './actionStrategy';
import { KeyedSelector } from './selector';
import { AxiumState } from '../concepts/axium/axium.concept';

export const nullActionType: ActionType = 'null';
// These need to be logical determined ahead of time.
//    Logical determinations such as these will be determined in the future via generation over hand placement.
const axiumConcludeType: ActionType = 'Conclude';
const axiumBadActionType: ActionType = 'Axium received a Bad Action';
const axiumSetBlockingModeType: ActionType = 'set Axium to Blocking Mode';

export type ActionType = string;
export type Action = {
    type: ActionType;
    semaphore: [number, number, number, number];
    payload?: unknown;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    expiration: number;
};

export function primeAction(concepts: Concept[], action: Action): Action {
  for (const concept of concepts) {
    const semaphore = getSemaphore(concepts, concept.name, action.type);
    if (semaphore[2] !== -1) {
      const newAction = {
        ...action,
        semaphore: semaphore,
      };
      if (newAction.strategy) {
        newAction.strategy.currentNode.action = newAction;
      }
      return newAction;
    }
  }
  return {
    type: axiumBadActionType,
    semaphore: [0, 0, -1, getSpecialSemaphore(axiumBadActionType)],
    expiration: Date.now() + 5000
  };
}

export function getSemaphore(concepts: Concept[], conceptName: string, actionType: ActionType): [number, number, number, number] {
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

export function createCacheSemaphores(concepts: Concept[]): Map<string, Map<string, [number, number, number, number]>> {
  const generation = (concepts[0].state as AxiumState).generation;
  const newCachedSemaphores = new Map<string, Map<string, [number, number, number, number]>>();
  concepts.forEach((concept, ci) => {
    const qualityMap = new Map<string, [number, number, number, number]>();
    concept.qualities.forEach((quality, qi) => {
      qualityMap.set(quality.actionType, [ci, qi, generation, 0]);
    });
    newCachedSemaphores.set(concept.name, qualityMap);
  });
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
  default: {
    return 0;
  }
  }
}

export function createAction(
  type: ActionType,
  payload?: unknown,
  keyedSelectors?: KeyedSelector[],
  agreement?: number,
  _semaphore?: [number, number, number, number]
): Action {
  const special = getSpecialSemaphore(type);
  const semaphore = _semaphore !== undefined ? _semaphore : [0, 0, -1, special] as [number, number, number, number];
  return {
    type,
    semaphore,
    payload,
    keyedSelectors,
    // Temporary until we have proper SLA
    expiration: Date.now() + (agreement !== undefined ? agreement : 5000),
  };
}

export function prepareActionCreator(actionType: ActionType) {
  return (
    payload?: unknown,
    keyedSelectors?: KeyedSelector[],
    agreement?: number,
    _semaphore?: [number, number, number, number]
  ) => {
    return createAction(actionType, payload, keyedSelectors, agreement, _semaphore);
  };
}

/**
 * Should only be used after if you can logically determine that the semaphores have been primed.
 * @returns boolean
 */
export function areSemaphoresEqual(first: Action, second: Action) {
  return first.semaphore[0] === second.semaphore[0] && first.semaphore[1] === second.semaphore[1];
}
