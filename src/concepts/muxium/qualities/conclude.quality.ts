/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a quality that will conclude a strategy.
This is the primary quality that allows for Stratimux to be provably terminating and/or halting complete.
Functionally. This is a pure action with no method or reducer. That will instead activate its functionality
within each qualities method if specified. As well as ownership if loaded in the Muxium's concept set.
$>*/
/*<#*/

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
export type ActionType = string;
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
export const muxiumConcludeType: ActionType = 'Muxium Conclude';
const muxiumBadActionType: ActionType = 'Muxium Bad Action';
const muxiumSetBlockingModeType: ActionType = 'Muxium Set Blocking Mode';
export function getSpecialSemaphore(type: ActionType) {
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

/**
 * muxiumConcludeType
 * This is a special Quality that does not have a Reducer or Method
 * Instead what this allows for is special functionality within the Muxium and Ownership Concepts
 * Is used for appending ActionList to Dialog
 * And used to clear Ownership of its Previous ActionNode and is handled by ActionStrategy
 * This should not be used Directly
 */
export const muxiumConclude = muxiumPrepareActionCreator(
  muxiumConcludeType,
  [[-1, -1, -1, getSpecialSemaphore(muxiumConcludeType)]]
);
/*#>*/