/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a principle that will allow for the modification of the Muxium's loaded concepts.
$>*/
/*<#*/
import { Observable, Subscriber, catchError } from 'rxjs';
import { AnyConcept, Concepts, Mode, forEachConcept, qualityToString } from '../../model/concept';
import { PrincipleFunction, createPrinciple$ } from '../../model/principle';
import { Action, Actions, createCachedSemaphores } from '../../model/action';
import { MuxiumDeck, muxiumName, MuxiumPrinciple } from './muxium.concept';
import { createActionNode, strategy, strategyBegin } from '../../model/actionStrategy';
import { addConceptsFromQueThenUnblockStrategy } from './strategies/addConcept.strategy';
import { removeConceptsViaQueThenUnblockStrategy } from './strategies/removeConcept.strategy';
import { blockingMode, permissiveMode } from './muxium.mode';
import { MuxiumLoad, blockingMethodSubscription, demuxifyDeck, getMuxiumState } from '../../model/muxium';
import { MuxiumQualities } from './qualities';
import { muxiumSelectAddConceptQue, muxiumSelectRemoveConceptQue } from './muxium.selector';
import { Deck } from '../../model/deck';
import { Comparators } from '../../model/interface';
import { BundledSelectors, createSelectors, updateKeyedSelectors } from '../../model/selector';

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
          muxiumState.conceptCounter += 1;
          if (concept.mode !== undefined) {
            const names = muxiumState.modeNames;
            const modes = concepts[0].mode as Mode[];
            concept.mode.forEach((mode: Mode) => {
              modes.push(mode);
              names.push(concept.name);
            });
          }

          newConcepts[concept.semaphore] = concept as AnyConcept;
          newConcepts[concept.semaphore].selectors = createSelectors(concept.semaphore);
          updateKeyedSelectors(newConcepts, concept.keyedSelectors, concept.semaphore);

          if (concept.principles !== undefined) {
            concept.principles.forEach(principle => {
              const observable = createPrinciple$(
                principle,
                concepts,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (muxiumState.concepts$.plan(concept.semaphore) as any).bind(muxiumState.concepts$),
                muxiumState.concepts$.subscribe.bind(muxiumState.concepts$),
                muxiumState.concepts$.next.bind(muxiumState.concepts$),
                muxiumState.action$.next.bind(muxiumState.action$),
                concept.semaphore,
                muxiumState.deck.d,
                concept.actions as Actions<any>,
                concept.comparators as Comparators<any>,
                {...concept.keyedSelectors, ...concept.selectors} as BundledSelectors<any>,
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
          });
          (muxiumState.deck.d as any)[key] = {
            e: concept.actions,
            c: concept.comparators,
            k: {...concept.keyedSelectors, ...concept.selectors}
          };
          demuxifyDeck(concept).forEach(u => {
            (muxiumState.deck.d as any)[u.name] = u.eck;
          });
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
          });
          if (shouldAdd) {
            newModeNames.push(modeName);
            newModes.push((concepts[0].mode as Mode[])[modeIndex]);
          }
          shouldAdd = false;
        });
        newConcepts[0].mode = newModes;
        newMuxiumState.modeNames = newModeNames;

        newMuxiumState.cachedSemaphores = createCachedSemaphores(newConcepts);
        newMuxiumState.methodSubscribers.forEach(named => {
          named.subscription.unsubscribe();
        });
        newMuxiumState.methodSubscribers = [];
        const newDeck = {} as Deck<any>;
        Object.keys(newConcepts).forEach((key) => {
          const i = Number(key);
          if (!removeKeys.includes(newConcepts[i].name)) {
            newDeck[newConcepts[i].name] = {
              e: newConcepts[i].actions,
              c: newConcepts[i].comparators,
              k: { ...newConcepts[i].keyedSelectors, ...newConcepts[i].selectors } as BundledSelectors<any>,
            };

            demuxifyDeck(newConcepts[i]).forEach(u => {
              (newDeck as any)[u.name].d = u.eck;
            });
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
  observer.next(strategy.begin(strategy.create({
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