/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a quality that will append a sequence of concepts to the Muxium's
removeConceptQue. The main muxium principle will then initialize a removal strategy based on this que.
$>*/
/*<#*/
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload, defaultMethodCreator } from '../../../model/quality';
import { MuxiumAppendConceptsToRemoveQuePayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumAppendConceptsToRemoveQue =
  createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumAppendConceptsToRemoveQuePayload>({
    type: 'append Concepts to Muxium\'s Remove Concept Que',
    reducer: (state, action) => {
      const payload = action.payload;
      let removeQue = state.removeConceptQue;
      removeQue = {
        ...removeQue,
        ...payload.concepts
      };
      return {
        removeConceptQue: removeQue
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/