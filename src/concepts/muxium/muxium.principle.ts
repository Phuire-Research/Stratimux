/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a principle that will allow for the modification of the Muxium's loaded concepts.
$>*/
/*<#*/
import { Observable, Subscriber, catchError } from 'rxjs';
import { AnyConcept, Concepts, Mode } from '../../model/concept/concept.type';
import { forEachConcept, qualityToString } from '../../model/concept/conceptHelpers';
import { createPrinciple$, PrincipleFunction } from '../../model/principle';
import { MuxiumDeck, muxiumName, MuxiumPrinciple } from './muxium.concept';
import { addConceptsFromQueThenUnblockStrategy } from './strategies/addConcept.strategy';
import { removeConceptsViaQueThenUnblockStrategy } from './strategies/removeConcept.strategy';
import { blockingMode, permissiveMode } from './muxium.mode';
import { muxiumSelectAddConceptQue, muxiumSelectRemoveConceptQue } from './muxium.selector';
import { Deck } from '../../model/deck';
import { Comparators } from '../../model/interface';
import { createSelectors, updateKeyedSelectors } from '../../model/selector/selectorAdvanced';
import { BundledSelectors } from '../../model/selector/selector.type';
import { Action, Actions } from '../../model/action/action.type';
import { createCachedSemaphores } from '../../model/action/actionSemaphore';
import { strategyBegin } from '../../model/action/strategy/actionStrategyConsumers';
import { createActionNode } from '../../model/action/strategy/actionStrategy';
import { strata } from '../../model/action/strategy';
import { getMuxiumState } from '../../model/muxium/muxiumHelpers';
import { blockingMethodSubscription } from '../../model/method/methodSubscription';
import { MuxiumLoad } from '../../model/muxium/muxium.type';

