/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a principle that will manage the Axium's close process.
$>*/
import { PrincipleFunction } from '../../model/principle';
import { selectUnifiedState } from '../../model/selector';
import { AxiumState } from './axium.concept';
import { axiumClose } from './qualities/close.quality';
import { axiumSelectPrepareClose } from './axium.selector';
import { AxiumQualities } from './qualities';
import { LoadConcepts } from '../../model/concept';
/*<#*/
export const axiumClosePrinciple: PrincipleFunction<AxiumQualities> = (
  {
    plan,
    nextC
  },
) => {
  let init = false;
  plan('Plan Axium Close', ({stage, conclude}) => [
    stage(({concepts, dispatch, stagePlanner, e}) => {
      const state = selectUnifiedState<AxiumState<unknown, LoadConcepts>>(concepts, 0);
      if (!init && state?.prepareClose) {
        init = true;
        nextC({0: concepts[0]});
        dispatch(e.axiumClose({exit: state.exit}), {
          iterateStage: true
        });
        stagePlanner.conclude();
      }
    }, { selectors: [axiumSelectPrepareClose], priority: Infinity}),
    conclude()
  ]);
};
/*#>*/