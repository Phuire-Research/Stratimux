/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a principle that will allow for the modification of the Axium's loaded concepts.
$>*/
/*<#*/
import { BehaviorSubject, Observable, Subject, Subscriber, catchError } from 'rxjs';
import { Concepts, Mode, forEachConcept, qualityToString } from '../../model/concept';
import { PrincipleFunction, createPrinciple$ } from '../../model/principle';
import { Action, createCacheSemaphores } from '../../model/action';
import { AxiumState, axiumName } from './axium.concept';
import { createActionNode, strategy, strategyBegin } from '../../model/actionStrategy';
import { addConceptsFromQueThenUnblockStrategy } from './strategies/addConcept.strategy';
import { removeConceptsViaQueThenUnblockStrategy } from './strategies/removeConcept.strategy';
import { blockingMode, permissiveMode } from './axium.mode';
import { UnifiedSubject, createStage } from '../../model/stagePlanner';
import { blockingMethodSubscription, getAxiumState } from '../../model/axium';
import { axiumSelectAddConceptQue, axiumSelectRemoveConceptQue } from './axium.selector';
import { axiumRegisterStagePlanner } from './qualities/registerStagePlanner.quality';

export const axiumPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concepts,
  concepts$: UnifiedSubject,
  semaphore: number
) => {
  let allowAdd = true;
  let allowRemove = true;
  const addConceptsPlan = concepts$.innerPlan('Add Concepts Plan', [
    createStage((_concepts, dispatch) => {
      const axiumState = _concepts[0].state as AxiumState;
      if (axiumState.addConceptQue.length === 0) {
        allowAdd = true;
      }
      if (axiumState.addConceptQue.length !== 0 && allowAdd) {
        allowAdd = false;
        axiumState.generation += 1;
        const newConcepts: Concepts = {};
        forEachConcept(concepts, (concept, s) => {
          newConcepts[Number(s)] = concept;
        });

        axiumState.addConceptQue.forEach((concept, _index) => {
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
              const observable = createPrinciple$(principle, concepts, axiumState.concepts$, concept.semaphore);
              axiumState.principleSubscribers.push({
                name: concept.name,
                subscription: observable.subscribe((action: Action) => axiumState.action$.next(action)) as Subscriber<Action>
              });
            });
          }
          concept.qualities.forEach(quality => {
            if (quality.methodCreator) {
              [quality.method, quality.subject] = quality.methodCreator(getAxiumState(concepts).concepts$, concept.semaphore);
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
                blockingMethodSubscription(tail, act);
              }) as Subscriber<Action>;
              getAxiumState(concepts).methodSubscribers.push({name: concept.name, subscription: methodSub});
            }
          });
          newConcepts[concept.semaphore] = concept;
          axiumState.conceptCounter += 1;
        });

        const newAxiumState = newConcepts[0].state as AxiumState;
        newAxiumState.cachedSemaphores = createCacheSemaphores(newConcepts);

        axiumState.actionConcepts$.next(newConcepts);
        axiumState.concepts$.next(newConcepts);

        dispatch(strategyBegin(addConceptsFromQueThenUnblockStrategy(newConcepts)), {
          throttle: 50
        });
      }
    }, { selectors: [axiumSelectAddConceptQue], priority: Infinity - 1}),
  ]);

  const removeConceptsPlan = concepts$.innerPlan('Remove Concepts Plan', [
    createStage((_concepts, dispatch) => {
      const axiumState = _concepts[0].state as AxiumState;
      if (axiumState.removeConceptQue.length === 0) {
        allowRemove = true;
      }
      if (axiumState.removeConceptQue.length > 0 && allowRemove) {
        allowRemove = false;
        const newConcepts: Concepts = {};
        axiumState.generation += 1;
        const newModes: Mode[] = [blockingMode, permissiveMode];
        const newModeNames: string[] = [axiumName, axiumName];
        forEachConcept(concepts, ((concept, s) => {
          axiumState.removeConceptQue.forEach(target => {
            if (concept.name !== target.name) {
              newConcepts[s as number] = (concept);
            }
          });
        }));
        const newAxiumState = newConcepts[0].state as AxiumState;
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

        newAxiumState.cachedSemaphores = createCacheSemaphores(newConcepts);
        newAxiumState.methodSubscribers.forEach(named => {
          named.subscription.unsubscribe();
        });
        newAxiumState.methodSubscribers = [];

        forEachConcept(newConcepts, (concept, s) => {
          concept.qualities.forEach(quality => {
            if (quality.methodCreator) {
              const [method, subject] = quality.methodCreator(axiumState.concepts$, s);
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
                blockingMethodSubscription(axiumState.tail, action);
              }) as Subscriber<Action>;
              const _axiumState = newConcepts[0].state as AxiumState;
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
          removeConceptsViaQueThenUnblockStrategy(newConcepts)), {
          throttle: 50
        });
      }
    }, { selectors: [axiumSelectRemoveConceptQue], priority: Infinity - 2})
  ]);
  observer.next(strategy.begin(strategy.create({
    topic: 'Register Axium Add/Remove Plans',
    initialNode: createActionNode(axiumRegisterStagePlanner({conceptName: axiumName, stagePlanner: addConceptsPlan}, semaphore), {
      successNode: createActionNode(axiumRegisterStagePlanner({conceptName: axiumName, stagePlanner: removeConceptsPlan}, semaphore), {
        successNode: null,
        failureNode: null
      }),
      failureNode: null
    })
  })));
};
/*#>*/