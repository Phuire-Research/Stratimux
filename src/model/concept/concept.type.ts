/* eslint-disable @typescript-eslint/no-explicit-any */
/*<$
For the asynchronous graph programming framework Stratimux, define the Concept Type model file.
This file defines the type definitions associated to a Stratimux Concept and their utilization within the Muxification Paradigm.
$>*/
/*<#*/
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { PrincipleFunction, PrincipleInterface } from '../principle';
import { BundledSelectors, KeyedSelectors, Selectors } from '../selector/selector.type';
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

export type Mode<Q = any, C = any, S = any> = ([action, concept, action$, concepts$]: [
  Action<unknown>,
  Concepts,
  Subject<Action>,
  MuxifiedSubject<Q, C, S>,
]) => void;

export type MethodCreatorStep<S extends Record<string, unknown>, T = void, C = void> = () => MethodCreator<S, T, C>;

export type MethodCreator<S extends Record<string, unknown>, T = void, C = void> =
  (concept$: Subject<Concepts>, semaphore: number) => [Method<T>, Subject<ActionDeck<T, C>>];
// export type MethodCreator = (concept$?: MuxifiedSubject, semaphore?: number) => [Method, Subject<Action>];

export type Muxified = {
  stateMap: string[];
  actionMap: string[];
};

// Type to represent the flattened qualities/properties from a muxified concept
export type ConceptECK<S = any, Q = any> = {
  e: Actions<Q>;
  c: Comparators<Q>;
  k: BundledSelectors<S> & Selectors<S>;
};

// Helper type to recursively extract deck types while preserving their structure
type ExtractNestedDecks<T> = T extends Concept<any, any, infer D>
  ? D extends LoadConcepts
    ? D & {
        [K in keyof D]: ExtractNestedDecks<D[K]>
      }
    : Record<string, never>
  : Record<string, never>;

// Flatten all decks from MuX recursively
type FlattenAllDecks<MuX extends LoadConcepts> = MuX & {
  [K in keyof MuX]: ExtractNestedDecks<MuX[K]>
}[keyof MuX];

// Functional composition for Concept-level deck: { d: { e, c, k }, e, c, k }
// The 'd' contains flattened access to muxified qualities/properties (halting API)
export type ConceptDECK<
  S extends Record<string, unknown>,
  Q = void,
  MuX extends LoadConcepts = Record<string, never>
> = {
    d: {
      [K in keyof FlattenAllDecks<MuX>]: FlattenAllDecks<MuX>[K] extends Concept<infer CS, infer CQ> ?
        ConceptECK<CS, CQ> // Halting API - only e, c, k from muxified concepts
        : never
    }
    e: Actions<Q>,
    c: Comparators<Q>,
    k: BundledSelectors<S> & Selectors<S>
  };

export type AnyConceptDECK = ConceptDECK<any, any, any>;

// Typescript limitation, use this to break typechecking, while ensuring Q and S are fit to Concept Principle Pair.
export type ConceptPrincipleFunction<Q = void, S = void> =
  (baseI: any) => void;

// Base concept without deck parameter to avoid circular reference
export type Concept<
  S extends Record<string, unknown>,
  Q = void,
  D extends LoadConcepts = Record<string, never>
> = {
  name: string;
  muxifiedRecord: Record<string, Muxified>; // NOTE Convert this logic to derive from deck after implementation of that workflow.
  deck: ConceptDECK<S, Q, D>
  state: S;
  actions: Actions<Q>;
  comparators: Comparators<Q>;
  keyedSelectors: KeyedSelectors<S>;
  selectors: Selectors<S>;
  qualities: Quality<Record<string, unknown>>[];
  q: Q extends Qualities ? Q : Qualities;
  semaphore: number;
  principles?: ConceptPrincipleFunction<Q, S>[];
  mode?: Mode[];
  meta?: Record<string, unknown>;
};

// LoadConcepts type using BaseConcept to break circular reference
export type LoadConcepts = Record<string, Concept<any, any, any>>;

// Update AnyConcept to include the D parameter
export type AnyConcept =
  | Concept<Record<string, unknown>, Qualities, LoadConcepts>
  | Concept<any, any, any>;

export type Concepts = Record<number, AnyConcept>;

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