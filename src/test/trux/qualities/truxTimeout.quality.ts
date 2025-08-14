/*<$
For the asynchronous graph programming framework Stratimux and the Bounded Trux Concept,
generate the truxTimeout quality. This quality reserves ownership of a specific position
in the Trux spatial mapping for 300ms, demonstrating uni-directional tree composition blocking
where parent positions block all descendant positions in the tree.
$>*/
/*<#*/
import { createQualityCardWithPayload, defaultReducer, nullReducer, Quality } from '../../../model/quality';
import { TruxState } from '../trux.concept';
import { createAsyncMethod, createAsyncMethodWithConcepts } from '../../../model/method/methodAsync';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';
import { muxiumConclude } from '../../../concepts/muxium/qualities/conclude.quality';
import { muxiumTimeOut } from '../../../model/time';
import { createMethodWithConcepts } from '../../../model/method/method';

export type TruxTimeoutPayload = {
  path: string;  // Path in the Trux space, e.g., "trux.A.B.C.D"
};

export type TruxTimeout = Quality<TruxState, TruxTimeoutPayload>;
/**
 * Creates KeyedSelectors for the specified path in the Trux spatial mapping.
 * This enables ownership tracking for uni-directional tree composition blocking.
 */

export const truxTimeout = createQualityCardWithPayload<TruxState, TruxTimeoutPayload>({
  type: 'trux timeout',
  reducer: defaultReducer,
  methodCreator: () => createAsyncMethodWithConcepts(({controller, action, concepts_}) => {
    setTimeout(() => {
      // Reserve position in Trux space for 300ms
      if (action.strategy) {
        controller.fire(strategySuccess(action.strategy));
      } else {
        controller.fire(muxiumConclude());
      }
    }, 300);
  }),
});

/*#>*/