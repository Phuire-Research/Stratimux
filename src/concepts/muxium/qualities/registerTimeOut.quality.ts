/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will register a subscription to the concepts$ stream.
This allows for the clean closure of concepts that are removed or when the muxium itself exits.
$>*/
/*<#*/
import { createQualityCardWithPayload, defaultReducer } from '../../../model/quality';
import { createMethodWithConcepts } from '../../../model/method';
import { muxiumTimeOut } from '../../../model/time';
import { AnyAction } from '../../../model/action';
import { strategySuccess } from '../../../model/actionStrategy';
import { MuxiumState } from '../muxium.concept';
import { MuxiumRegisterTimeOutPayload } from '.';
import { LoadConcepts } from '../../../model/concept';

export const muxiumRegisterTimeOut = createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumRegisterTimeOutPayload>({
  type: 'register an Action to Muxium\'s timerLedger',
  reducer: defaultReducer,
  methodCreator: () => createMethodWithConcepts((action, concepts) => {
    const {
      act,
      timeOut
    } = action.payload;
    muxiumTimeOut(concepts, () => act, timeOut);
    if (action.strategy) {
      return strategySuccess(action.strategy);
    } else {
      return action;
    }
  })
});
/*#>*/