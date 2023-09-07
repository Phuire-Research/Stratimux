import { Action, createAction, primeAction } from '../model/action';
import { OwnershipState, createOwnershipConcept, ownershipKey } from '../concepts/ownership/ownership.concept';
import { Concept } from './concept';
import { KeyedSelector, selectState } from './selector';
import { axiumBadActionType, badActionReducer } from '../concepts/axium/qualities/badAction.quality';
// Define Ownership Here
// As the Basis of anything Within Model Directory is that Such Enables the Concepts to Function as Intended
// AKA Concept Model

// Register

// Unregister

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

// export const addEntry = (concepts: Concept[], action: Action, duration: number): [OwnershipLedger, boolean[]] => {
//   const ownershipState = selectState<OwnershipState>(concepts, ownershipConcept.key);
//   const newLedger: OwnershipLedger = {...ownershipState.ownershipLedger};
//   const newEntries = action.keyedSelectors;
//   if (newEntries !== undefined) {
//     const success = new Array<boolean>(newEntries.length).fill(false);
//     newEntries.forEach((keyedSelector: KeyedSelector<unknown>, i: number) => {
//       const key = `${keyedSelector.conceptKey} ${keyedSelector.key}`;
//       if (!newLedger.entries.has(key)) {
//         newLedger.entries.set(key, {
//           ticket: ownershipState.ticker

//         });
//         success[i] = true;
//       }
//     });

//     return [newLedger, success];
//   }
//   return [newLedger, [false]];
// };

// export const removeEntry = (ledger: OwnershipLedger, action: Action): [OwnershipLedger, boolean[]] => {
//   const newLedger = {...ledger};
//   const stubs = action.stubs;
//   const success = new Array<boolean>(stubs.length).fill(false);
//   stubs.forEach((stub: OwnershipTicket, i: number) => {
//     newLedger.entries = newLedger.entries
//       .filter(entry => {
//         if (stub.key !== entry.key && stub.ticket !== entry.key) {
//           success[i] = true;
//         }
//       });
//   });
//   return [newLedger, success];
// };

// export const editEntry = (ledger: OwnershipLedger, stub: OwnershipTicket, data: T): [OwnershipLedger, boolean] => {
//   const newLedger = {...ledger};
//   for (let i = 0; i < newLedger.entries.length; i++) {
//       if (newLedger.entries[i].key === stub.key && newLedger.entries[i].tickets[0] === stub.ticket) {
//           newLedger.entries[i] = {
//               data,
//               key : newLedger.entries[i].key,
//               tickets : newLedger.entries[i].tickets.filter(ticket => ticket !== stub.ticket)
//           };

//           return [newLedger, true];
//       }
//   }
//   return [ledger, false];
// };

// export const referenceEntry = (ledger: OwnershipLedger, key: number): T | boolean => {
//   const newLedger = {...ledger};
//   for(let i = 0; i < newLedger.entries.length; i++) {
//       if (newLedger.entries[i].key === key) {
//           return newLedger.entries[i].data as T;
//       }
//   }
//   return false;
// };

export const checkIn =
(concepts: Concept[], action: Action): [Concept[], Action] => {
  const newConcepts = concepts;
  const ownershipState = selectState<OwnershipState>(newConcepts, ownershipKey);
  const ownershipLedger = ownershipState.ownershipLedger;
  action.stubs = [] as OwnershipTicketStub[];
  action.keyedSelectors?.forEach(keyed => {
    const key = `${keyed.conceptKey} ${keyed.stateKeys}`;
    const entry = ownershipLedger.get(key);
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
    if (entry) {
      ownershipLedger.get(key)?.push(newTicket);
      action.stubs?.push(newTicketStub);
    } else {
      ownershipLedger.set(key, [newTicket]);
      action.stubs?.push(newTicketStub);
    }
  });
  return  [
    newConcepts,
    action
  ];
};

