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
import { Planner, StagePlanner } from '../stagePlanner/stagePlanner.type';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { Decks } from '../deck';
import { Action, Actions } from '../action/action.type';

// eslint-disable-next-line no-shadow
export enum MuxiumOrigins {
  strategyTail = 'strategyTail',
  muxiumHead = 'muxiumHead'
}

export type MuxiumLoad<C extends LoadConcepts> = {
  [K in keyof C] : C[K] extends AnyConcept ? C[K] : AnyConcept
};

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

/*#>*/