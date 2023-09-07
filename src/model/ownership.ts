import { Action } from '../model/action';
import { OwnershipState, createOwnershipConcept, ownershipKey } from '../concepts/ownership/ownership.concept';
import { Concept } from './concept';
import { KeyedSelector, selectState } from './selector';
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
  const ticketStalls = ownershipState.ticketStalls;
  action.stubs = [];
  for (const stallSemaphore of ticketStalls) {
    if (stallSemaphore[0] === action.semaphore[0] && stallSemaphore[1] === action.semaphore[1]) {
      action.keyedSelectors?.forEach(keyed => {
        const key = `${keyed.conceptKey} ${keyed.stateKeys}`;
        const entry = ownershipLedger.get(key);
        if (entry) {
          const newTicket = {
            ticket: entry.length,
            expiration: Date.now() + 5000
          };
          ownershipLedger.get(key)?.push(newTicket);
          action.stubs?.push(newTicket);
        } else {
          const newTicket = {
            ticket: 0,
            expiration: Date.now() + 5000
          };
          ownershipLedger.set(key, [newTicket]);
          action.stubs?.push(newTicket);
        }
      });
      break;
    }
  }
  return  [
    newConcepts,
    action
  ];
};

export const isActionReady = () => {
  // Check action for Ticket Stubs and Compare Against OwnershipLedger
  // If all Stubs are at Front of Line, then Dispatch
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
