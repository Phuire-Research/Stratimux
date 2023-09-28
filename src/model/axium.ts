import {
  Observable,
  Subject,
  withLatestFrom,
  Subscriber,
  catchError,
} from 'rxjs';
import { Action, createAction, createCacheSemaphores } from './action';
import { strategyBegin } from './actionStrategy';
import { Concept, Mode } from './concept';
import {
  createAxiumConcept,
  AxiumState,
  initializationStrategy,
} from '../concepts/axium/axium.concept';
import { axiumBadActionType } from '../concepts/axium/qualities/badAction.quality';
import { axiumCloseType } from '../concepts/axium/qualities/close.quality';
import {
  AppendActionListToDialogPayload,
  axiumAppendActionListToDialogType
} from '../concepts/axium/qualities/appendActionListToDialog.quality';
import { axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';

export const blockingMethodSubscription = (action$: Subject<Action>, action: Action) => {
  if (
    action.strategy &&
    action.type === axiumConcludeType
  ) {
    // Allows for reducer next in sequence
    const appendToDialog = createAction(axiumAppendActionListToDialogType);
    appendToDialog.payload = {
      actionList: action.strategy.actionList,
      strategyTopic: action.strategy.topic
    } as AppendActionListToDialogPayload;
    action$.next(appendToDialog);
  } else if (
    action.strategy &&
    action.type !== axiumBadActionType
  ) {
    action$.next(action);
  }
};

export const defaultMethodSubscription = (action$: Subject<Action>, action: Action) => {
  if (
    action.strategy &&
    action.type === axiumConcludeType
  ) {
    // Allows for reducer next in sequence
    const appendToDialog = createAction(axiumAppendActionListToDialogType);
    appendToDialog.payload = {
      actionList: action.strategy.actionList,
      strategyTopic: action.strategy.topic
    } as AppendActionListToDialogPayload;
    setTimeout(() => {
      action$?.next(appendToDialog);
    }, 0);
  } else if (
    action.strategy &&
    action.type !== axiumBadActionType
  ) {
    setTimeout(() => {
      action$?.next(action);
    }, 0);
  }
};

export function createAxium(initialConcepts: Concept[], logging?: boolean, storeDialog?: boolean) {
  // const action$: Subject<Action> = new Subject();
  const concepts: Concept[] = [createAxiumConcept(logging, storeDialog), ...initialConcepts];
  let axiumState = concepts[0].state as AxiumState;
  axiumState.cachedSemaphores = createCacheSemaphores(concepts);
  concepts.forEach((concept, _index) => {
    concept.qualities.forEach((quality, index) => {
      if (quality.methodCreator) {
        const [method, subject] = quality.methodCreator(axiumState.subConcepts$);
        quality.method = method;
        quality.subject = subject;
        const methodSub = quality.method.subscribe((action: Action) => {
          blockingMethodSubscription(axiumState.action$, action);
        }) as Subscriber<Action>;
        axiumState = concepts[0].state as AxiumState;
        axiumState.methodSubscribers.push({
          name: concept.name,
          subscriber: methodSub,
        });
      }
    });
    if (_index !== 0 && concept.mode !== undefined) {
      axiumState = concepts[0].state as AxiumState;
      const names = axiumState.modeNames;
      const modes = concepts[0].mode as Mode[];
      concept.mode.forEach((mode) => {
        modes.push(mode);
        names.push(concept.name);
      });
    }
    // if (concept.principles) {
    //     const axiumState = selectState<AxiumState>(concepts, _axium.key);
    //     concept.principles.forEach((principle) => {
    //         const sub = createPrinciple$(principle, concept).subscribe(action => action$.next(action)) as Subscriber<Action>;
    //         axiumState.subscribers.push({
    //             key: concept.key,
    //             subscriber: sub,
    //         });
    //     })
    // }
  });
  // const concepts$: BehaviorSubject<Concept[]> = new BehaviorSubject(concepts);
  axiumState.action$
    .pipe(
      withLatestFrom(axiumState.concepts$),
      // This will be where the Ownership Principle will be Loaded
      // As Such is a Unique Principle in the Scope of State Management
      // This will also allow for Actions to be added to the Stream to Update to most Recent Values
      catchError((err: unknown, caught: Observable<[Action, Concept[]]>) => {
        // Will need to Refine this Function Continuously
        if (axiumState.logging) {
          console.error('ACTION STREAM ERROR', err);
        }
        return caught;
      }),
    )
    .subscribe(([action, _concepts]: [Action, Concept[]]) => {
      // Would be notifying methods
      // console.log('Check Length', concepts.length)
      const _axiumState = _concepts[0].state as AxiumState;
      const modeIndex = _axiumState.modeIndex;
      const modes = _concepts[0].mode as Mode[];
      const mode = modes[modeIndex] as Mode;
      mode([action, _concepts, _axiumState.action$, _axiumState.concepts$]);
    });

  axiumState = concepts[0].state as AxiumState;
  const action$ = axiumState.action$;
  const subConcepts$ = axiumState.subConcepts$;
  axiumState.concepts$.next(concepts);
  axiumState.action$.next(
    strategyBegin(initializationStrategy(concepts)),
  );
  const close = () => {
    subConcepts$.complete();
    action$.next(createAction(axiumCloseType));
  };
  return {
    subscribe: subConcepts$.subscribe.bind(subConcepts$),
    unsubscribe: subConcepts$.unsubscribe.bind(subConcepts$),
    close: close.bind(subConcepts$),
    dispatch: (action: Action) => {
      action$.next(action);
    },
    stage: subConcepts$.stage.bind(subConcepts$),
  };
}
