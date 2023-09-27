import { Subscriber } from 'rxjs';
import { Action } from '../../model/action';
import { PrincipleFunction, registerPrincipleSubscription } from '../../model/principle';
import { Concept } from '../../model/concept';
import { UnifiedSubject } from '../../model/unifiedSubject';
import { selectState } from '../../model/selector';
import { AxiumState, axiumName } from '../axium/axium.concept';
import { ExperimentState, experimentName } from './experiment.concept';

export const ownershipPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concept[],
  concepts$: UnifiedSubject
) => {
  let readyToGo = false;
  const sub = concepts$.subscribe(_cpts => {
    const axiumState = selectState<AxiumState>(_cpts, axiumName);
    if (axiumState.open) {
      const subscription = concepts$.subscribe(cpts => {
        const concepts = cpts;
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState.actionQue.length > 0) {
          if (!readyToGo) {
            setTimeout(() => {
              readyToGo = true;
            }, 500);
          } else {
            readyToGo = false;
            const nextAction = experimentState.actionQue.shift();
            if (nextAction) {
              experimentState.actionQue = [... experimentState.actionQue];
              concepts$.next(concepts);
              observer.next(nextAction);
            } else {
              experimentState.actionQue = [];
              concepts$.next(concepts);
            }
          }
        }
      });
      sub.unsubscribe();
      registerPrincipleSubscription(observer, _cpts, experimentName, subscription);
    }
  });
};

