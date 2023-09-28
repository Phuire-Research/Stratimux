import { Method, MethodCreator, createQuality, defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, ActionType, createAction } from '../../../model/action';
import { Subject, map } from 'rxjs';
import { backTrack } from '../../../model/actionStrategy';
import { axiumConcludeType } from '../../axium/qualities/conclude.quality';

export const ownershipBackTrackType: ActionType = 'backtracking to previous ActionNode';

const createBackTrackMethodCreator: MethodCreator = () => {
  const backTrackSubject = new Subject<Action>();
  const backTrackMethod: Method = backTrackSubject.pipe(
    map((action: Action) => {
      if (action.strategy) {
        const newAction = backTrack(action.strategy);
        return newAction;
      }
      return createAction(axiumConcludeType);
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
