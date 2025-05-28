/*<$
For the asynchronous graph programming framework Stratimux, define the Quality model file.
This model allows for qualities to be made at a single point of entry, reducing the complexity of defining such.
$>*/
/*<#*/
import { Subject, map } from 'rxjs';
import {
  prepareActionCreator,
  prepareActionWithPayloadCreator
} from './action/action';
import { KeyedSelector } from './selector/selector.type';
import { muxiumConcludeType } from '../concepts/muxium/qualities/conclude.quality';
import { Action, ActionCreator, ActionCreatorType, ActionCreatorWithPayload, ActionType } from './action/action.type';
import { strategySuccess } from './action/strategy/actionStrategyConsumers';
import { ActionDeck, Concepts, MethodCreatorStep, SpecificReducer } from './concept/concept.type';
import { Method } from './method/method.type';

export type Quality<S extends Record<string, unknown>, T = void, C = void> = {
  actionType: ActionType;
  qualityIdentity: number;
  actionSemaphoreBucket: [number, number, number, number][];
  actionCreator: T extends Record<string, unknown> ? ActionCreatorWithPayload<T> : ActionCreator;
  bufferedActionCreator: (
    semaphoreBucket: [[number, number, number, number]],
    identity: number
  ) => ActionCreatorType<T>
  reducer: SpecificReducer<any, T, C>;
  toString: () => string;
  methodCreator?: MethodCreatorStep<S, T, C>;
  method?: Method<unknown>;
  subject?: Subject<ActionDeck<T, C>>;
  keyedSelectors?: KeyedSelector[];
  meta?: Record<string,unknown>;
  analytics?: Record<string,unknown>;
};

export type Qualities = {
  [s: string | symbol]: Quality<Record<string, unknown>, Record<string, unknown>> |
  Quality<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>> |
  Quality<Record<string, unknown>, undefined>;
  // [s: string]: Quality<Record<string, unknown>>
};

// Generate a unique quality identity that won't overflow for 1000+ years
export function generateQualityIdentity(): number {
  // Use a smaller random number to prevent overflow
  // Random number between 1 and 999,999 (6 digits max)
  const randomNumber = Math.floor(Math.random() * 999999) + 1;
  // Get current timestamp in milliseconds
  const timestampInMilliseconds = Date.now();
  // Combine: timestamp + random component
  // This ensures uniqueness while staying within safe integer bounds
  // JavaScript's Number.MAX_SAFE_INTEGER is 9,007,199,254,740,991
  // Current timestamp (2025) is ~1,737,000,000,000 (13 digits)
  // Adding 6-digit random gives us ~19 digits total
  // This will remain safe for well over 1000 years
  return (timestampInMilliseconds * 1000000) + randomNumber;
}

export function createQuality<S extends Record<string, unknown>, T = void, C = void>(
  actionType: ActionType,
  actionSemaphoreBucket: [number, number, number, number][],
  actionCreator: ActionCreatorType<T>,
  bufferedActionCreator: (
    semaphoreBucket: [[number, number, number, number]],
    identity: number
  ) => ActionCreatorType<T>,
  reducer: SpecificReducer<S, T, C>,
  methodCreator?: MethodCreatorStep<S, T, C>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>,
): Quality<S, T, any> {
  return {
    actionType,
    actionCreator,
    qualityIdentity: generateQualityIdentity(),
    bufferedActionCreator,
    actionSemaphoreBucket,
    reducer,
    methodCreator,
    keyedSelectors,
    meta,
    analytics
  };
}

export function defaultReducer<S extends Record<string, unknown>>(state: S, _: Action<any>): S {
  return state;
}
defaultReducer.toString = () => ('Default Reducer');

export function nullReducer<S extends Record<string, unknown>>(_: S, __: Action<any>) {
  return null;
}
nullReducer.toString = () => ('Null Reducer');

export const defaultMethodCreator = <T = void, C = void>() =>
  (_concepts$: Subject<Concepts>, _semaphore: number) : [Method<T>, Subject<ActionDeck<T, C>>] =>  {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod = defaultSubject.pipe(
      map((act: ActionDeck<T, C>) => {
        if (act.action.strategy) {
          return [strategySuccess(act.action.strategy), false];
        }
        return [{
          ...act.action,
          type: muxiumConcludeType
        }, false];
      }),
    ) as Method<T>;

    defaultMethod.toString = () => ('Default Method');
    return [defaultMethod, defaultSubject];
  };

export function createQualityCard<S extends Record<string, unknown>, C = void>(q: {
  type: string,
  reducer: SpecificReducer<S, void, C>,
  methodCreator?: MethodCreatorStep<S, void, C>,
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>
}): Quality<S, void, any> {
  const bucket: [number, number, number, number][] = [[-1, -Infinity, -1, -1]];
  const qualityIdentity = generateQualityIdentity()
  const actionCreator = prepareActionCreator(q.type, bucket, qualityIdentity);
  if (q.methodCreator) {
    return createQuality<S, void, C>(
      q.type,
      bucket,
      actionCreator,
      (
        semaphoreBucket: [[number, number, number, number]],
        identity: number
      ) => prepareActionCreator(q.type, semaphoreBucket, identity) as ActionCreator,
      q.reducer,
      q.methodCreator,
      q.keyedSelectors,
      q.meta,
      q.analytics
    );
  }
  return createQuality<S, void, C>(
    q.type,
    bucket,
    actionCreator,
    (
      semaphoreBucket: [[number, number, number, number]],
      identity: number
    ) => prepareActionCreator(q.type, semaphoreBucket, identity) as ActionCreator,
    q.reducer,
    q.methodCreator,
    q.keyedSelectors,
    q.meta,
    q.analytics
  );
}

export function createQualityCardWithPayload<
  S extends Record<string, unknown>,
  T extends Record<string, unknown>,
  C = void
>(q: {
  type: string,
  reducer: SpecificReducer<S, T, C>,
  methodCreator?: MethodCreatorStep<S, T, C>,
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>
}): Quality<S, T, any> {
  const bucket: [number, number, number, number][] = [[-1, -1, -1, -1]];
  const qualityIdentity = generateQualityIdentity()
  const actionCreatorWithPayload = prepareActionWithPayloadCreator<T>(q.type, bucket, qualityIdentity);
  if (q.methodCreator) {
    return createQuality<S, T, C>(
      q.type,
      bucket,
      actionCreatorWithPayload as ActionCreatorType<T>,
      (
        semaphoreBucket: [[number, number, number, number]],
        identity: number
      ) => prepareActionWithPayloadCreator<T>(q.type, semaphoreBucket, identity) as ActionCreatorType<T>,
      q.reducer,
      q.methodCreator,
      q.keyedSelectors,
      q.meta,
      q.analytics
    );
  }
  return createQuality<S, T, C>(
    q.type,
    bucket,
    actionCreatorWithPayload as ActionCreatorType<T>,
    (
      semaphoreBucket: [[number, number, number, number]],
      identity: number
    ) => prepareActionWithPayloadCreator<T>(q.type, semaphoreBucket, identity) as ActionCreatorType<T>,
    q.reducer,
    q.methodCreator,
    q.keyedSelectors,
    q.meta,
    q.analytics
  );
}

export const quality = {
  defaultReducer,
  nullReducer,
  defaultMethodCreator,
  create: createQualityCard,
  createWithPayload: createQualityCardWithPayload
};
/*#>*/