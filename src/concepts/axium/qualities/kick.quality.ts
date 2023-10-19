import { defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { ActionType, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const axiumKickType: ActionType = 'Kick Axium';
export const axiumKick = prepareActionCreator(axiumKickType);

export const kickQuality = createQuality(
  axiumKickType,
  defaultReducer,
  defaultMethodCreator
);
