// import { Action } from '../model/action';
// // Define Ownership Here
// // As the Basis of anything Within Model Directory is that Such Enables the Concepts to Function as Intended
// // AKA Concept Model

// // Register

// // Unregister

// export interface OwnershipLedger {
//   entries: OwnershipTickers[];
// }

// export interface OwnershipTicket {
//   ticket: number;
//   key: string;
// }

// export interface OwnershipTickers {
//   tickets: OwnershipTicket[];
//   key: string;
// }

// export const createOwnershipLedger = (): OwnershipLedger => ({
//   entries: [
//   ]
// } as OwnershipLedger);

// export const addEntry = (ledger: OwnershipLedger, action: Action): [OwnershipLedger, boolean[]] => {
//   const newLedger = {...ledger};
//   const newEntries = action.keyedSelectors;
//   if (newEntries !== undefined) {
//     const success = new Array<boolean>(newEntries.length).fill(false);
//     newEntries.forEach((entry: OwnershipTickers, i: number) => {
//       if (!newLedger.entries.find(e => e === entry)) {
//         newLedger.entries.push({
//         // data,
//           tickets: [] as OwnershipTicket[],
//           key: entry
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

// // export const editEntry = (ledger: OwnershipLedger, stub: OwnershipTicket, data: T): [OwnershipLedger, boolean] => {
// //   const newLedger = {...ledger};
// //   for (let i = 0; i < newLedger.entries.length; i++) {
// //       if (newLedger.entries[i].key === stub.key && newLedger.entries[i].tickets[0] === stub.ticket) {
// //           newLedger.entries[i] = {
// //               data,
// //               key : newLedger.entries[i].key,
// //               tickets : newLedger.entries[i].tickets.filter(ticket => ticket !== stub.ticket)
// //           };

// //           return [newLedger, true];
// //       }
// //   }
// //   return [ledger, false];
// // };

// // export const referenceEntry = (ledger: OwnershipLedger, key: number): T | boolean => {
// //   const newLedger = {...ledger};
// //   for(let i = 0; i < newLedger.entries.length; i++) {
// //       if (newLedger.entries[i].key === key) {
// //           return newLedger.entries[i].data as T;
// //       }
// //   }
// //   return false;
// // };

// export const takeTicket =
// (ledger: OwnershipLedger, action: Action): [OwnershipLedger, OwnershipTicket[]] => {
//   const stubs: OwnershipTicket[] = [];
//   const newLedger = {...ledger};
//   const keys = action.selectors;
//   keys.forEach((key: any) => {
//     for (let i = 0; i < newLedger.entries.length; i++) {
//       if (newLedger.entries[i].key === key) {
//         // Change this
//         const ticketNumber = Number.parseInt(crypto.randomUUID(), 16);
//         const stub: OwnershipTicket = {
//           // data: newLedger.entries[i].data as T,
//           ticket: ticketNumber,
//           key: newLedger.entries[i].key,
//         };
//         newLedger.entries[i].tickets.push(stub);
//         stubs.push(stub);
//       }
//     }
//   });
//   return  [
//     newLedger,
//     stubs
//   ];
// };

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
