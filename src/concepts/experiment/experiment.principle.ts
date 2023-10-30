import { Subscriber } from 'rxjs';
import { Action, primeAction } from '../../model/action';
import { PrincipleFunction } from '../../model/principle';
import { Concept, Concepts } from '../../model/concept';
import { UnifiedSubject } from '../../model/stagePlanner';
import { selectState, selectUnifiedState } from '../../model/selector';
import { ExperimentState, experimentName } from './experiment.concept';
import { axiumRegisterStagePlanner } from '../axium/qualities/registerStagePlanner.quality';
import { axiumSelectOpen } from '../axium/axium.selector';

export const experimentActionQuePrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  _concepts: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number
) => {
  let readyToGo = false;
  const plan = concepts$.stage('ownership Principle Plan', [
    (concepts, dispatch) => {
      dispatch(primeAction(concepts, axiumRegisterStagePlanner({conceptName: experimentName, stagePlanner: plan})), {
        on: {
          selector: axiumSelectOpen,
          expected: true,
        },
        iterateStage: true
      });
    },
    (cpts, _) => {
      const concepts = cpts;
      const experimentState = selectUnifiedState<ExperimentState>(concepts, semaphore);
      // console.log('Check que', experimentState.actionQue);
      if (experimentState && experimentState.actionQue.length > 0) {
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
    }
  ]);
};

