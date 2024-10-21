/*<$
For the asynchronous graph programming framework Stratimux, define the Action model file.
This file dictates the functionality of Actions within Stratimux.
$>*/
/*<#*/
import { AnyConcept, Concepts, LoadConcepts } from '../concept/concept';
import { MuxiumState } from '../../concepts/muxium/muxium.concept';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { Action, ActionType } from './action.type';

export const nullActionType: ActionType = 'null';
// These need to be logical determined ahead of time.
//   Logical determinations such as these will be determined in the future via generation over hand placement.
const muxiumConcludeType: ActionType = 'Conclude';
const muxiumBadActionType: ActionType = 'Muxium received a Bad Action';
const muxiumSetBlockingModeType: ActionType = 'set Muxium to Blocking Mode';

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

/**
 * Should only be used after if you can logically determine that the semaphores have been primed.
 * @returns boolean
 */
export function areSemaphoresEqual(first: Action, second: Action) {
  return first.semaphore[0] === second.semaphore[0] && first.semaphore[1] === second.semaphore[1];
}

/*#>*/