/*<$
For the graph programming framework Stratimux and Experiment Concept,
generate a principle that observes the experiment's actionQue and dispatches
in sequence upon each observation of state.
$>*/
/*<#*/
import { Subscriber } from 'rxjs';
import { Action, primeAction } from '../../model/action';
import { PrincipleFunction } from '../../model/principle';
import { Concepts } from '../../model/concept';
import { UnifiedSubject } from '../../model/stagePlanner';
import { selectUnifiedState } from '../../model/selector';
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
  const plan = concepts$.stage('Experiment Principle Plan', [
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
      if (experimentState && experimentState.actionQue.length > 0) {
        if (!readyToGo) {
          readyToGo = true;
          setTimeout(() => {
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
          }, 400);
        }
      }
    }
  ]);
};
/*#>*/