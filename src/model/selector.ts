import { Action } from './action';
import { Concept, Concepts } from './concept';

// Dumb association, as we would be setting this value via a generated value
// Would like to expand this system to include slices of Arrays or a List of Keys from a Dictionary
//  Will not worry about such until we are working in a Massively Parallel Environment.
//  But this is where we would effect such and likewise the Consumer Function would have to be Updated
// TO-DO: Have state keys be represented as an array of strings.
export type KeyedSelector = {
  conceptName: string,
  stateKeys: string
};

/**
 * For usage outside of the Axium, or when subscribed to other Axium'sl
 */
export const createConceptKeyedSelector =
  (concepts: Concepts, conceptName: string, keyedSelector: KeyedSelector): KeyedSelector | undefined => {
    let exists = false;
    const indexes = Object.keys(concepts).map(key => Number(key));
    for (const index of indexes) {
      if (concepts[index].name === conceptName) {
        exists = true;
        break;
      }
    }
    if (exists) {
      const newSelector = {...keyedSelector};
      keyedSelector.conceptName = conceptName;
      return newSelector;
    } else {
      return undefined;
    }
  };

/**
 * This will update a concepts KeyedSelector to its currently unified concept.
 * @Note Use this in place of createUnifiedSelector if you find yourself needing to lock deep values.
 */
export const updateUnifiedKeyedSelector = (concepts: Concepts, semaphore: number, keyedSelector: KeyedSelector) => {
  if (concepts[semaphore]) {
    const newSelector = {...keyedSelector};
    keyedSelector.conceptName = concepts[semaphore].name;
    return newSelector;
  } else {
    return undefined;
  }
};

/**
 * Will create a new KeyedSelector during runtime, for usage within your principles.
 * @Note Will want to expand this later, so that we can select into objects and arrays.
 *  This would allow us to lock parts of such in later revisions, not an immediate concern.
 */
export const createUnifiedKeyedSelector = <T extends Record<string, unknown>>(
  concepts: Concepts,
  semaphore: number,
  key: keyof T
): KeyedSelector | undefined => {
  const concept = concepts[semaphore];
  if (concept) {
    const name = concept.name;
    return {
      conceptName: name,
      stateKeys: key as string,
    };
  } else {
    return undefined;
  }
};

export function selectState<T>(concepts: Concepts, name: string): T | undefined {
  let concept;
  const conceptKeys = Object.keys(concepts);
  for (const i of conceptKeys) {
    const index = Number(i);
    if (concepts[index].name === name) {
      concept = concepts[index];
      break;
    }
  }
  return concept?.state as T | undefined;
}

/**
 * Simple helper function that returns payload casted to T.
 */
export function selectPayload<T>(action: Action): T {
  return action.payload as T;
}

// Note: The Concept Key within the selector has to be set Explicitly for now
export function selectSlice<T>(
  concepts: Concepts,
  selector: KeyedSelector): T | undefined {
  let concept: Concept | undefined;
  const conceptKey = selector.conceptName;
  const conceptKeys = Object.keys(concepts);
  for (const i of conceptKeys) {
    const index = Number(i);
    if (concepts[index].name === conceptKey) {
      concept = concepts[index];
      break;
    } else if (index === conceptKeys.length - 1) {
      return undefined;
    }
  }
  const keys = selector.stateKeys.split(' ');
  if (concept === undefined) {return undefined;}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cast = concept.state as Record<string, any>;
  let exists = false;
  let previous = cast;
  for (const k of keys) {
    if (typeof previous === 'object' && previous[k]) {
      previous = previous[k];
      exists = true;
    } else {
      exists = false;
    }
  }
  if (exists) {
    return previous as T;
  } else {
    return undefined;
  }
}

export function selectConcept(concepts: Concepts, name: string): Concept {
  let concept;
  const conceptKeys = Object.keys(concepts);
  for (const i of conceptKeys) {
    const index = Number(i);
    if (concepts[index].name === name) {
      concept = concepts[index];
      break;
    }
  }
  return concept as Concept;
}

/**
 * Allows for the Unification of Concepts and a form of Data Oriented Functional Inheritance.
 * @within_principles Simply pass the supplied semaphore passed to your PrincipleFunction to gain access to that State.
 * @outside_selection Use selectState targeting that Unified Concept Name
 */

// Either returns the current concept's unified state, or informs that the concept has been removed and the principles needs shutdown
export function selectUnifiedState<T>(concepts: Concepts, semaphore: number): T | undefined {
  const exists = Object.keys(concepts).includes(`${semaphore}`);
  if (exists) {
    return concepts[semaphore].state as T;
  } else {
    return undefined;
  }
}