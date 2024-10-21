/*<$
For the asynchronous graph programming framework Stratimux, define the Method Type model file.
This file holds the type definitions required for the method helper functions.
$>*/
/*<#*/
import { Observable, Subject, map, switchMap, withLatestFrom } from 'rxjs';
import { ActionStrategy } from '../action/strategy/actionStrategy.type';
import { KeyedSelector } from '../selector';
import { Deck } from '../deck';
import { ActionCreator, ActionCreatorWithPayload } from '../action/action.type';
import { Concepts, MethodCreator } from '../concept';
import { ActionController } from '../action/actionController';

type ActionType = string;
type Action<T = void> = {
  type: ActionType;
  semaphore: [number, number, number, number];
  conceptSemaphore?: number;
  payload: T extends Record<string, unknown> ? T : undefined;
  strategy?: ActionStrategy;
  keyedSelectors?: KeyedSelector[];
  agreement?: number;
  expiration: number;
  priority?: number;
  muxium?: string;
  origin?: string;
};
export type Method<T = void> = Observable<[Action<T>, boolean]> & {toString: () => string};

export type MethodParams<T = void, C = void> = {
  action: Action<T>, deck: Deck<C>, self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}

export type MethodCreatorBase = <S extends Record<string, unknown>, T = void, C = void>(
  method: (params: MethodParams<T,C>) => Action<any>
) => MethodCreator<S, T, C>;

export type MethodWithStateParams<S extends Record<string, unknown>, T = void, C = void> = {
  action: Action<T>, state: S, deck: Deck<C>, self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}

export type MethodCreatorBaseWithState = <S extends Record<string, unknown>, T = void, C = void>(
  methodWithState: (params: MethodWithStateParams<S,T,C>) => Action<any>,
) => MethodCreator<S, T, C>;

export type MethodWithConceptsParams<T = void, C = void> = {
  action: Action<T>,
  concepts_: Concepts,
  semaphore: number,
  deck: Deck<C>, self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}

export type MethodCreatorBaseWithConcepts = <S extends Record<string, unknown>, T = void, C = void>(
  methodWithConcepts: (params: MethodWithConceptsParams<T,C>) => Action<any>,
) => MethodCreator<S, T, C>;

export type MethodAsyncParams<T = void, C = void> = {
  action: Action<T>, controller: ActionController, deck: Deck<C>, self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}
export type MethodCreatorAsync = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethod: (params: MethodAsyncParams<T,C>) => void
) => MethodCreator<S, T, C>;

export type MethodAsyncWithStateParams<S extends Record<string, unknown>, T = void, C = void> = {
  action: Action<T>,
  state: S,
  deck: Deck<C>,
  controller: ActionController,
  self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}

export type MethodCreatorAsyncWithState = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithState: (params: MethodAsyncWithStateParams<S, T, C>) => void,
) => MethodCreator<S, T, any>;

export type MethodCreatorAsyncDebounce = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethod: (params: MethodAsyncParams<T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodCreatorAsyncDebounceWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithConcepts: (params: MethodAsyncWithConceptsParams<T,C>) => void,
  duration: number,
) => MethodCreator<S, T, any>;

export type MethodCreatorAsyncDebounceWithState = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithState: (params: MethodAsyncWithStateParams<S,T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodCreatorBaseThrottle = <S extends Record<string, unknown>, T = void, C = void>(
  method: (params: MethodParams<T,C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodCreatorBaseThrottleWithState = <S extends Record<string, unknown>, T = void, C = void>(
  methodWithState: (params: MethodWithStateParams<S,T,C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodCreatorAsyncThrottle = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethod: (params: MethodAsyncParams<T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodCreatorAsyncThrottleWithState = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithState: (params: MethodAsyncWithStateParams<S,T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodAsyncWithConceptsParams<T = void, C = void> = {
  action: Action<T>,
  controller: ActionController,
  concepts_: Concepts,
  semaphore: number,
  deck: Deck<C>, self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}

export type MethodCreatorAsyncWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithConcepts: (params: MethodAsyncWithConceptsParams<T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodCreatorBaseThrottleWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  methodWithConcepts: (params: MethodWithConceptsParams<T,C>) => Action,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodCreatorAsyncThrottleWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithConcepts: (params: MethodAsyncWithConceptsParams<T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodCreatorBaseDebounce = <S extends Record<string, unknown>, T = void, C = void>(
  method: (params: MethodParams<T,C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodCreatorBaseDebounceWithState = <S extends Record<string, unknown>, T = void, C = void>(
  methodWithState: (params: MethodWithStateParams<S, T, C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, any>;

export type MethodCreatorBaseDebounceWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  methodWithConcepts: (params: MethodWithConceptsParams<T,C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, any>;

/*#>*/