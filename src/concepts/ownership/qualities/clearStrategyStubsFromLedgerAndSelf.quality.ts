/*<$
For the graph programming framework Stratimux and Ownership Concept,
generate a quality that will clear the current strategies stubs from the
ownership ledger. This is to afford for strategies to relieve their ownership prior to their conclusion.
$>*/
/*<#*/
import { MethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { OwnershipTicket } from '../../../model/ownership';
import { strategySuccess } from '../../../model/actionStrategy';
import { createMethod } from '../../../model/method';

export const ownershipClearStrategyStubsFromLedgerAndSelfType: ActionType = 'clear current Strategy Stubs from Ownership Ledger and Itself';
export const ownershipClearStrategyStubsFromLedgerAndSelf = prepareActionCreator(ownershipClearStrategyStubsFromLedgerAndSelfType);

const ownershipClearStrategyStubsFromLedgerAndSelfMethodCreator: MethodCreator = () => createMethod((action) => {
  if (action.strategy) {
    action.strategy.stubs = undefined;
    return strategySuccess(action.strategy);
  }
  return action;
});

function ownershipClearStrategyStubsFromLedgerAndSelfReducer(state: OwnershipState, action: Action): OwnershipState {
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
    ...state,
    ownershipLedger: ownershipLedger
  };
}
export const clearStrategyStubsFromLedgerAndSelfQuality = createQuality(
  ownershipClearStrategyStubsFromLedgerAndSelfType,
  ownershipClearStrategyStubsFromLedgerAndSelfReducer,
  ownershipClearStrategyStubsFromLedgerAndSelfMethodCreator
);
/*#>*/