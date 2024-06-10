/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will add concepts within the addConceptQue into the Axium's Concepts.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { createQualityCard } from '../../../model/quality';

export const axiumAddConceptsFromQue =
  createQualityCard<AxiumState<unknown, unknown>>({
    type: 'Add Concepts from Axium Concept Que',
    reducer: (state) => {
      return {
        ...state,
        addConceptQue: []
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/