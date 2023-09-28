/* eslint-disable max-depth */
import { Action, createAction, getSemaphore, primeAction } from '../model/action';
import { OwnershipState, ownershipName } from '../concepts/ownership/ownership.concept';
import { Concept } from './concept';
import { selectState } from './selector';
import { axiumBadActionType } from '../concepts/axium/qualities/badAction.quality';
import { nullActionType } from './actionStrategy';
import { ownershipBackTrackType } from '../concepts/ownership/qualities/backTrack.quality';
// Define Ownership Here
// As the Basis of anything Within Model Directory is that Such Enables the Concepts to Function as Intended
// AKA Concept Model

// Register

// Unregister

export type OwnershipLedger = Map<string, OwnershipTicket[]>;

export type OwnershipTicket = {
  ticket: number;
  // new Date().now() + Agreement
  expiration: number;
}

export type OwnershipTicketStub = {
  key: string,
  ticket: number,
}

export const createOwnershipLedger = (): OwnershipLedger => ( new Map<string, OwnershipTicket[]>());

export const ownershipShouldBlock = (concepts: Concept[], action: Action): boolean => {
  const qualityKeys = concepts[action.semaphore[0]].qualities[action.semaphore[1]].keyedSelectors;
  const actionSelectors = action.keyedSelectors;
  const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  let shouldBlock = false;
  // console.log('Action', action, qualityKeys, ownershipLedger);
  if (qualityKeys) {
    for (let i = 0; i < qualityKeys.length; i++) {
      if (ownershipLedger.has(`${qualityKeys[i].conceptName} ${qualityKeys[i].stateKeys}`)) {
        shouldBlock = true;
        break;
      }
    }
  } else if (actionSelectors) {
    for (let i = 0; i < actionSelectors.length; i++) {
      if (ownershipLedger.has(`${actionSelectors[i].conceptName} ${actionSelectors[i].stateKeys}`)) {
        shouldBlock = true;
        break;
      }
    }
  }
  // console.log('Should Block', shouldBlock);
  return shouldBlock;
};

