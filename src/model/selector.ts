import { Concept } from './concept';

// Dumb association, as we would be setting this value via a generated value
export type KeyedSelector = {
  conceptKey: string,
  stateKeys: string
};

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

// Note: The Concept Key within the selector has to be set Explicitly for now
export function selectSlice<T>(
  concepts: Concept[],
  selector: KeyedSelector): T | undefined {
  let concept: Concept | undefined;
  const conceptKey = selector.conceptKey;
  for (let i = 0; i < concepts.length; i++) {
    if (concepts[i].key === conceptKey) {
      concept = concepts[i];
      break;
    } else if (i === concepts.length - 1) {
      console.log('Check Slice', i, concepts, selector);
      return undefined;
    }
  }

  const keys = selector.stateKeys.split(' ');
  if (concept === undefined) {return undefined;}
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
