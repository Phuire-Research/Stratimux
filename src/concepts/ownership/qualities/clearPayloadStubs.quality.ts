/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality that will clear the provided stubs from the current Ownership Ledger.
If no tickets exist within a line, delete that line from the ledger.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { OwnershipState } from '../ownership.concept';
import { OwnershipTicket, OwnershipTicketStub } from '../../../model/ownership';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type OwnershipClearPayloadStubsPayload = {
  stubs: OwnershipTicketStub[]
};

export const [
  ownershipClearPayloadStubs,
  ownershipClearPayloadStubsType,
  ownershipClearPayloadStubsQuality
] = createQualitySetWithPayload<OwnershipClearPayloadStubsPayload>({
  type: 'clear payload Stubs from Ownership Ledger',
  reducer: (state: OwnershipState, action) => {
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
  },
  methodCreator: defaultMethodCreator
});
/*#>*/