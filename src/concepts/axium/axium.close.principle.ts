/*<$
For the framework Stratimux and Axium Concept, generate a principle that will manage the Axium's close process.
$>*/
import { Subscriber } from 'rxjs';
import { Concepts } from '../../model/concept';
import { PrincipleFunction } from '../../model/principle';
import { selectUnifiedState } from '../../model/selector';
import { UnifiedSubject } from '../../model/stagePlanner';
import { AxiumState } from './axium.concept';
import { axiumClose } from './qualities/close.quality';
import { Action } from '../../model/action';
/*<#*/
export const axiumClosePrinciple: PrincipleFunction = (
  _: Subscriber<Action>,
  __: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number
) => {
  let init = false;
  const plan = concepts$.stage('Plan Axium Close', [
    (concepts, dispatch) => {
      const state = selectUnifiedState<AxiumState>(concepts, semaphore);
      if (!init && state?.prepareClose) {
        init = true;
        concepts$.next({0: concepts[0]});
        dispatch(axiumClose({exit: state.exit}), {
          iterateStage: true
        });
        plan.conclude();
      }
    },
    () => {
      //
    }
  ]);
};
/*#>*/