/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will set the default mode index to what is specified by
the action's payload.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { MuxiumSetDefaultModeIndexPayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumSetDefaultModeIndex =
  createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumSetDefaultModeIndexPayload>({
    type: 'set Muxium\'s Default Mode Index',
    reducer: (_, action) => {
      const payload = action.payload;
      return {
        defaultModeIndex: payload.index,
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/