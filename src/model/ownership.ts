/* eslint-disable max-depth */
import { Action, createAction, getSemaphore, primeAction } from '../model/action';
import { OwnershipState, ownershipName } from '../concepts/ownership/ownership.concept';
import { Concept } from './concept';
import { selectState } from './selector';
import { axiumBadActionType } from '../concepts/axium/qualities/badAction.quality';
import { ActionNode, ActionStrategy, nullActionType } from './actionStrategy';
import { counterSetCountType } from '../concepts/counter/qualities/setCount.quality';

export type OwnershipLedger = Map<string, OwnershipTicket[]>;

export type OwnershipTicket = {
  ticket: number;
  // new Date().now() + Agreement
  expiration: number;
}

export type OwnershipTicketStub = {
  key: string,
  ticket: number,
}

export const createOwnershipLedger = (): OwnershipLedger => ( new Map<string, OwnershipTicket[]>());

export const ownershipShouldBlock = (concepts: Concept[], action: Action): boolean => {
  const qualityKeys = concepts[action.semaphore[0]].qualities[action.semaphore[1]].keyedSelectors;
  const actionSelectors = action.keyedSelectors;
  const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  let shouldBlock = false;
  // Quality Action no Keys, no Strategy
  if (qualityKeys && !actionSelectors && action.strategy === undefined) {
    for (let i = 0; i < qualityKeys.length; i++) {
      if (ownershipLedger.has(`${qualityKeys[i].conceptName} ${qualityKeys[i].stateKeys}`)) {
        shouldBlock = true;
        break;
      }
    }
  // ActionStrategy, with Keys
  } else if (actionSelectors && action.strategy && action.strategy.stubs === undefined) {
    for (let i = 0; i < actionSelectors.length; i++) {
      if (ownershipLedger.has(`${actionSelectors[i].conceptName} ${actionSelectors[i].stateKeys}`)) {
        shouldBlock = true;
        break;
      }
    }
  }
  if (!shouldBlock && action?.strategy?.stubs) {
    const stubs = action.strategy.stubs;
    let firstOfAllLines = false;
    for (let i = 0; i < stubs.length; i++) {
      const line = ownershipLedger.get(action.strategy.stubs[i].key);
      if (line) {
        for (const [_, stub] of line.entries()) {
          if (stubs[i].ticket === stub.ticket) {
            firstOfAllLines = true;
            break;
          }
        }
      }
      shouldBlock = !firstOfAllLines;
    }
  }
  return shouldBlock;
};

