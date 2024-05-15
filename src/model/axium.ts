/*<$
For the asynchronous graph programming framework Stratimux, define the Axium model file.
This file dictates the creation of the Axium itself and engages all necessary parts to ensure its functionality
as a provably recursive terminating function.
$>*/
/*<#*/
import {
  Observable,
  Subject,
  withLatestFrom,
  Subscriber,
  catchError,
  Subscription,
  Observer,
} from 'rxjs';
import { Action, createCacheSemaphores } from './action';
import { strategyBegin } from './actionStrategy';
import { Concept, Concepts, Mode, forEachConcept, qualityToString } from './concept';
import {
  createAxiumConcept,
  AxiumState,
  initializationStrategy,
} from '../concepts/axium/axium.concept';
import {
  axiumAppendActionListToDialog,
} from '../concepts/axium/qualities/appendActionListToDialog.quality';
import { axiumPreClose } from '../concepts/axium/qualities/preClose.quality';
import { StagePlanner, Staging } from './stagePlanner';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { axiumTimeOut } from './time';
import { handlePriority, isPriorityValid } from './priority';

export const blockingMethodSubscription = (concepts: Concepts, tail: Action[], action: Action) => {
  if (
    action.strategy &&
    // Logical Determination: axiumConcludeType
    action.semaphore[3] === 3
  ) {
    // Allows for reducer next in sequence
    const appendToDialog = axiumAppendActionListToDialog({
      actionList: action.strategy.actionList,
      strategyTopic: action.strategy.topic,
      strategyData: action.strategy.data,
    });
    if (isPriorityValid(action)) {
      const state = getAxiumState(concepts);
      handlePriority(state, action);
      appendToDialog.priority = action.priority;
      handlePriority(state, appendToDialog);
    } else {
      tail.push(appendToDialog);
      tail.push(action);
    }
  } else if (
    action.strategy &&
    // Logical Determination: axiumBadType
    action.semaphore[3] !== 1
  ) {
    if (isPriorityValid(action)) {
      handlePriority(getAxiumState(concepts), action);
    } else {
      tail.push(action);
    }
    tail.push(action);
  }
};

export const defaultMethodSubscription = (concepts: Concepts, tail: Action[], action$: Subject<Action>, action: Action, async: boolean) => {
  if (
    action.strategy &&
    // Logical Determination: axiumConcludeType
    action.semaphore[3] === 3
  ) {
    // Allows for reducer next in sequence
    const appendToDialog = axiumAppendActionListToDialog({
      actionList: action.strategy.actionList,
      strategyTopic: action.strategy.topic,
      strategyData: action.strategy.data
    });
    // setTimeout(() => {
    if (isPriorityValid(action)) {
      const state = getAxiumState(concepts);
      handlePriority(state, action);
      appendToDialog.priority = action.priority;
      handlePriority(state, appendToDialog);
    } else {
      tail.push(appendToDialog);
      tail.push(action);
    }
    if (async) {
      axiumTimeOut(concepts, () => {
        return axiumKick();
      }, 0);
    }
    // }, 0);
  } else if (
    action.strategy &&
    // Logical Determination: axiumBadType
    action.semaphore[3] !== 1
  ) {
    if (isPriorityValid(action)) {
      handlePriority(getAxiumState(concepts), action);
    } else {
      tail.push(action);
    }
    if (async) {
      axiumTimeOut(concepts, () => {
        return axiumKick();
      }, 0);
    }
  }
};

