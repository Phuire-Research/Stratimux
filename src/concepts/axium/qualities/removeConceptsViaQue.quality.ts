import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Mode, Quality, Reducer, defaultReducer } from '../../../model/concept';
import { KeyedSub } from '../axium.concept';
import { Action, } from '../../../model/action';
import { endOfActionStrategy, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { createPrinciple$ } from '../../../model/principle';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const removeConceptsViaQue: Action =
    createAction('Axium Remove Concepts via Removal Concept Que');

const removeConceptsViaQueSubject = new Subject<Action>();
const removeConceptsViaQueMethod: Method = removeConceptsViaQueSubject.pipe<Action>(
  map((action: Action) => {
    if (action.strategy) {
      return strategySuccess(action.strategy);
    }
    return endOfActionStrategy;
  })
);

export function removeConceptsViaQueReducer(state: AxiumState, _action: Action) {
  const methodSubscribers = state.methodSubscribers;
  const newMethodSubscribers = [] as KeyedSub[];
  const generalSubscribers = state.methodSubscribers;
  const newGeneralSubscribers = [] as KeyedSub[];

  const removeConceptQue = state.removeConceptQue;

  methodSubscribers.forEach(keyed => {
    let exists = false;
    removeConceptQue.forEach(concept => {
      if (concept.key === keyed.key) {
        exists = true;
      }
    });
    if (!exists) {
      newMethodSubscribers.push(keyed);
    } else {
      keyed.subscriber.unsubscribe();
    }
  });

  generalSubscribers.forEach(keyed => {
    let exists = false;
    removeConceptQue.forEach(concept => {
      if (concept.key === keyed.key) {
        exists = true;
      }
    });
    if (!exists) {
      newGeneralSubscribers.push(keyed);
    } else {
      keyed.subscriber.unsubscribe();
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
  removeConceptsViaQue,
  removeConceptsViaQueReducer,
  removeConceptsViaQueMethod,
  removeConceptsViaQueSubject
);
