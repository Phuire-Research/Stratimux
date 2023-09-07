import { Concept } from './concept';
import { ActionStrategy } from './actionStrategy';
import { KeyedSelector } from './selector';
import { OwnershipTicket, OwnershipTicketStub } from './ownership';
import { axiumBadActionType } from '../concepts/axium/qualities/badAction.quality';

export type ActionType = string;
export type Action = {
    type: ActionType;
    semaphore: [number, number, number];
    payload?: unknown;
    strategy?: ActionStrategy;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyedSelectors?: KeyedSelector[];
    stubs?: OwnershipTicketStub[];
    expiration?: number;
};

export function primeAction(concepts: Concept[], action: Action): Action {
  for (const concept of concepts) {
    for (const quality of concept.qualities) {
      if (action.type === quality.actionType) {
        return {
          ...action,
          semaphore: quality.semaphore,
        };
      }
    }
  }
  return {
    type: axiumBadActionType,
    semaphore: [0, 0, -1],
  };
}

export function createAction(type: ActionType, payload?: unknown): Action {
  return {
    type,
    semaphore: [0, 0, -1],
    payload
  };
}
