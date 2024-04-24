/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will add concepts within the addConceptQue into the Axium's Concepts.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { createQualitySet } from '../../../model/quality';

export const [axiumAddConceptFromQue, axiumAddConceptFromQueType, axiumAddConceptsFromQueQuality] = createQualitySet({
  type: 'Add Concepts from Axium Concept Que',
  reducer: (state: AxiumState, action) => {
    return {
      ...state,
      addConceptQue: []
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/