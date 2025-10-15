/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality that will clear the current strategies stubs from the
ownership ledger. This is to afford for strategies to relieve their ownership prior to their conclusion.
$>*/
/*<#*/
import { OwnershipState } from '../ownership.concept';
import { OwnershipTicket } from '../../../model/ownership';
import { createQualityCard, Quality } from '../../../model/quality';
import { createMethodDebounce } from '../../../model/method/methodDebounce';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';

export type OwnershipClearStrategyStubsFromLedgerAndSelf = Quality<OwnershipState>;
export const ownershipClearStrategyStubsFromLedgerAndSelf = createQualityCard<OwnershipState>({
  type: 'Ownership Clear Strategy Stubs From Ledger And Self',
  reducer: (state, action) => {
    const stubs = action?.strategy?.stubs;
    const ownershipLedger = state.ownershipLedger;
    if (action.strategy && stubs) {
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
    return {
      ownershipLedger: ownershipLedger
    };
  },
  methodCreator: () => createMethodDebounce(({action}) => {
    if (action.strategy) {
      action.strategy.stubs = undefined;
      return strategySuccess(action.strategy);
    }
    return action;
  }, 10)
});
/*#>*/