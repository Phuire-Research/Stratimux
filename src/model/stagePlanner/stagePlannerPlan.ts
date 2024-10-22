/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner model file.
This file introduces the Muxified Subject, that allows for users to stage plans based on observation of the Concepts stream.
The Stage Planner paradigm is what allows for the ease of working within a recursive run time, via setting plans to specific stages
in order to prevent action overflow. Action overflow is when a function is stuck within a recursive loop. This paradigm
also ensures Stratimux of its own provable termination in majority of configurations.
$>*/
/*<#*/
/* eslint-disable complexity */
import { Concepts } from '../concept/concept.type';
import { BundledSelectors, KeyedSelector } from '../selector/selector.type';
import { muxiumTimeOut } from '../time';
import { Comparators } from '../interface';
import { accessDeck } from '../deck';
import { Actions } from '../action/action.type';
import { createAction } from '../action/action';
import { MuxifiedSubjectProperties, Plan, Planner, StagePlanner, Staging } from './stagePlanner.type';
import { createStage, stageConclude, stageWaitForOpenThenIterate } from './stagePlannerHelpers';
import { handleAddSelector, handleRemoveSelector } from './stagePlannerHandlers';
import { manageQues } from './stagePlannerQues';
import { execute } from './stagePlannerEntropy';

export function createPlan<Q,C,S>(
  properties: MuxifiedSubjectProperties,
  title: string,
  planner: Planner<Q, C, S>,
  space: number,
  conceptSemaphore: number
): Plan<Q, C, S> {
  const stages = planner({
    d__: accessDeck(properties.concepts),
    e__: properties.concepts[conceptSemaphore].actions as Actions<any>,
    c__: properties.concepts[conceptSemaphore].comparators as Comparators<any>,
    k__: {
      ...properties.concepts[conceptSemaphore].keyedSelectors,
      ...properties.concepts[conceptSemaphore].selectors,
    } as BundledSelectors<any>,
    stage: createStage,
    stageO: stageWaitForOpenThenIterate,
    conclude: stageConclude
  });
  const staged: Staging<Q, C, S>[] = stages.map<Staging<Q, C, S>>(s => {
    return {
      stage: s.stage,
      selectors: s.selectors ? s.selectors : [],
      firstRun: true,
      priority: s.priority,
      beat: s.beat
    };
  });

  const planId = properties.planId;
  properties.planId += 1;
  const beat = staged[0].beat;
  const plan = {
    id: planId,
    space,
    conceptSemaphore,
    conceptName: properties.concepts[conceptSemaphore].name,
    title,
    stages: staged,
    stage: 0,
    stageFailed: -1,
    beat: beat ? beat : -1,
    offBeat: -1,
    timer: [],
    changeAggregator: {}
  };
  return plan;
}

export function initPlan<Q,C,S>(
  properties: MuxifiedSubjectProperties,
  plan: Plan<Q, C, S>,
  next: (concepts: Concepts, keyedSelectors?: KeyedSelector<any>[]) => void
): StagePlanner {
  properties.currentPlans.set(plan.id, plan);
  handleAddSelector(properties, plan.stages[plan.stage].selectors, plan.id);
  manageQues(properties);
  const conclude = () => {
    deletePlan(properties, plan.id);
  };
  muxiumTimeOut(properties.concepts, () => {
    next(properties.concepts);
    return createAction('Conclude');
  }, 0);
  return {
    title: plan.title,
    planId: plan.id,
    conclude: conclude
  };
}

export function deletePlan(properties: MuxifiedSubjectProperties, planId: number) {
  const plan = properties.currentPlans.get(planId);
  if (plan) {
    plan.timer.forEach(timer => clearTimeout(timer));
    plan.timer = [];
    properties.currentPlans.delete(planId);
    const selectors = plan.stages[plan.stage]?.selectors;
    if (selectors) {
      handleRemoveSelector(properties, selectors, plan.id);
    }
    manageQues(properties);
  }
  return plan;
}

export function nextPlans(properties: MuxifiedSubjectProperties) {
  properties.currentPlans.forEach(plan => {
    nextPlan(properties, plan, []);
  });
}

export function nextPlan<Q,C,S>(properties: MuxifiedSubjectProperties, plan: Plan<Q, C, S>, changes: KeyedSelector[]) {
  const index = plan.stage;
  if (index < plan.stages.length) {
    if (plan.beat > -1) {
      const timer = plan.timer;
      const now = Date.now();
      if (plan.offBeat < now) {
        plan.offBeat = Date.now() + plan.beat;
        execute(properties, plan, index, changes);
      } else if (timer.length === 0 && plan.offBeat > now) {
        // Logic to push changes into aggregator
        changes.forEach(key => {
          plan.changeAggregator[key.keys] = key;
        });
        timer.push(setTimeout(() => {
          const changeAggregation = Object.keys(plan.changeAggregator).map(k => plan.changeAggregator[k]);
          plan.changeAggregator = {};
          plan.timer = [];
          plan.offBeat = Date.now() + plan.beat;
          execute(properties, plan, index, changeAggregation);
        }, plan.offBeat - Date.now()));
      } else {
        changes.forEach(key => {
          plan.changeAggregator[key.keys] = key;
        });
      }
    } else {
      execute(properties, plan, index, changes);
    }
  }
}
/*#>*/