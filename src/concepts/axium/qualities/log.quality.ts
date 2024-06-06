/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will console log the action itself.
This is used to trouble shoot strategies or simply notify the log of different states.
$>*/
/*<#*/
import { nullReducer } from '../../../model/quality';
import { strategySuccess } from '../../../model/actionStrategy';
import { createMethod } from '../../../model/method';
import { createQualityCard } from '../../../model/quality';

export const axiumLog = createQualityCard({
  type: 'logged a message passed to Axium',
  reducer: nullReducer,
  methodCreator: () => createMethod((action) => {
    console.log('Logging: ', action);
    if (action.strategy) {
      return strategySuccess(action.strategy);
    } else {
      return action;
    }
  })
});
/*#>*/