export const isActionReady = (concepts: Concept[], _action: Action): [Concept[], Action | undefined] => {
  if (_action.semaphore[2] !== -1 && _action.type !== axiumBadActionType) {
    const action = _action;
    const stubs = action.stubs;
    if (stubs) {
      return stubAction(concepts, action);
    } else {
      return qualityAction(concepts, action);
    }
  } else if (_action.type !== axiumBadActionType) {
    const action = primeAction(concepts, _action);
    return isActionReady(concepts, action);
  } else {
    const ownershipState = selectState<OwnershipState>(concepts, ownershipKey);
    const cleanUp = [] as Action[];
    ownershipState.pendingActions = ownershipState.pendingActions.filter(
      (atn) => {
        if (_action.type !== atn.type) {
          return true;
        } else {
          cleanUp.push(atn);
          return false;
        }
      }
    );
    _action.payload = cleanUp;
    return [concepts, _action];
  }
};

const stubAction = (concepts: Concept[], _action: Action): [Concept[], Action | undefined] => {
  const action = _action;
  const ownershipState = selectState<OwnershipState>(concepts, ownershipKey);
  const ownershipLedger = ownershipState.ownershipLedger;
  const stubs = action.stubs as OwnershipTicketStub[];
  let frontOfAllLines = true;
  let expired = false;
  for (const stub of stubs) {
    if (action.expiration < Date.now()) {
      expired = true;
      break;
    }
    const positions = ownershipLedger.get(stub.key);
    if (positions) {
      for (const [i, pos] of positions.entries()) {
        if (i === 0 && pos.ticket === stub.ticket) {
          break;
        } else {
          frontOfAllLines = false;
          break;
        }
      }
    }
  }
  if (expired) {
    for (const stub of stubs) {
      const positions = ownershipLedger.get(stub.key);
      if (positions) {
        const newLine = positions.filter(pos => pos.ticket !== stub.ticket);
        if (newLine.length > 0) {
          ownershipLedger.set(stub.key, newLine);
        } else {
          ownershipLedger.delete(stub.key);
        }
      }
    }
    return [concepts, createAction(axiumBadActionType, action)];
  }
  if (frontOfAllLines) {
    for (const stub of stubs) {
      const line = ownershipLedger.get(stub.key);
      if (line) {
        const newLine = line;
        newLine.shift();
        if (newLine.length > 0) {
          ownershipLedger.set(stub.key, newLine);
        } else {
          ownershipLedger.delete(stub.key);
        }
      }
    }
    return [concepts, action];
  } else {
    return [concepts, undefined];
  }
};

const qualityAction = (concepts: Concept[], _action: Action): [Concept[], Action | undefined] => {
  const ownershipState = selectState<OwnershipState>(concepts, ownershipKey);
  const ownershipLedger = ownershipState.ownershipLedger;
  const action = _action;
  const qualitySelectors = concepts[action.semaphore[0]].qualities[action.semaphore[1]].keyedSelectors;
  let readyToGo = true;
  if (qualitySelectors) {
    for (const selector of qualitySelectors) {
      const key = `${selector.conceptKey} ${selector.stateKeys}`;
      if (ownershipLedger.get(key)) {
        readyToGo = false;
        break;
      }
    }
    if (readyToGo) {
      return [concepts, action];
    }
  }
  return [concepts, undefined];
};

export const checkOut = () => {
  // This runs if the Action already has Ticket Stubs
  // As stubs attached and beyond the Initial Guard it is Assumed it is a Good Action
  // Check Out Removes the Tickets from the Ownership Ledger based on the Stubs
};

// export const removeTickets = (ledger: OwnershipLedger, action: Action): [OwnershipLedger, boolean[]] => {
//   const newLedger = {...ledger};
//   const stubs = action.stubs;
//   const success = new Array<boolean>(stubs.length).fill(false);
//   stubs.forEach((stub: OwnershipTicket) => {
//     for (let i = 0; i < newLedger.entries.length; i++) {
//       if (newLedger.entries[i].key === stub.key) {
//         newLedger.entries[i].tickets = newLedger.entries[i].tickets.filter((entry: OwnershipTicket) => entry.ticket !== stub.ticket);
//         success[i] = true;
//       }
//     }
//   });
//   return [newLedger, success];
// };
