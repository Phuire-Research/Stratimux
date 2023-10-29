import { Action } from './action';
import { Concept, Concepts } from './concept';

// Dumb association, as we would be setting this value via a generated value
// Would like to expand this system to include slices of Arrays or a List of Keys from a Dictionary
//  Will not worry about such until we are working in a Massively Parallel Environment
//  But this is where we would effect such and likewise the Consumer Function would have to be Updated
// TO-DO: Have state keys be represented as an array of strings
export type KeyedSelector = {
  conceptName: string,
  stateKeys: string
};

export function selectState<T>(concepts: Concepts, name: string): T {
  let concept;
  const conceptKeys = Object.keys(concepts);
  for (const i of conceptKeys) {
    const index = Number(i);
    if (concepts[index].name === name) {
      concept = concepts[index];
      break;
    }
  }
  return concept?.state as T;
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
  const existsKeys = Object.keys(cast);
  let exists = false;
  existsKeys.forEach(key => {key === keys[0] ? exists = true : null;});
  if (!exists) {
    return undefined;
  }
  if (keys.length === 1) {
    return cast[keys[0]] as T;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let target: Record<string, any> = cast[keys.shift() as string];
  let finalKey = '';
  for (const [i, key] of keys.entries()) {
    let aspectExists = false;
    const aspectExistsKeys = Object.keys(target);
    aspectExistsKeys.forEach(_key => {_key === key ? aspectExists = true : null;});
    if (!aspectExists) {
      return undefined;
    }
    if (i !== keys.length - 1) {
      target = target[key];
    } else {
      finalKey = key;
    }
  }
  return target[finalKey] as T;
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