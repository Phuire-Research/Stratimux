/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a principle that will allow for the modification of the Axium's loaded concepts.
$>*/
/*<#*/
import { Observable, Subscriber, catchError } from 'rxjs';
import { AnyConcept, Concepts, Mode, forEachConcept, qualityToString } from '../../model/concept';
import { PrincipleFunction, createPrinciple$ } from '../../model/principle';
import { Action, Actions, createCachedSemaphores } from '../../model/action';
import { axiumName } from './axium.concept';
import { createActionNode, strategy, strategyBegin } from '../../model/actionStrategy';
import { addConceptsFromQueThenUnblockStrategy } from './strategies/addConcept.strategy';
import { removeConceptsViaQueThenUnblockStrategy } from './strategies/removeConcept.strategy';
import { blockingMode, permissiveMode } from './axium.mode';
import { AxiumDeck, blockingMethodSubscription, getAxiumState } from '../../model/axium';
import { AxiumQualities } from './qualities';
import { axiumSelectAddConceptQue, axiumSelectRemoveConceptQue } from './axium.selector';

export const axiumPrinciple: PrincipleFunction<AxiumQualities> = (
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
      const axiumState = getAxiumState(concepts);
      if (axiumState.addConceptQue.length === 0) {
        allowAdd = true;
      }
      if (axiumState.addConceptQue.length !== 0 && allowAdd) {
        allowAdd = false;
        axiumState.generation += 1;
        const newConcepts: Concepts = {};
        forEachConcept(concepts, (concept, se) => {
          newConcepts[Number(se)] = concept;
        });
        axiumState.addConceptQue.forEach((cpt, _index) => {
          const concept = cpt as unknown as AnyConcept;
          concept.semaphore = axiumState.conceptCounter;
          if (concept.mode !== undefined) {
            const names = axiumState.modeNames;
            const modes = concepts[0].mode as Mode[];
            concept.mode.forEach((mode: Mode) => {
              modes.push(mode);
              names.push(concept.name);
            });
          }
          if (concept.principles !== undefined) {
            concept.principles.forEach(principle => {
              const observable = createPrinciple$<typeof concept.q, AxiumDeck>(
                principle,
                concepts,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (axiumState.concepts$.plan(concept.semaphore) as any).bind(axiumState.concepts$),
                axiumState.concepts$.subscribe.bind(axiumState.concepts$),
                axiumState.concepts$.next.bind(axiumState.concepts$),
                axiumState.action$.next.bind(axiumState.action$),
                concept.semaphore,
                axiumState.deck,
                concept.actions as Actions<any>,
                concept.typeValidators,
                concept.selectors,
              );
              axiumState.principleSubscribers.push({
                name: concept.name,
                subscription: observable.subscribe((action: Action) => axiumState.action$.next(action)) as Subscriber<Action>
              });
            });
          }
          concept.qualities.forEach(quality => {
            if (quality.methodCreator) {
              [quality.method, quality.subject] = quality.methodCreator()(getAxiumState(concepts).concepts$, concept.semaphore);
              quality.method.pipe(
                catchError((err: unknown, caught: Observable<[Action, boolean]>) => {
                  if (getAxiumState(concepts).logging) {
                    console.error('METHOD ERROR', err);
                  }
                  return caught;
                }));
              quality.toString = qualityToString(quality);
              const methodSub = quality.method.subscribe(([act, _]) => {
                const tail = getAxiumState(concepts).tail;
                blockingMethodSubscription(concepts, tail, act);
              }) as Subscriber<Action>;
              getAxiumState(concepts).methodSubscribers.push({name: concept.name, subscription: methodSub});
            }
          });
          newConcepts[concept.semaphore] = concept as AnyConcept;
          axiumState.conceptCounter += 1;
        });

        const newAxiumState = getAxiumState(newConcepts[0]);
        newAxiumState.cachedSemaphores = createCachedSemaphores(newConcepts);

        axiumState.actionConcepts$.next(newConcepts);
        axiumState.concepts$.next(newConcepts);

        dispatch(strategyBegin(addConceptsFromQueThenUnblockStrategy(e, newConcepts)), {
          throttle: 50
        });
      }
    }, { selectors: [axiumSelectAddConceptQue], priority: Infinity - 1}),
  ]);

  const removeConceptsPlan = plan('Remove Concepts Plan', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      const axiumState = getAxiumState(concepts);
      if (axiumState.removeConceptQue.length === 0) {
        allowRemove = true;
      }
      if (axiumState.removeConceptQue.length > 0 && allowRemove) {
        allowRemove = false;
        const newConcepts: Concepts = {};
        axiumState.generation += 1;
        const newModes: Mode[] = [blockingMode, permissiveMode];
        const newModeNames: string[] = [axiumName, axiumName];
        forEachConcept(concepts, ((concept, se) => {
          axiumState.removeConceptQue.forEach(target => {
            if (concept.name !== target.name) {
              newConcepts[se as number] = (concept);
            }
          });
        }));
        const newAxiumState = getAxiumState(newConcepts);
        newAxiumState.modeNames.forEach((modeName, modeIndex) => {
          let shouldAdd = false;
          axiumState.removeConceptQue.forEach(removeTarget => {
            if (modeName !== axiumName) {
              if (modeName !== removeTarget.name) {
                shouldAdd = true;
              } else if (modeName === removeTarget.name && modeIndex === newAxiumState.defaultModeIndex) {
                newAxiumState.defaultModeIndex = 1;
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
        newAxiumState.modeNames = newModeNames;

        newAxiumState.cachedSemaphores = createCachedSemaphores(newConcepts);
        newAxiumState.methodSubscribers.forEach(named => {
          named.subscription.unsubscribe();
        });
        newAxiumState.methodSubscribers = [];

        forEachConcept(newConcepts, (concept, se) => {
          concept.qualities.forEach(quality => {
            if (quality.methodCreator) {
              const [method, subject] = quality.methodCreator()(axiumState.concepts$, se);
              quality.method = method;
              quality.subject = subject;
              quality.method.pipe(
                catchError((err: unknown, caught: Observable<[Action, boolean]>) => {
                  if (axiumState.logging) {
                    console.error('METHOD ERROR', err);
                  }
                  return caught;
                }));
              const methodSub = quality.method.subscribe(([action, _]) => {
                blockingMethodSubscription(newConcepts, axiumState.tail, action);
              }) as Subscriber<Action>;
              const _axiumState = getAxiumState(newConcepts);
              _axiumState.methodSubscribers.push({
                name: concept.name,
                subscription: methodSub,
              });
            }
          });
        });
        axiumState.actionConcepts$.next(newConcepts);
        axiumState.concepts$.next(newConcepts);
        dispatch(strategyBegin(
          removeConceptsViaQueThenUnblockStrategy(e, newConcepts)), {
          throttle: 50
        });
      }
    }, { selectors: [axiumSelectRemoveConceptQue], priority: Infinity - 2})
  ]);
  observer.next(strategy.begin(strategy.create({
    topic: 'Register Axium Add/Remove Plans',
    initialNode: createActionNode(e_.axiumRegisterStagePlanner({conceptName: axiumName, stagePlanner: addConceptsPlan}), {
      successNode:
      createActionNode(e_.axiumRegisterStagePlanner({conceptName: axiumName, stagePlanner: removeConceptsPlan}), {
        successNode: null,
        failureNode: null
      }),
      failureNode: null
    }),
    priority: Infinity
  })));
};
/*#>*/