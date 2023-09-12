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
    keyedSelectors?: KeyedSelector[];
    stubs?: OwnershipTicketStub[];
    expiration: number;
};

export function primeAction(concepts: Concept[], action: Action, agreement?: number): Action {
  for (const concept of concepts) {
    for (const quality of concept.qualities) {
      if (action.type === quality.actionType) {
        return {
          ...action,
          semaphore: quality.semaphore,
          expiration: Date.now() + (agreement !== undefined ? agreement : 5000)
        };
      }
    }
  }
  return {
    type: axiumBadActionType,
    semaphore: [0, 0, -1],
    expiration: Date.now() + 5000
  };
}

export function getSemaphore(concepts: Concept[], actionType: ActionType): [number, number, number] {
  for (const concept of concepts) {
    for (const quality of concept.qualities) {
      if (actionType === quality.actionType) {
        return quality.semaphore;
      }
    }
  }
  return [0, 0, -1];
}

export function createAction(
  type: ActionType,
  payload?: unknown,
  keyedSelectors?: KeyedSelector[],
  agreement?: number,
  _semaphore?: [number, number, number]
): Action {
  const semaphore = _semaphore ? _semaphore : [0, 0, -1] as [number, number, number];
  return {
    type,
    semaphore,
    payload,
    keyedSelectors,
    // Temporary until we have proper SLA
    expiration: Date.now() + (agreement !== undefined ? agreement : 5000),
  };
}