export function createAxium(
  name: string,
  initialConcepts: Concept[],
  options?: {
    logging?: boolean,
    storeDialog?: boolean,
    logActionStream?: boolean
  }
): Axium {
  const concepts: Concepts = {};
  const init = [
    createAxiumConcept(
      name,
      options?.storeDialog,
      options?.logging,
      options?.logActionStream
    ), ...initialConcepts];
  init.forEach((concept, i) => {
    concept.semaphore = i;
    concepts[i] = concept;
  });
  let axiumState = concepts[0].state as AxiumState;
  axiumState.cachedSemaphores = createCacheSemaphores(concepts);
  forEachConcept(concepts, ((concept, semaphore) => {
    axiumState.conceptCounter += 1;
    concept.qualities.forEach(quality => {
      if (quality.methodCreator) {
        [quality.method, quality.subject] = quality.methodCreator(axiumState.concepts$, semaphore);
        quality.method.pipe(
          catchError((err: unknown, caught: Observable<[Action, boolean]>) => {
            if (axiumState.logging) {
              console.error('METHOD ERROR', err);
            }
            return caught;
          }));
        quality.toString = qualityToString(quality);
        const methodSub = quality.method.subscribe(([action, _]) => {
          blockingMethodSubscription(concepts, axiumState.tail, action);
        }) as Subscriber<Action>;
        axiumState = concepts[0].state as AxiumState;
        axiumState.methodSubscribers.push({
          name: concept.name,
          subscription: methodSub,
        });
      }
    });
    if (semaphore !== 0 && concept.mode !== undefined) {
      axiumState = concepts[0].state as AxiumState;
      const names = axiumState.modeNames;
      const modes = concepts[0].mode as Mode[];
      concept.mode.forEach((mode) => {
        modes.push(mode);
        names.push(concept.name);
      });
    }
  }));
  axiumState.action$
    .pipe(
      withLatestFrom(axiumState.actionConcepts$),
      // This will be where the Ownership Principle will be Loaded
      // As Such is a Unique Principle in the Scope of State Management
      // This will also allow for Actions to be added to the Stream to Update to most Recent Values
      catchError((err: unknown, caught: Observable<[Action, Concepts]>) => {
        if (axiumState.logging) {
          console.error('ACTION STREAM ERROR', err);
        }
        return caught;
      }),
    )
    .subscribe(([action, _concepts]: [Action, Concepts]) => {
      // Would be notifying methods
      const _axiumState = _concepts[0].state as AxiumState;
      // console.log('CHECK QUES', _axiumState.head, _axiumState.body, _axiumState.tail);
      if (_axiumState.head.length === 0) {
        _axiumState.head.push(action);
        if (_axiumState.tailTimer.length > 0) {
          const timer = _axiumState.tailTimer.shift();
          if (timer) {
            clearTimeout(timer);
          }
        }
        const modeIndex = _axiumState.modeIndex;
        if (getAxiumState(_concepts).logActionStream) {
          console.log('CHECK ACTION STREAM', action.type, action.payload, action.semaphore, action.strategy?.topic);
        }
        const modes = _concepts[0].mode as Mode[];
        const mode = modes[modeIndex] as Mode;
        // console.log('STREAM', action, mode);
        mode([action, _concepts, _axiumState.action$, _axiumState.concepts$]);
        _axiumState.head.shift();
        if (_axiumState.body.length === 0) {
          const nextAction = getAxiumState(concepts).tail.shift();
          if (nextAction) {
            getAxiumState(concepts).action$.next(nextAction);
          }
        } else {
          const nextAction = getAxiumState(concepts).body.shift();
          if (nextAction) {
            getAxiumState(concepts).action$.next(nextAction);
          }
        }
      // An action dispatched from a priority stage, with a priority set to 0
      // Will override the need to handle priority
      } else if (isPriorityValid(action)) {
        handlePriority(_axiumState, action);
      } else {
        _axiumState.body.push(action);
      }
    });

  axiumState = concepts[0].state as AxiumState;
  const action$ = axiumState.action$;
  axiumState.actionConcepts$.next(concepts);
  axiumState.concepts$.init(concepts);
  axiumState.action$.next(
    strategyBegin(initializationStrategy(concepts)),
  );
  const close = (exit?: boolean) => {
    action$.next(axiumPreClose({
      exit: exit ? exit : false
    }));
  };
  return {
    subscribe: axiumState.concepts$.subscribe.bind(axiumState.concepts$),
    unsubscribe: axiumState.concepts$.unsubscribe.bind(axiumState.concepts$),
    close: close,
    dispatch: (action: Action) => {
      action$.next(action);
    },
    plan: axiumState.concepts$.outerPlan.bind(axiumState.concepts$),
  };
}

export type Axium = {
  subscribe: (observerOrNext?: Partial<Observer<Concepts>> | ((value: Concepts) => void) | undefined) => Subscription;
  unsubscribe: () => void;
  close: (exit?: boolean) => void;
  dispatch: (action: Action) => void;
  plan: (title: string, stages: Staging[]) => StagePlanner
}

export const getAxiumState = (concepts: Concepts) => (concepts[0].state as AxiumState);

export const isAxiumOpen = (concepts: Concepts) => ((concepts[0].state as AxiumState).open);

export const axium = ({
  create: createAxium,
  getState: getAxiumState,
  isOpen: isAxiumOpen
});
/*#>*/