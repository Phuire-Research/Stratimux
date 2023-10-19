import { MethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { OwnershipTicket } from '../../../model/ownership';
import { strategySuccess } from '../../../model/actionStrategy';
import { createMethod } from '../../../model/method';

export const ownershipClearStrategyStubsFromLedgerAndSelfType: ActionType = 'clear current Strategy Stubs from Ownership Ledger and Itself';
export const ownershipClearStrategyStubsFromLedgerAndSelf = prepareActionCreator(ownershipClearStrategyStubsFromLedgerAndSelfType);

const createClearStrategyStubsFromLedgerAndSelfMethodCreator: MethodCreator = () => createMethod((action) => {
  if (action.strategy) {
    action.strategy.stubs = undefined;
    return strategySuccess(action.strategy);
  }
  return action;
});

export function clearStrategyStubsFromLedgerAndSelfReducer(state: OwnershipState, action: Action): OwnershipState {
  const stubs = action?.strategy?.stubs;
  const ownershipLedger = state.ownershipLedger;
  if (action.strategy && stubs) {
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
  }
  return {
    ...state,
    ownershipLedger: ownershipLedger
  };
}
export const clearStrategyStubsFromLedgerAndSelfQuality = createQuality(
  ownershipClearStrategyStubsFromLedgerAndSelfType,
  clearStrategyStubsFromLedgerAndSelfReducer,
  createClearStrategyStubsFromLedgerAndSelfMethodCreator
);
