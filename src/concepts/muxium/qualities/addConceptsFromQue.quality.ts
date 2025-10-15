/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will add concepts within the addConceptQue into the Muxium's Concepts.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { createQualityCard } from '../../../model/quality';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumAddConceptsFromQue =
  createQualityCard<MuxiumState<unknown, LoadConcepts>>({
    type: 'Muxium Add Concepts From Que',
    reducer: () => {
      return {
        addConceptQue: {}
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/