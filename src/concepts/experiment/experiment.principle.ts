import { Subscriber } from 'rxjs';
import { Action } from '../../model/action';
import { PrincipleFunction, registerPrincipleSubscription } from '../../model/principle';
import { Concept } from '../../model/concept';
import { UnifiedSubject } from '../../model/unifiedSubject';
import { selectState } from '../../model/selector';
import { AxiumState, axiumName } from '../axium/axium.concept';
import { ExperimentActionQueState, experimentName } from './experiment.concept';

export const experimentActionQuePrinciple: PrincipleFunction = (
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
        const experimentState = selectState<ExperimentActionQueState>(concepts, experimentName);
        // console.log('Check que', experimentState.actionQue);
        if (experimentState.actionQue.length > 0) {
          if (!readyToGo) {
            readyToGo = true;
            setTimeout(() => {
              readyToGo = false;
              const nextAction = experimentState.actionQue.shift();
              // console.log('Dispatched from Experiment Principle', nextAction, experimentState.actionQue);
              if (nextAction) {
                experimentState.actionQue = [... experimentState.actionQue];
                concepts$.next(concepts);
                observer.next(nextAction);
              } else {
                experimentState.actionQue = [];
                concepts$.next(concepts);
              }
            }, 400);
          }
        }
      });
      sub.unsubscribe();
      registerPrincipleSubscription(observer, _cpts, experimentName, subscription);
    }
  });
};

