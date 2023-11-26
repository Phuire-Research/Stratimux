import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { OwnershipTicket, OwnershipTicketStub } from '../../../model/ownership';
import { selectPayload } from '../../../model/selector';

export type OwnershipClearPayloadStubsPayload = {
  stubs: OwnershipTicketStub[]
};
export const ownershipClearPayloadStubsType: ActionType = 'clear payload Stubs from Ownership Ledger';
export const ownershipClearPayloadStubs =
  prepareActionWithPayloadCreator<OwnershipClearPayloadStubsPayload>(ownershipClearPayloadStubsType);

function ownershipClearPayloadStubsReducer(state: OwnershipState, action: Action): OwnershipState {
  const stubs = selectPayload<OwnershipClearPayloadStubsPayload>(action).stubs;
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
  ownershipClearPayloadStubsReducer,
  defaultMethodCreator
);
