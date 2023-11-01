import {
  Observable,
  Subject,
  withLatestFrom,
  Subscriber,
  catchError,
} from 'rxjs';
import { Action, createCacheSemaphores } from './action';
import { strategyBegin } from './actionStrategy';
import { Concept, Concepts, Method, Mode, forEachConcept } from './concept';
import {
  createAxiumConcept,
  AxiumState,
  initializationStrategy,
  axiumName,
} from '../concepts/axium/axium.concept';
import {
  axiumAppendActionListToDialog,
} from '../concepts/axium/qualities/appendActionListToDialog.quality';
import { axiumPreClose } from '../concepts/axium/qualities/preClose.quality';

export const blockingMethodSubscription = (action$: Subject<Action>, action: Action) => {
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
    action$.next(appendToDialog);
    action$.next(action);
  } else if (
    action.strategy &&
    // Logical Determination: axiumBadType
    action.semaphore[3] !== 1
  ) {
    action$.next(action);
  }
};

export const defaultMethodSubscription = (action$: Subject<Action>, action: Action) => {
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
    setTimeout(() => {
      action$.next(appendToDialog);
      action$.next(action);
    }, 0);
  } else if (
    action.strategy &&
    // Logical Determination: axiumBadType
    action.semaphore[3] !== 1
  ) {
    setTimeout(() => {
      action$?.next(action);
    }, 0);
  }
};

export function createAxium(name: string, initialConcepts: Concept[], logging?: boolean, storeDialog?: boolean) {
  const concepts: Concepts = {};
  const init = [createAxiumConcept(name, logging, storeDialog), ...initialConcepts];
  init.forEach((concept, i) => {
    concept.semaphore = i;
    concepts[i] = concept;
  });
  let axiumState = concepts[0].state as AxiumState;
  axiumState.cachedSemaphores = createCacheSemaphores(concepts);
  forEachConcept(concepts, ((concept, semaphore) => {
    concept.qualities.forEach(quality => {
      if (quality.methodCreator) {
        [quality.method, quality.subject] = quality.methodCreator(axiumState.concepts$, semaphore);
        quality.method.pipe(
          catchError((err: unknown, caught: Observable<Action>) => {
            if (axiumState.logging) {
              console.error('METHOD ERROR', err);
            }
            return caught;
          }));
        quality.toString = () =>
          (`Type: ${quality.actionType} Reducer: ${quality.reducer.toString()} Method: ${quality.method?.toString()}`);
        const methodSub = quality.method.subscribe((action: Action) => {
          blockingMethodSubscription(axiumState.action$, action);
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
      withLatestFrom(axiumState.innerConcepts$),
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
      const modeIndex = _axiumState.modeIndex;
      // console.log('CHECK ACTION STREAM', action);
      const modes = _concepts[0].mode as Mode[];
      const mode = modes[modeIndex] as Mode;
      mode([action, _concepts, _axiumState.action$, _axiumState.concepts$]);
    });

  axiumState = concepts[0].state as AxiumState;
  const action$ = axiumState.action$;
  const subConcepts$ = axiumState.subConcepts$;
  const concepts$Sub = axiumState.concepts$.subscribe(_concepts => {
    axiumState.innerConcepts$.next(_concepts);
  });
  axiumState.generalSubscribers.push({
    name: axiumName,
    subscription: concepts$Sub
  });
  axiumState.concepts$.next(concepts);
  axiumState.action$.next(
    strategyBegin(initializationStrategy(concepts)),
  );
  const close = (exit?: boolean) => {
    action$.next(axiumPreClose({
      exit: exit ? exit : false
    }));
  };
  return {
    subscribe: subConcepts$.subscribe.bind(subConcepts$),
    unsubscribe: subConcepts$.unsubscribe.bind(subConcepts$),
    close: close,
    dispatch: (action: Action) => {
      action$.next(action);
    },
    stage: subConcepts$.stage.bind(subConcepts$),
  };
}
