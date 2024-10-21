/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a principle that observes the experiment's actionQue and dispatches
in sequence upon each observation of state.
$>*/
/*<#*/
import { PrincipleFunction } from '../../model/principle';
import { selectMuxifiedState } from '../../model/selectors/selector';
import { StagePlanner } from '../../model/stagePlanner/stagePlanner.type';
import { ExperimentState, experimentName } from './experiment.concept';

export const experimentActionQuePrincipleCreator = <T>() => {
  const experimentActionQuePrinciple: PrincipleFunction<T> = ({
    observer,
    plan,
    nextC,
    conceptSemaphore
  }) => {
    let readyToGo = false;
    const planExperiment: StagePlanner = plan('Experiment Principle Plan', ({d__, stage, stageO}) => [
      stageO(() =>
        (d__.muxium.e.muxiumRegisterStagePlanner({conceptName: experimentName, stagePlanner: planExperiment}))
      ),
      stage(({concepts}) => {
        const experimentState = selectMuxifiedState<ExperimentState>(concepts, conceptSemaphore);
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