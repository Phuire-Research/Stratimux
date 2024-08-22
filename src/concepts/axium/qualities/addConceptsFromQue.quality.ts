/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will add concepts within the addConceptQue into the Axium's Concepts.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { createQualityCard } from '../../../model/quality';
import { LoadConcepts } from '../../../model/concept';

export const axiumAddConceptsFromQue =
  createQualityCard<AxiumState<unknown, LoadConcepts>>({
    type: 'Add Concepts from Axium Concept Que',
    reducer: () => {
      return {
        addConceptQue: {}
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/