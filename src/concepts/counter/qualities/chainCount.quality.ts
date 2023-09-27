import { defaultReducer } from '../../../model/concept';
import { prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const counterChainCountType = 'Counter Chain Count';

export const counterChainCount = prepareActionCreator(counterChainCountType);

export const chainCountQuality = createQuality(
  counterChainCountType,
  defaultReducer
);
