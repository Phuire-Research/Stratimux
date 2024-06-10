/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a principle that observes the experiment's actionQue and dispatches
in sequence upon each observation of state.
$>*/
/*<#*/
import { PrincipleFunction } from '../../model/principle';
import { StagePlanner, createStage, stageWaitForOpenThenIterate } from '../../model/stagePlanner';
import { selectUnifiedState } from '../../model/selector';
import { ExperimentState, experimentName } from './experiment.concept';
import { axiumRegisterStagePlanner } from '../axium/qualities/registerStagePlanner.quality';

export const experimentActionQuePrincipleCreator = <T>() => {
  const experimentActionQuePrinciple: PrincipleFunction<T> = ({
    observer,
    plan,
    nextC,
    conceptSemaphore
  }) => {
    let readyToGo = false;
    const planExperiment: StagePlanner = plan('Experiment Principle Plan', ({d__}) => [
      stageWaitForOpenThenIterate(() =>
        (d__.axium.e.axiumRegisterStagePlanner({conceptName: experimentName, stagePlanner: planExperiment}))
      ),
      createStage(({concepts}) => {
        const experimentState = selectUnifiedState<ExperimentState>(concepts, conceptSemaphore);
        if (experimentState && experimentState.actionQue.length > 0) {
          if (!readyToGo) {
            readyToGo = true;
            setTimeout(() => {
              readyToGo = false;
              const nextAction = experimentState.actionQue.shift();
              if (nextAction) {
                experimentState.actionQue = [... experimentState.actionQue];
                nextC(concepts);
                observer.next(nextAction);
              } else {
                experimentState.actionQue = [];
                nextC(concepts);
              }
            }, 400);
          }
        }
      })
    ]);
  };
  return experimentActionQuePrinciple;
};
/*#>*/