import { Subject, Subscriber } from 'rxjs';
import { Concept, Concepts, defaultMethodCreator, forEachConcept  } from '../../../model/concept';
import { createPrinciple$ } from '../../../model/principle';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState, axiumName } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { selectPayload } from '../../../model/selector';

export type InitializePrinciplesPayload = {
    concepts: Concepts;
}
export const axiumInitializePrinciplesType: ActionType = 'initialize Principles and set new Subscribers to General Subscribers list';
export const axiumInitializePrinciples =
  prepareActionWithPayloadCreator<InitializePrinciplesPayload>(axiumInitializePrinciplesType);

export function initializePrinciplesReducer(state: AxiumState, _action: Action): AxiumState {
  const payload = selectPayload<InitializePrinciplesPayload>(_action);
  const concepts = payload.concepts;
  let conceptCounter = state.conceptCounter;
  const action$ = state.action$ as Subject<Action>;
  const concepts$ = state.concepts$ as UnifiedSubject;
  const principleSubscribers = state.generalSubscribers;
  forEachConcept(concepts ,((concept: Concept, semaphore) => {
    if (concept.name === axiumName && concept.principles) {
      concept.principles.forEach(principle => {
        const observable = createPrinciple$(principle, concepts, state.innerConcepts$, semaphore as number);
        principleSubscribers.push({
          name: concept.name,
          subscription: observable.subscribe((action: Action) => action$.next(action)) as Subscriber<Action>,
        });
      });
      conceptCounter += 1;
    } else if (concept.principles) {
      concept.principles.forEach(principle => {
        const observable = createPrinciple$(principle, concepts, concepts$, semaphore as number);
        principleSubscribers.push({
          name: concept.name,
          subscription: observable.subscribe((action: Action) => action$.next(action)) as Subscriber<Action>,
        });
      });
      conceptCounter += 1;
    }
  }));
  return {
    ...state,
    principleSubscribers,
    conceptCounter,
  };
}

export const axiumInitializePrinciplesQuality = createQuality(
  axiumInitializePrinciplesType,
  initializePrinciplesReducer,
  defaultMethodCreator
);
