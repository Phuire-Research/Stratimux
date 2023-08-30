import { Concept } from './concept';

export type Selector<T, R> = (state: T) => R;
export type KeyedSelector<T, K extends keyof T> = {
  key: K,
  selector: Selector<T, unknown>
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

export function selectSlice<T, R>(
  concepts: Concept[],
  conceptKey: string,
  selector: Selector<T, R>): R {
  let concept;
  for (let i = 0; i < concepts.length; i++) {
    if (concepts[i].key === conceptKey) {
      concept = concepts[i];
      break;
    }
  }
  return selector(concept?.state as T) as R;
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
