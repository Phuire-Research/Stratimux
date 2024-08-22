/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will register a subscription to the concepts$ stream.
This allows for the clean closure of concepts that are removed or when the axium itself exits.
$>*/
/*<#*/
import { createQualityCardWithPayload, defaultReducer } from '../../../model/quality';
import { createMethodWithConcepts } from '../../../model/method';
import { axiumTimeOut } from '../../../model/time';
import { AnyAction } from '../../../model/action';
import { strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { AxiumRegisterTimeOutPayload } from '.';
import { LoadConcepts } from '../../../model/concept';

export const axiumRegisterTimeOut = createQualityCardWithPayload<AxiumState<unknown, LoadConcepts>, AxiumRegisterTimeOutPayload>({
  type: 'register an Action to Axium\'s timerLedger',
  reducer: defaultReducer,
  methodCreator: () => createMethodWithConcepts((action, concepts) => {
    const {
      act,
      timeOut
    } = action.payload;
    axiumTimeOut(concepts, () => act, timeOut);
    if (action.strategy) {
      return strategySuccess(action.strategy);
    } else {
      return action;
    }
  })
});
/*#>*/