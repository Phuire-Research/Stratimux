import { prepareActionCreator } from '../../../model/action';
import { ActionNodeOptions, createActionNode, strategySuccess } from '../../../model/actionStrategy';
import { createQuality, defaultReducer } from '../../../model/concept';
import { ActionType, createMethod } from '../../../model/method';

export const axiumStitchType: ActionType = 'Axium Stitch';
export const axiumStitch = prepareActionCreator(axiumStitchType);

const axiumStitchMethodCreator = () => createMethod((action) => {
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
});

export const axiumStitchQuality = createQuality(
  axiumStitchType,
  defaultReducer,
  axiumStitchMethodCreator
);

/**
 * Must be used within an ActionStrategyStitch with only one ActionNode provided.
 * @param options `optional` will set return ActionNode's options if provided.
 * @returns ActionNode of axiumStitch
 */
export const axium_createStitchNode = (options?: ActionNodeOptions) =>
  ({...createActionNode(axiumStitch(), options ? options : {
    successNode: null,
    failureNode: null,
  })});
