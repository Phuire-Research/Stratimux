import { Concept } from './concept';

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
