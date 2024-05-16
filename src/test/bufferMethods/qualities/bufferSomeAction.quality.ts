/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a method that will buffer
the dispatch of an action assigned to payload.
$>*/
/*<#*/
import { defaultReducer, nullReducer } from '../../../model/concept';
import { createMethodBuffer } from '../../../model/method';
import { createActionNode, createStrategy, strategyBegin, } from '../../../model/actionStrategy';
import { createQualitySetWithPayload } from '../../../model/quality';
import { Action } from '../../../model/action';
import { selectPayload } from '../../../model/selector';

type ExperimentBufferNextActionPayload = {
  action: Action
}

export const [
  experimentBufferNextAction,
  experimentBufferNextActionType,
  experimentBufferNextActionQuality
] = createQualitySetWithPayload<ExperimentBufferNextActionPayload>({
  type: 'Experiment will debounce incoming actions within set duration',
  reducer: defaultReducer,
  methodCreator: () => createMethodBuffer((action) => {
    const act = selectPayload<ExperimentBufferNextActionPayload>(action).action;
    return strategyBegin(createStrategy({
      initialNode: createActionNode(act),
      topic: 'Buffered Action Topic'
    }));
  }, 10)
});
/*#>*/