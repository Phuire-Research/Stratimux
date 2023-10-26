import { Action } from './action';
import { Concept } from './concept';

// Dumb association, as we would be setting this value via a generated value
// Would like to expand this system to include slices of Arrays or a List of Keys from a Dictionary
//  Will not worry about such until we are working in a Massively Parallel Environment
//  But this is where we would effect such and likewise the Consumer Function would have to be Updated
// TO-DO: Have state keys be represented as an array of strings
export type KeyedSelector = {
  conceptName: string,
  stateKeys: string
};

export function selectState<T>(concepts: Concept[], name: string): T {
  let concept;
  for (let i = 0; i < concepts.length; i++) {
    if (concepts[i].name === name) {
      concept = concepts[i];
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
  concepts: Concept[],
  selector: KeyedSelector): T | undefined {
  let concept: Concept | undefined;
  const conceptKey = selector.conceptName;
  for (let i = 0; i < concepts.length; i++) {
    if (concepts[i].name === conceptKey) {
      concept = concepts[i];
      break;
    } else if (i === concepts.length - 1) {
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

export function selectConcept(concepts: Concept[], name: string): Concept {
  let concept;
  for (let i = 0; i < concepts.length; i++) {
    if (concepts[i].name === name) {
      concept = concepts[i];
      break;
    }
  }
  return concept as Concept;
}

/**
 * Tomorrows refactor.
 * Instead of worrying about finding names to isolate some unified state,
 * we should instead utilize the spacial paradigm of semaphores within this system.
 * Therefore methods and principles should receive their semaphore directly.
 *
 * As for the case of foreign selection, that should be done via the unified name.
 * Punting the worry for pure numerical selection to a compilation step.
 */
export function selectUnifiedState<T>(concepts: Concept[], semaphore: number): T {
  return concepts[semaphore].state as T;
}

// export function selectUnifiedState<T>(concepts: Concept[], name: string): T {
//   let concept;
//   let found = false;
//   for (let i = 0; i < concepts.length; i++) {
//     const unified = concepts[i].unified;
//     if (concepts[i].name === name) {
//       concept = concepts[i];
//       break;
//     }
//     for (let j = 0; j < unified.length; j++) {
//       if (unified[j] === name) {
//         concept = concepts[i];
//         found = true;
//         break;
//       }
//     }
//     if (found) {
//       break;
//     }
//   }
//   return concept?.state as T;
// }

// export function selectUnifiedSlice<T>(concept: Concept): T {
//   return concept.state as T;
// }