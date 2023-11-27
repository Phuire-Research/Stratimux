/*<$
For the graph programming framework Stratimux and Ownership Concept,
generate a quality that will clear the provided stubs from the current Ownership Ledger.
If no tickets exist within a line, delete that line from the ledger.
$>*/
/*<#*/
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
/*#>*/