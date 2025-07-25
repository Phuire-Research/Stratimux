/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner Entropy model file.
This file defines the management of the dispatch functionality within a Stratimux Stage Planner, allowing for
smooth operation of Stratimux's provable termination.
$>*/
/*<#*/
/* eslint-disable complexity */
import { Subject } from 'rxjs';
import { MuxiumDeck, MuxiumState } from '../../concepts/muxium/muxium.concept';
import { BundledSelectors, KeyedSelector } from '../selector/selector.type';
import {
  HandleOrigin,
  HandleOverrideConcept,
  HandleOverrideOriginType,
  HandleOverrideSpecificType,
  createOrigin,
  getMuxiumState
} from '../muxium/muxiumHelpers';
import { Comparators } from '../interface';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { accessDeck, Deck } from '../deck';
import { Action, Actions } from '../action/action.type';
import { Dispatcher, dispatchOptions, MuxifiedSubjectProperties, Plan } from './stagePlanner.type';
import { handleRun, handleStageDelimiter } from './stagePlannerHelpers';
import {
  handleAddSelector, handleNewStageOptions, handleRemoveSelector, handleSetStageOptions, removeSelector
} from './stagePlannerHandlers';
import { deletePlan } from './stagePlannerPlan';
import { manageQues } from './stagePlannerQues';
import { Outer } from './stagePlanner';

// Token to denote ALL, using a selector that utilizes this token should return undefined
export function _dispatch<Q,C,S>(
  properties: MuxifiedSubjectProperties,
  muxiumState: MuxiumState<MuxiumQualities, MuxiumDeck>,
  plan: Plan<Q, C, S>,
  action: Action,
  options: dispatchOptions
): void {
  let stageDelimiter = properties.stageDelimiters.get(plan.id);
  let throttle = false;
  let goodAction = true;
  let run = true;
  [stageDelimiter, goodAction] = handleStageDelimiter(plan, action, stageDelimiter, options);
  [stageDelimiter, run] = handleRun(stageDelimiter, plan, action, options);
  properties.stageDelimiters.set(plan.id, stageDelimiter);
  if (goodAction && run) {
    const action$ = muxiumState.action$ as Subject<Action>;
    if (options?.throttle !== undefined) {
      let previousExpiration = 0;
      for (let i = 0; i < stageDelimiter.prevActions.length; i++) {
        if (stageDelimiter.prevActions[i] === action.type) {
          previousExpiration = stageDelimiter.unionExpiration[i];
          break;
        }
      }
      if (previousExpiration !== action.expiration && action.expiration - previousExpiration < options?.throttle) {
        throttle = true;
      } else {
        for (let i = 0; i < stageDelimiter.prevActions.length; i++) {
          if (stageDelimiter.prevActions[i] === action.type) {
            stageDelimiter.unionExpiration[i] = action.expiration;
            break;
          }
        }
      }
    }
    properties.stageDelimiters.set(plan.id, stageDelimiter);
    if (!throttle && run) {
      let next = -1;
      const evaluate = handleNewStageOptions(properties, plan, options, next);
      handleSetStageOptions(plan, options);
      if (options?.iterateStage) {
        next = plan.stage + 1;
        // this.updatePlanSelector(plan, plan.stage, next < plan.stages.length ? next : undefined);
      }
      if (options?.setStage !== undefined) {
        next = options.setStage;
      }
      if (next !== -1) {
        // Don't like having to do this.
        // Double check this logic while writing the unit test.
        if (plan.stages[plan.stage]) {
          handleRemoveSelector(properties, plan.stages[plan.stage].selectors, plan.id);
        }
        plan.stage = next;
        if (plan.stages[plan.stage]) {
          handleAddSelector(properties, plan.stages[plan.stage].selectors, plan.id);
        }
        manageQues(properties);
        const beat = plan.stages[plan.stage].beat;
        plan.beat = beat !== undefined ? beat : -1;
        stageDelimiter.prevActions = [];
        stageDelimiter.unionExpiration = [];
        stageDelimiter.runOnceMap = new Map();
        plan.changeAggregator = {};
        properties.stageDelimiters.set(plan.id, stageDelimiter);
      }
      if (evaluate && next === -1) {
        manageQues(properties);
      }
      // Horrifying
      // Keep in place, this prevents branch prediction from creating ghost actions if there is an action overflow.
      if (plan.stageFailed === -1) {
        // Will set a the current stage's priority if no priority is set.
        action.origin = createOrigin({
          conceptName: plan.conceptName,
          originType: plan.title,
          specificType: plan.stage + ''
        });
        const settleOrigin = () => {
          if (options.conceptOverride) {
            HandleOverrideConcept(muxiumState, action);
          } else if (options.planOverride) {
            HandleOverrideOriginType(muxiumState, action);
          } else if (options.specificOverride) {
            HandleOverrideSpecificType(muxiumState, action, plan.title, plan.stage);
          } else if (options.override) {
            console.log('CHECK ACTION WITH OVERRIDE, action', action);
            console.log('CHECK STATE', muxiumState.body);
            HandleOrigin(muxiumState, action);
          } else {
            action$.next(action);
          }
        };
        if (plan.stages[plan.stage].priority && action.priority === undefined) {
          action.priority = plan.stages[plan.stage].priority;
          settleOrigin();
        } else {
          settleOrigin();
        }
      }
    }
  } else if (
    options?.runOnce === undefined &&
    (!options.throttle && (options.iterateStage === undefined || options.setStage === plan.stage))
  ) {
    plan.stageFailed = plan.stage;
    plan.stage = plan.stages.length;
    console.error('DELETED PLAN: ', plan.id);
    const deleted = deletePlan(properties, plan.id);
    if (deleted) {
      muxiumState.badPlans.push(plan);
    }
  }
}

export function execute<Q,C,S>(properties: MuxifiedSubjectProperties, plan: Plan<Q, C, S>, index: number, changes: KeyedSelector[]): void {
  const muxiumState = getMuxiumState(properties.concepts);
  const dispatcher: Dispatcher = (() => (action: Action, options: dispatchOptions) => {
    _dispatch<Q,C,S>(properties, muxiumState, plan, action, options);
  })();
  const conclude = () => {
    deletePlan(properties, plan.id);
  };
  // console.warn('CHECKING', Object.keys(getMuxiumState(this.concepts).head));
  if (properties.concepts[plan.conceptSemaphore] === undefined) {
    // console.error('CHECK', plan, Object.keys(getMuxiumState(this.concepts).head));
  } else {
    plan.stages[index].stage({
      concepts: properties.concepts,
      dispatch: dispatcher,
      changes,
      stagePlanner: {
        title: plan.title,
        planId: plan.id,
        conclude: conclude
      },
      origin: createOrigin({
        conceptName: plan.conceptName,
        originType: plan.title,
        specificType: plan.stage + ''
      }),
      // [TODO WHY? BACK HERE AGAIN!?!?!?
      // Triggered by ownership test, for some reason the muxium was the sole concept available here mid way through test]
      d: plan.space === Outer ?
        accessDeck(properties.concepts)
        :
        // (properties.concepts[plan.conceptSemaphore as any] as any).deck,
        properties.concepts[plan.conceptSemaphore].deck.d as unknown as Deck<C>,
      e: properties.concepts[plan.conceptSemaphore].actions as Actions<any>,
      c: properties.concepts[plan.conceptSemaphore].comparators as Comparators<any>,
      k: {
        ...properties.concepts[plan.conceptSemaphore].selectors,
        ...properties.concepts[plan.conceptSemaphore].keyedSelectors,
      } as unknown as BundledSelectors<any>,
    });
  }
}
/*#>*/