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
import { createAction } from '../action/action';
import { Action } from '../action/action.type';

export const tailWhip = <Q, C extends LoadConcepts>(muxiumState: MuxiumState<Q, C>) => {
  if (muxiumState.tailTimer.length === 0) {
    muxiumState.tailTimer.push(setTimeout(() => {
      muxiumState.action$.next(createAction('Kick Muxium'));
    }, 3));
  }
};

export type ActionOriginComposition = {
  conceptName: string;
  originType: string;
  specificType?: string;
}
export const createOrigin = ({conceptName, originType, specificType}: ActionOriginComposition ): string => {
  let origin = conceptName + '+' + originType;
  if (specificType) {
    origin += '+' + specificType;
  }
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

export const HandleOverrideOriginType = <Q, C extends LoadConcepts>(state: MuxiumState<Q, C>, action: Action) => {
  // Fill Bucket
  // Empty Bucket
  // Issue is I need to remove all origins and replace with hard overriding action at the earliest slot
  const {
    body,
    tail
  } = state;
  let found = false;
  const origin = action.origin?.split('+')[1];
  for (const [i, a] of body.entries()) {
    const aOrigin = a.origin?.split('+')[1];
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

export const HandleOverrideConcept = <Q, C extends LoadConcepts>(state: MuxiumState<Q, C>, action: Action) => {
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

export const HandleOverrideSpecificType = <Q, C extends LoadConcepts>(
  state: MuxiumState<Q, C>,
  action: Action,
  planTitle: string,
  specificStage: number
) => {
  // Fill Bucket
  // Empty Bucket
  // Issue is I need to remove all origins and replace with hard overriding action at the earliest slot
  const {
    body,
    tail
  } = state;
  let found = false;
  for (const [i, a] of body.entries()) {
    const originType = a.origin?.split('+')[1];
    const specificType = Number(a.origin?.split('+')[2]);
    if (
      originType !== undefined &&
      specificType !== undefined &&
      originType === planTitle &&
      specificType === specificStage
    ) {
      body[i] = action;
      found = true;
      break;
    }
  }
  if (!found) {
    for (const [i, a] of tail.entries()) {
      const originType = a.origin?.split('+')[1];
      const specificType = Number(a.origin?.split('+')[2]);
      if (
        originType !== undefined &&
        specificType !== undefined &&
        originType === planTitle &&
        specificType === specificStage
      ) {
        tail[i] = action;
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
/*#>*/