export const clearStubs = (concepts: Concept[], action: Action): Concept[] => {
  const newConcepts = concepts;
  const ownershipState = selectState<OwnershipState>(newConcepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  if (action.type !== nullActionType && ownershipLedger) {
    if (action.stubs) {
      action.stubs.forEach(ticketStub => {
        const line = ownershipLedger.get(ticketStub.key);
        // console.log('Start Clear', line);
        if (line) {
          const newLine = [] as OwnershipTicket[];
          for (const stub of line) {
            if (stub.ticket !== ticketStub.ticket) {
              newLine.push(stub);
            }
          }
          // console.log('Check new line', newLine);
          if (newLine.length === 0) {
            ownershipLedger.delete(ticketStub.key);
          } else {
            ownershipLedger.set(ticketStub.key, newLine);
          }
        }
      });
    }
    if (action.strategy) {
      const nextAction = action.strategy.currentNode.lastActionNode?.action;
      if (nextAction && nextAction.type !== nullActionType) {
        return clearStubs(newConcepts, nextAction);
      }
    }
  }
  return newConcepts;
};

export const editStubs = (_concepts: Concept[], oldAction: Action, newAction: Action): [Concept[], Action] => {
  const concepts = _concepts;
  newAction.stubs = [];
  const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  if (oldAction.stubs) {
    oldAction.stubs.forEach((ticketStub) => {
      const line = ownershipLedger.get(ticketStub.key);
      if (line) {
        for (const stub of line) {
          if (stub.ticket === ticketStub.ticket) {
            stub.expiration = newAction.expiration;
            newAction.stubs?.push({
              key: ticketStub.key,
              ticket: stub.ticket
            });
          }
        }
      }
    });
  }
  return [concepts, newAction];
};

export const checkIn =
(concepts: Concept[], action: Action): [Concept[], Action] => {
  const newConcepts = concepts;
  const ownershipState = selectState<OwnershipState>(newConcepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  action.stubs = [] as OwnershipTicketStub[];
  action.keyedSelectors?.forEach(keyed => {
    const key = `${keyed.conceptName} ${keyed.stateKeys}`;
    const entry = ownershipLedger.get(key);
    const expiration = action.expiration;
    const newTicketStub = {
      key,
      ticket: ownershipState.ticker,
      expiration
    };
    const newTicket = {
      ticket: ownershipState.ticker,
      expiration
    };
    ownershipState.ticker += 1;
    action.stubs?.push(newTicketStub);
    if (entry) {
      entry.push(newTicket);
    } else {
      ownershipLedger.set(key, [newTicket]);
    }
  });
  return  [
    newConcepts,
    action
  ];
};

export const isActionReady = (concepts: Concept[], _action: Action): [Concept[], Action | undefined] => {
  if (_action.semaphore[2] !== -1 && _action.type !== axiumBadActionType) {
    const action = _action;
    const stubs = action.stubs;
    if (stubs) {
      return stubAction(concepts, action);
    } else {
      return qualityAction(concepts, action);
    }
  } else if (_action.type !== axiumBadActionType) {
    const action = primeAction(concepts, _action);
    return isActionReady(concepts, action);
  } else {
    const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
    const cleanUp = [] as Action[];
    ownershipState.pendingActions = ownershipState.pendingActions.filter(
      (atn) => {
        if (_action.type !== atn.type) {
          return true;
        } else {
          cleanUp.push(atn);
          return false;
        }
      }
    );
    _action.payload = cleanUp;
    return [concepts, _action];
  }
};

const stubAction = (concepts: Concept[], _action: Action): [Concept[], Action | undefined] => {
  const action = _action;
  const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  const stubs = action.stubs as OwnershipTicketStub[];
  let finalReturn: [Concept[], Action | undefined] = [concepts, action];
  let frontOfAllLines = true;
  let expired = false;
  for (const stub of stubs) {
    if (action.expiration < Date.now()) {
      expired = true;
      break;
    }
    const positions = ownershipLedger.get(stub.key);
    if (positions) {
      for (const [i, pos] of positions.entries()) {
        if (i === 0 && pos.ticket >= stub.ticket) {
          continue;
        } else {
          frontOfAllLines = false;
          break;
        }
      }
    }
  }
  if (expired) {
    for (const stub of stubs) {
      const positions = ownershipLedger.get(stub.key);
      if (positions) {
        const newLine = positions.filter(pos => pos.ticket !== stub.ticket);
        if (newLine.length > 0) {
          ownershipLedger.set(stub.key, newLine);
        } else {
          ownershipLedger.delete(stub.key);
        }
      }
    }
    finalReturn = [concepts, createAction(axiumBadActionType, action)];
  } else if (frontOfAllLines) {
    for (const stub of stubs) {
      const line = ownershipLedger.get(stub.key);
      if (line) {
        const newLine = line;
        newLine.shift();
        if (newLine.length > 0) {
          ownershipLedger.set(stub.key, newLine);
        } else {
          ownershipLedger.delete(stub.key);
        }
      }
    }
    finalReturn = [concepts, action];
  } else {
    finalReturn = [concepts, undefined];
  }
  return finalReturn;
};

const qualityAction = (concepts: Concept[], _action: Action): [Concept[], Action | undefined] => {
  const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  const ownershipLedger = ownershipState.ownershipLedger;
  const action = _action;
  const qualitySelectors = concepts[action.semaphore[0]].qualities[action.semaphore[1]].keyedSelectors;
  let readyToGo = true;
  if (action.strategy) {
    if (action.strategy.currentNode.lastActionNode?.action) {
      const prevAction = action.strategy.currentNode.lastActionNode?.action;
      let frontOfAllLines = true;
      let expired = false;
      // console.log('HIT', prevAction);
      if (prevAction.stubs) {
        // console.log('Check quality action', prevAction)
        for (const stub of prevAction.stubs) {
          if (action.expiration < Date.now()) {
            expired = true;
            break;
          }
          const positions = ownershipLedger.get(stub.key);
          if (positions) {
            for (const [i, pos] of positions.entries()) {
              if (i === 0 && pos.ticket >= stub.ticket) {
                continue;
              } else {
                frontOfAllLines = false;
                break;
              }
            }
          }
        }
        if (expired) {
          for (const stub of prevAction.stubs) {
            const positions = ownershipLedger.get(stub.key);
            if (positions) {
              const newLine = positions.filter(pos => pos.ticket !== stub.ticket);
              if (newLine.length > 0) {
                ownershipLedger.set(stub.key, newLine);
              } else {
                ownershipLedger.delete(stub.key);
              }
            }
          }
          return [concepts, createAction(axiumBadActionType, action)];
        }
        if (frontOfAllLines) {
          return [concepts, action];
        }
      }
    }
  } else if (qualitySelectors) {
    for (const selector of qualitySelectors) {
      const key = `${selector.conceptName} ${selector.stateKeys}`;
      if (ownershipLedger.get(key)) {
        readyToGo = false;
        break;
      }
    }
    if (readyToGo) {
      return [concepts, action];
    }
  }
  return [concepts, undefined];
};

export const areEqual = (first: Action, second: Action ) => {
  let equal = false;
  if (first.strategy === undefined && second.strategy === undefined) {
    if (first.type === second.type) {
      if (first.payload === undefined && second.payload === undefined) {
        equal = true;
      }
      equal = JSON.stringify(first.payload) === JSON.stringify(second.payload);
    }
    equal = false;
  } else if (first.strategy?.topic === second.strategy?.topic) {
    if (first.type === second.type) {
      if (first.payload === undefined && second.payload === undefined) {
        equal = true;
      }
      equal = JSON.stringify(first.payload) === JSON.stringify(second.payload);
    }
    equal = false;
  }
  return equal;
};

export const updateAddToPendingActions = (_concepts: Concept[], _action: Action) => {
  let concepts = _concepts;
  let action = _action;
  // console.log('CHECK ADD TO PENDING ACTIONS', action);
  const ownershipState = selectState<OwnershipState>(concepts, ownershipName);
  const pendingActions = ownershipState.pendingActions;
  const newPendingActions: Action[] = [];
  // const strippedAction = {
  //   ...action,
  //   expiration: 0,
  // } as Action;
  if (pendingActions.length > 0) {
    let added = false;
    for (const pending of pendingActions) {
      // const strippedPending = {
      //   ...pending,
      //   expiration: 0,
      // };
      // const equal = areEqual(strippedAction, strippedPending);
      const equal = areEqual(action, pending);
      if (equal && pending.keyedSelectors) {
        [concepts, action] = editStubs(concepts, pending, action);
        newPendingActions.push(action);
        added = true;
      } else if (equal) {
        newPendingActions.push(action);
        added = true;
      } else {
        newPendingActions.push(pending);
      }
    }
    if (!added) {
      newPendingActions.push(action);
    }
    ownershipState.pendingActions = [...newPendingActions];
  } else {
    ownershipState.pendingActions = [action];
  }
  return concepts;
};
