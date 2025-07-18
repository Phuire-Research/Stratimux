/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will initialize principles loaded into the Muxium's conceptual set.
$>*/
/*<#*/
import { Subject, Subscriber } from 'rxjs';
import { forEachConcept } from '../../../model/concept/conceptHelpers';
import { LoadConcepts  } from '../../../model/concept/concept.type';
import { PrincipleFunction, createPrinciple$ } from '../../../model/principle';
import { MuxiumState, muxiumName } from '../muxium.concept';
import { MuxifiedSubject } from '../../../model/stagePlanner/stagePlanner';
import { createQualityCardWithPayload, defaultMethodCreator } from '../../../model/quality';
import { MuxiumInitializePrinciplesPayload } from '.';
import { Comparators } from '../../../model/interface';
import { BundledSelectors } from '../../../model/selector/selector.type';
import { Action, Actions, AnyAction } from '../../../model/action/action.type';
import { Planning } from '../../../model/stagePlanner/stagePlanner.type';
import { Deck, Stratideck } from '../../../model/deck';
import { createOrigin } from '../../../model/muxium/muxiumHelpers';

export const muxiumInitializePrinciples =
  createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumInitializePrinciplesPayload>({
    type: 'initialize Principles and set new Subscribers to General Subscribers list',
    reducer: (state, act) => {
      const payload = act.payload;
      const concepts = payload.concepts;
      let conceptCounter = state.conceptCounter;
      const action$ = state.action$ as Subject<Action>;
      const concepts$ = state.concepts$ as MuxifiedSubject<unknown, LoadConcepts, unknown>;
      const principleSubscribers = state.generalSubscribers;
      forEachConcept(concepts ,((concept, semaphore) => {
        if (concept.name === muxiumName && concept.principles) {
          concept.principles.forEach((principle, i) => {
            const observable = createPrinciple$<unknown, unknown, unknown>(
              principle as PrincipleFunction<unknown, unknown, unknown>,
              concepts,
              state.concepts$.innerPlan.bind(concepts$) as Planning<any, any, any>,
              state.concepts$.subscribe.bind(concepts$),
              state.concepts$.next.bind(concepts$),
              (action: AnyAction) => {
                action.origin = createOrigin({
                  conceptName: concept.name,
                  originType: 'principle-' + concept.semaphore + '-' + i
                });
                state.action$.next(action);
              },
              semaphore,
              // concept.deck as unknown as Deck<unknown>,

              (state.deck.d as any)[concept.name].d as Deck<unknown>,
              concept.actions as Actions<unknown>,
              concept.comparators as Comparators<unknown>,
              (state.deck.d as any)[concept.name].k as BundledSelectors<any>,
            );
            principleSubscribers.push({
              name: concept.name,
              subscription: observable.subscribe((action: Action) => action$.next(action)) as Subscriber<Action>,
            });
          });
          conceptCounter += 1;
        } else if (concept.principles) {
          concept.principles.forEach((principle, i) => {
            const observable = createPrinciple$<any, any, any>(
              principle,
              concepts,
              concepts$.plan(concept.semaphore).bind(concepts$) as Planning<any, any, any>,
              concepts$.subscribe.bind(concepts$),
              concepts$.next.bind(concepts$),
              (action: AnyAction) => {
                action.origin = createOrigin({
                  conceptName: concept.name,
                  originType: 'principle-' + concept.semaphore + '-' + i
                });
                state.action$.next(action);
              },
              semaphore,
              (state.deck.d as any)[concept.name].d as Deck<unknown>,
              concept.actions as Actions<any>,
              concept.comparators as Comparators<any>,
              (state.deck.d as any)[concept.name].k as BundledSelectors<any>,
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
        principleSubscribers,
        conceptCounter,
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/