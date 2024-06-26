/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will append a sequence of concepts to the Axium's
removeConceptQue. The main axium principle will then initialize a removal strategy based on this que.
$>*/
/*<#*/
import { Concept, defaultMethodCreator } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type AxiumAppendConceptsToRemoveQuePayload = {
  concepts: Concept[]
}

export const [
  axiumAppendConceptsToRemoveQue,
  axiumAppendConceptsToRemoveQueType,
  axiumAppendConceptsToRemoveQueQuality
] = createQualitySetWithPayload<AxiumAppendConceptsToRemoveQuePayload>({
  type: 'append Concepts to Axium\'s Remove Concept Que',
  reducer: (state: AxiumState, action) => {
    const payload = selectPayload<AxiumAppendConceptsToRemoveQuePayload>(action);
    let removeQue = state.removeConceptQue;
    removeQue = [
      ...removeQue,
      ...payload.concepts
    ];
    return {
      ...state,
      removeConceptQue: removeQue
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/