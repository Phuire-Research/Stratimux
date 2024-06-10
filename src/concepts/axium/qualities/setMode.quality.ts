/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will set the mode explicitly via the payload.
$>*/
/*<#*/
import { AxiumState } from '../axium.concept';
import { strategySuccess } from '../../../model/actionStrategy';
import { selectPayload } from '../../../model/selector';
import { createMethod } from '../../../model/method';
import { createQualityCardWithPayload } from '../../../model/quality';

export type AxiumSetModePayload = {
  modeIndex: number;
  modeName: string;
}

export const axiumSetMode = createQualityCardWithPayload<AxiumState<unknown, unknown>, AxiumSetModePayload>({
  type: 'set Axium Mode',
  reducer: (state, action) => {
    const payload = action.payload;
    return {
      ...state,
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