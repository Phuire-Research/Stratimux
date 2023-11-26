/*<$
For the framework Stratimux and Axium Concept, generate a principle that will allow for the modification of the Axium's loaded concepts.
$>*/
/*<#*/
import { Observable, Subscriber, catchError } from 'rxjs';
import { Concepts, Mode, forEachConcept } from '../../model/concept';
import { PrincipleFunction, createPrinciple$, registerPrincipleSubscription } from '../../model/principle';
import { Action, createCacheSemaphores } from '../../model/action';
import { AxiumState, axiumName } from './axium.concept';
import { strategyBegin } from '../../model/actionStrategy';
import { addConceptsFromQueThenUnblockStrategy } from './strategies/addConcept.strategy';
import { removeConceptsViaQueThenUnblockStrategy } from './strategies/removeConcept.strategy';
import { blockingMode, permissiveMode } from './axium.mode';
import { UnifiedSubject } from '../../model/stagePlanner';
import { blockingMethodSubscription } from '../../model/axium';

export const axiumPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concepts,
  concepts$: UnifiedSubject,
  _: number
) => {
  let allowAdd = true;
  let allowRemove = true;
  const subscription = concepts$.subscribe(_concepts => {
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
        newConcepts[concept.semaphore] = concept;
        axiumState.conceptCounter += 1;
      });

      const newAxiumState = newConcepts[0].state as AxiumState;
      newAxiumState.cachedSemaphores = createCacheSemaphores(newConcepts);

      axiumState.concepts$?.next(newConcepts);

      observer.next(strategyBegin(
        addConceptsFromQueThenUnblockStrategy(newConcepts)
      ));
    }
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
              catchError((err: unknown, caught: Observable<Action>) => {
                if (axiumState.logging) {
                  console.error('METHOD ERROR', err);
                }
                return caught;
              }));
            const methodSub = quality.method.subscribe((action: Action) => {
              console.log('HIT');
              blockingMethodSubscription(axiumState.action$, action);
            }) as Subscriber<Action>;
            const _axiumState = newConcepts[0].state as AxiumState;
            _axiumState.methodSubscribers.push({
              name: concept.name,
              subscription: methodSub,
            });
          }
        });
      });
      axiumState.concepts$.next(newConcepts);

      observer.next(strategyBegin(
        removeConceptsViaQueThenUnblockStrategy(newConcepts)
      ));
    }
  });
  registerPrincipleSubscription(observer, concepts, axiumName, subscription);
};
/*#>*/