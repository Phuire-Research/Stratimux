/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a quality that will console log the action itself.
This is used to trouble shoot strategies or simply notify the log of different states.
$>*/
/*<#*/
import { nullReducer } from '../../../model/quality';
import { createMethod } from '../../../model/method/method';
import { createQualityCard } from '../../../model/quality';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';

export const muxiumLog = createQualityCard({
  type: 'Muxium Log',
  reducer: nullReducer,
  methodCreator: () => createMethod(({action}) => {
    console.log('Logging: ', action);
    if (action.strategy) {
      return strategySuccess(action.strategy);
    } else {
      return action;
    }
  })
});
/*#>*/