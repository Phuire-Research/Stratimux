/*<$
For the asynchronous graph programming framework Stratimux, define the Action model file.
This file dictates the functionality of Actions within Stratimux.
$>*/
/*<#*/
import { AnyConcept, Concepts, LoadConcepts } from '../concept/concept.type';
import { muxiumName, MuxiumState } from '../../concepts/muxium/muxium.concept';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { Action, ActionType } from './action.type';

export const nullActionType: ActionType = 'null';
// These need to be logical determined ahead of time.
//   Logical determinations such as these will be determined in the future via generation over hand placement.
const muxiumConcludeType: ActionType = 'Muxium Conclude';
const muxiumBadActionType: ActionType = 'Muxium Bad Action';
const muxiumSetBlockingModeType: ActionType = 'Muxium Set Blocking Mode';

export function getSemaphore(concepts: Concepts, conceptName: string, actionType: ActionType): [number, number, number, number] {
  const muxiumState = concepts[0].state as MuxiumState<MuxiumQualities, LoadConcepts>;
  const cachedSemaphores = muxiumState.cachedSemaphores;
  const conceptMap = cachedSemaphores.get(conceptName);
  const special = getSpecialSemaphore(actionType);
  if (conceptMap) {
    const qualitySemaphore = conceptMap.get(conceptName, actionType);
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

export const createCachedKey = (conceptName: string, type: string) => conceptName + '-' + type;

// ...existing code...

/**
 * A specialized Map wrapper for cached semaphores that combines concept name and quality type
 * into a single key using a dash separator.
 */
/**
 * A specialized Map wrapper for quality semaphores that combines concept name and quality type
 * into a single key using a dash separator.
 */
export class QualityMap {
  private map: Map<string, [number, number, number, number]>;

  constructor() {
    this.map = new Map<string, [number, number, number, number]>();
  }

  /**
   * Creates a combined key from concept name and quality type
   */
  private createKey(conceptName: string, qualityType: string): string {
    return conceptName + '-' + qualityType;
  }

  /**
   * Sets a semaphore for the given concept name and quality type
   */
  set(conceptName: string, qualityType: string, semaphore: [number, number, number, number]): this {
    const key = this.createKey(conceptName, qualityType);
    this.map.set(key, semaphore);
    return this;
  }

  /**
   * Gets a semaphore for the given concept name and quality type
   */
  get(conceptName: string, qualityType: string): [number, number, number, number] | undefined {
    const key = this.createKey(conceptName, qualityType);
    return this.map.get(key);
  }

  /**
   * Checks if a semaphore exists for the given concept name and quality type
   */
  has(conceptName: string, qualityType: string): boolean {
    const key = this.createKey(conceptName, qualityType);
    return this.map.has(key);
  }

  /**
   * Deletes a semaphore for the given concept name and quality type
   */
  delete(conceptName: string, qualityType: string): boolean {
    const key = this.createKey(conceptName, qualityType);
    return this.map.delete(key);
  }

  /**
   * Clears all quality semaphores
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Returns the number of quality semaphores
   */
  get size(): number {
    return this.map.size;
  }

  /**
   * Returns an iterator of all keys (combined concept-quality strings)
   */
  keys(): IterableIterator<string> {
    return this.map.keys();
  }

  /**
   * Returns an iterator of all semaphore values
   */
  values(): IterableIterator<[number, number, number, number]> {
    return this.map.values();
  }

  /**
   * Returns an iterator of all [key, semaphore] entries
   */
  entries(): IterableIterator<[string, [number, number, number, number]]> {
    return this.map.entries();
  }

  /**
   * Executes a callback for each quality semaphore
   */
  forEach(callback: (semaphore: [number, number, number, number], key: string, map: QualityMap) => void): void {
    this.map.forEach((semaphore, key) => {
      callback(semaphore, key, this);
    });
  }
}
// ...existing code...

export function createCachedSemaphores(concepts: Concepts): Map<string, QualityMap> {
  const generation = (concepts[0].state as MuxiumState<MuxiumQualities, LoadConcepts>).generation;
  const newCachedSemaphores = new Map<string, QualityMap>();

  forEachConcept(concepts, ((concept, ci) => {
    const qualityMap = new QualityMap();
    concept.qualities.forEach((quality, qi) => {
      const semaphore: [number, number, number, number] = [ci as number, qi, generation, getSpecialSemaphore(quality.actionType)];
      quality.actionSemaphoreBucket.shift();
      quality.actionSemaphoreBucket.push(semaphore);
      qualityMap.set(concept.name, quality.actionType, semaphore);
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