/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a principle will manage the ownership's pendingActions based upon the current
ownershipLedger's contents. Only actions that are first in all lines of their tickets set the the strategy's KeyedSelectors,
may be dispatched into the Axium. This principle will also clear duplicate strategies, and handle actions if their agreement has expired.
$>*/
/*<#*/
import { Subscriber } from 'rxjs';
import { Concepts } from '../../model/concept';
import { PrincipleFunction } from '../../model/principle';
import { OwnershipState, ownershipName} from '../ownership/ownership.concept';
import { ownershipSetOwnershipModeStrategy } from './strategies/setOwnerShipMode.strategy';
import { Action, areSemaphoresEqual, createAction, primeAction } from '../../model/action';
import { selectUnifiedState } from '../../model/selector';
import { strategyBegin } from '../../model/actionStrategy';
import { OwnershipTicket, createOwnershipLedger, isActionReady } from '../../model/ownership';
import { UnifiedSubject, createStage, stageWaitForOpenThenIterate, stageWaitForOwnershipThenIterate  } from '../../model/stagePlanner';
import { AxiumBadActionPayload, axiumBadActionType } from '../axium/qualities/badAction.quality';
import { axiumRegisterStagePlanner } from '../axium/qualities/registerStagePlanner.quality';
import { failureConditions, strategyData_appendFailure } from '../../model/actionStrategyData';

function denoteExpiredPending(action: Action): Action {
  if (action.strategy) {
    const strategy = action.strategy;
    action.strategy.data = strategyData_appendFailure(strategy, failureConditions.ownershipExpired);
  }
  return action;
}

export const ownershipPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number
) => {
  let initDispatch = false;
  let finalCheck = true;
  const plan = concepts$.plan('ownership Principle Plan', [
    stageWaitForOpenThenIterate(() => (axiumRegisterStagePlanner({conceptName: ownershipName, stagePlanner: plan}))),
    createStage((cpts, _) => {
      let concepts = cpts;
      let ownershipState = selectUnifiedState<OwnershipState>(concepts, semaphore);
      if (ownershipState?.initialized) {
        // This will be the point of dispatch of Qued Actions
        let newAction;
        if (ownershipState.pendingActions.length > 0) {
          // One Action at a Time
          for (const action of ownershipState.pendingActions) {
            let readyToGo = false;
            [concepts, readyToGo] = isActionReady(concepts, action);
            if (readyToGo) {
              newAction = action;
              break;
            }
          }
          if (newAction) {
            ownershipState = selectUnifiedState(concepts, semaphore) as OwnershipState;
            const newPendingActions = [];
            for (const pending of ownershipState.pendingActions) {
              if (!areSemaphoresEqual(pending, newAction) && pending.expiration !== newAction.expiration) {
                newPendingActions.push(pending);
              } else if (areSemaphoresEqual(pending, newAction) && pending.expiration !== newAction.expiration) {
                newPendingActions.push(pending);
              }
            }
            ownershipState.pendingActions = [...newPendingActions];
            concepts$.next(concepts);
            observer.next(newAction);
          } else if (!newAction && ownershipState.pendingActions.length !== 0) {
            const payload: AxiumBadActionPayload = {
              badActions: []
            };
            const newPending: Action[] = [];
            for (const pending of ownershipState.pendingActions) {
              if (pending.expiration < Date.now()) {
                payload.badActions.push(denoteExpiredPending(pending));
              } else {
                newPending.push(pending);
              }
            }
            if (payload.badActions.length > 0) {
              newAction = createAction(axiumBadActionType, payload);
              ownershipState.pendingActions = newPending;
              concepts$.next(concepts);
              observer.next(newAction);
            } else if (finalCheck) {
              finalCheck = false;
              setTimeout(() => {
                finalCheck = true;
                concepts$.next(concepts);
              }, 200);
            }
          }
        }
      } else if (!initDispatch && !ownershipState?.initialized && ownershipState?.isResponsibleForMode) {
        initDispatch = true;
        observer.next(
          strategyBegin(
            ownershipSetOwnershipModeStrategy(concepts, 'Ownership')
          )
        );
      }
    })
  ]);
};
/*#>*/
/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, generate a principle that manage clear lines of expired tickets.
This functionality is chiefly important for Actions that have moved off the current process, but will return after completing
their strategies in outside Axiums.
$>*/
/*<#*/
export const ownershipExpirationPrinciple: PrincipleFunction = (
  _: Subscriber<Action>,
  _concepts: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number
) => {
  const plan = concepts$.plan('ownership Principle Plan', [
    stageWaitForOwnershipThenIterate(() => (axiumRegisterStagePlanner({conceptName: ownershipName, stagePlanner: plan}))),
    createStage((cpts, __) => {
      const concepts = cpts;
      const ownershipState = selectUnifiedState<OwnershipState>(concepts, semaphore);
      if (ownershipState?.initialized) {
        let modified = false;
        const newLedger = createOwnershipLedger();
        for (const [key, line] of ownershipState.ownershipLedger.entries()) {
          const expiredTickets: OwnershipTicket[] = [];
          const newLine: OwnershipTicket[] = [];
          for (const ticket of line) {
            if (ticket.expiration > Date.now()) {
              expiredTickets.push(ticket);
            } else {
              newLine.push(ticket);
            }
          }
          if (expiredTickets.length > 0 && newLine.length > 0) {
            modified = true;
            newLedger.set(key, newLine);
          }
        }
        if (modified) {
          ownershipState.ownershipLedger = newLedger;
          concepts$.next(concepts);
        }
      }
    })
  ]);
};
/*#>*/