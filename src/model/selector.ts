import { Concept } from './concept';

// Dumb association, as we would be setting this value via a generated value
export type KeyedSelector = {
  conceptKey: string,
  stateKeys: string
};

// Placeholder Select Functions will be Replaced with Key Selection Once that Workflow is Defined
export function selectState<T>(concepts: Concept[], key: string): T {
  let concept;
  for (let i = 0; i < concepts.length; i++) {
    if (concepts[i].key === key) {
      concept = concepts[i];
      break;
    }
  }
  return concept?.state as T;
}

export function selectSlice<T>(
  concepts: Concept[],
  selector: KeyedSelector): T | Error {
  let concept: Concept | undefined;
  const conceptKey = selector.conceptKey;
  for (let i = 0; i < concepts.length; i++) {
    if (concepts[i].key === conceptKey) {
      concept = concepts[i];
      break;
    } else if (i === concepts.length - 1) {
      return Error('Invalid Concept Key');
    }
  }

  const keys = selector.stateKeys.split(' ');
  const cast = concept?.state as Record<string, any>;
  let guardKey = Object.keys(cast);
  let guard = false;
  guardKey.forEach(key => {key !== keys[0] ? guard = true : null;});
  if (guard) {
    return new Error('Invalid State Key');
  }
  if (keys.length === 1) {
    return cast[keys[0]] as T;
  }
  let target = cast[keys.shift() as string];
  let finalKey = '';
  for (const [i, key] of keys.entries()) {
    let loopGuard = false;
    guardKey = Object.keys(target);
    guardKey.forEach(_key => {_key !== key ? loopGuard = true : null;});
    if (loopGuard) {
      return new Error('Invalid Inner State Key');
    }
    if (i !== keys.length - 1) {
      target = target[key];
    } else {
      finalKey = key;
    }
  }
  return target[finalKey] as T;
}

export function selectConcept(concepts: Concept[], key: string): Concept {
  let concept;
  for (let i = 0; i < concepts.length; i++) {
    if (concepts[i].key === key) {
      concept = concepts[i];
      break;
    }
  }
  return concept as Concept;
}
