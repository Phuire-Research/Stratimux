/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a principle will manage the ownership's pendingActions based upon the current
ownershipLedger's contents. Only actions that are first in all lines of their tickets set the the strategy's KeyedSelectors,
may be dispatched into the Muxium. This principle will also clear duplicate strategies, and handle actions if their agreement has expired.
$>*/
/*<#*/
import { OwnershipPrinciple, OwnershipState, ownershipName} from '../ownership/ownership.concept';
import { ownershipSetOwnershipModeStrategy } from './strategies/setOwnerShipMode.strategy';
import { selectMuxifiedState } from '../../model/selector/selector';
import { OwnershipTicket, createOwnershipLedger, isActionReady } from '../../model/ownership';
import { StagePlanner } from '../../model/stagePlanner/stagePlanner.type';
import { failureConditions, strategyData_appendFailure } from '../../model/action/actionStrategyData';
import { MuxiumBadActionPayload } from '../muxium/qualities';
import { Action, AnyAction } from '../../model/action/action.type';
import { areSemaphoresEqual } from '../../model/action/actionSemaphore';
import { strategyBegin } from '../../model/action/strategy/actionStrategyConsumers';

function denoteExpiredPending(action: Action): Action {
  if (action.strategy) {
    const strategy = action.strategy;
    action.strategy.data = strategyData_appendFailure(strategy, failureConditions.ownershipExpired);
  }
  return action;
}

export const ownershipPrinciple: OwnershipPrinciple = ({
  observer,
  plan,
  nextC,
  conceptSemaphore
}) => {
  let initDispatch = false;
  let finalCheck = true;
  const planOwnership: StagePlanner = plan('ownership Principle Plan', ({d__, stage, stageO}) => [
    stageO(() => d__.muxium.e.muxiumRegisterStagePlanner({conceptName: ownershipName, stagePlanner: planOwnership})),
    stage(({concepts, d}) => {
      let newConcepts = concepts;
      let ownershipState = selectMuxifiedState<OwnershipState>(newConcepts, conceptSemaphore);
      if (ownershipState?.initialized) {
        // This will be the point of dispatch of Qued Actions
        let newAction;
        if (ownershipState.pendingActions.length > 0) {
          // One Action at a Time
          for (const action of ownershipState.pendingActions) {
            let readyToGo = false;
            [newConcepts, readyToGo] = isActionReady(newConcepts, action);
            if (readyToGo) {
              newAction = action;
              break;
            }
          }
          if (newAction) {
            ownershipState = selectMuxifiedState(newConcepts, conceptSemaphore) as OwnershipState;
            const newPendingActions = [];
            for (const pending of ownershipState.pendingActions) {
              if (!areSemaphoresEqual(pending, newAction) && pending.expiration !== newAction.expiration) {
                newPendingActions.push(pending);
              } else if (areSemaphoresEqual(pending, newAction) && pending.expiration !== newAction.expiration) {
                newPendingActions.push(pending);
              }
            }
            ownershipState.pendingActions = [...newPendingActions];
            nextC(newConcepts);
            observer.next(newAction);
          } else if (!newAction && ownershipState.pendingActions.length !== 0) {
            const payload: MuxiumBadActionPayload = {
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
              newAction = d.muxium.e.muxiumBadAction(payload) as AnyAction;
              ownershipState.pendingActions = newPending;
              console.error('CHECK OWNERSHIP 1', Object.keys(concepts));
              nextC(newConcepts);
              observer.next(newAction);
            } else if (finalCheck) {
              finalCheck = false;
              setTimeout(() => {
                finalCheck = true;
                console.error('CHECK OWNERSHIP 2', Object.keys(concepts));
                nextC(newConcepts);
              }, 200);
            }
          }
        }
      } else if (!initDispatch && !ownershipState?.initialized && ownershipState?.isResponsibleForMode) {
        initDispatch = true;
        observer.next(
          strategyBegin(
            ownershipSetOwnershipModeStrategy(d, newConcepts, 'Ownership')
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
their strategies in outside Muxiums.
$>*/
/*<#*/
export const ownershipExpirationPrinciple: OwnershipPrinciple = ({
  plan,
  nextC,
  conceptSemaphore
}) => {
  const planOwnership: StagePlanner = plan('ownership Principle Plan', ({d__, stage, stageO}) => [
    stageO(() => (d__.muxium.e.muxiumRegisterStagePlanner({conceptName: ownershipName, stagePlanner: planOwnership}))),
    stage(({concepts}) => {
      const ownershipState = selectMuxifiedState<OwnershipState>(concepts, conceptSemaphore);
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
          nextC(concepts);
        }
      }
    })
  ]);
};
/*#>*/