/*<$
For the asynchronous graph programming framework Stratimux, define the Time Model File
This concept unified into the axium, manages how the timer functions interact with a given Axium
$>*/
/*<#*/
import { AxiumState } from '../concepts/axium/axium.concept';
import { Action, createAction } from './action';
import { getAxiumState } from './axium';
import { Concepts } from './concept';
import { handlePriority } from './priority';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleTimedRun = (axiumState: AxiumState, func: (() => Action)[], timed: number) => {
  func.forEach(f => {
    const action = f();
    if (action.type !== 'Conclude') {
      if (action.priority !== undefined) {
        handlePriority(axiumState, action);
      } else {
        axiumState.tail.push(action);
      }
    }
  });
  axiumState.timer.shift();
  axiumState.timerLedger.delete(timed);
  const timerKeys = Object.keys(axiumState.timerLedger);
  if (timerKeys.length > 0) {
    const timerList = timerKeys.map(t => Number(t)).sort((a, b) => a - b);
    const slot = axiumState.timerLedger.get(timerList[0]);
    if (slot) {
      const someTime = slot[1] - Date.now();
      axiumState.timer.push(setTimeout(() => handleTimedRun(axiumState, slot[0], slot[1]), someTime >= 0 ? someTime : 0));
    }
  }
  if (axiumState.tailTimer.length === 0) {
    axiumState.tailTimer.push(setTimeout(() => {
      axiumState.action$.next(createAction('Kick Axium'));
    }, 3));
  }
};

// This is treating setTimeout as if it is its own Time Axium
// The importance of this would be how to handle asynchronous activity in a native environment without access to NodeJS
export const axiumTimeOut = (concepts: Concepts, func: () => Action, timeOut: number) => {
  const timed = Date.now() + timeOut;
  const axiumState = getAxiumState(concepts);
  const ledger = axiumState.timerLedger;
  const timer = axiumState.timer.length > 0 ? axiumState.timer[0] : undefined;
  if (timer) {
    // If timer exists, first index of timerList would exist
    const timerList = Object.keys(ledger).map(t => Number(t)).sort((a, b) => a - b);
    if (timerList[0] > timed) {
      clearTimeout(timer);
      axiumState.timer.shift();
      const slot = axiumState.timerLedger.get(timed);
      if (slot) {
        slot[0].push(func);
        ledger.set(timed, [slot[0], timed]);
        axiumState.timer.push(setTimeout(() => {
          handleTimedRun(axiumState, slot[0], timed);
        }, timeOut));
      } else {
        ledger.set(timed, [[func], timed]);
        axiumState.timer.push(setTimeout(() => {
          handleTimedRun(axiumState, [func], timed);
        }, timeOut));
      }
    } else {
      const slot = axiumState.timerLedger.get(timed);
      if (slot) {
        slot[0].push(func);
        ledger.set(timed, [slot[0], timed]);
      }
    }
  } else {
    ledger.set(timed, [[func], timed]);
    axiumState.timer.push(setTimeout(() => {
      handleTimedRun(axiumState, [func], timed);
    }, timeOut));
  }
};
/*#>*/