/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will append a series of concepts to the Axium's
addConceptQue. This will then be observed via the Axium's principle.
$>*/
/*<#*/
import { Concept, defaultMethodCreator } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type AxiumAppendConceptsToAddQuePayload = {
  concepts: Concept[]
}

export const [
  axiumAppendConceptsToAddQue,
  axiumAppendConceptsToAddQueType,
  axiumAppendConceptsToAddQueQuality
] = createQualitySetWithPayload<AxiumAppendConceptsToAddQuePayload>({
  type: 'append Concepts to Axium\'s Add Concept Que',
  reducer: (state: AxiumState, action) => {
    const payload = selectPayload<AxiumAppendConceptsToAddQuePayload>(action);
    const addConceptQue = [
      ...payload.concepts
    ];
    return {
      ...state,
      addConceptQue,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/