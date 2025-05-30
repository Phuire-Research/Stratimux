/*<$
For the asynchronous graph programming framework Stratimux, define the Ownership model file.
This file will dictate functionality used within the Ownership Concept to engage in its functionality.
$>*/
/*<#*/
/* eslint-disable max-depth */
import { OwnershipState, ownershipName } from '../concepts/ownership/ownership.concept';
import { Concepts } from './concept/concept.type';
import { selectState } from './selector/selector';
import { getMuxiumState } from './muxium/muxiumHelpers';
import { Action } from './action/action.type';
import { ActionNode, ActionStrategy } from './action/strategy/actionStrategy.type';
import { areSemaphoresEqual } from './action/actionSemaphore';

export type OwnershipLedger = Map<string, OwnershipTicket[]>;

export type OwnershipTicket = {
  ticket: string;
  expiration: number;
}

export type OwnershipTicketStub = {
  key: string,
  ticket: string,
}

export const createOwnershipLedger = (): OwnershipLedger => ( new Map<string, OwnershipTicket[]>());

const generateUUID = (): string => {
  const randomHex = (): string => {
    return Math.floor(Math.random() * 16).toString(16);
  };

  let uuid = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    }
    else if (i === 14) {
      uuid += '4';
    }
    else if (i === 19) {
      const variant = Math.floor(Math.random() * 4 + 8).toString(16);
      uuid += variant;
    }
    else {
      uuid += randomHex();
    }
  }
  return uuid;
};

export const ownershipShouldBlock = (concepts: Concepts, action: Action): boolean => {
  // console.log(concepts, action);
  let qualityKeys;
  try {
    qualityKeys = concepts[action.semaphore[0]].qualities[action.semaphore[1]].keyedSelectors;
  } catch (error) {
    console.log('----');
    console.error(error);
    console.error(JSON.stringify(action.semaphore), action.type, action.origin, Object.keys(concepts));
    console.log('----');
  }
  const actionSelectors = action.keyedSelectors;
  const ownershipState = selectState(concepts, ownershipName) as OwnershipState;
  const ownershipLedger = ownershipState.ownershipLedger;
  let shouldBlock = false;
  // Quality Action no Keys, no Strategy
  if (qualityKeys && !actionSelectors && action.strategy === undefined) {
    for (let i = 0; i < qualityKeys.length; i++) {
      if (ownershipLedger.has(qualityKeys[i].keys)) {
        shouldBlock = true;
        break;
      }
    }
  // ActionStrategy, with Keys
  } else if (actionSelectors && action.strategy && action.strategy.stubs === undefined) {
    for (let i = 0; i < actionSelectors.length; i++) {
      if (ownershipLedger.has(actionSelectors[i].keys)) {
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

export const clearStubs = (concepts: Concepts, strategy: ActionStrategy): Concepts => {
  const newConcepts = concepts;
  const stubs = strategy.stubs;
  const ownershipState = selectState(newConcepts, ownershipName) as OwnershipState;
  const ownershipLedger = ownershipState.ownershipLedger;
  if (stubs) {
    stubs.forEach(ticketStub => {
      const line = ownershipLedger.get(ticketStub.key);
      if (line) {
        const newLine = [] as OwnershipTicket[];
        for (const stub of line) {
          if (stub.ticket !== ticketStub.ticket) {
            newLine.push(stub);
          }
        }
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

export const editStubs = (_concepts: Concepts, oldAction: Action, newAction: Action): [Concepts, Action] => {
  const concepts = _concepts;
  const oldStrategy = oldAction.strategy as ActionStrategy;
  const newStrategy = newAction.strategy as ActionStrategy;
  newStrategy.stubs = [];
  const ownershipState = selectState(concepts, ownershipName) as OwnershipState;
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
(concepts: Concepts, action: Action): [Concepts, Action] => {
  const newConcepts = concepts;
  const ownershipState = selectState(newConcepts, ownershipName) as OwnershipState;
  const ownershipLedger = ownershipState.ownershipLedger;
  const strategy = action.strategy;
  if (strategy) {
    strategy.stubs = strategy.stubs ? strategy.stubs : [] as OwnershipTicketStub[];
    action.keyedSelectors?.forEach(keyed => {
      const key = keyed.keys;
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
        const muxiumState = getMuxiumState(concepts);
        const ticket = muxiumState.name + generateUUID();
        const newTicketStub = {
          key,
          ticket,
          expiration
        };
        const newTicket = {
          ticket,
          expiration
        };
        strategy.stubs?.push(newTicketStub);
        if (entry) {
          entry.push(newTicket);
        } else {
          ownershipLedger.set(key, [newTicket]);
        }
      }
    });
  }
  return  [
    newConcepts,
    action
  ];
};

export const isActionReady = (concepts: Concepts, _action: Action): [Concepts, boolean] => {
  const action = _action;
  const stubs = action.strategy?.stubs;
  if (stubs) {
    return stubActionStrategy(concepts, action);
  } else {
    return qualityAction(concepts, action);
  }
};

const stubActionStrategy = (concepts: Concepts, _action: Action): [Concepts, boolean] => {
  const action = _action;
  const ownershipState = selectState(concepts, ownershipName) as OwnershipState;
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

const qualityAction = (concepts: Concepts, _action: Action): [Concepts, boolean] => {
  const ownershipState = selectState(concepts, ownershipName) as OwnershipState;
  const ownershipLedger = ownershipState.ownershipLedger;
  const action = _action;
  const qualitySelectors = concepts[action.semaphore[0]].qualities[action.semaphore[1]].keyedSelectors;
  let readyToGo = true;

  if (qualitySelectors) {
    for (const selector of qualitySelectors) {
      const key = selector.keys;
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
    // Logical Determination: nullActionType
    //  In addition we logically guarantee that action would be set at this point of execution
    (first.lastActionNode?.action as Action).semaphore[3] !== 2 ? count[0] + 1 : count[0],
    (second.lastActionNode?.action as Action).semaphore[3] !== 2 ? count[0] + 1 : count[0]
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
    if (areSemaphoresEqual(first, second)) {
      if (first.payload === undefined && second.payload === undefined) {
        equal = true;
      } else {
        equal = JSON.stringify(first.payload) === JSON.stringify(second.payload);
      }
    }
    equal = false;
  } else if (firstStrategy?.topic === secondStrategy?.topic) {
    if (areSemaphoresEqual(first, second)) {
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

export const updateAddToPendingActions = (_concepts: Concepts, _action: Action) => {
  let concepts = _concepts;
  const action = _action;
  const ownershipState = selectState(concepts, ownershipName) as OwnershipState;
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

export const ownership = ({
  createOwnershipLedger,
  ownershipShouldBlock,
  clearStubs,
  editStubs,
  checkIn,
  isActionReady,
  areEqual,
  updateAddToPendingActions,
});
/*#>*/