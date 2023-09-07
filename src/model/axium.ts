import {
  Observable,
  Subject,
  withLatestFrom,
  BehaviorSubject,
  Subscriber,
  catchError,
} from 'rxjs';
import { endOfActionStrategyType } from './actionStrategy';
import { Action, createAction } from './action';
import { strategyBegin } from './actionStrategy';
import { Concept, Mode } from './concept';
import {
  _axium,
  AxiumState,
  initializationStrategy,
} from '../concepts/axium/axium.concept';
import { axiumBadActionType } from '../concepts/axium/qualities/badAction.quality';
import { blockingMode } from '../concepts/axium/axium.mode';
import { axiumCloseType } from '../concepts/axium/qualities/close.quality';
import {
  AppendActionListToDialogPayload,
  axiumAppendActionListToDialogType
} from '../concepts/axium/qualities/appendActionListToDialog.quality';

// type Axium<T> = {
//     subscribe: (observer: Observable<T>) => void;
//     unsubscribe: (observer: Observable<T>) => void;
//     dispatch(action: Action): void;
// }

// const loggingSubject = new Subject<Action>;
// const loggingMethod: Method = loggingSubject.pipe<Action>(
//     map((action: Action) => {
//         console.log('Logging: ', action);
//         return action;
//     })
// )

// type AxiumQuality = {
//     modeIndex: number;
//     modeKeys: string[]
//     subscribers: Subscriber<unknown>[];
// }

// // Not Final, Chain is for testing
// export const defaultMode: Mode = ([action, concepts, action$, concepts$]) => {
//     if(action.semaphore) {
//         if(action.chain) {
//             action.chain.forEach(chain => action$.next(chain));
//         } else {
//             let subject: Subject<Action>;
//             if (concepts[action.semaphore[0]].qualities[action.semaphore[1]].method) {
//                 subject = concepts[action.semaphore[0]].qualities[action.semaphore[1]].subject as Subject<Action>;
//                 subject.next(action);
//             }
//             const reduce = concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer;
//             const state = concepts[action.semaphore[0]].state;
//             concepts[action.semaphore[0]].state = reduce(state, action);
//             concepts$.next(concepts);
//         }
//     } else {
//         action = primeAction(concepts, action);
//         action$.next(action);
//     }
// }

// const close: Action = {
//     type: 'Axium Close'
//

// export function closeReducer(state: AxiumQuality, _action: Action) {
//     state.subscribers.forEach(sub => sub.unsubscribe());
//     return {
//         ...state,
//         subscribers: []
//     };
// };

// const _axium: Concept = {
//     key: 'axium',
//     state: {
//         modeIndex: 0,
//         modeKeys: ['axium'],
//         subscribers: [] as Subscriber<unknown>[]
//     } as AxiumQuality,
//     qualities : [{
//         action: close,
//         reducer: closeReducer as Reducer,
//         subject: loggingSubject,
//         method: loggingMethod,
//     }],
//     mode: [defaultMode]
// };

export function createAxium(initialConcepts: Concept[]) {
  const action$: Subject<Action> = new Subject();
  const concepts: Concept[] = [_axium, ...initialConcepts];
  let axiumState = concepts[0].state as AxiumState;
  concepts.forEach((concept, _index) => {
    concept.semaphore = _index;
    concept.qualities.forEach((quality, index) => {
      quality.semaphore = [_index, index, axiumState.generation];
      if (quality.methodCreator) {
        const [method, subject] = quality.methodCreator(axiumState.subConcepts$);
        quality.method = method;
        quality.subject = subject;
        const methodSub = quality.method.subscribe((action: Action) => {
          if (
            action.strategy &&
            action.type === endOfActionStrategyType
          ) {
            // Allows for reducer next in sequence
            const appendToDialog = createAction(axiumAppendActionListToDialogType, {
              actionList: action.strategy.actionList,
              strategyKey: action.strategy.key
            } as AppendActionListToDialogPayload);
            action$.next(appendToDialog);
          } else if (
            action.strategy &&
            action.type !== endOfActionStrategyType &&
            action.type !== axiumBadActionType
          ) {
            // Allows for reducer next in sequence
            action$.next(action);
          }
        }) as Subscriber<Action>;
        axiumState = concepts[0].state as AxiumState;
        axiumState.methodSubscribers.push({
          key: concept.key,
          subscriber: methodSub,
        });
      }
    });
    if (_index !== 0 && concept.mode !== undefined) {
      axiumState = concepts[0].state as AxiumState;
      const keys = axiumState.modeKeys;
      const modes = concepts[0].mode as Mode[];
      concept.mode.forEach((mode) => {
        modes.push(mode);
        keys.push(concept.key);
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
  const concepts$: BehaviorSubject<Concept[]> = new BehaviorSubject(concepts);
  action$
    .pipe(
      withLatestFrom(concepts$),
      // This will be where the Ownership Principle will be Loaded
      // As Such is a Unique Principle in the Scope of State Management
      // This will also allow for Actions to be added to the Stream to Update to most Recent Values
      catchError((err: unknown, caught: Observable<[Action, Concept[]]>) => {
        // Will need to Refine this Function Continuously
        console.error('ACTION STREAM ERROR', err);
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
      mode([action, _concepts, action$, concepts$]);
    });

  axiumState = concepts[0].state as AxiumState;
  const subConcepts$ = axiumState.subConcepts$;

  action$.next(
    strategyBegin(initializationStrategy({ action$, concepts$ }, concepts)),
  );

  // concepts$.subscribe(val => console.log(val));
  return {
    subscribe: subConcepts$.subscribe.bind(subConcepts$),
    unsubscribe: subConcepts$.unsubscribe.bind(subConcepts$),
    // Rough In, Refine Later as Needed
    close: () => {
      action$.next(createAction(axiumCloseType));
      action$.complete();
      concepts$.complete();
      subConcepts$.complete();
    },
    dispatch: (action: Action) => {
      action$.next(action);
    },
  };
}
