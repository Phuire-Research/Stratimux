/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a quality that will set the mode explicitly via the payload.
$>*/
/*<#*/
import { MuxiumState } from '../muxium.concept';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';
import { createMethod } from '../../../model/method/method';
import { createQualityCardWithPayload } from '../../../model/quality';
import { MuxiumSetModePayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept';

export const muxiumSetMode = createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumSetModePayload>({
  type: 'set Muxium Mode',
  reducer: (_, action) => {
    const payload = action.payload;
    return {
      modeIndex: payload.modeIndex,
    };
  },
  methodCreator: () => createMethod(({action}) => {
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