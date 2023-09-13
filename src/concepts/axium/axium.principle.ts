import { defer, Observable, Subject, withLatestFrom, BehaviorSubject, Subscriber, map} from 'rxjs';
import { Concept, Mode } from '../../model/concept';
import { PrincipleFunction, createPrinciple$ } from '../../model/principle';
import { Action, createAction, createCacheSemaphores } from '../../model/action';
import { AxiumState, axiumKey } from './axium.concept';
import { selectState } from '../../model/selector';
import { RegisterSubscriberPayload, axiumRegisterSubscriberType } from './qualities/registerSubscriber.quality';
import { primeAction } from '../../model/action';
import { strategyBegin } from '../../model/actionStrategy';
import { addConceptsFromQueThenUnblockStrategy } from './strategies/addConcept.strategy';
import { removeConceptsViaQueThenUnblockStrategy } from './strategies/removeConcept.strategy';
import { blockingMode, permissiveMode } from './axium.mode';

export const axiumPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concept[],
  concepts$: Subject<Concept[]>
) => {
  let allowAdd = true;
  let allowRemove = true;
  const subscriber = concepts$.subscribe(_concepts => {
    const axiumState = _concepts[0].state as AxiumState;
    // console.log('Check', axiumState.addConceptQue);
    if (axiumState.addConceptQue.length === 0) {
      allowAdd = true;
    }
    if (axiumState.addConceptQue.length !== 0 && allowAdd) {
      allowAdd = false;
      console.log('Once');
      axiumState.generation += 1;
      axiumState.addConceptQue.forEach((concept, _index) => {
        if (concept.mode !== undefined) {
          const keys = axiumState.modeKeys;
          const modes = concepts[0].mode as Mode[];
          concept.mode.forEach((mode: Mode) => {
            modes.push(mode);
            keys.push(concept.key);
          });
        }
      });

      const newConcepts = [
        ...concepts,
        ...axiumState.addConceptQue
      ] as Concept[];
      const newAxiumState = newConcepts[0].state as AxiumState;
      newAxiumState.cachedSemaphores = createCacheSemaphores(newConcepts);

      newConcepts.forEach((concept, _index) => {
        concept.semaphore = _index;
        concept.qualities.forEach((quality, index) => {
          quality.semaphore = [_index, index, axiumState.generation];
        });
      });
      axiumState.concepts$?.next(newConcepts);

      const action$ = axiumState.action$ as Subject<Action>;

      observer.next(strategyBegin(
        addConceptsFromQueThenUnblockStrategy(action$, newConcepts)
      ));
    }
    if (axiumState.removeConceptQue.length === 0) {
      allowRemove = true;
    }
    if (axiumState.removeConceptQue.length > 0 && allowRemove) {
      allowRemove = false;
      const newConcepts = [] as Concept[];
      axiumState.generation += 1;
      const newModes: Mode[] = [blockingMode, permissiveMode];
      const newModeKeys: string[] = [axiumKey, axiumKey];
      concepts.forEach(concept => {
        axiumState.removeConceptQue.forEach(target => {
          if (concept.key !== target.key) {
            newConcepts.push(concept);
          }
        });
      });
      const newAxiumState = newConcepts[0].state as AxiumState;
      newAxiumState.modeKeys.forEach((modeKey, modeIndex) => {
        let shouldAdd = false;
        axiumState.removeConceptQue.forEach(removeTarget => {
          if (modeKey !== axiumKey) {
            if (modeKey !== removeTarget.key) {
              shouldAdd = true;
            } else if (modeKey === removeTarget.key && modeIndex === newAxiumState.defaultModeIndex) {
              newAxiumState.defaultModeIndex = 1;
            }
          }
        });
        if (shouldAdd) {
          newModeKeys.push(modeKey);
          newModes.push((concepts[0].mode as Mode[])[modeIndex]);
        }
        shouldAdd = false;
      });
      newConcepts[0].mode = newModes;
      newAxiumState.modeKeys = newModeKeys;
      newConcepts.forEach((concept, _index) => {
        concept.semaphore = _index;
        concept.qualities.forEach((quality, index) => {
          quality.semaphore = [_index, index, axiumState.generation];
        });
      });
      newAxiumState.cachedSemaphores = createCacheSemaphores(newConcepts);

      axiumState.concepts$?.next(newConcepts);

      observer.next(strategyBegin(
        removeConceptsViaQueThenUnblockStrategy(newConcepts)
      ));
      // Do More Things
    }
  });
  const primedRegisterSubscriber = primeAction(concepts, createAction(axiumRegisterSubscriberType));
  primedRegisterSubscriber.payload = { subscriber, key: axiumKey } as RegisterSubscriberPayload;
  observer.next(primedRegisterSubscriber);
};