export const clearStubs = (concepts: Concept[], strategy: ActionStrategy): Concept[] => {
  const newConcepts = concepts;
  const stubs = strategy.stubs;
  const ownershipState = selectState<OwnershipState>(newConcepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  if (stubs) {
    stubs.forEach(ticketStub => {
      const line = ownershipLedger.get(ticketStub.key);
      // console.log('Start Clear', line);
      if (line) {
        const newLine = [] as OwnershipTicket[];
        for (const stub of line) {
          if (stub.ticket !== ticketStub.ticket) {
            newLine.push(stub);
          }
        }
        // console.log('Check new line', newLine);
        if (newLine.length === 0) {
          ownershipLedger.delete(ticketStub.key);
        } else {
          ownershipLedger.set(ticketStub.key, newLine);
        }
      }
    });
  }
  return newConcepts;
};

export const editStubs = (_concepts: Concept[], oldAction: Action, newAction: Action): [Concept[], Action] => {
  const concepts = _concepts;
  const oldStrategy = oldAction.strategy as ActionStrategy;
  const newStrategy = newAction.strategy as ActionStrategy;
  newStrategy.stubs = [];
  const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  if (oldStrategy.stubs) {
    oldStrategy.stubs.forEach((ticketStub) => {
      const line = ownershipLedger.get(ticketStub.key);
      if (line) {
        for (const stub of line) {
          if (stub.ticket === ticketStub.ticket) {
            stub.expiration = newAction.expiration;
            newStrategy.stubs?.push({
              key: ticketStub.key,
              ticket: stub.ticket
            });
          }
        }
      }
    });
  }
  return [concepts, newAction];
};

export const checkIn =
(concepts: Concept[], action: Action): [Concept[], Action] => {
  const newConcepts = concepts;
  const ownershipState = selectState<OwnershipState>(newConcepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  const strategy = action.strategy;
  if (strategy) {
    strategy.stubs = strategy.stubs ? strategy.stubs : [] as OwnershipTicketStub[];
    action.keyedSelectors?.forEach(keyed => {
      const key = `${keyed.conceptName} ${keyed.stateKeys}`;
      const entry = ownershipLedger.get(key);
      let found = false;
      if (entry && action.strategy?.stubs) {
        for (const ticketStub of entry) {
          for (const stub of action.strategy.stubs) {
            if (ticketStub.ticket === stub.ticket && stub.key === key) {
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }
      if (!found) {
        const expiration = action.expiration;
        const newTicketStub = {
          key,
          ticket: ownershipState.ticker,
          expiration
        };
        const newTicket = {
          ticket: ownershipState.ticker,
          expiration
        };
        ownershipState.ticker += 1;
        strategy.stubs?.push(newTicketStub);
        if (entry) {
          entry.push(newTicket);
        } else {
          ownershipLedger.set(key, [newTicket]);
        }
        console.log('Check Ticket', newTicket);
      }
    });
  }
  return  [
    newConcepts,
    action
  ];
};

export const isActionReady = (concepts: Concept[], _action: Action): [Concept[], boolean] => {
  const action = _action;
  const stubs = action.strategy?.stubs;
  if (stubs) {
    return stubActionStrategy(concepts, action);
  } else {
    return qualityAction(concepts, action);
  }
};

const stubActionStrategy = (concepts: Concept[], _action: Action): [Concept[], boolean] => {
  const action = _action;
  const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  const stubs = action.strategy?.stubs as OwnershipTicketStub[];
  let frontOfAllLines = true;
  // let expired = false;
  for (const stub of stubs) {
    const positions = ownershipLedger.get(stub.key);
    if (positions) {
      for (const [i, pos] of positions.entries()) {
        if (i === 0 && pos.ticket === stub.ticket) {
          continue;
        } else {
          frontOfAllLines = false;
          break;
        }
      }
    }
  }
  return [concepts, frontOfAllLines];
};

const qualityAction = (concepts: Concept[], _action: Action): [Concept[], boolean] => {
  const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  const action = _action;
  const qualitySelectors = concepts[action.semaphore[0]].qualities[action.semaphore[1]].keyedSelectors;
  let readyToGo = true;

  if (qualitySelectors) {
    for (const selector of qualitySelectors) {
      const key = `${selector.conceptName} ${selector.stateKeys}`;
      if (ownershipLedger.get(key)) {
        readyToGo = false;
        break;
      }
    }
    return [concepts, readyToGo];
  }
  return [concepts, readyToGo];
};

const areSameDepth = (first: ActionNode, second: ActionNode, count: [number, number]): boolean => {
  const newCount: [number, number] = [
    first.lastActionNode?.actionType !== nullActionType ? count[0] + 1 : count[0],
    second.lastActionNode?.actionType !== nullActionType ? count[0] + 1 : count[0]
  ];
  if (count[0] !== newCount[0] && count[1] !== newCount[1] && newCount[0] === newCount[1]) {
    return areSameDepth(first.lastActionNode as ActionNode, second.lastActionNode as ActionNode, newCount);
  } else if (count[0] === newCount[0] && count[1] === newCount[1]) {
    return true;
  }
  return false;
};

export const areEqual = (first: Action, second: Action ) => {
  let equal = false;
  const firstStrategy = first.strategy;
  const secondStrategy = second.strategy;
  if (firstStrategy === undefined && secondStrategy === undefined) {
    if (first.type === second.type) {
      if (first.payload === undefined && second.payload === undefined) {
        equal = true;
      } else {
        equal = JSON.stringify(first.payload) === JSON.stringify(second.payload);
      }
    }
    equal = false;
  } else if (firstStrategy?.topic === secondStrategy?.topic) {
    if (first.type === second.type) {
      if (first.payload === undefined && second.payload === undefined) {
        equal = true;
      } else if (JSON.stringify(first.payload) === JSON.stringify(second.payload)) {
        equal = areSameDepth(
          (firstStrategy as ActionStrategy).currentNode,
          (secondStrategy as ActionStrategy).currentNode,
          [0,0]
        );
      }
    }
    equal = false;
  }
  return equal;
};

export const updateAddToPendingActions = (_concepts: Concept[], _action: Action) => {
  let concepts = _concepts;
  const action = _action;
  // console.log('CHECK ADD TO PENDING ACTIONS', action);
  const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  const pendingActions = ownershipState.pendingActions;
  const newPendingActions: Action[] = [];
  if (pendingActions.length > 0) {
    for (const pending of pendingActions) {
      const equal = areEqual(action, pending);
      if (equal && pending.keyedSelectors && action.keyedSelectors) {
        let editedAction;
        [concepts, editedAction] = editStubs(concepts, pending, action);
        newPendingActions.push(editedAction);
      } else if (equal) {
        newPendingActions.push(action);
      } else {
        newPendingActions.push(pending);
        newPendingActions.push(action);
      }
    }
    ownershipState.pendingActions = [...newPendingActions];
  } else {
    ownershipState.pendingActions = [action];
  }
  return concepts;
};
