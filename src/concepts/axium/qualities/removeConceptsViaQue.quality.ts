import { defaultMethodCreator } from '../../../model/concept';
import { NamedSubscriber } from '../axium.concept';
import { Action, ActionType, } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';

export const axiumRemoveConceptsViaQueType: ActionType = 'remove Concepts via Axium\'s Removal Concept Que';

export function removeConceptsViaQueReducer(state: AxiumState, _action: Action) {
  const methodSubscribers = state.methodSubscribers;
  const newMethodSubscribers = [] as NamedSubscriber[];
  const generalSubscribers = state.methodSubscribers;
  const newGeneralSubscribers = [] as NamedSubscriber[];

  const removeConceptQue = state.removeConceptQue;

  methodSubscribers.forEach(named => {
    let exists = false;
    removeConceptQue.forEach(concept => {
      if (concept.name === named.name) {
        exists = true;
      }
    });
    if (!exists) {
      newMethodSubscribers.push(named);
    } else {
      named.subscriber.unsubscribe();
    }
  });

  generalSubscribers.forEach(named => {
    let exists = false;
    removeConceptQue.forEach(concept => {
      if (concept.name === named.name) {
        exists = true;
      }
    });
    if (!exists) {
      newGeneralSubscribers.push(named);
    } else {
      named.subscriber.unsubscribe();
    }
  });

  return {
    ...state,
    // generation: state.generation + 1,
    methodSubscribers: newMethodSubscribers,
    generalSubscribers: newGeneralSubscribers,
    removeConceptQue: []
  };
}

export const removeConceptsViaQueQuality = createQuality(
  axiumRemoveConceptsViaQueType,
  removeConceptsViaQueReducer,
  defaultMethodCreator
);
