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
import { Action, Actions, createAction, createCachedSemaphores } from './action';
import { strategyBegin } from './actionStrategy';
import { AnyConcept, Concept, ConceptDeck, Concepts, LoadConcepts, Mode, forEachConcept, qualityToString } from './concept';
import {
  createAxiumConcept,
  AxiumState,
  initializationStrategy,
  AxiumDeck,
} from '../concepts/axium/axium.concept';
import { Planning } from './stagePlanner';
import { axiumTimeOut } from './time';
import { handlePriority, isPriorityValid } from './priority';
import { AxiumQualities } from '../concepts/axium/qualities';
import { Deck, Decks } from './deck';
import { BundledSelectors, createBufferedSelectorsSet, createSelectors, KeyedSelectors, updateKeyedSelectors } from './selector';

// eslint-disable-next-line no-shadow
export enum AxiumOrigins {
  strategyTail = 'strategyTail',
  axiumHead = 'axiumHead'
}

export const tailWhip = <Q, C extends LoadConcepts>(axiumState: AxiumState<Q, C>) => {
  if (axiumState.tailTimer.length === 0) {
    axiumState.tailTimer.push(setTimeout(() => {
      axiumState.action$.next(createAction('Kick Axium'));
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

export const HandleOrigin = <Q, C extends LoadConcepts>(state: AxiumState<Q, C>, action: Action) => {
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

export const HandleHardOrigin = <Q, C extends LoadConcepts>(state: AxiumState<Q, C>, action: Action) => {
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
    // Logical Determination: axiumConcludeType
    action.semaphore[3] === 3
  ) {
    // Allows for reducer next in sequence
    const appendToDialog = accessAxium(concepts).e.axiumAppendActionListToDialog({
      actionList: action.strategy.actionList,
      strategyTopic: action.strategy.topic,
      strategyData: action.strategy.data,
    });
    if (isPriorityValid(action)) {
      appendToDialog.priority = action.priority;
      const state = getAxiumState(concepts);
      handlePriority(state, action);
      handlePriority(state, appendToDialog);
    } else {
      action.origin = AxiumOrigins.strategyTail;
      tail.push(action);
      tail.push(appendToDialog);
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
    // Logical Determination: axiumConcludeType
    action.semaphore[3] === 3
  ) {
    // Allows for reducer next in sequence
    const appendToDialog = accessAxium(concepts).e.axiumAppendActionListToDialog({
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
      tail.push(action);
      tail.push(appendToDialog);
    }
    if (async) {
      axiumTimeOut(concepts, () => {
        return accessAxium(concepts).e.axiumKick();
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
        return accessAxium(concepts).e.axiumKick();
      }, 0);
    }
  }
};

// export type AxiumLoad<C extends LoadConcepts> = {
//   axium: Concept<AxiumState<AxiumQualities, C>, AxiumQualities>,
//   [key: string] : AnyConcept;
// };

export type AxiumLoad<C extends LoadConcepts> = {
  [K in keyof C] : C[K] extends AnyConcept ? C[K] : AnyConcept
};

export function createAxium<C extends LoadConcepts>(
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deckLoad: C,
  options?: {
    logging?: boolean,
    storeDialog?: boolean,
    logActionStream?: boolean,
    dynamic?: boolean,
  }
): Axium<AxiumQualities, C & AxiumDeck, AxiumState<AxiumQualities, C>> {
  const axiumConcept = createAxiumConcept<AxiumQualities, C>(
    name,
    options?.storeDialog,
    options?.logging,
    options?.logActionStream,
    options?.dynamic
  );
  const concepts: Concepts = {
    0: axiumConcept
  };
  // as Concept<AxiumState<AxiumQualities, AxiumDeck & C>, AxiumQualities>;
  updateKeyedSelectors(concepts, axiumConcept.keyedSelectors, 0);
  const bundledSelectors = {
    ...axiumConcept.keyedSelectors,
    ...createBufferedSelectorsSet(0)
  } as BundledSelectors<AxiumState<AxiumQualities, C>>;
  const baseDeck: Decks<AxiumQualities, AxiumState<AxiumQualities, C>, AxiumLoad<AxiumDeck>> = {
    d: { axium: {
      e: axiumConcept.actions,
      c: axiumConcept.comparators,
      k: bundledSelectors,
    },
    } as Deck<AxiumLoad<AxiumDeck>>,
    e: axiumConcept.actions,
    c: axiumConcept.comparators,
    k: bundledSelectors,
  };
  axiumConcept.semaphore = 0;
  axiumConcept.selectors = createSelectors(0);
  Object.keys(deckLoad).forEach((key, i) => {
    const target = i + 1;
    concepts[target] = deckLoad[key];
    updateKeyedSelectors(concepts, deckLoad[key].keyedSelectors, target);
    (baseDeck as any).d[key] = {
      e: deckLoad[key].actions,
      c: deckLoad[key].comparators,
      k: {...deckLoad[key].keyedSelectors, ...createBufferedSelectorsSet(target)},
      s: {}
    };
    deckLoad[key].semaphore = target;
  });

  const deck = baseDeck as Decks<AxiumQualities, AxiumState<AxiumQualities, C>, AxiumLoad<C & AxiumDeck>>;
  baseDeck.d.axium.c.axiumAddConceptsFromQue;
  let axiumState = concepts[0].state as AxiumState<AxiumQualities, C>;
  axiumState.deck = deck;
  axiumState.cachedSemaphores = createCachedSemaphores(concepts);
  forEachConcept(concepts, ((concept, semaphore) => {
    axiumState.conceptCounter += 1;
    concept.selectors = createSelectors(semaphore);
    concept.qualities.forEach(quality => {
      if (quality.methodCreator) {
        [quality.method, quality.subject] = quality.methodCreator()(axiumState.concepts$, semaphore);
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
        axiumState = concepts[0].state as AxiumState<AxiumQualities, C>;
        axiumState.methodSubscribers.push({
          name: concept.name,
          subscription: methodSub,
        });
      }
    });
    if (semaphore !== 0 && concept.mode !== undefined) {
      axiumState = concepts[0].state as AxiumState<AxiumQualities, C>;
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
      if (getAxiumState(_concepts).logActionStream) {
        console.log(
          'ACTION STREAM: ', action,
          ' topic: ', action.strategy?.topic
        );
      }
      const _axiumState = _concepts[0].state as AxiumState<AxiumQualities, C>;
      if (_axiumState.head.length === 0) {
        action.origin = AxiumOrigins.axiumHead;
        _axiumState.head.push(action);
        if (_axiumState.tailTimer.length > 0) {
          const timer = _axiumState.tailTimer.shift();
          if (timer) {
            clearTimeout(timer);
          }
        }
        const modeIndex = _axiumState.modeIndex;
        const modes = _concepts[0].mode as Mode[];
        const mode = modes[modeIndex] as Mode;
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

  axiumState = concepts[0].state as AxiumState<AxiumQualities, C>;
  const action$ = axiumState.action$;
  axiumState.actionConcepts$.next(concepts);
  axiumState.concepts$.init(concepts);
  axiumState.action$.next(
    strategyBegin(initializationStrategy(concepts[0].actions as unknown as Actions<AxiumQualities>, concepts)),
  );
  const close = (exit?: boolean) => {
    action$.next(baseDeck.d.axium.e.axiumPreClose({
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
    plan: axiumState.concepts$.outerPlan,
    deck,
    e: deck.d.axium.e
  } as unknown as Axium<AxiumQualities, C & AxiumDeck, AxiumState<AxiumQualities, C>>;
}

// [TODO] - IMPORTANT - Point of providing access to white listed qualities organized by concepts.
export type Axium<Q extends Record<string, unknown>, C extends LoadConcepts, S extends Record<string, unknown>> = {
  subscribe: (observerOrNext?: Partial<Observer<Concepts>> | ((value: Concepts) => void) | undefined) => Subscription;
  unsubscribe: () => void;
  close: (exit?: boolean) => void;
  dispatch: (action: Action<any>) => void;
  plan: Planning<Q, C, S>;
  deck: Decks<AxiumQualities, AxiumState<Q, C>, AxiumLoad<C>>,
  e: Actions<AxiumQualities>
}

export const getAxiumState = <Q = void, C = void>(concepts: Concepts) =>
  (concepts[0].state as AxiumState<Q extends void ? AxiumQualities : Q, C extends LoadConcepts ? C : AxiumDeck >);

export const accessAxium = (concepts: Concepts) => (getAxiumState(concepts).deck.d.axium);

export const isAxiumOpen = (concepts: Concepts) => ((concepts[0].state as AxiumState<AxiumQualities, AxiumLoad<any>>).open);

export const axium = ({
  create: createAxium,
  getState: getAxiumState,
  isOpen: isAxiumOpen
});
/*#>*/