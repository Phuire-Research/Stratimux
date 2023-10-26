import { Concept, defaultMethodCreator } from '../../../model/concept';
import { NamedSubscription } from '../axium.concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { NamedStagePlanner } from '../../../model/stagePlanner';

export const axiumRemoveConceptsViaQueType: ActionType = 'remove Concepts via Axium\'s Removal Concept Que';
export const axiumRemoveConceptsViaQue = prepareActionCreator(axiumRemoveConceptsViaQueType);

export function removeConceptsViaQueReducer(state: AxiumState, _action: Action) {
  const principleSubscribers = state.methodSubscribers;
  const newPrincipleSubscribers = [] as NamedSubscription[];
  const generalSubscribers = state.methodSubscribers;
  const newGeneralSubscribers = [] as NamedSubscription[];
  const stagePlanners = state.stagePlanners;
  const newStagePlanners = [] as NamedStagePlanner[];
  const removeConceptQue = state.removeConceptQue;

  principleSubscribers.forEach(named => {
    let exists = false;
    removeConceptQue.forEach(concept => {
      if (concept.name === named.name) {
        exists = true;
      }
    });
    if (!exists) {
      newPrincipleSubscribers.push(named);
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