export const muxiumPrinciple: MuxiumPrinciple = (
  {
    observer,
    plan,
    e_
  }
) => {
  let allowAdd = true;
  let allowRemove = true;
  const addConceptsPlan = plan('Add Concepts Plan', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      const muxiumState = getMuxiumState(concepts);
      const addKeys = Object.keys(muxiumState.addConceptQue);
      if (addKeys.length === 0) {
        allowAdd = true;
      }
      if (addKeys.length !== 0 && allowAdd) {
        allowAdd = false;
        muxiumState.generation += 1;
        const newConcepts: Concepts = {};
        forEachConcept(concepts, (concept, se) => {
          newConcepts[Number(se)] = concept;
        });
        addKeys.forEach((key, _index) => {
          const concept = muxiumState.addConceptQue[key] as unknown as AnyConcept;
          concept.semaphore = muxiumState.conceptCounter;
          muxiumState.conceptCounter += 1;          if (concept.mode !== undefined) {
            const names = muxiumState.modeNames;
            const modes = concepts[0].mode as Mode<unknown, unknown, unknown>[];
            concept.mode.forEach((mode: Mode<unknown, unknown, unknown>) => {
              modes.push(mode);
              names.push(concept.name);
            });
          }

          newConcepts[concept.semaphore] = concept as AnyConcept;
          newConcepts[concept.semaphore].selectors = createSelectors(concept.semaphore);
          updateKeyedSelectors(newConcepts, concept.keyedSelectors, concept.semaphore);          if (concept.principles !== undefined) {
            concept.principles.forEach(principle => {
              const observable = createPrinciple$<unknown, unknown, unknown>(
                principle as PrincipleFunction<unknown, unknown, unknown>,
                concepts,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (muxiumState.concepts$.plan(concept.semaphore) as any).bind(muxiumState.concepts$),
                muxiumState.concepts$.subscribe.bind(muxiumState.concepts$),
                muxiumState.concepts$.next.bind(muxiumState.concepts$),                muxiumState.action$.next.bind(muxiumState.action$),
                concept.semaphore,
                muxiumState.deck.d as Deck<unknown>,
                concept.actions as Actions<unknown>,
                concept.comparators as Comparators<unknown>,
                {...concept.keyedSelectors, ...concept.selectors} as BundledSelectors<unknown>,
              );
              muxiumState.principleSubscribers.push({
                name: concept.name,
                subscription: observable.subscribe((action: Action) => muxiumState.action$.next(action)) as Subscriber<Action>
              });
            });
          }
          concept.qualities.forEach(quality => {
            if (quality.methodCreator) {
              [quality.method, quality.subject] = quality.methodCreator()(getMuxiumState(concepts).concepts$, concept.semaphore);
              quality.method.pipe(
                catchError((err: unknown, caught: Observable<[Action, boolean]>) => {
                  if (getMuxiumState(concepts).logging) {
                    console.error('METHOD ERROR', err);
                  }
                  return caught;
                }));
              quality.toString = qualityToString(quality);
              const methodSub = quality.method.subscribe(([act, _]) => {
                const tail = getMuxiumState(concepts).tail;
                blockingMethodSubscription(concepts, tail, act);
              }) as Subscriber<Action>;
              getMuxiumState(concepts).methodSubscribers.push({name: concept.name, subscription: methodSub});
            }
          });          (muxiumState.deck.d as Record<string, unknown>)[key] = {
            d: concept.deck.d,
            e: concept.actions,
            c: concept.comparators,
            k: {...concept.keyedSelectors, ...concept.selectors}
          };
        });
        const newMuxiumState = getMuxiumState(newConcepts);
        newMuxiumState.cachedSemaphores = createCachedSemaphores(newConcepts);
        muxiumState.actionConcepts$.next(newConcepts);
        muxiumState.concepts$.next(newConcepts);

        dispatch(strategyBegin(addConceptsFromQueThenUnblockStrategy(e, newConcepts)), {
          throttle: 50
        });
      }
    }, { selectors: [muxiumSelectAddConceptQue], priority: Infinity - 1}),
  ]);

  const removeConceptsPlan = plan('Remove Concepts Plan', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      const muxiumState = getMuxiumState(concepts);
      const removeKeys = Object.keys(muxiumState.removeConceptQue);
      if (removeKeys.length === 0) {
        allowRemove = true;
      }
      if (removeKeys.length > 0 && allowRemove) {
        allowRemove = false;
        const newConcepts: Concepts = {};
        muxiumState.generation += 1;
        const newModes: Mode[] = [blockingMode, permissiveMode];
        const newModeNames: string[] = [muxiumName, muxiumName];
        forEachConcept(concepts, ((concept, se) => {
          removeKeys.forEach(key => {
            if (concept.name !== muxiumState.removeConceptQue[key].name) {
              newConcepts[se as number] = (concept);
            }
          });
        }));
        const newMuxiumState = getMuxiumState(newConcepts);
        newMuxiumState.modeNames.forEach((modeName, modeIndex) => {
          let shouldAdd = false;
          removeKeys.forEach(key => {
            if (modeName !== muxiumName) {
              if (modeName !== muxiumState.removeConceptQue[key].name) {
                shouldAdd = true;
              } else if (modeName === muxiumState.removeConceptQue[key].name && modeIndex === newMuxiumState.defaultModeIndex) {
                newMuxiumState.defaultModeIndex = 1;
              }
            }
          });          if (shouldAdd) {
            newModeNames.push(modeName);
            newModes.push((concepts[0].mode as Mode<unknown, unknown, unknown>[])[modeIndex]);
          }
          shouldAdd = false;
        });
        newConcepts[0].mode = newModes;
        newMuxiumState.modeNames = newModeNames;

        newMuxiumState.cachedSemaphores = createCachedSemaphores(newConcepts);
        newMuxiumState.methodSubscribers.forEach(named => {
          named.subscription.unsubscribe();
        });
        newMuxiumState.methodSubscribers = [];        const newDeck = {} as Record<string, unknown>;
        Object.keys(newConcepts).forEach((key) => {
          const i = Number(key);
          if (!removeKeys.includes(newConcepts[i].name)) {
            newDeck[newConcepts[i].name] = {
              d: newConcepts[i].deck.d,
              e: newConcepts[i].actions,
              c: newConcepts[i].comparators,
              k: { ...newConcepts[i].keyedSelectors, ...newConcepts[i].selectors },
            };
          }
        });
        newMuxiumState.deck.d = newDeck as Deck<MuxiumLoad<MuxiumDeck>>;

        forEachConcept(newConcepts, (concept, se) => {
          concept.qualities.forEach(quality => {
            if (quality.methodCreator) {
              const [method, subject] = quality.methodCreator()(muxiumState.concepts$, se);
              quality.method = method;
              quality.subject = subject;
              quality.method.pipe(
                catchError((err: unknown, caught: Observable<[Action, boolean]>) => {
                  if (muxiumState.logging) {
                    console.error('METHOD ERROR', err);
                  }
                  return caught;
                }));
              const methodSub = quality.method.subscribe(([action, _]) => {
                blockingMethodSubscription(newConcepts, muxiumState.tail, action);
              }) as Subscriber<Action>;
              const _muxiumState = getMuxiumState(newConcepts);
              _muxiumState.methodSubscribers.push({
                name: concept.name,
                subscription: methodSub,
              });
            }
          });
        });
        muxiumState.actionConcepts$.next(newConcepts);
        muxiumState.concepts$.next(newConcepts);
        dispatch(strategyBegin(
          removeConceptsViaQueThenUnblockStrategy(e, newConcepts)), {
          throttle: 50
        });
      }
    }, { selectors: [muxiumSelectRemoveConceptQue], priority: Infinity - 2})
  ]);
  observer.next(strata.begin(strata.create({
    topic: 'Register Muxium Add/Remove Plans',
    initialNode: createActionNode(e_.muxiumRegisterStagePlanner({conceptName: muxiumName, stagePlanner: addConceptsPlan}), {
      successNode:
      createActionNode(e_.muxiumRegisterStagePlanner({conceptName: muxiumName, stagePlanner: removeConceptsPlan}), {
        successNode: null,
        failureNode: null
      }),
      failureNode: null
    }),
    priority: Infinity
  })));
};
/*#>*/