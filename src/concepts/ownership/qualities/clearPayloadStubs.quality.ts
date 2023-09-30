import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { OwnershipTicket, OwnershipTicketStub } from '../../../model/ownership';

export const ownershipClearPayloadStubsType: ActionType = 'clear payload Stubs from Ownership Ledger';
export type ClearPayloadStubsPayload = OwnershipTicketStub[];

export function clearPayloadStubsReducer(state: OwnershipState, action: Action): OwnershipState {
  const stubs = action.payload as ClearPayloadStubsPayload;
  const ownershipLedger = state.ownershipLedger;
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
  return {
    ...state,
    ownershipLedger: ownershipLedger
  };
}
export const clearPayloadStubsQuality = createQuality(
  ownershipClearPayloadStubsType,
  clearPayloadStubsReducer,
  defaultMethodCreator
);
