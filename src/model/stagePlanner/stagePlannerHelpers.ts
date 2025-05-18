/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner Helpers model file.
This file defines a series of helper functions used internally in a Muxified Subject to ensure smooth
provably terminating operation of a Muxium.
$>*/
/*<#*/
/* eslint-disable complexity */
import { KeyedSelector } from '../selector/selector.type';
import { selectSlice } from '../selector/selector';
import { muxiumSelectOpen } from '../../concepts/muxium/muxium.selector';
import { ownershipSelectInitialized } from '../../concepts/ownership/ownership.selector';
import { getMuxiumState, isMuxiumOpen } from '../muxium/muxiumHelpers';
import { ownershipSetOwnerShipModeTopic } from '../../concepts/ownership/strategies/setOwnerShipMode.strategy';
import { Action, AnyAction } from '../action/action.type';
import { dispatchOptions, Plan, Stage, StageDelimiter, Staging } from './stagePlanner.type';

export const createPriorityKey = (planId: number, stage: number) => `${planId}${stage}`;
/**
 * Used in principle plans that are loaded during muxium initialization
 */
export const stageWaitForOpenThenIterate = <Q, C, S>(func: () => AnyAction): Staging<Q, C, S> => (createStage(({concepts, dispatch}) => {
  if (isMuxiumOpen(concepts)) {
    dispatch(func(), {
      iterateStage: true
    });
  }
}, { selectors: [muxiumSelectOpen] }));

export const stageConclude = <Q, C, S>(): Staging<Q, C, S> => createStage(({stagePlanner}) => {stagePlanner.conclude();});

export const stageWaitForOwnershipThenIterate =
  <Q, C, S>(func: () => Action): Staging<Q, C, S> => (createStage(({concepts, dispatch}) => {
    if (selectSlice(concepts, ownershipSelectInitialized) && getMuxiumState(concepts).lastStrategy === ownershipSetOwnerShipModeTopic) {
      dispatch(func(), {
        iterateStage: true
      });
    }
  }, { selectors: [ownershipSelectInitialized] }));
/**
 * <Qualities, Concepts> Helper function to aid readability of composing plans, otherwise you may directly create a Staging Entity, selectors non optional
 * @param stage - (concepts, dispatch) => {}
 * @param selectors - Array of observed dependencies to execute your stage
 * @param priority - Adding this property will change the order in which your plan is notified on each state change
 * @param beat - Will fire once, then if informed again within your supplied beat, will fire after such time
 * @returns stage: Stage, selectors: KeyedSelector[], priority?: number, beat?: number
 */
export const createStage = <Q = void, C = void, S = void>(
  stage: Stage<Q, C, S>,
  options?: { selectors?: KeyedSelector<any>[], priority?: number, beat?: number}
): Staging<Q, C, S> => {
  if (options) {
    return {
      stage,
      selectors: options.selectors ? options.selectors : [],
      firstRun: true,
      priority: options.priority,
      beat: options.beat
    };
  } else {
    return {
      stage,
      firstRun: true,
      selectors: []
    };
  }
};

export const createStages = <
  Q = void,
  C = void,
  S = void
  >(cb: () => Staging<Q, C, S>[]):
    Staging<Q, C, S>[] => cb();

export const handleRun =
  <Q, C, S>(stageDelimiter: StageDelimiter, plan: Plan<Q, C, S>, action: Action, options?: dispatchOptions)
    : [StageDelimiter, boolean] => {
    if (options?.runOnce) {
      const stageRunner = stageDelimiter.runOnceMap.get(action.type + plan.stage);
      if (stageRunner === undefined) {
        stageDelimiter.runOnceMap.set(action.type + plan.stage, true);
        return [
          stageDelimiter, true
        ];
      } else {
        stageDelimiter.runOnceMap.set(action.type + plan.stage, false);
        return [
          stageDelimiter, false
        ];
      }
    }
    return [
      stageDelimiter,
      true
    ];
  };

export const handleStageDelimiter =
  <Q, C, S>(plan: Plan<Q, C, S>, action: Action, delimiter?: StageDelimiter, options?: dispatchOptions): [StageDelimiter, boolean] => {
    let stageDelimiter = delimiter;
    let goodAction = true;
    if (stageDelimiter &&
        stageDelimiter.prevActions.includes(action.type) &&
        options?.throttle === undefined) {
      if (plan.stage !== stageDelimiter?.stage) {
        stageDelimiter = {
          stage: plan.stage,
          prevActions: [action.type],
          unionExpiration: [action.expiration],
          runOnceMap: new Map()
        };
      } else {
        goodAction = false;
      }
    } else if (stageDelimiter) {
      if (stageDelimiter.prevActions.length > 4) {
        stageDelimiter = {
          stage: plan.stage,
          prevActions: [
            stageDelimiter.prevActions[1],
            stageDelimiter.prevActions[2],
            stageDelimiter.prevActions[3],
            stageDelimiter.prevActions[4],
            action.type
          ],
          unionExpiration: [
            stageDelimiter.unionExpiration[1],
            stageDelimiter.unionExpiration[2],
            stageDelimiter.unionExpiration[3],
            stageDelimiter.unionExpiration[4],
            action.expiration
          ],
          runOnceMap: new Map()
        };
      } else {
        stageDelimiter = {
          stage: plan.stage,
          prevActions: [...stageDelimiter.prevActions, action.type],
          unionExpiration: [...stageDelimiter.unionExpiration, action.expiration],
          runOnceMap: new Map()
        };
      }
    } else {
      stageDelimiter = {
        stage: plan.stage,
        prevActions: [action.type],
        unionExpiration: [action.expiration],
        runOnceMap: new Map()
      };
    }
    return [
      stageDelimiter,
      goodAction
    ];
  };

/*#>*/