import { Method, MethodCreator, createQuality, defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { Subject, map } from 'rxjs';
import { strategyBackTrack } from '../../../model/actionStrategy';
import { axiumConclude } from '../../axium/qualities/conclude.quality';

export const ownershipBackTrackType: ActionType = 'backtracking to previous ActionNode';
export const ownershipBackTrack = prepareActionCreator(ownershipBackTrackType);

const createBackTrackMethodCreator: MethodCreator = () => {
  const backTrackSubject = new Subject<Action>();
  const backTrackMethod: Method = backTrackSubject.pipe(
    map((action: Action) => {
      if (action.strategy) {
        const newAction = strategyBackTrack(action.strategy);
        return newAction;
      }
      return axiumConclude();
    })
  );
  return [
    backTrackMethod,
    backTrackSubject
  ];
};

export const backTrackQuality = createQuality(
  ownershipBackTrackType,
  defaultReducer,
  createBackTrackMethodCreator,
);
