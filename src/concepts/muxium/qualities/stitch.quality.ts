/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will silently start the next step in the strategy graph.
$>*/
/*<#*/
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';
import { defaultReducer } from '../../../model/quality';
import { createMethod } from '../../../model/method/method';
import { createQualityCard } from '../../../model/quality';

export const muxiumStitch = createQualityCard({
  type: 'Muxium Stitch',
  reducer: defaultReducer,
  methodCreator: () => createMethod(({action}) => {
    if (action.strategy) {
      const nextStrategy = strategySuccess(action.strategy);
      if (nextStrategy.strategy) {
        const actionList = nextStrategy.strategy.actionList;
        const newList = [];
        for (let i = 0; i < actionList.length - 1; i++) {
          newList.push(actionList[i]);
        }
        nextStrategy.strategy.actionList = newList;
      }
      return nextStrategy;
    } else {
      return action;
    }
  })
});
/*#>*/