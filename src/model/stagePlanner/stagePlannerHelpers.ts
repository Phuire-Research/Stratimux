/* eslint-disable max-len */
/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner Helpers model file.
This file defines a series of helper functions used internally in a Muxified Subject to ensure smooth
provably terminating operation of a Muxium.
$>*/
/*<#*/
/* eslint-disable complexity */
import { KeyedSelector } from '../selector/selector.type';
import { selectStratiDECK } from '../selector/selector';
import { muxiumSelectOpen } from '../../concepts/muxium/muxium.selector';
import { getMuxiumState } from '../muxium/muxiumHelpers';
import { Action } from '../action/action.type';
import { BaseStage, BaseStaging, dispatchOptions, Plan, Stage, StageDelimiter, Staging } from './stagePlanner.type';
import { OwnershipConcept, ownershipName } from '../../concepts/ownership/ownership.concept';
import { Concepts } from '../concept/concept.type';

export const createPriorityKey = (planId: number, stage: number) => `${planId}${stage}`;
/**
 * Used in principle plans that are loaded during muxium initialization
 */
export const stageWaitForOpenThenIterate = (concepts_: Concepts) => <Q, C, S>(skipOwnershipInit?: true): Staging<Q, C, S> => {
  const _muxiumState = getMuxiumState(concepts_);
  const ownershipDeck = selectStratiDECK<OwnershipConcept>(
    _muxiumState.deck.d,
    ownershipName
  );
  return (createStage(({concepts, dispatch, k, stagePlanner}) => {
    const conceptName = k.getName(concepts);
    const muxiumState = getMuxiumState(concepts);
    const isOpen = muxiumState.open;
    const muxiumDeck = _muxiumState ? _muxiumState.deck : getMuxiumState(concepts).deck;
    // Check ownership from current concepts if not explicitly handled
    // If handleOwnership passed, skip ownership check
    // If not passed, check if ownership exists and is initialized
    if (skipOwnershipInit || ownershipDeck === undefined) {
      if (isOpen) {
        dispatch(
          muxiumDeck.e.muxiumRegisterStagePlanner({
            conceptName: conceptName as string,
            stagePlanner,
          }), {
            iterateStage: true
          });
      }
    } else if (isOpen && ownershipDeck.k.initialized.select()) {
      dispatch(
        muxiumDeck.e.muxiumRegisterStagePlanner({
          conceptName: conceptName as string,
          stagePlanner,
        }), {
          iterateStage: true
        });
    }
  }, {
    selectors: skipOwnershipInit === undefined  && ownershipDeck ?
      [
        muxiumSelectOpen,
        ownershipDeck.k.initialized as KeyedSelector
      ]
      : [muxiumSelectOpen]
  }));
};

export const baseStageWaitForOpenThenIterate = (concepts_: Concepts) => <Q, C, S>(skipOwnershipInit?: true): BaseStaging<Q, C, S> => {
  const _muxiumState = getMuxiumState(concepts_);
  const ownershipDeck = selectStratiDECK<OwnershipConcept>(
    _muxiumState.deck.d,
    ownershipName
  );
  return createBaseStage(({concepts, dispatch, k, stagePlanner}) => {
    const conceptName = k.getName(concepts);
    const muxiumState = getMuxiumState(concepts);
    const isOpen = muxiumState.open;
    const muxiumDeck = _muxiumState ? _muxiumState.deck : getMuxiumState(concepts).deck;
    // Check ownership from current concepts if not explicitly handled
    // If skipOwnershipInit passed, skip ownership check
    // If not passed, check if ownership exists and is initialized
    if (skipOwnershipInit || ownershipDeck === undefined) {
      if (isOpen) {
        dispatch(
          muxiumDeck.e.muxiumRegisterStagePlanner({
            conceptName: conceptName as string,
            stagePlanner,
          }), {
            iterateStage: true
          });
      }
    } else if (isOpen && ownershipDeck.k.initialized.select()) {
      dispatch(
        muxiumDeck.e.muxiumRegisterStagePlanner({
          conceptName: conceptName as string,
          stagePlanner,
        }), {
          iterateStage: true
        });
    }
  }, {
    selectors: skipOwnershipInit === undefined && ownershipDeck ?
      [
        muxiumSelectOpen,
        ownershipDeck.k.initialized as KeyedSelector
      ]
      : [muxiumSelectOpen]
  });
};

export const stageConclude = <Q, C, S>(): Staging<Q, C, S> => createStage(({stagePlanner}) => {stagePlanner.conclude();});
export const baseStageConclude = <Q, C, S>(): BaseStaging<Q, C, S> => createBaseStage(({stagePlanner}) => {stagePlanner.conclude();});
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

export const createBaseStage = <Q = void, C = void, S = void>(
  stage: BaseStage<Q, C, S>,
  options?: { selectors?: KeyedSelector<any>[], priority?: number, beat?: number}
): BaseStaging<Q, C, S> => {
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

export const createBaseStages = <
  Q = void,
  C = void,
  S = void
  >(cb: () => BaseStaging<Q, C, S>[]):
    BaseStaging<Q, C, S>[] => cb();

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