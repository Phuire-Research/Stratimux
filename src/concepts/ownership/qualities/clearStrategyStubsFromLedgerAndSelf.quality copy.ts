import { Method, MethodCreator, createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, createAction } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { OwnershipTicket } from '../../../model/ownership';
import { Subject, map } from 'rxjs';
import { strategySuccess } from '../../../model/actionStrategy';
import { axiumConcludeType } from '../../axium/qualities/conclude.quality';

export const ownershipClearStrategyStubsFromLedgerAndSelfType: ActionType = 'clear current Strategy Stubs from Ownership Ledger and Itself';

const createClearStrategyStubsFromLedgerAndSelfMethodCreator: MethodCreator = () => {
  const logSubject = new Subject<Action>();
  const logMethod: Method = logSubject.pipe(
    map((action: Action) => {
      if (action.strategy) {
        action.strategy.stubs = undefined;
        return strategySuccess(action.strategy);
      }
      return createAction(axiumConcludeType);
    })
  );
  return [
    logMethod,
    logSubject
  ];
};

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
