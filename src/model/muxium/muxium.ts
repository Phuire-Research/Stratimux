/*<$
For the asynchronous graph programming framework Stratimux, define the Muxium model file.
This file dictates the creation of a Muxium and engages all necessary parts to ensure its functionality
as a provably recursive terminating function.
$>*/
/*<#*/
import { Observable, withLatestFrom, Subscriber, catchError } from 'rxjs';
import {
  Concept,
  Concepts,
  LoadConcepts,
  Mode,
} from '../concept/concept.type';
import {
  forEachConcept,
  qualityToString
} from '../concept/conceptHelpers';
import { muxiumConcept, MuxiumState, initializationStrategy, MuxiumDeck } from '../../concepts/muxium/muxium.concept';
import { Planner } from '../stagePlanner/stagePlanner.type';
import { handlePriority, isPriorityValid } from '../priority';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { Deck, Decks, demuxifyDeck } from '../deck';
import { createSelectors, updateKeyedSelectors } from '../selector/selectorAdvanced';
import { BundledSelectors } from '../selector/selector.type';
import { Action, Actions } from '../action/action.type';
import { createCachedSemaphores } from '../action/actionSemaphore';
import { strategyBegin } from '../action/strategy/actionStrategyConsumers';
import { Muxium, MuxiumLoad, MuxiumOrigins } from './muxium.type';
import { blockingMethodSubscription } from '../method/methodSubscription';
import { getMuxiumState } from './muxiumHelpers';

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
  const muxium = muxiumConcept<MuxiumQualities, C>(
    name,
    options?.storeDialog,
    options?.logging,
    options?.logActionStream,
    options?.dynamic
  ) as Concept<MuxiumState<MuxiumQualities, C>, MuxiumQualities>;
  const concepts: Concepts = {
    0: muxium
  };
  // as Concept<MuxiumState<MuxiumQualities, MuxiumDeck & C>, MuxiumQualities>;
  updateKeyedSelectors(concepts, muxium.keyedSelectors, 0);
  muxium.selectors = createSelectors(0);
  const bundledSelectors = {
    ...muxium.keyedSelectors,
    ...muxium.selectors
  } as BundledSelectors<MuxiumState<MuxiumQualities, C>>;
  const baseDeck: Decks<MuxiumQualities, MuxiumState<MuxiumQualities, C>, MuxiumLoad<MuxiumDeck>> = {
    d: { muxium: {
      e: muxium.actions,
      c: muxium.comparators,
      k: bundledSelectors,
    },
    } as Deck<MuxiumLoad<MuxiumDeck>>,
    e: muxium.actions,
    c: muxium.comparators,
    k: bundledSelectors,
  };
  muxium.semaphore = 0;
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

/*#>*/