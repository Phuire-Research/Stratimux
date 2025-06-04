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
import { muxiumConcept, MuxiumState, initializationStrategy, MuxiumDeck, muxiumName } from '../../concepts/muxium/muxium.concept';
import { Planner } from '../stagePlanner/stagePlanner.type';
import { MuxifiedSubject } from '../stagePlanner/stagePlanner';
import { handlePriority, isPriorityValid } from '../priority';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { Deck, Stratideck } from '../deck';
import {
  createBufferedConceptSelector,
  createBufferedMuxifiedKeyedSelector,
  createBufferedMuxifiedNameSelector,
  createBufferedStateSelector,
  createSelectors,
  updateKeyedSelectors
} from '../selector/selectorAdvanced';
import { BundledSelectors } from '../selector/selector.type';
import { Action, Actions } from '../action/action.type';
import { createCachedSemaphores } from '../action/actionSemaphore';
import { strategyBegin } from '../action/strategy/actionStrategyConsumers';
import { MaybeEnhancedMuxiumQualities, Muxium, MuxiumLoad, MuxiumOrigins } from './muxium.type';
import { blockingMethodSubscription } from '../method/methodSubscription';
import { getMuxiumState } from './muxiumHelpers';

export function muxification<C extends LoadConcepts>(
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deckLoad: LoadConcepts,
  options?: {
    logging?: boolean,
    storeDialog?: boolean,
    logActionStream?: boolean,
    dynamic?: boolean,
  }
): Muxium<C & MuxiumDeck, MaybeEnhancedMuxiumQualities> {
  const muxium = muxiumConcept<MaybeEnhancedMuxiumQualities, C>(
    name,
    options?.storeDialog,
    options?.logging,
    options?.logActionStream,
    options?.dynamic
  ) as Concept<MuxiumState<MaybeEnhancedMuxiumQualities, C>, MaybeEnhancedMuxiumQualities>;
  const concepts: Concepts = {
    0: muxium
  };
  // as Concept<MuxiumState<MuxiumQualities, MuxiumDeck & C>, MuxiumQualities>;
  updateKeyedSelectors(concepts, muxium.keyedSelectors, 0);
  muxium.selectors = createSelectors(0);
  const bundledSelectors = {
    ...muxium.keyedSelectors,
    ...muxium.selectors
  } as BundledSelectors<MuxiumState<MaybeEnhancedMuxiumQualities, C>>;
  const baseDeck: Stratideck<MaybeEnhancedMuxiumQualities, MuxiumState<MaybeEnhancedMuxiumQualities, C>, MuxiumLoad<MuxiumDeck>> = {
    d: {
      muxium: {
        d: muxium.deck.d,
        e: muxium.actions,
        c: muxium.comparators,
        k: bundledSelectors,
      },
    } as unknown as Deck<MuxiumLoad<MuxiumDeck>>,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const assembled = {
      d: concepts[semaphore].deck.d,
      e: concepts[semaphore].actions,
      c: concepts[semaphore].comparators,
      k: Object.keys(concepts[semaphore].deck.k).length !== 0 ?
        concepts[semaphore].deck.k
        :
        {...concepts[semaphore].keyedSelectors, ...concepts[semaphore].selectors},
    };
    (assembled.d as any) ?
      (assembled.d as any)[key] = assembled
      :
      (assembled.d as any)[key] = {
        [key]: assembled
      };
    (assembled.d as any).muxium = baseDeck;
    (baseDeck as any).d[key] = assembled;
    (concepts[semaphore].deck as any) = assembled;
    if (i !== 0) {
      (baseDeck as any).d[key].muxium = muxium.deck.d;
    }
  });

  const experimentStash: any[] = [];
  const muxified = Object.keys(baseDeck.d);
  muxified.forEach((muX) => {
    // console.log('muX', muX);
    const mU = Object.keys((baseDeck.d as any)[muX].d);
    mU.forEach((mu) => {
      // console.log('mu', mu);
      if ((baseDeck.d as any)[muX].d[mu].d) {
        const M = Object.keys((baseDeck.d as any)[muX].d[mu].d);
        M.forEach(m => {
          const semaphore = deckLoad[muX].semaphore;
          // console.log('m', m, semaphore);
          if ((baseDeck.d as any)[muX].d[mu].d[m] && m !== 'muxium' && mu !== 'muxium') {
            if (m === 'experiment') {
              experimentStash.push((baseDeck.d as any)[muX].d[mu].d[m].k);
            }
            // console.log('\nset', 'muX: ', muX, 'mu', mu, 'm', m, '\n',
            //   'set', 'muxified: ', muxified, 'mU: ', mU, 'M', M, '\n',
            //   'set semaphore: ', semaphore
            // );
            // (baseDeck.d as any)[muX].d[mu].d[m].k = (baseDeck.d as any)[muX].k;
            // (baseDeck.d as any)[muX].d[mu].d[m].k.state = createBufferedStateSelector(semaphore);
            (baseDeck.d as any)[muX].d[mu].d[m].k.createSelector = createBufferedMuxifiedKeyedSelector(semaphore);
            (baseDeck.d as any)[muX].d[mu].d[m].k.getName = createBufferedMuxifiedNameSelector(semaphore);
            (baseDeck.d as any)[muX].d[mu].d[m].k.getState = createBufferedStateSelector(semaphore);
            (baseDeck.d as any)[muX].d[mu].d[m].k.getConcept = createBufferedConceptSelector(semaphore);
            // (baseDeck.d as any)[muX].d[mu].d[m].k.create = createBufferedMuxifiedKeyedSelector(semaphore);
            // console.log(muX, mu, m, muX);
          }
        });
      }
    });
  });
  const deck = baseDeck;
  baseDeck.d.muxium.c.muxiumAddConceptsFromQue;
  let muxiumState = concepts[0].state as MuxiumState<MaybeEnhancedMuxiumQualities, C>;
  muxiumState.deck = deck as Stratideck<MuxiumQualities, MuxiumState<MaybeEnhancedMuxiumQualities, C>, MuxiumLoad<C>>;
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
        muxiumState = concepts[0].state as MuxiumState<MaybeEnhancedMuxiumQualities, C>;
        muxiumState.methodSubscribers.push({
          name: concept.name,
          subscription: methodSub,
        });
      }
    });    if (semaphore !== 0 && concept.mode !== undefined) {
      muxiumState = concepts[0].state as MuxiumState<MaybeEnhancedMuxiumQualities, C>;
      const names = muxiumState.modeNames;
      const modes = concepts[0].mode as Mode<MaybeEnhancedMuxiumQualities, C, MuxiumState<MaybeEnhancedMuxiumQualities, C>>[];
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
      const _muxiumState = _concepts[0].state as MuxiumState<MaybeEnhancedMuxiumQualities, C>;
      if (_muxiumState.head.length === 0) {
        action.origin = MuxiumOrigins.muxiumHead;
        _muxiumState.head.push(action);
        if (_muxiumState.tailTimer.length > 0) {
          const timer = _muxiumState.tailTimer.shift();
          if (timer) {
            clearTimeout(timer);
          }        }        const modeIndex = _muxiumState.modeIndex;
        const modes = _concepts[0].mode as Mode<MaybeEnhancedMuxiumQualities, C, MuxiumState<MaybeEnhancedMuxiumQualities, C>>[];
        const mode = modes[modeIndex] as Mode<MaybeEnhancedMuxiumQualities, C, MuxiumState<MaybeEnhancedMuxiumQualities, C>>;
        mode([
          action,
          _concepts,
          _muxiumState.action$,
          _muxiumState.concepts$ as unknown as MuxifiedSubject<
          MaybeEnhancedMuxiumQualities, C, MuxiumState<MaybeEnhancedMuxiumQualities, C>
          >
        ]);
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

  muxiumState = concepts[0].state as MuxiumState<MaybeEnhancedMuxiumQualities, C>;
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
    },    plan: <Co extends LoadConcepts = C>(
      title: string, planner: Planner<MaybeEnhancedMuxiumQualities, Co & MuxiumDeck, MuxiumState<MaybeEnhancedMuxiumQualities, C>>
    ) => (
      (muxiumState.concepts$ as unknown as MuxifiedSubject<
        MaybeEnhancedMuxiumQualities, Co, MuxiumState<MaybeEnhancedMuxiumQualities, C>
        >).outerPlan(title, planner as unknown as Planner<MaybeEnhancedMuxiumQualities, Co, MuxiumState<MaybeEnhancedMuxiumQualities, C>>)),
    deck,
    e: deck.d.muxium.e
  } as unknown as Muxium<C & MuxiumDeck, MaybeEnhancedMuxiumQualities>;
}

/*#>*/