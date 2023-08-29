import { Concept } from './concept';
import { ActionStrategy } from './actionStrategy';

export type Action = {
    type: string;
    semaphore: [number, number, number];
    payload?: unknown;
    strategy?: ActionStrategy;
};

export function primeAction(concepts: Concept[], action: Action): Action {
  for (const concept of concepts) {
    for (const quality of concept.qualities) {
      if (action.type === quality.action.type) {
        return {
          ...action,
          semaphore: quality.action.semaphore,
        };
      }
    }
  }
  return {
    type: 'Bad Action',
    semaphore: [0, 0, -1],
  };
}

export function createAction(type: string): Action {
  return {
    type,
    semaphore: [0, 0, -1],
  };
}
