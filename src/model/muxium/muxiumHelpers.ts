/*<$
For the asynchronous graph programming framework Stratimux, define the Muxium Helper model file.
This file defines the necessary helper functions to aid in the management of a Muxium.
$>*/
/*<#*/
import {
  Concepts,
  LoadConcepts,
} from '../concept/concept.type';
import {
  MuxiumDeck,
  MuxiumState,
} from '../../concepts/muxium/muxium.concept';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { MuxiumLoad } from './muxium.type';



export const tailWhip = <Q, C extends LoadConcepts>(muxiumState: MuxiumState<Q, C>) => {
  if (muxiumState.tailTimer.length === 0) {
    muxiumState.tailTimer.push(setTimeout(() => {
      muxiumState.action$.next(createAction('Kick Muxium'));
    }, 3));
  }
};

export const createOrigin = (location: unknown[]): string => {
  let origin = '';
  let addSign = false;
  location.forEach(l => {
    if (addSign) {
      origin += '+' + l;
    } else {
      origin += l;
      addSign = true;
    }
  });
  return origin;
};

export const HandleOrigin = <Q, C extends LoadConcepts>(state: MuxiumState<Q, C>, action: Action) => {
  const {
    body,
    tail
  } = state;
  let found = false;
  for (const [i, a] of body.entries()) {
    if (a.origin && a.origin === action.origin) {
      body[i] = action;
      found = true;
      break;
    }
  }
  if (!found) {
    for (const [i, a] of tail.entries()) {
      if (a.origin && a.origin === action.origin) {
        body[i] = action;
        found = true;
        break;
      }
    }
  }

  if (!found) {
    body.push(action);
  }
  tailWhip(state);
};

export const HandleHardOrigin = <Q, C extends LoadConcepts>(state: MuxiumState<Q, C>, action: Action) => {
  // Fill Bucket
  // Empty Bucket
  // Issue is I need to remove all origins and replace with hard overriding action at the earliest slot
  const {
    body,
    tail
  } = state;
  let found = false;
  const origin = action.origin?.split('+')[0];
  for (const [i, a] of body.entries()) {
    const aOrigin = a.origin?.split('+')[0];
    if (aOrigin !== undefined && aOrigin === origin) {
      body[i] = action;
      found = true;
      break;
    }
  }
  if (!found) {
    for (const [i, a] of tail.entries()) {
      const aOrigin = a.origin?.split('+')[0];
      if (aOrigin !== undefined && aOrigin === action.origin) {
        body[i] = action;
        found = true;
        break;
      }
    }
  }

  if (!found) {
    body.push(action);
  }
  tailWhip(state);
};

export const getMuxiumState = <Q = void, C = void>(concepts: Concepts) =>
  (concepts[0].state as MuxiumState<Q extends void ? MuxiumQualities : Q, C extends LoadConcepts ? C : MuxiumDeck >);

export const accessMuxium = (concepts: Concepts) => (getMuxiumState(concepts).deck.d.muxium);

export const isMuxiumOpen = (concepts: Concepts) => ((concepts[0].state as MuxiumState<MuxiumQualities, MuxiumLoad<any>>).open);
type SelectorFunction<T = void> = (obj: Record<string, unknown>) => T extends void ? unknown : T | undefined;
type KeyedSelector<T = void> = {
  conceptName: string,
  conceptSemaphore: number,
  keys: string,
  select: () => T,
  _selector: SelectorFunction<T>,
  setKeys?: (number | string)[]
  setSelector?: SelectorFunction
};
interface ActionNotes {
  preposition?: string;
  denoter?: string;
}
type ActionType = string;
interface ActionNode {
  action?: Action<unknown>;
  actionType: ActionType;
  payload?: Record<string, unknown>;
  conceptSemaphore?: number;
  priority?: number;
  keyedSelectors?: KeyedSelector[];
  semaphore?: [number, number, number, number];
  agreement?: number;
  decisionNodes?: Record<string, ActionNode>;
  decisionNotes?: ActionNotes;
  successNode: ActionNode | null;
  successNotes?: ActionNotes;
  failureNode: ActionNode | null;
  failureNotes?: ActionNotes;
  lastActionNode?: ActionNode;
}
type OwnershipTicketStub = {
  key: string,
  ticket: string,
}
interface ActionStrategy {
  topic: string;
  data?: Record<string, unknown>;
  currentNode: ActionNode;
  actionList: Array<string>;
  puntedStrategy?: ActionStrategy[];
  stubs?: OwnershipTicketStub[];
  priority?: number;
  step?: number;
}
type Action<T = void> = {
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
type ActionOptions = {
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

type ActionWithPayloadOptions<T = void> = {
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
const nullActionType: ActionType = 'null';
// These need to be logical determined ahead of time.
//   Logical determinations such as these will be determined in the future via generation over hand placement.
const muxiumConcludeType: ActionType = 'Conclude';
const muxiumBadActionType: ActionType = 'Muxium received a Bad Action';
const muxiumSetBlockingModeType: ActionType = 'set Muxium to Blocking Mode';
function getSpecialSemaphore(type: ActionType) {
  switch (type) {
  case muxiumBadActionType: {
    return 1;
  }
  case nullActionType: {
    return 2;
  }
  case muxiumConcludeType: {
    return 3;
  }
  case muxiumSetBlockingModeType: {
    return 4;
  }
  // case muxiumOpenType: {
  //   return 5;
  // }
  default: {
    return 0;
  }
  }
}
function generateQualityIdentity(): number {
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
function createAction<T = void>(
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
      identity: options.identity ? options.identity : generateQualityIdentity(),
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
      identity: generateQualityIdentity(),
      semaphore,
      expiration: Date.now() + 5000,
      payload: {} as T extends Record<string, unknown> ? T : undefined
    };
  }
}

export function muxiumPrepareActionCreator(
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
/*#>*/