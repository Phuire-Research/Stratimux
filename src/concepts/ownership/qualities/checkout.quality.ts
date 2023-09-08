// This allows for actions to block, while moving off axium to be return later
// Goal is to have this function with Strategies in Mindimport { map, Subject } from 'rxjs';
import { Action, ActionType } from '../../../model/action';
import { Method, MethodCreator, defaultReducer } from '../../../model/concept';
import { strategyFailed, strategySuccess } from '../../../model/actionStrategy';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { Subject, map } from 'rxjs';
import { OwnershipTicket, OwnershipTicketStub } from '../../../model/ownership';
import { axiumConcludeType } from '../../axium/qualities/conclude.quality';

export const ownershipCheckoutType: ActionType = 'Ownership Checkout';
export type OwnershipCheckoutPayload = {
  ticket: OwnershipTicket
  ticketStub: OwnershipTicketStub
}

// Move Ticket Logic Creation to Mode Intersect for Checkout Strategy

const checkoutMethodCreator: MethodCreator = () => {
  const addSubject = new Subject<Action>();
  const addMethod: Method = addSubject.pipe<Action>(
    map((action: Action) => {
      if (action.strategy && action.keyedSelectors) {
        return strategySuccess(action.strategy);
      } else if (action.strategy) {
        return strategyFailed(action.strategy);
      }
      return createAction(axiumConcludeType);
    })
  );
  return [
    addMethod,
    addSubject
  ];
};

export const checkoutQuality = createQuality(
  ownershipCheckoutType,
  defaultReducer,
  checkoutMethodCreator,
);