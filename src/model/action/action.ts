/*<$
For the asynchronous graph programming framework Stratimux, define the Action model file.
This file dictates the functionality of Actions within Stratimux.
$>*/
/*<#*/
import { Concepts, LoadConcepts } from '../concept/concept';
import { MuxiumState } from '../../concepts/muxium/muxium.concept';
import { failureConditions, strategyData_appendFailure } from './actionStrategyData';
import { MuxiumBadActionPayload, MuxiumQualities } from '../../concepts/muxium/qualities';
import { Action, ActionCreatorWithPayload, ActionOptions, ActionType, ActionWithPayloadOptions } from './action.type';
import { getSemaphore, getSpecialSemaphore } from './actionSemaphore';

export const nullActionType: ActionType = 'null';
// These need to be logical determined ahead of time.
//   Logical determinations such as these will be determined in the future via generation over hand placement.
const muxiumBadActionType: ActionType = 'Muxium received a Bad Action';

const createPayload = <T extends Record<string, unknown>>(payload: T) => payload;

export function primeAction<T>(concepts: Concepts, action: Action<T>): Action<T> {
  const expired = action.expiration < Date.now();
  let semaphore: [number, number, number, number] = [-1, -1, -1, -1];
  if (!expired) {
    if (action.conceptSemaphore) {
      semaphore = getSemaphore(concepts, concepts[action.conceptSemaphore].name, action.type);
    } else {
      const conceptKeys = Object.keys(concepts);
      for (const i of conceptKeys) {
        const index = Number(i);
        semaphore = getSemaphore(concepts, concepts[index].name, action.type);
        if (semaphore[2] !== -1 && action.expiration) {
          break;
        }
      }
    }
  }
  if (semaphore[2] !== -1 && action.expiration) {
    let muxium;
    if (action.muxium) {
      muxium = action.muxium;
    } else {
      muxium = (concepts[0].state as MuxiumState<MuxiumQualities, LoadConcepts>).name;
    }
    const newAction = {
      ...action,
      semaphore: semaphore,
      muxium,
    } as Action<T>;
    if (newAction.strategy) {
      newAction.strategy.currentNode.action = newAction;
    }
    return newAction;
  }
  const badAction: Action<MuxiumBadActionPayload> = {
    type: muxiumBadActionType,
    payload: createPayload<MuxiumBadActionPayload>({badActions: [action]}),
    expiration: Date.now() + 5000,
    semaphore: getSemaphore(concepts, concepts[0].name, muxiumBadActionType)
  };
  if (action.strategy) {
    badAction.strategy = action.strategy;
    badAction.strategy.currentNode.action = badAction as Action<any>;
    if (expired) {
      badAction.strategy.data = strategyData_appendFailure(badAction.strategy, failureConditions.muxiumExpired);
    } else {
      badAction.strategy.data = strategyData_appendFailure(badAction.strategy, failureConditions.muxiumBadGeneration);
    }
  }
  return badAction as Action<any>;
}

/**
 * @param action A previously created action.
 * @returns Returns a newly recomposed Action with a updated expiration, takes into account agreement if present.
 */
export const refreshAction = (action: Action): Action => {
  const newAction = {
    ...action,
  };
  if (newAction.agreement) {
    newAction.expiration = Date.now() + newAction.agreement;
  } else {
    newAction.expiration = Date.now() + 5000;
  }
  return newAction;
};

export function createAction<T = void>(
  type: ActionType,
  options?: ActionWithPayloadOptions<T>,
): Action<T> {
  const special = getSpecialSemaphore(type);

  const semaphore = options?.semaphore !== undefined ? options.semaphore : [0, 0, -1, special] as [number, number, number, number];
  if (options) {
    const {
      payload,
      keyedSelectors,
      agreement,
      conceptSemaphore,
      priority,
      origin
    } = options;
    return {
      type,
      semaphore: options.semaphore ? options.semaphore : semaphore,
      payload: (payload ? payload  : {}) as T extends Record<string, unknown> ? T : undefined,
      keyedSelectors,
      agreement,
      expiration: Date.now() + (agreement !== undefined ? agreement : 5000),
      conceptSemaphore,
      priority,
      origin
    };
  } else {
    return {
      type,
      semaphore,
      expiration: Date.now() + 5000,
      payload: {} as T extends Record<string, unknown> ? T : undefined
    };
  }
}

export function prepareActionCreator(
  actionType: ActionType,
  actionSemaphoreBucket: [number, number, number, number][]
) {
  return (
    options?: ActionOptions
  ) => {
    if (options) {
      return createAction(actionType,
        {
          ...options,
          semaphore: actionSemaphoreBucket[0] ? actionSemaphoreBucket[0] : [-1, -1, -1, -1]
        }
      );
    }
    return createAction(
      actionType, {
        semaphore: actionSemaphoreBucket[0] ? actionSemaphoreBucket[0] : [-1, -1, -1, -1]
      }
    );
  };
}

export function prepareActionWithPayloadCreator<T extends Record<string, unknown>>(
  actionType: ActionType,
  actionSemaphoreBucket: [number, number, number, number][]
): ActionCreatorWithPayload<T> {
  return (
    payload: T,
    options?: ActionOptions
  ): Action<T> => {
    const opt: ActionWithPayloadOptions<T> = {
      ...options,
      payload: payload as T extends Record<string, unknown> ? T : undefined
    };
    return createAction<T>(
      actionType,
      {
        ...opt,
        semaphore: actionSemaphoreBucket[0] ? actionSemaphoreBucket[0] : [-1, -1, -1, -1]
      }
    );
  };
}

/*#>*/