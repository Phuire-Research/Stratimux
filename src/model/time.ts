/*<$
For the asynchronous graph programming framework Stratimux, define the Time Model File
This concept muxified into the muxium, manages how the timer functions interact with a given Muxium
$>*/
/*<#*/
import { MuxiumState } from '../concepts/muxium/muxium.concept';
import { getMuxiumState, tailWhip } from './muxium/muxiumHelpers';
import { Concepts } from './concept/concept.type';
import { handlePriority, isPriorityValid } from './priority';
import { Action } from './action/action.type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleTimedRun = (muxiumState: MuxiumState<any, any>, func: (() => Action)[], timed: number) => {
  func.forEach(f => {
    const action = f();
    if (action.type !== 'Conclude') {
      if (isPriorityValid(action)) {
        handlePriority(muxiumState, action);
      } else {
        muxiumState.tail.push(action);
      }
    }
  });
  muxiumState.timer.shift();
  muxiumState.timerLedger.delete(timed);
  const timerKeys: number[] = [];
  muxiumState.timerLedger.forEach((_, key) => {
    timerKeys.push(key);
  });
  if (timerKeys.length > 0) {
    const timerList = timerKeys.sort((a, b) => a - b);
    const slot = muxiumState.timerLedger.get(timerList[0]);
    if (slot) {
      const someTime = timerList[0] - Date.now();
      muxiumState.timer.push(setTimeout(() => handleTimedRun(muxiumState, slot, timerList[0]), someTime >= 0 ? someTime : 0));
    }
  }
  tailWhip(muxiumState);
};

// This is treating setTimeout as if it is its own Time Muxium
// The importance of this would be how to handle asynchronous activity in a native environment without access to NodeJS
export const muxiumTimeOut = (concepts: Concepts, func: () => Action, timeOut: number) => {
  const timed = Date.now() + timeOut;
  const muxiumState = getMuxiumState(concepts);
  const ledger = muxiumState.timerLedger;
  const timer = muxiumState.timer.length > 0 ? muxiumState.timer[0] : undefined;
  if (timer) {
    // If timer exists, first index of timerList would exist
    const timerKeys: number[] = [];
    muxiumState.timerLedger.forEach((_, key) => {
      timerKeys.push(key);
    });
    const timerList = timerKeys.sort((a, b) => a - b);
    if (timerList[0] > timed) {
      clearTimeout(timer);
      muxiumState.timer.shift();
      const slot = muxiumState.timerLedger.get(timed);
      if (slot) {
        slot.push(func);
        muxiumState.timer.push(setTimeout(() => {
          handleTimedRun(muxiumState, slot, timed);
        }, timeOut));
      } else {
        ledger.set(timed, [func]);
        const slotted = ledger.get(timed) as (() => Action)[];
        muxiumState.timer.push(setTimeout(() => {
          handleTimedRun(muxiumState, slotted, timed);
        }, timeOut));
      }
    } else {
      const slot = muxiumState.timerLedger.get(timed);
      if (slot) {
        slot.push(func);
        ledger.set(timed, slot);
      } else {
        ledger.set(timed, [func]);
      }
    }
  } else {
    ledger.set(timed, [func]);
    const slotted = ledger.get(timed) as (() => Action)[];
    muxiumState.timer.push(setTimeout(() => {
      handleTimedRun(muxiumState, slotted, timed);
    }, timeOut));
  }
};

/*#>*/