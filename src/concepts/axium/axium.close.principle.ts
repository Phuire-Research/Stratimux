/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a principle that will manage the Axium's close process.
$>*/
import { Subscriber } from 'rxjs';
import { Concepts } from '../../model/concept';
import { PrincipleFunction } from '../../model/principle';
import { selectUnifiedState } from '../../model/selector';
import { UnifiedSubject, createStage } from '../../model/stagePlanner';
import { AxiumState } from './axium.concept';
import { axiumClose } from './qualities/close.quality';
import { Action } from '../../model/action';
import { axiumSelectPrepareClose } from './axium.selector';
/*<#*/
export const axiumClosePrinciple: PrincipleFunction = (
  _: Subscriber<Action>,
  __: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number
) => {
  let init = false;
  const plan = concepts$.innerPlan('Plan Axium Close', [
    createStage((concepts, dispatch) => {
      const state = selectUnifiedState<AxiumState>(concepts, semaphore);
      if (!init && state?.prepareClose) {
        init = true;
        concepts$.next({0: concepts[0]});
        dispatch(axiumClose({exit: state.exit}), {
          iterateStage: true
        });
        plan.conclude();
      }
    }, { selectors: [axiumSelectPrepareClose], priority: Infinity}),
    createStage(() => {
      //
    })
  ]);
};
/*#>*/