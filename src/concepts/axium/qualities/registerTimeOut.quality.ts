/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will register a subscription to the concepts$ stream.
This allows for the clean closure of concepts that are removed or when the axium itself exits.
$>*/
/*<#*/
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload, defaultReducer } from '../../../model/quality';
import { createMethodWithConcepts } from '../../../model/method';
import { axiumTimeOut } from '../../../model/time';
import { Action } from '../../../model/action';
import { strategySuccess } from '../../../model/actionStrategy';

export type AxiumRegisterTimeOutPayload = {
    act: Action;
    timeOut: number
}

export const [
  axiumRegisterTimeOut,
  axiumRegisterTimeOutType,
  axiumRegisterTimeOutQuality
] = createQualitySetWithPayload<AxiumRegisterTimeOutPayload>({
  type: 'register an Action to Axium\'s timerLedger',
  reducer: defaultReducer,
  methodCreator: (concepts$, semaphore) => createMethodWithConcepts((action, concepts) => {
    const {
      act,
      timeOut
    } = selectPayload<AxiumRegisterTimeOutPayload>(action);
    axiumTimeOut(concepts, () => act, timeOut);
    if (action.strategy) {
      return strategySuccess(action.strategy);
    } else {
      return action;
    }
  }, concepts$, semaphore)
});
/*#>*/