import { defer, Observable, Subject, withLatestFrom, BehaviorSubject, Subscriber, map} from 'rxjs';
import { Concept, Mode } from '../../model/concept';
import { PrincipleFunction, createPrinciple$ } from '../../model/principle';
import { OwnershipState, ownershipConcept } from '../ownership/ownership.concept';
import { setOwnershipModeStrategy } from './strategies/setOwnerShipMode.strategy';
import { AxiumState, _axium } from '../axium/axium.concept';
import { Action } from '../../model/action';
import { selectState } from '../../model/selector';
import { primeAction } from '../../model/action';
import { strategyBegin } from '../../model/actionStrategy';
import { registerPrincipleSubscription } from '../../model/principle';

export const ownershipPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concept[],
  concepts$: Subject<Concept[]>
) => {
  let initDispatch = false;
  const sub = concepts$.subscribe(_cpts => {
    const axiumState = selectState<AxiumState>(_cpts, _axium.key);
    // console.log('Check', axiumState.open);
    if (axiumState.open) {
      const subscription = concepts$.subscribe(concepts => {
        const ownershipState = selectState<OwnershipState>(concepts, ownershipConcept.key);
        // console.log('Check', ownershipState);
        if (ownershipState.initialized) {
          console.log('Do Stuff');
        } else if (!initDispatch && !ownershipState.initialized) {
          console.log('DISPATCH');
          initDispatch = true;
          observer.next(
            strategyBegin(
              setOwnershipModeStrategy(concepts)
            )
          );
        }
      });
      // Problem Step
      // registerPrincipleSubscription(observer, _cpts, subscription);
      sub.unsubscribe();
    }
  });
};

