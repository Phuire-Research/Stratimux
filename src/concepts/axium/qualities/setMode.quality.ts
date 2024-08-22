/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will set the mode explicitly via the payload.
$>*/
/*<#*/
import { AxiumState } from '../axium.concept';
import { strategySuccess } from '../../../model/actionStrategy';
import { createMethod } from '../../../model/method';
import { createQualityCardWithPayload } from '../../../model/quality';
import { AxiumSetModePayload } from '.';
import { LoadConcepts } from '../../../model/concept';

export const axiumSetMode = createQualityCardWithPayload<AxiumState<unknown, LoadConcepts>, AxiumSetModePayload>({
  type: 'set Axium Mode',
  reducer: (_, action) => {
    const payload = action.payload;
    return {
      modeIndex: payload.modeIndex,
    };
  },
  methodCreator: () => createMethod((action) => {
    const payload = action.payload;
    if (action.strategy) {
      action.strategy.currentNode.successNotes = {
        denoter: `to ${payload.modeName}.`
      };
      return strategySuccess(action.strategy);
    }
    return action;
  })
});
/*#>*/