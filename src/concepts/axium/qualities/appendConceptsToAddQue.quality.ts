/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will append a series of concepts to the Axium's
addConceptQue. This will then be observed via the Axium's principle.
$>*/
/*<#*/
import { AnyConcept, Concept } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { createQualityCardWithPayload, defaultMethodCreator } from '../../../model/quality';
import { AxiumAppendConceptsToAddQuePayload } from '.';

export const axiumAppendConceptsToAddQue = createQualityCardWithPayload<AxiumState<unknown, unknown>, AxiumAppendConceptsToAddQuePayload>({
  type: 'append Concepts to Axium\'s Add Concept Que',
  reducer: (state, action) => {
    const payload = action.payload;
    const addConceptQue = {
      ...state.addConceptQue,
      ...payload.concepts
    };
    return {
      ...state,
      addConceptQue,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/