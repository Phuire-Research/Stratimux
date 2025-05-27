/*<$
For the asynchronous graph programming framework Stratimux, define the Muxium Type model file.
This file defines all types and enums that are associated to the management of Muxiums.
$>*/
/*<#*/
import {
  Subscription,
  Observer,
} from 'rxjs';
import {
  AnyConcept,
  Concepts,
  LoadConcepts,
} from '../concept/concept.type';
import {
  MuxiumState,
  MuxiumDeck,
} from '../../concepts/muxium/muxium.concept';
import { BasePlanner, Planner, StagePlanner } from '../stagePlanner/stagePlanner.type';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { Stratideck } from '../deck';
import { Action, Actions, AnyAction } from '../action/action.type';

// eslint-disable-next-line no-shadow
export enum MuxiumOrigins {
  strategyTail = 'strategyTail',
  muxiumHead = 'muxiumHead'
}

export type MuxiumLoad<C extends LoadConcepts> = {
  [K in keyof C] : C[K] extends AnyConcept ? C[K] : AnyConcept
};

export type MaybeEnhancedMuxiumQualities<Q = void | Record<string, unknown>> = Q extends void ? MuxiumQualities : Record<string, unknown>;
// [TODO] - IMPORTANT - Point of providing access to white listed qualities organized by concepts.
export type Muxium<C extends LoadConcepts, Q = void> = {
  subscribe: (observerOrNext?: Partial<Observer<Concepts>> | ((value: Concepts) => void) | undefined) => Subscription;
  unsubscribe: () => void;
  close: (exit?: boolean) => void;
  dispatch: (action: AnyAction) => void;
  plan: <Co extends LoadConcepts = C>(
    title: string,
    planner: BasePlanner<
    MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities,
    Co & MuxiumDeck,
    MuxiumState<
      MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities,
      Co & MuxiumDeck
      >
    >
  ) => StagePlanner;
  deck: Stratideck<MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities, MuxiumState<Q, C>, MuxiumLoad<C>>,
  e: Actions<MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities>
}

/*#>*/