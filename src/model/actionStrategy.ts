import { axiumConclude, axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';
import { Action, ActionType, createAction, nullActionType } from './action';
import { OwnershipTicketStub } from './ownership';
import { KeyedSelector } from './selector';

/**
 * ActionNode
 * Control Structure used by ActionStrategy
 *
 * `NOTE` When creating Actions for action. There is no need to pass payload, or strategy parameters,
 *  as ActionStrategy takes care of that behind the scenes.
 *
 * @param action - Action to be dispatched.
 * @param successNode - Upon ActionStrategy.success() the Strategy will update itself to this node.
 * * If set to null, will default to Axium Conclude Type on ActionStrategy.success().
 * @param failureNode - `optional` ActionStrategy.failed() will fire Axium Conclude Type if left blank or set to null.
 * @param payload - `optional` Will set the payload of the action.
 * @param semaphore - `optional` This will prime the action to avoid look up at run time. Best practice use getSemaphore().
 * @param agreement - `optional` Is time in milliseconds of the actions intended lifetime.
 * @param decisionNodes - `optional` The third or more option, may override success or failure in your workflows.
 * @param preposition - `optional` String that prefixes the ActionType when added to the Strategy's ActionList.
 * @param denoter - `optional` String that denotes the end of the ActionList sentence.
 *                               If placed dynamically, allows for the explicit appending of information at the end of the sentence
 * @ExampleSentence ${preposition: 'Via'} Axium set Mode to ${denoter: 'Ownership Mode.'}
 *  @Output Via Axium set Mode to Ownership Mode.
 */

export interface ActionNode {
  action?: Action;
  actionType: ActionType;
  payload?: unknown;
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

export interface ActionNodeOptions {
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

/**
 * Decomposes an action into an ActionNode to be later Recomposed.
 * @param action Action properties of KeyedSelector, Agreement, and Semaphore take priority over options.
 * @param options successNode and failureNodes are always required. If using decisionNodes, set both to null.
 * @returns ActionNode
 */
export function createActionNode(action: Action, options: ActionNodeOptions): ActionNode {
  return {
    actionType: action.type,
    payload: action.payload,
    keyedSelectors: action.keyedSelectors ? action.keyedSelectors : options.keyedSelectors,
    agreement: action.agreement ? action.agreement : options.agreement,
    semaphore: action.semaphore ? action.semaphore : options.semaphore,
    successNode: options.successNode,
    successNotes: options.successNotes,
    failureNode: options.failureNode,
    failureNotes: options.failureNotes,
    decisionNodes: options.decisionNodes,
    decisionNotes: options.decisionNotes,
    lastActionNode: options.lastActionNode
  };
}

/**
 * Will decorate the final Stratimux sentence
 * @preposition - Would append your string.
 * @denoter - Would include some string ending in punctuation.
 */
export interface ActionNotes {
  preposition?: string;
  denoter?: string;
}

/**
 * ActionStrategyParams
 * Interface of ActionStrategy Construction
 * @param data - Payload to be carried throughout the strategy.
 * @param initialNode - Starting point of your ActionStrategy
 */
export interface ActionStrategyParameters {
  topic: string;
  data?: Record<string, unknown>;
  initialNode: ActionNode;
}
export interface ActionStrategy {
  topic: string;
  data?: Record<string, unknown>;
  currentNode: ActionNode;
  actionList: Array<string>;
  puntedStrategy?: ActionStrategy[];
  stubs?: OwnershipTicketStub[];
}

export type ActionStrategyTopic = string;

function isNotPunctuated(str: string): boolean {
  const punctuatedList = ['.', ',', '?', '!', ';'];
  let notPunctuated = true;
  for (const punctuated of punctuatedList) {
    if (str.charAt(0) === punctuated) {
      notPunctuated = false;
      break;
    }
  }
  return notPunctuated;
}

function createSentence(actionNode: ActionNode, actionNotes?: ActionNotes , decisionKey?: string): string {
  const preposition = actionNotes?.preposition ? `${actionNotes.preposition} ` : '';
  const decision = decisionKey ? `${decisionKey} ` : '';
  const body = `${actionNode.actionType}`;
  let denoter = '.';
  if (actionNotes?.denoter) {
    if (isNotPunctuated(actionNotes.denoter)) {
      denoter = ` ${actionNotes.denoter}`;
    } else {
      denoter = actionNotes.denoter;
    }
  }
  return preposition + decision + body + denoter;
}

export function createStrategy(
  params: ActionStrategyParameters,
): ActionStrategy {
  const data: Record<string, unknown> | undefined = params.data;
  const currentNode: ActionNode = params.initialNode;
  currentNode.lastActionNode = {
    // This logically determines that all ActionNodes will have a Action associated.
    action: createAction(nullActionType),
    actionType: nullActionType,
    successNode: null,
    failureNode: null
  };
  const actionList: Array<string> = [params.topic + '.'];
  return {
    topic: params.topic,
    data,
    currentNode,
    actionList,
  };
}

export const strategyBegin = (strategy: ActionStrategy, data?: Record<string, unknown>): Action => {
  strategy.currentNode.action = createAction(
    strategy.currentNode.actionType,
    strategy.currentNode.payload,
    strategy.currentNode.keyedSelectors,
    strategy.currentNode.agreement
  );
  strategy.currentNode.action.strategy = {
    ...strategy,
    topic: strategy.topic,
    data: data ? data : strategy.data,
    currentNode: strategy.currentNode,
    actionList: strategy.actionList,
  };
  if (strategy.currentNode.action !== null) {
    return strategy.currentNode.action;
  } else {
    return axiumConclude();
  }
};

/**
 * strategySuccess(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
export const strategySuccess = (_strategy: ActionStrategy, data?: Record<string, unknown>) => {
  const strategy = {..._strategy};
  let nextAction: Action;
  const actionListEntry = createSentence(
    strategy.currentNode,
    strategy.currentNode?.successNotes,
    strategy.currentNode.successNotes?.preposition !== undefined ? '' : 'Success with'
  );
  if (strategy.currentNode.successNode !== null) {
    const nextNode = strategy.currentNode.successNode;
    nextAction = createAction(
      nextNode.actionType,
      nextNode.payload,
      nextNode.keyedSelectors,
      nextNode.agreement,
      nextNode.semaphore,
    );
    nextNode.action = nextAction;
    nextNode.lastActionNode = strategy.currentNode;
    nextAction.strategy = {
      ...strategy,
      topic: strategy.topic,
      data: data ? data : strategy.data,
      currentNode: nextNode,
      actionList: [...strategy.actionList, actionListEntry],
    };
    return nextAction;
  } else {
    strategy.actionList = [...strategy.actionList, actionListEntry, '\n'];
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      nextStrategy.puntedStrategy = strategy.puntedStrategy;
      const nextEntry = `${nextStrategy.topic}.`;
      nextStrategy.actionList = [
        ...strategy.actionList,
        nextEntry,
      ];

      nextStrategy.stubs = strategy.stubs;
      nextStrategy.currentNode.lastActionNode = strategy.currentNode;
      return strategyBegin(nextStrategy);
    }
    const conclude: ActionNode = {
      actionType: axiumConcludeType,
      successNode: null,
      failureNode: null,
      lastActionNode: strategy.currentNode,
    };
    conclude.action = createAction(conclude.actionType);
    conclude.action.strategy = {
      ...strategy,
      currentNode: conclude,
      data: data ? data : strategy.data
    };
    return conclude.action;
  }
};
/**
 * strategyFailed(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
export function strategyFailed(_strategy: ActionStrategy, data?: Record<string, unknown>) {
  const strategy = {..._strategy};
  let nextAction: Action;
  const actionListEntry = createSentence(
    strategy.currentNode,
    strategy.currentNode.failureNotes,
    strategy.currentNode.failureNotes?.preposition !== undefined ? '' : 'Failed with'
  );
  if (
    strategy.currentNode.failureNode !== null
  ) {
    const nextNode = strategy.currentNode.failureNode;
    nextAction = createAction(
      nextNode.actionType,
      nextNode.payload,
      nextNode.keyedSelectors,
      nextNode.agreement,
      nextNode.semaphore
    );
    nextNode.action = nextAction;
    nextNode.lastActionNode = strategy.currentNode;
    strategy.actionList = [...strategy.actionList, actionListEntry];
    nextAction = { ...nextAction };
    nextAction.strategy = {
      ...strategy,
      topic: strategy.topic,
      data: strategy.data,
      currentNode: nextNode,
      actionList: strategy.actionList,
    };
    return nextAction;
  } else {
    strategy.actionList = [...strategy.actionList, actionListEntry, '\n'];
    if (
      strategy.puntedStrategy !== undefined &&
            strategy.puntedStrategy?.length !== 0
    ) {
      const nextStrategy =
                strategy.puntedStrategy.shift() as ActionStrategy;
      nextStrategy.puntedStrategy = strategy.puntedStrategy;
      const nextEntry = `${nextStrategy.topic}.`;
      nextStrategy.actionList = [
        ...strategy.actionList,
        nextEntry,
      ];

      nextStrategy.stubs = strategy.stubs;
      nextStrategy.currentNode.lastActionNode = strategy.currentNode;
      return strategyBegin(nextStrategy);
    }
    const conclude: ActionNode = {
      actionType: axiumConcludeType,
      successNode: null,
      failureNode: null,
      lastActionNode: strategy.currentNode,
    };
    conclude.action = createAction(conclude.actionType);
    conclude.action.strategy = {
      ...strategy,
      currentNode: conclude,
      data: data ? data : strategy.data
    };
    return conclude.action;
  }
}

/**
 * strategyDecide(strategy: ActionStrategy, index:number, data?: any)
 * Returns the DecisionNode of Index reassigns ActionStrategy to that Action's strategy parameter.
 * If no decisionNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
export const strategyDecide = (
  _strategy: ActionStrategy,
  decideKey: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, unknown>,
) => {
  const strategy = {..._strategy};
  let nextAction: Action;
  const actionListEntry = createSentence(
    strategy.currentNode,
    strategy.currentNode.decisionNotes,
    decideKey
  );

  if (strategy.currentNode.decisionNodes) {
    const decisionNodes = strategy.currentNode.decisionNodes as Record<string, ActionNode>;
    if (
      decisionNodes[decideKey] !== null
    ) {
      const nextNode = decisionNodes[decideKey];
      nextAction = createAction(
        nextNode.actionType,
        nextNode.payload,
        nextNode.keyedSelectors,
        nextNode.agreement,
        nextNode.semaphore
      );
      nextNode.action = nextAction;
      nextNode.lastActionNode = strategy.currentNode;
      strategy.actionList = [...strategy.actionList, actionListEntry];
      nextAction.strategy = {
        ...strategy,
        topic: strategy.topic,
        data: data ? data : strategy.data,
        currentNode: nextNode,
        actionList: strategy.actionList,
      };
      return nextAction;
    }
  }
  strategy.actionList = [...strategy.actionList, actionListEntry, '\n'];
  if (
    strategy.puntedStrategy !== undefined &&
          strategy.puntedStrategy?.length !== 0
  ) {
    const nextStrategy =
              strategy.puntedStrategy.shift() as ActionStrategy;
    nextStrategy.puntedStrategy = strategy.puntedStrategy;
    const nextEntry = `${nextStrategy.topic}.`;
    nextStrategy.actionList = [
      ...strategy.actionList,
      nextEntry,
    ];
    nextStrategy.stubs = strategy.stubs;
    nextStrategy.currentNode.lastActionNode = strategy.currentNode;
    return strategyBegin(nextStrategy);
  }
  const conclude: ActionNode = {
    actionType: axiumConcludeType,
    successNode: null,
    failureNode: null,
    lastActionNode: strategy.currentNode,
  };
  conclude.action = createAction(conclude.actionType);
  conclude.action.strategy = {
    ...strategy,
    currentNode: conclude,
    data: data ? data : strategy.data
  };
  return conclude.action;
};
// Remember Water Boy
export const strategyPunt = (
  puntedStrategy: ActionStrategy,
  newStrategy: ActionStrategy,
) => {
  let puntList: ActionStrategy[] = [];
  if (puntedStrategy.puntedStrategy !== undefined) {
    puntList = [...puntedStrategy.puntedStrategy, puntedStrategy];
  } else {
    puntList.push(puntedStrategy);
  }
  newStrategy.puntedStrategy = puntList;
  return newStrategy;
};

export const strategySequence = (strategies: ActionStrategy[]): ActionStrategy | undefined => {
  if (strategies.length > 0) {
    const first = strategies[0];
    const list = [];
    for (let i = 1; i < strategies.length; i++) {
      list.push(strategies[i]);
    }
    first.puntedStrategy = list;
    return first;
  } else {
    return undefined;
  }
};

export const strategyBackTrack = (_strategy: ActionStrategy): Action => {
  const strategy = _strategy;
  if (strategy.currentNode.lastActionNode?.actionType !== nullActionType) {
    const newNode = strategy.currentNode.lastActionNode as ActionNode;
    if (newNode.action?.strategy?.actionList) {
      newNode.action.strategy.actionList = [
        ...newNode.action.strategy.actionList,
        strategy.actionList[strategy.actionList.length - 1],
      ];
    }
    return newNode.action as Action;
  } else {
    return axiumConclude();
  }
};

/**
 * The main functionality of this helper function is to allow for asynchronous recursion within your strategies.
 *  As the difficulty of working with async code within a node, is that you must use a then operation
 *    This simplifies the process of asynchronously depleting a list until your call the next strategy decision function.
 *      Likewise this should be used within the context of a method, not within a strategy creator function.
 * @param _strategy Target ActionStrategy.
 * @param control A depleting list should be either the payload or data passed into this function to allow this to be halting complete.
 * @param payload If set will set the payload for both action and the newly created ActionNode.
 * @param data If set will set the data on the ActionStrategy attached to the returned action.
 * @returns Action
 */
export const strategyRecurse = (_strategy: ActionStrategy, control: {payload?: unknown, data?: Record<string, unknown>}): Action => {
  const strategy = {
    ..._strategy
  };
  const currentNode = {
    ..._strategy.currentNode
  };
  const action = {
    ...currentNode.action
  } as Action;
  action.payload = control.payload ? control.payload : (_strategy.currentNode.action as Action).payload;
  currentNode.payload = control.payload ? control.payload : _strategy.currentNode.payload;
  currentNode.lastActionNode = _strategy.currentNode;
  strategy.data = control.data ? control.data : _strategy.data;
  strategy.actionList = [
    ...strategy.actionList,
    createSentence(
      _strategy.currentNode,
      _strategy.currentNode.successNotes,
    )
  ];
  currentNode.action = action;
  strategy.currentNode = currentNode;
  action.strategy = strategy;
  return action;
};
