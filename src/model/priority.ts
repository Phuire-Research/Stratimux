/*<$
For the asynchronous graph programming framework Stratimux, define the Priority Model File
This muxified concept further enhances the ability to control the halting nature of an Muxium
$>*/
/*<#*/
import { MuxiumState } from '../concepts/muxium/muxium.concept';
import { Action } from './action';

// Is only called if action has priority
const fillBucket = (body: Action[], bucket: Action[], action: Action, _added = false) => {
  let added = _added;
  const drop = body.shift();
  if (drop) {
    if (drop.priority && action.priority) {
      if (drop.priority && drop.priority < action.priority && !added) {
        bucket.push(action);
        bucket.push(drop);
        added = true;
      } else {
        bucket.push(drop);
      }
    } else if (drop.priority === undefined && !added) {
      bucket.push(action);
      bucket.push(drop);
      added = true;
    } else {
      bucket.push(drop);
    }
    fillBucket(body, bucket, action, added);
  } else if (!added) {
    bucket.push(action);
  }
};

const emptyBucket = (body: Action[], bucket: Action[]) => {
  const drop = bucket.shift();
  if (drop) {
    body.push(drop);
    emptyBucket(body, bucket);
  }
};

export const handlePriority = (muxiumState: MuxiumState<any, any>, action: Action<unknown>) => {
  const body = muxiumState.body;
  if (body[0] && body[0].priority !== undefined) {
    const bucket: Action[] = [];
    fillBucket(body, bucket, action);
    emptyBucket(body, bucket);
  } else if (body[0]) {
    body.unshift(action);
  } else {
    body.push(action);
  }
};

export const isPriorityValid = (action: Action) => (action.priority !== undefined && action.priority !== 0);
/*#>*/