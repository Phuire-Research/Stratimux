import { Subscriber } from 'rxjs';
import { Concept } from '../../model/concept';
import { PrincipleFunction } from '../../model/principle';
import { OwnershipState, ownershipName} from '../ownership/ownership.concept';
import { setOwnershipModeStrategy } from './strategies/setOwnerShipMode.strategy';
import { AxiumState, axiumName } from '../axium/axium.concept';
import { Action, areSemaphoresEqual, createAction } from '../../model/action';
import { selectState } from '../../model/selector';
import { strategyBegin } from '../../model/actionStrategy';
import { registerPrincipleSubscription } from '../../model/principle';
import { OwnershipTicket, createOwnershipLedger, isActionReady } from '../../model/ownership';
import { UnifiedSubject } from '../../model/unifiedSubject';
import { BadActionPayload, axiumBadActionType } from '../axium/qualities/badAction.quality';

export const ownershipPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concept[],
  concepts$: UnifiedSubject
) => {
  let initDispatch = false;
  let finalCheck = true;
  const sub = concepts$.subscribe(_cpts => {
    const axiumState = selectState<AxiumState>(_cpts, axiumName);
    if (axiumState.open) {
      const subscription = concepts$.subscribe(cpts => {
        let concepts = cpts;
        let ownershipState = selectState<OwnershipState>(concepts, ownershipName);
        if (ownershipState.initialized) {
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
              ownershipState = selectState<OwnershipState>(concepts, ownershipName);
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
              const badActions: BadActionPayload = [];
              const newPending: Action[] = [];
              for (const pending of ownershipState.pendingActions) {
                if (pending.expiration < Date.now()) {
                  badActions.push(pending);
                } else {
                  newPending.push(pending);
                }
              }
              if (badActions.length > 0) {
                newAction = createAction(axiumBadActionType, badActions);
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
        } else if (!initDispatch && !ownershipState.initialized && ownershipState.isResponsibleForMode) {
          initDispatch = true;
          observer.next(
            strategyBegin(
              setOwnershipModeStrategy(concepts, 'Ownership')
            )
          );
        }
      });
      sub.unsubscribe();
      registerPrincipleSubscription(observer, _cpts, ownershipName, subscription);
    }
  });
};

export const ownershipExpirationPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concept[],
  concepts$: UnifiedSubject
) => {
  const sub = concepts$.subscribe(_cpts => {
    const axiumState = selectState<AxiumState>(_cpts, axiumName);
    if (axiumState.open) {
      const subscription = concepts$.subscribe(cpts => {
        const concepts = cpts;
        const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
        if (ownershipState.initialized) {
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
      });
      sub.unsubscribe();
      registerPrincipleSubscription(observer, _cpts, ownershipName, subscription);
    }
  });
};
