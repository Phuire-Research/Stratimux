/*<$
For the graph programming framework Stratimux and Axium Concept, generate a quality that will append a series of concepts to the Axium's
addConceptQue. This will then be observed via the Axium's principle.
$>*/
/*<#*/
import { Concept, defaultMethodCreator } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';

export type AxiumAppendConceptsToAddQuePayload = {
  concepts: Concept[]
}
export const axiumAppendConceptsToAddQueType: ActionType = 'append Concepts to Axium\'s Add Concept Que';
export const axiumAppendConceptsToAddQue =
  prepareActionWithPayloadCreator<AxiumAppendConceptsToAddQuePayload>(axiumAppendConceptsToAddQueType);

export function axiumAppendConceptsToAddQueReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<AxiumAppendConceptsToAddQuePayload>(action);
  const addConceptQue = [
    ...payload.concepts
  ];
  return {
    ...state,
    addConceptQue,
  };
}

export const axiumAppendConceptsToAddQueQuality = createQuality(
  axiumAppendConceptsToAddQueType,
  axiumAppendConceptsToAddQueReducer,
  defaultMethodCreator
);
/*#>*/