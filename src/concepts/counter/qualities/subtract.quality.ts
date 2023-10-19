import { map, Subject } from 'rxjs';
import { strategySuccess } from '../../../model/actionStrategy';
import { defaultMethodCreator, Method, MethodCreator } from '../../../model/concept';
import { Counter } from '../counter.concept';
import { Action, ActionType, createAction, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { counterSelectCount } from '../counter.selector';
import { axiumConclude } from '../../axium/qualities/conclude.quality';

export const counterSubtractType: ActionType = 'Counter Subtract';

export const counterSubtract = prepareActionCreator(counterSubtractType);

export function subtractReducer(state: Counter) {
  return {
    ...state,
    count: state.count - 1
  };
}

export const subtractQuality = createQuality(
  counterSubtractType,
  subtractReducer,
  defaultMethodCreator,
  [counterSelectCount]
);
