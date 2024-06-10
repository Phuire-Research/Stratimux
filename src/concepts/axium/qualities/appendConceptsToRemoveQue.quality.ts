/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will append a sequence of concepts to the Axium's
removeConceptQue. The main axium principle will then initialize a removal strategy based on this que.
$>*/
/*<#*/
import { AxiumState } from '../axium.concept';
import { createQualityCardWithPayload, defaultMethodCreator } from '../../../model/quality';
import { AxiumAppendConceptsToRemoveQuePayload } from '.';

export const axiumAppendConceptsToRemoveQue =
  createQualityCardWithPayload<AxiumState<unknown, unknown>, AxiumAppendConceptsToRemoveQuePayload>({
    type: 'append Concepts to Axium\'s Remove Concept Que',
    reducer: (state, action) => {
      const payload = action.payload;
      let removeQue = state.removeConceptQue;
      removeQue = {
        ...removeQue,
        ...payload.concepts
      };
      return {
        ...state,
        removeConceptQue: removeQue
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/