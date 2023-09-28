import { Subscriber } from 'rxjs';
import { Concept } from '../../model/concept';
import { PrincipleFunction } from '../../model/principle';
import { OwnershipState, ownershipName} from '../ownership/ownership.concept';
import { setOwnershipModeStrategy } from './strategies/setOwnerShipMode.strategy';
import { AxiumState, axiumName } from '../axium/axium.concept';
import { Action } from '../../model/action';
import { selectState } from '../../model/selector';
import { primeAction } from '../../model/action';
import { strategyBegin } from '../../model/actionStrategy';
import { registerPrincipleSubscription } from '../../model/principle';
import { isActionReady } from '../../model/ownership';
import { UnifiedSubject } from '../../model/unifiedSubject';

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
          if (ownershipState.pendingActions) {
            let newAction;
            // One Action at a Time
            for (const action of ownershipState.pendingActions) {
              if (!action.stubs) {
                // console.log('Check last Action', action.strategy?.lastActionNode.action);
                if (action.strategy?.currentNode.lastActionNode?.action?.stubs) {
                  [concepts, newAction] = isActionReady(concepts, action.strategy.currentNode.lastActionNode.action);

                  // eslint-disable-next-line max-depth
                  if (newAction) {
                    newAction = action;
                    break;
                  }
                }
              } else {
                [concepts, newAction] = isActionReady(concepts, action);
                if (newAction) {
                  newAction = action;
                  break;
                }
              }
            }
            if (newAction) {
              ownershipState = selectState<OwnershipState>(concepts, ownershipName);
              const newPendingActions = [];
              for (const pending of ownershipState.pendingActions) {
                // eslint-disable-next-line max-depth
                if (pending.type !== newAction.type && pending.expiration !== newAction.expiration) {
                  newPendingActions.push(pending);
                } else if (pending.type === newAction.type && pending.expiration !== newAction.expiration) {
                  newPendingActions.push(pending);
                }
              }
              ownershipState.pendingActions = [...newPendingActions];
              concepts$.next(concepts);
              observer.next(newAction);
            } else if (ownershipState.pendingActions.length !== 0 && finalCheck) {
              finalCheck = false;
              setTimeout(() => {
                finalCheck = true;
                concepts$.next(concepts);
              }, 200);
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

