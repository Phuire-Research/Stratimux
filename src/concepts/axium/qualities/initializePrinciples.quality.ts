import { map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, Principle, createDefaultMethodCreator  } from '../../../model/concept';
import { createPrinciple$ } from '../../../model/principle';
import { Action, ActionType } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const axiumInitializePrinciplesType: ActionType = 'initialize Principles and set new Subscribers to General Subscribers list';

export type InitializePrinciplesPayload = {
    concepts: Concept[];
}

export function initializePrinciplesReducer(state: AxiumState, _action: Action) {
  const payload = _action.payload as InitializePrinciplesPayload;
  const concepts = payload.concepts;
  const action$ = state.action$ as Subject<Action>;
  const subConcepts$ = state.concepts$ as Subject<Concept[]>;
  const subscribers = state.generalSubscribers;
  concepts.forEach((concept: Concept) => {
    if (concept.principles) {
      concept.principles.forEach(principle => {
        const observable = createPrinciple$(principle, concepts, subConcepts$);
        subscribers.push({
          name: concept.name,
          subscriber: observable.subscribe((action: Action) => action$.next(action)) as Subscriber<Action>,
        });
      });
    }
  });
  return {
    ...state,
    subscribers
  };
}

export const initializePrinciplesQuality = createQuality(
  axiumInitializePrinciplesType,
  initializePrinciplesReducer,
  createDefaultMethodCreator
);
