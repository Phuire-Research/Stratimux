/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a principle that will manage the Muxium's close process.
$>*/
import { PrincipleFunction } from '../../model/principle';
import { selectMuxifiedState } from '../../model/selectors/selector';
import { MuxiumPrinciple, MuxiumState } from './muxium.concept';
import { muxiumClose } from './qualities/close.quality';
import { muxiumSelectPrepareClose } from './muxium.selector';
import { MuxiumQualities } from './qualities';
import { LoadConcepts } from '../../model/concept/concept';
/*<#*/
export const muxiumClosePrinciple: MuxiumPrinciple = (
  {
    plan,
    nextC
  },
) => {
  let init = false;
  plan('Plan Muxium Close', ({stage, conclude}) => [
    stage(({concepts, dispatch, stagePlanner, e}) => {
      const state = selectMuxifiedState<MuxiumState<unknown, LoadConcepts>>(concepts, 0);
      if (!init && state?.prepareClose) {
        init = true;
        nextC({0: concepts[0]});
        dispatch(e.muxiumClose({exit: state.exit}), {
          iterateStage: true
        });
        stagePlanner.conclude();
      }
    }, { selectors: [muxiumSelectPrepareClose], priority: Infinity}),
    conclude()
  ]);
};
/*#>*/