/*<$
For the asynchronous graph programming framework Stratimux and the Bounded Trux Concept,
generate the truxPrepareSelector quality. This quality creates a KeyedSelector for a given
path in the Trux spatial mapping and attaches it to the next action via strategySuccess.
This enables dynamic ownership reservation based on the path.
$>*/
/*<#*/
import { createQualityCardWithPayload, defaultReducer, nullReducer, Quality } from '../../../model/quality';
import { TruxState } from '../trux.concept';
import { createMethod } from '../../../model/method/method';
import { strategySuccess, strategyFailed } from '../../../model/action/strategy/actionStrategyConsumers';
import { createConceptKeyedSelector } from '../../../model/selector/selector';
import { muxiumConclude } from '../../../concepts/muxium/qualities/conclude.quality';

export type TruxPrepareSelectorPayload = {
  path: string;  // Path in the Trux space, e.g., "trux.A.B.C.D"
};

export type TruxPrepareSelector = Quality<TruxState, TruxPrepareSelectorPayload>;

/**
 * Creates a KeyedSelector for the specified path in the Trux spatial mapping
 * and attaches it to the next action in the strategy.
 * This enables dynamic ownership tracking for uni-directional tree composition blocking.
 */
export const truxPrepareSelector = createQualityCardWithPayload<TruxState, TruxPrepareSelectorPayload>({
  type: 'trux prepare selector',
  reducer: defaultReducer,
  methodCreator: () => createMethod(({ action }) => {
    const { path } = action.payload;
    const strategyTopic = action.strategy?.topic || 'unknown';
    
    console.log(`\n🔧 [${strategyTopic}] PREPARE SELECTOR EXECUTING`);
    console.log(`  📍 Path requested: ${path}`);
    console.log(`  🎯 Strategy progress: Step ${action.strategy?.actionList?.length || 0} of strategy`);
    
    // Validate path format
    const segments = path.split('.');
    if (segments[0] !== 'trux' || segments.length < 2) {
      console.log(`  ❌ Invalid path format - failing strategy`);
      // Invalid path - conclude without selector
      if (action.strategy) {
        return strategyFailed(action.strategy);
      }
      return muxiumConclude();
    }

    // Create KeyedSelector for the path (removing 'trux.' prefix)
    const dotPath = segments.slice(1).join('.');
    const keyedSelector = createConceptKeyedSelector('trux', dotPath as any);
    
    console.log(`  🔑 Created KeyedSelector:`);
    console.log(`     - Concept: ${keyedSelector.conceptName}`);
    console.log(`     - Keys: ${keyedSelector.keys}`);
    console.log(`     - Full selector path: ${keyedSelector.keys}`);

    // Attach the KeyedSelector to the next action via strategySuccess
    if (action.strategy) {
      const nextAction = strategySuccess(action.strategy);
      // Attach keyedSelectors to the next action
      nextAction.keyedSelectors = [keyedSelector];
      
      console.log(`  ✅ Attached KeyedSelector to next action`);
      console.log(`     - Next action type: ${nextAction.type}`);
      console.log(`     - Strategy continuing to step: ${(action.strategy?.actionList?.length || 0) + 1}`);
      console.log(`     - KeyedSelectors attached: ${nextAction.keyedSelectors?.length || 0}`);
      console.log(`  🚀 RETURNING timeout action to system for dispatch`);
      
      return nextAction;
    }

    console.log(`  ⚠️ No strategy - concluding`);
    return muxiumConclude();
  })
});
/*#>*/