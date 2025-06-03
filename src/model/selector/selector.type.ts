/*<$
For the asynchronous graph programming framework Stratimux, define the Selector Type model file.
This file defines all types necessary for Stratimux Selector functionality.
$>*/
/*<#*/
import { AnyConcept, Concepts } from '../concept/concept.type';
import { DotPath } from '../dotPath';

/**
 * Will have such be a list of state keys separated by spaces until someone yells at me to change this.
 */
export type SelectorFunction<T = void> = (obj: Record<string, unknown>) => T extends void ? unknown : T | undefined;
export type KeyedSelector<T = void> = {
  conceptName: string,
  conceptSemaphore: number,
  keys: string,
  select: () => T,
  _selector: SelectorFunction<T>,
  setKeys?: (number | string)[]
  setSelector?: SelectorFunction
};

export type KeyedSelectors<S = void> = {
  [K in keyof S]: S[K] extends KeyedSelector<void> ?
  KeyedSelector<void>
  :
  KeyedSelector<S[K]>
};

export type CreateBufferedMuxifiedKeyedSelector = <T = void> (semaphore: number) =>
  MuxifiedKeyedSelector<T>;

export type MuxifiedKeyedSelector<T = void> = (
  concepts: Concepts,
  keys: DotPath<T extends Record<string, unknown> ? T : Record<string, unknown>>,
  setKeys?: (number | string)[]
) => KeyedSelector | undefined;

export type StateValidator<S = void> = S extends Record<string, unknown> ? S : Record<string, unknown>;
export type CreateBufferedStateSelector = <S = void>(semaphore: number) =>
  StateSelector<S>;
export type StateSelector<S = void> = (concepts: Concepts) => StateValidator<S> | undefined;

export type CreateBufferedConceptSelector = (semaphore: number) =>
  ConceptSelector;
export type ConceptSelector = <C extends AnyConcept>(concepts: Concepts) => C | undefined;

export type MuxifiedNameSelector = (concepts: Concepts) => string | undefined;
export type CreateBufferedMuxifiedNameSelector = (semaphore: number) => MuxifiedNameSelector;

// export type Selectors<S = void, C = void> = {
export type Selectors<S = void> = {
  createSelector: MuxifiedKeyedSelector<S>,
  getState: StateSelector<S>,
  getName: MuxifiedNameSelector
  getConcept: ConceptSelector
}

export type BundledSelectors<S = void> = KeyedSelectors<S> & Selectors<S>
/*#>*/