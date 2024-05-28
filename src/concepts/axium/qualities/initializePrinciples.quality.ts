/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will initialize principles loaded into the Axium's conceptual set.
$>*/
/*<#*/
import { Subject, Subscriber } from 'rxjs';
import { Concept, Concepts, forEachConcept  } from '../../../model/concept';
import { createPrinciple$ } from '../../../model/principle';
import { Action, } from '../../../model/action';
import { AxiumState, axiumName } from '../axium.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload, defaultMethodCreator } from '../../../model/quality';

export type AxiumInitializePrinciplesPayload = {
    concepts: Concepts;
}

export const [
  axiumInitializePrinciples,
  axiumInitializePrinciplesType,
  axiumInitializePrinciplesQuality
] = createQualitySetWithPayload<AxiumInitializePrinciplesPayload>({
  type: 'initialize Principles and set new Subscribers to General Subscribers list',
  reducer: (state: AxiumState, act) => {
    const payload = selectPayload<AxiumInitializePrinciplesPayload>(act);
    const concepts = payload.concepts;
    let conceptCounter = state.conceptCounter;
    const action$ = state.action$ as Subject<Action>;
    const concepts$ = state.concepts$ as UnifiedSubject;
    const principleSubscribers = state.generalSubscribers;
    forEachConcept(concepts ,((concept, semaphore) => {
      if (concept.name === axiumName && concept.principles) {
        concept.principles.forEach(principle => {
          const observable = createPrinciple$(
            principle,
            concepts,
            state.concepts$,
            concept.actions,
            concept.selectors,
            concept.typeValidators,
            semaphore
          );
          principleSubscribers.push({
            name: concept.name,
            subscription: observable.subscribe((action: Action) => action$.next(action)) as Subscriber<Action>,
          });
        });
        conceptCounter += 1;
      } else if (concept.principles) {
        concept.principles.forEach(principle => {
          const observable = createPrinciple$(
            principle,
            concepts,
            concepts$,
            concept.actions,
            concept.selectors,
            concept.typeValidators,
            semaphore
          );
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
  },
  methodCreator: defaultMethodCreator
});
/*#>*/