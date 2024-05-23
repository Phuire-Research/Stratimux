/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality similar to axium kick, except this is used when the Axium is
currently in blocking mode. This allows for subscribers to be notified of any new configurations if set.
Or simply that the axium is ready to receive actions.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type OpenPayload = {
  open: boolean
};

export const [
  axiumOpen,
  axiumOpenType,
  axiumOpenQuality
] = createQualitySetWithPayload<OpenPayload>({
  type: 'Open Axium',
  reducer: (state: AxiumState, action) => {
    const {open} = selectPayload<OpenPayload>(action);
    return {
      ...state,
      open
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/