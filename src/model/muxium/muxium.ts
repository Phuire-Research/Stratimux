/*<$
For the asynchronous graph programming framework Stratimux, define the Muxium model file.
This file dictates the creation of the Muxium itself and engages all necessary parts to ensure its functionality
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
import {
  AnyConcept,
  Concept,
  Concepts,
  LoadConcepts,
  Mode,
  forEachConcept,
  qualityToString
} from '../concept/concept';
import {
  muxificationConcept,
  MuxiumState,
  initializationStrategy,
  MuxiumDeck,
} from '../../concepts/muxium/muxium.concept';
import { Planner, StagePlanner } from '../stagePlanner/stagePlanner.type';
import { muxiumTimeOut } from '../time';
import { handlePriority, isPriorityValid } from '../priority';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { Deck, Decks, ECK } from '../deck';
import { BundledSelectors, createSelectors, updateKeyedSelectors } from '../selectors/selector';
import { Comparators } from '../interface';
import { createAction } from '../action/action';
import { Action, Actions } from '../action/action.type';
import { createCachedSemaphores } from '../action/actionSemaphore';
import { strategyBegin } from '../action/strategy/actionStrategyConsumers';

// eslint-disable-next-line no-shadow
export enum MuxiumOrigins {
  strategyTail = 'strategyTail',
  muxiumHead = 'muxiumHead'
}

export const tailWhip = <Q, C extends LoadConcepts>(muxiumState: MuxiumState<Q, C>) => {
  if (muxiumState.tailTimer.length === 0) {
    muxiumState.tailTimer.push(setTimeout(() => {
      muxiumState.action$.next(createAction('Kick Muxium'));
    }, 3));
  }
};

export const createOrigin = (location: unknown[]): string => {
  let origin = '';
  let addSign = false;
  location.forEach(l => {
    if (addSign) {
      origin += '+' + l;
    } else {
      origin += l;
      addSign = true;
    }
  });
  return origin;
};

export const HandleOrigin = <Q, C extends LoadConcepts>(state: MuxiumState<Q, C>, action: Action) => {
  const {
    body,
    tail
  } = state;
  let found = false;
  for (const [i, a] of body.entries()) {
    if (a.origin && a.origin === action.origin) {
      body[i] = action;
      found = true;
      break;
    }
  }
  if (!found) {
    for (const [i, a] of tail.entries()) {
      if (a.origin && a.origin === action.origin) {
        body[i] = action;
        found = true;
        break;
      }
    }
  }

  if (!found) {
    body.push(action);
  }
  tailWhip(state);
};

export const HandleHardOrigin = <Q, C extends LoadConcepts>(state: MuxiumState<Q, C>, action: Action) => {
  // Fill Bucket
  // Empty Bucket
  // Issue is I need to remove all origins and replace with hard overriding action at the earliest slot
  const {
    body,
    tail
  } = state;
  let found = false;
  const origin = action.origin?.split('+')[0];
  for (const [i, a] of body.entries()) {
    const aOrigin = a.origin?.split('+')[0];
    if (aOrigin !== undefined && aOrigin === origin) {
      body[i] = action;
      found = true;
      break;
    }
  }
  if (!found) {
    for (const [i, a] of tail.entries()) {
      const aOrigin = a.origin?.split('+')[0];
      if (aOrigin !== undefined && aOrigin === action.origin) {
        body[i] = action;
        found = true;
        break;
      }
    }
  }

  if (!found) {
    body.push(action);
  }
  tailWhip(state);
};

export const blockingMethodSubscription = (
  concepts: Concepts,
  tail: Action<unknown>[],
  action: Action
) => {
  if (
    action.strategy &&
    // Logical Determination: muxiumConcludeType
    action.semaphore[3] === 3
  ) {
    // Allows for reducer next in sequence
    const appendToDialog = accessMuxium(concepts).e.muxiumAppendActionListToDialog({
      actionList: action.strategy.actionList,
      strategyTopic: action.strategy.topic,
      strategyData: action.strategy.data,
    });
    if (isPriorityValid(action)) {
      appendToDialog.priority = action.priority;
      const state = getMuxiumState(concepts);
      handlePriority(state, action);
      handlePriority(state, appendToDialog);
    } else {
      action.origin = MuxiumOrigins.strategyTail;
      tail.push(action);
      tail.push(appendToDialog);
    }
  } else if (
    action.strategy &&
    // Logical Determination: muxiumBadType
    action.semaphore[3] !== 1
  ) {
    if (isPriorityValid(action)) {
      handlePriority(getMuxiumState(concepts), action);
    } else {
      tail.push(action);
    }
  }
};

export const defaultMethodSubscription = (
  concepts: Concepts,
  tail: Action<unknown>[],
  action$: Subject<Action>,
  action: Action,
  async: boolean
) => {
  if (
    action.strategy &&
    // Logical Determination: muxiumConcludeType
    action.semaphore[3] === 3
  ) {
    // Allows for reducer next in sequence
    const appendToDialog = accessMuxium(concepts).e.muxiumAppendActionListToDialog({
      actionList: action.strategy.actionList,
      strategyTopic: action.strategy.topic,
      strategyData: action.strategy.data
    });
    // setTimeout(() => {
    if (isPriorityValid(action)) {
      const state = getMuxiumState(concepts);
      handlePriority(state, action);
      appendToDialog.priority = action.priority;
      handlePriority(state, appendToDialog);
    } else {
      tail.push(action);
      tail.push(appendToDialog);
    }
    if (async) {
      muxiumTimeOut(concepts, () => {
        return accessMuxium(concepts).e.muxiumKick();
      }, 0);
    }
    // }, 0);
  } else if (
    action.strategy &&
    // Logical Determination: muxiumBadType
    action.semaphore[3] !== 1
  ) {
    if (isPriorityValid(action)) {
      handlePriority(getMuxiumState(concepts), action);
    } else {
      tail.push(action);
    }
    if (async) {
      muxiumTimeOut(concepts, () => {
        return accessMuxium(concepts).e.muxiumKick();
      }, 0);
    }
  }
};

// export type MuxiumLoad<C extends LoadConcepts> = {
//   muxium: Concept<MuxiumState<MuxiumQualities, C>, MuxiumQualities>,
//   [key: string] : AnyConcept;
// };

export type MuxiumLoad<C extends LoadConcepts> = {
  [K in keyof C] : C[K] extends AnyConcept ? C[K] : AnyConcept
};

export const demuxifyDeck = (concept: AnyConcept): {name: string, eck: ECK<any>}[] => {
  const final: {name: string, eck: ECK<any>}[] = [];
  const keys = Object.keys(concept.muxifiedRecord);
  keys.forEach(name => {
    const e: Actions<any> = {};
    const c: Comparators<any> = {};
    const k = {...concept.selectors} as BundledSelectors<any>;
    concept.muxifiedRecord[name].actionMap.forEach(ky => {
      e[ky] = concept.actions[ky];
      c[ky] = concept.comparators[ky];
    });
    concept.muxifiedRecord[name].stateMap.forEach(ky => {
      k[ky] = concept.keyedSelectors[ky];
    });
    const eck: ECK<any> = {
      e,
      c,
      k
    };
    final.push({
      name,
      eck
    });
  });
  return final;
};

export function muxification<C extends LoadConcepts>(
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deckLoad: C,
  options?: {
    logging?: boolean,
    storeDialog?: boolean,
    logActionStream?: boolean,
    dynamic?: boolean,
  }
): Muxium<MuxiumQualities, C & MuxiumDeck, MuxiumState<MuxiumQualities, C>> {
  const muxiumConcept = muxificationConcept<MuxiumQualities, C>(
    name,
    options?.storeDialog,
    options?.logging,
    options?.logActionStream,
    options?.dynamic
  ) as Concept<MuxiumState<MuxiumQualities, C>, MuxiumQualities>;
  const concepts: Concepts = {
    0: muxiumConcept
  };
  // as Concept<MuxiumState<MuxiumQualities, MuxiumDeck & C>, MuxiumQualities>;
  updateKeyedSelectors(concepts, muxiumConcept.keyedSelectors, 0);
  muxiumConcept.selectors = createSelectors(0);
  const bundledSelectors = {
    ...muxiumConcept.keyedSelectors,
    ...muxiumConcept.selectors
  } as BundledSelectors<MuxiumState<MuxiumQualities, C>>;
  const baseDeck: Decks<MuxiumQualities, MuxiumState<MuxiumQualities, C>, MuxiumLoad<MuxiumDeck>> = {
    d: { muxium: {
      e: muxiumConcept.actions,
      c: muxiumConcept.comparators,
      k: bundledSelectors,
    },
    } as Deck<MuxiumLoad<MuxiumDeck>>,
    e: muxiumConcept.actions,
    c: muxiumConcept.comparators,
    k: bundledSelectors,
  };
  muxiumConcept.semaphore = 0;
  Object.keys(deckLoad).forEach((key, i) => {
    const semaphore = i + 1;
    concepts[semaphore] = deckLoad[key];
    deckLoad[key].semaphore = semaphore;
    updateKeyedSelectors(concepts, concepts[semaphore].keyedSelectors, semaphore);
    concepts[semaphore].selectors = createSelectors(semaphore);
    (baseDeck as any).d[key] = {
      e: concepts[semaphore].actions,
      c: concepts[semaphore].comparators,
      k: {...concepts[semaphore].keyedSelectors, ...concepts[semaphore].selectors},
    };
    demuxifyDeck(concepts[semaphore]).forEach(u => {
      (baseDeck as any).d[u.name] = u.eck;
    });
  });

  const deck = baseDeck as Decks<MuxiumQualities, MuxiumState<MuxiumQualities, C>, MuxiumLoad<C & MuxiumDeck>>;
  baseDeck.d.muxium.c.muxiumAddConceptsFromQue;
  let muxiumState = concepts[0].state as MuxiumState<MuxiumQualities, C>;
  muxiumState.deck = deck;
  muxiumState.cachedSemaphores = createCachedSemaphores(concepts);
  forEachConcept(concepts, ((concept, semaphore) => {
    muxiumState.conceptCounter += 1;
    concept.qualities.forEach(quality => {
      if (quality.methodCreator) {
        [quality.method, quality.subject] = quality.methodCreator()(muxiumState.concepts$, semaphore);
        quality.method.pipe(
          catchError((err: unknown, caught: Observable<[Action, boolean]>) => {
            if (muxiumState.logging) {
              console.error('METHOD ERROR', err);
            }
            return caught;
          }));
        quality.toString = qualityToString(quality);
        const methodSub = quality.method.subscribe(([action, _]) => {
          blockingMethodSubscription(concepts, muxiumState.tail, action);
        }) as Subscriber<Action>;
        muxiumState = concepts[0].state as MuxiumState<MuxiumQualities, C>;
        muxiumState.methodSubscribers.push({
          name: concept.name,
          subscription: methodSub,
        });
      }
    });
    if (semaphore !== 0 && concept.mode !== undefined) {
      muxiumState = concepts[0].state as MuxiumState<MuxiumQualities, C>;
      const names = muxiumState.modeNames;
      const modes = concepts[0].mode as Mode[];
      concept.mode.forEach((mode) => {
        modes.push(mode);
        names.push(concept.name);
      });
    }
  }));
  muxiumState.action$
    .pipe(
      withLatestFrom(muxiumState.actionConcepts$),
      // This will be where the Ownership Principle will be Loaded
      // As Such is a Unique Principle in the Scope of State Management
      // This will also allow for Actions to be added to the Stream to Update to most Recent Values
      catchError((err: unknown, caught: Observable<[Action, Concepts]>) => {
        if (muxiumState.logging) {
          console.error('ACTION STREAM ERROR', err);
        }
        return caught;
      }),
    )
    .subscribe(([action, _concepts]: [Action, Concepts]) => {
      // Would be notifying methods
      if (getMuxiumState(_concepts).logActionStream) {
        console.log(
          'ACTION STREAM: ', action,
          ' topic: ', action.strategy?.topic
        );
      }
      const _muxiumState = _concepts[0].state as MuxiumState<MuxiumQualities, C>;
      if (_muxiumState.head.length === 0) {
        action.origin = MuxiumOrigins.muxiumHead;
        _muxiumState.head.push(action);
        if (_muxiumState.tailTimer.length > 0) {
          const timer = _muxiumState.tailTimer.shift();
          if (timer) {
            clearTimeout(timer);
          }
        }
        const modeIndex = _muxiumState.modeIndex;
        const modes = _concepts[0].mode as Mode[];
        const mode = modes[modeIndex] as Mode;
        mode([action, _concepts, _muxiumState.action$, _muxiumState.concepts$]);
        _muxiumState.head.shift();
        if (_muxiumState.body.length === 0) {
          const nextAction = getMuxiumState(concepts).tail.shift();
          if (nextAction) {
            getMuxiumState(concepts).action$.next(nextAction);
          }
        } else {
          const nextAction = getMuxiumState(concepts).body.shift();
          if (nextAction) {
            getMuxiumState(concepts).action$.next(nextAction);
          }
        }
      // An action dispatched from a priority stage, with a priority set to 0
      // Will override the need to handle priority
      } else if (isPriorityValid(action)) {
        handlePriority(_muxiumState, action);
      } else {
        _muxiumState.body.push(action);
      }
    });

  muxiumState = concepts[0].state as MuxiumState<MuxiumQualities, C>;
  const action$ = muxiumState.action$;
  muxiumState.actionConcepts$.next(concepts);
  muxiumState.concepts$.init(concepts);
  muxiumState.action$.next(
    strategyBegin(initializationStrategy(concepts[0].actions as unknown as Actions<MuxiumQualities>, concepts)),
  );
  const close = (exit?: boolean) => {
    action$.next(baseDeck.d.muxium.e.muxiumPreClose({
      exit: exit ? exit : false
    }));
  };
  return {
    subscribe: muxiumState.concepts$.subscribe.bind(muxiumState.concepts$),
    unsubscribe: muxiumState.concepts$.unsubscribe.bind(muxiumState.concepts$),
    close: close,
    dispatch: (action: Action) => {
      action$.next(action);
    },
    plan: <Co>(title: string, planner: Planner<MuxiumQualities, Co & MuxiumDeck, MuxiumState<MuxiumQualities, C>>) => (
      muxiumState.concepts$.outerPlan(title, planner as unknown as Planner<MuxiumQualities, C, void>)),
    deck,
    e: deck.d.muxium.e
  } as unknown as Muxium<MuxiumQualities, C & MuxiumDeck, MuxiumState<MuxiumQualities, C>>;
}

// [TODO] - IMPORTANT - Point of providing access to white listed qualities organized by concepts.
export type Muxium<Q extends Record<string, unknown>, C extends LoadConcepts, S extends Record<string, unknown>> = {
  subscribe: (observerOrNext?: Partial<Observer<Concepts>> | ((value: Concepts) => void) | undefined) => Subscription;
  unsubscribe: () => void;
  close: (exit?: boolean) => void;
  dispatch: (action: Action<any>) => void;
  plan: <Co>(title: string, planner: Planner<MuxiumQualities, Co & MuxiumDeck, MuxiumState<MuxiumQualities, C>>) => StagePlanner;
  deck: Decks<MuxiumQualities, MuxiumState<Q, C>, MuxiumLoad<C>>,
  e: Actions<MuxiumQualities>
}

export const getMuxiumState = <Q = void, C = void>(concepts: Concepts) =>
  (concepts[0].state as MuxiumState<Q extends void ? MuxiumQualities : Q, C extends LoadConcepts ? C : MuxiumDeck >);

export const accessMuxium = (concepts: Concepts) => (getMuxiumState(concepts).deck.d.muxium);

export const isMuxiumOpen = (concepts: Concepts) => ((concepts[0].state as MuxiumState<MuxiumQualities, MuxiumLoad<any>>).open);

export const muxium = ({
  create: muxification,
  getState: getMuxiumState,
  isOpen: isMuxiumOpen
});
/*#>*/