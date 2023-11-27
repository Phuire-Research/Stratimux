/*<$
For the graph programming framework Stratimux and Axium Concept, generate a quality that will console log the action itself.
This is used to trouble shoot strategies or simply notify the log of different states.
$>*/
/*<#*/
import { MethodCreator, defaultReducer } from '../../../model/concept';
import { ActionType, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { strategySuccess } from '../../../model/actionStrategy';
import { createMethod } from '../../../model/method';

export const axiumLogType: ActionType = 'logged a message passed to Axium';
export const axiumLog = prepareActionCreator(axiumLogType);

export const axiumLogMethodCreator: MethodCreator = () => createMethod((action) => {
  console.log('Logging: ', action);
  if (action.strategy) {
    return strategySuccess(action.strategy);
  } else {
    return action;
  }
});

export const axiumLogQuality = createQuality(
  axiumLogType,
  defaultReducer,
  axiumLogMethodCreator,
);
/*#>*/