/*<$
For the asynchronous graph programming framework Stratimux, define the Concept Type model file.
This file defines the type definitions associated to a Stratimux Concept and their utilization within the Muxification Paradigm.
$>*/
/*<#*/
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { PrincipleFunction } from '../principle';
import { KeyedSelectors, Selectors } from '../selector/selector.type';
import { MuxifiedSubject } from '../stagePlanner/stagePlanner';
import { Comparators } from '../interface';
import { Qualities, Quality } from '../quality';
import { Deck } from '../deck';
import { Action, ActionCreator, ActionCreatorWithPayload, Actions } from '../action/action.type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Reducer<
  S extends Record<string, unknown>,
  T = void
> = (state: S, action: Action<T>) => S | null;

export type SpecificReducer<S extends Record<string, unknown>, T = void, C = void> =
  (state: S, action: Action<T>, deck: Deck<C>) => Partial<S> | null;

export type Method<T = void> = Observable<[Action<T>, boolean]>;
export type Principle = Observable<Action>;
export type Self<T = void, C = void> = T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
export type ActionDeck<T = void, C = void> = {action: Action<T>, deck: Deck<C>, self: Self<T>};

export type Mode = ([action, concept, action$, concepts$]: [
  Action<unknown>,
  Concepts,
  Subject<Action>,
  MuxifiedSubject<any, any>,
]) => void;

export type MethodCreatorStep<S extends Record<string, unknown>, T = void, C = void> = () => MethodCreator<S, T, C>;

export type MethodCreator<S extends Record<string, unknown>, T = void, C = void> =
  (concept$: Subject<Concepts>, semaphore: number) => [Method<T>, Subject<ActionDeck<T, C>>];
// export type MethodCreator = (concept$?: MuxifiedSubject, semaphore?: number) => [Method, Subject<Action>];

export type Muxified = {
  stateMap: string[];
  actionMap: string[];
};

export type Concept<S extends Record<string, unknown>, Q = void> = {
  name: string;
  muxifiedRecord: Record<string, Muxified>;
  state: S;
  actions: Actions<Q>;
  comparators: Comparators<Q>;
  keyedSelectors: KeyedSelectors<S>;
  selectors: Selectors<S>;
  qualities: Quality<Record<string, unknown>>[];
  q: Q extends Qualities ?
    Q
    :
    Qualities;
  semaphore: number;
  principles?: PrincipleFunction<Q, any, S>[];
  mode?: Mode[];
  meta?: Record<string,unknown>;
};

// export type AnyConcept = Concept<Record<string, unknown>, any> | Concept<Record<string, unknown>, void>;
export type AnyConcept =
  Concept<Record<string, unknown>, Qualities>
  |
  // Concept<Record<string, unknown>, void>
  // |
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  Concept<any, any>;

export type Concepts = Record<number, AnyConcept>;
export type LoadConcepts = Record<string, AnyConcept>;

export type ConceptDeck<T> = {
  [K in keyof T]:
    T[K] extends Concept<Record<string, unknown>, void> ?
      Concept<Record<string, unknown>, void>
      :
      T[K] extends Concept<Record<string, unknown>, Qualities> ?
      Concept<Record<string, unknown>, T[K]['q']>
      :
      Concept<Record<string, unknown>, any>
};

export type ConceptsSubscriber = (observerOrNext?: Partial<Observer<Concepts>> | ((value: Concepts) => void) | undefined) => Subscription;
/*#>*/