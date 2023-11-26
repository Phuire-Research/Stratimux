/*<$
For the framework Stratimux and Axium Concept, generate a quality similar to axium kick, except this is used when the Axium is
currently in blocking mode. This allows for subscribers to be notified of any new configurations if set.
Or simply that the axium is ready to receive actions.
$>*/
/*<#*/
import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type OpenPayload = {
  open: boolean
};

export const axiumOpenType: ActionType = 'Open Axium';
export const axiumOpen = prepareActionWithPayloadCreator<OpenPayload>(axiumOpenType);

export function axiumOpenReducer(state: AxiumState, action: Action): AxiumState {
  const open = selectPayload<OpenPayload>(action).open;
  return {
    ...state,
    open,
  };
}
export const axiumOpenQuality = createQuality(
  axiumOpenType,
  axiumOpenReducer,
  defaultMethodCreator
);
/*#>*/