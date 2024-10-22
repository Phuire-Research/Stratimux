/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a quality that will append a series of concepts to the Muxium's
addConceptQue. This will then be observed via the Muxium's principle.
$>*/
/*<#*/
import { LoadConcepts } from '../../../model/concept/concept.type';
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload, defaultMethodCreator } from '../../../model/quality';
import { MuxiumAppendConceptsToAddQuePayload } from '.';

export const muxiumAppendConceptsToAddQue =
  createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumAppendConceptsToAddQuePayload>({
    type: 'append Concepts to Muxium\'s Add Concept Que',
    reducer: (state, action) => {
      const payload = action.payload;
      const addConceptQue = {
        ...state.addConceptQue,
        ...payload.concepts
      };
      return {
        addConceptQue,
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/