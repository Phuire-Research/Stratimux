import { map, Subject } from 'rxjs';
import { strategySuccess } from '../../../model/actionStrategy';
import { defaultMethodCreator, Method, MethodCreator } from '../../../model/concept';
import { CounterState } from '../counter.concept';
import { Action, ActionType, createAction, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { counterSelectCount } from '../counter.selector';
import { axiumConclude } from '../../axium/qualities/conclude.quality';

export const counterSubtractType: ActionType = 'Counter Subtract';

export const counterSubtract = prepareActionCreator(counterSubtractType);

function counterSubtractReducer(state: CounterState) {
  return {
    ...state,
    count: state.count - 1
  };
}

export const counterSubtractQuality = createQuality(
  counterSubtractType,
  counterSubtractReducer,
  defaultMethodCreator,
  [counterSelectCount]
);
