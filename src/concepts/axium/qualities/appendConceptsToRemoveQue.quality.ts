/*<$
For the graph programming framework Stratimux and Axium Concept, generate a quality that will append a sequence of concepts to the Axium's
removeConceptQue. The main axium principle will then initialize a removal strategy based on this que.
$>*/
/*<#*/
import { Concept, defaultMethodCreator } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';

export type AxiumAppendConceptsToRemoveQuePayload = {
  concepts: Concept[]
}
export const axiumAppendConceptsToRemoveQueType: ActionType = 'append Concepts to Axium\'s Remove Concept Que';
export const axiumAppendConceptsToRemoveQue =
  prepareActionWithPayloadCreator<AxiumAppendConceptsToRemoveQuePayload>(axiumAppendConceptsToRemoveQueType);

export function axiumAppendConceptsToRemoveQueReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<AxiumAppendConceptsToRemoveQuePayload>(action);
  let removeQue = state.removeConceptQue;
  removeQue = [
    ...removeQue,
    ...payload.concepts
  ];
  return {
    ...state,
    removeConceptQue: removeQue
  };
}

export const axiumAppendConceptsToRemoveQueQuality = createQuality(
  axiumAppendConceptsToRemoveQueType,
  axiumAppendConceptsToRemoveQueReducer,
  defaultMethodCreator
);
/*#>*/