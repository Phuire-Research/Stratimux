/*<$
For the asynchronous graph programming framework Stratimux, define the Action Type model file.
This file defines the types used for Stratimux Actions
$>*/
/*<#*/
import { KeyedSelector } from '../selector/selector.type';
import { Quality } from '../quality';
import { ActionStrategy } from './strategy/actionStrategy.type';

export const nullActionType: ActionType = 'null';

export type ActionType = string;
export type Action<T = void> = {
    type: ActionType;
    identity: number;
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

export type AnyAction = {
    type: ActionType;
    identity: number;
    semaphore: [number, number, number, number];
    conceptSemaphore?: number;
    payload: any;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration: number;
    priority?: number;
    muxium?: string;
    origin?: string;
}

export type ActionCreatorType<T = void> =
  T extends Record<string, unknown> ?
    ActionCreatorWithPayload<T> :
    ActionCreator;

export type Actions<T = void> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends Quality<Record<string, unknown>, any, any> ?
    T[K]['actionCreator'] : ActionCreator;
};

export type ActionCreator = (
  options?: ActionOptions
) => Action;

export type ActionCreatorWithPayload<T extends Record<string, unknown>> = (
  payload: T,
  options?: ActionWithPayloadOptions<T>
) => Action<T>;

export type ActionOptions = {
    semaphore?: [number, number, number, number];
    identity?: number;
    conceptSemaphore?: number;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration?: number;
    priority?: number;
    muxium?: string;
    origin?: string;
};

export type ActionWithPayloadOptions<T = void> = {
    semaphore?: [number, number, number, number];
    identity?: number;
    conceptSemaphore?: number;
    payload?: T extends Record<string, unknown> ? T : undefined;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration?: number;
    priority?: number;
    muxium?: string;
    origin?: string;
};
/*#>*/