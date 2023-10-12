import { defaultMethodCreator } from '../../../model/concept';
import { NamedSubscription } from '../axium.concept';
import { Action, ActionType, prepareActionCreator, } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { NamedStagePlanner } from '../../../model/stagePlanner';

export const axiumRemoveConceptsViaQueType: ActionType = 'remove Concepts via Axium\'s Removal Concept Que';
export const axiumRemoveConceptsViaQue = prepareActionCreator(axiumRemoveConceptsViaQueType);

export function removeConceptsViaQueReducer(state: AxiumState, _action: Action) {
  const methodSubscribers = state.methodSubscribers;
  const newMethodSubscribers = [] as NamedSubscription[];
  const generalSubscribers = state.methodSubscribers;
  const newGeneralSubscribers = [] as NamedSubscription[];
  const stagePlanners = state.stagePlanners;
  const newStagePlanners = [] as NamedStagePlanner[];
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
      named.subscription.unsubscribe();
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
      named.subscription.unsubscribe();
    }
  });

  stagePlanners.forEach(named => {
    let exists = false;
    removeConceptQue.forEach(concept => {
      if (concept.name === named.name) {
        exists = true;
      }
    });
    if (!exists) {
      newStagePlanners.push(named);
    } else {
      named.conclude();
    }
  });

  return {
    ...state,
    // generation: state.generation + 1,
    methodSubscribers: newMethodSubscribers,
    generalSubscribers: newGeneralSubscribers,
    stagePlanners: newStagePlanners,
    removeConceptQue: []
  };
}

export const removeConceptsViaQueQuality = createQuality(
  axiumRemoveConceptsViaQueType,
  removeConceptsViaQueReducer,
  defaultMethodCreator
);
