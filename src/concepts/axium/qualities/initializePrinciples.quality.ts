import { Subject, Subscriber } from 'rxjs';
import { Concept, defaultMethodCreator  } from '../../../model/concept';
import { createPrinciple$ } from '../../../model/principle';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { UnifiedSubject } from '../../../model/unifiedSubject';
import { selectPayload } from '../../../model/selector';

export type InitializePrinciplesPayload = {
    concepts: Concept[];
}
export const axiumInitializePrinciplesType: ActionType = 'initialize Principles and set new Subscribers to General Subscribers list';
export const axiumInitializePrinciples =
  prepareActionWithPayloadCreator<InitializePrinciplesPayload>(axiumInitializePrinciplesType);

export function initializePrinciplesReducer(state: AxiumState, _action: Action) {
  const payload = selectPayload<InitializePrinciplesPayload>(_action);
  const concepts = payload.concepts;
  const action$ = state.action$ as Subject<Action>;
  const subConcepts$ = state.concepts$ as UnifiedSubject;
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
  defaultMethodCreator
);
