/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner model file.
This file introduces the Muxified Subject, that allows for users to stage plans based on observation of the Concepts stream.
The Stage Planner paradigm is what allows for the ease of working within a recursive run time, via setting plans to specific stages
in order to prevent action overflow. Action overflow is when a function is stuck within a recursive loop. This paradigm
also ensures Stratimux of its own provable termination in majority of configurations.
$>*/
/*<#*/
/* eslint-disable complexity */
import {
  KeyedSelector,
  select,
} from '../selectors/selector';
import { dispatchOptions, MappedSelectors, MuxifiedSubjectProperties, Plan } from './stagePlanner.type';

// Token to denote ALL, using a selector that utilizes this token should return undefined
const ALL = '*4||*';

export function handleAddSelector(properties: MuxifiedSubjectProperties, selectors: KeyedSelector[], id: number) {
  if (selectors.length === 0) {
    const ALL_SELECTOR = select.createConceptKeyedSelector(ALL, ALL);
    addSelector(properties, ALL_SELECTOR, id);
  }
  selectors.forEach(selector => addSelector(properties, selector, id));
}

export function handleNewStageOptions<Q,C,S>(
  properties: MuxifiedSubjectProperties,
  plan: Plan<Q, C, S>,
  options: dispatchOptions,
  next: number
): boolean {
  let evaluate = false;
  if (options.newPriority) {
    plan.stages[plan.stage].priority = options.newPriority;
    evaluate = true;
  }
  if (options.newSelectors) {
    handleRemoveSelector(properties, plan.stages[plan.stage].selectors, plan.id);
    plan.stages[plan.stage].selectors = options.newSelectors;
    handleAddSelector(properties, plan.stages[plan.stage].selectors, plan.id);
    evaluate = true;
  }
  if (options.newBeat) {
    plan.stages[plan.stage].beat = options.newBeat;
    if (next === -1) {
      plan.beat = options.newBeat;
    }
    evaluate = true;
  }
  return evaluate;
}

export function handleSetStageOptions<Q,C,S>(plan: Plan<Q, C, S>, options: dispatchOptions) {
  if (options.setStageSelectors && plan.stages[options.setStageSelectors.stage]) {
    plan.stages[options.setStageSelectors.stage].selectors = options.setStageSelectors.selectors;
  }
  if (options.setStagePriority && plan.stages[options.setStagePriority.stage]) {
    plan.stages[options.setStagePriority.stage].priority = options.setStagePriority.priority;
  }
  if (options.setStageBeat && plan.stages[options.setStageBeat.stage]) {
    plan.stages[options.setStageBeat.stage].beat = options.setStageBeat.beat;
  }
}

export function handleRemoveSelector(properties: MuxifiedSubjectProperties, selectors: KeyedSelector[], id: number) {
  if (selectors.length === 0) {
    const ALL_SELECTOR = select.createConceptKeyedSelector(ALL, ALL);
    removeSelector(properties, ALL_SELECTOR, id);
  }
  selectors.forEach(selector => removeSelector(properties, selector, id));
}

export function addSelector(properties: MuxifiedSubjectProperties, selector: KeyedSelector, id: number) {
  const s = properties.mappedSelectors.get(selector.keys);
  if (s) {
    properties.mappedSelectors.set(selector.keys, {selector, ids: [...s.ids, id]});
  } else {
    properties.mappedSelectors.set(selector.keys, {selector, ids: [id]});
  }
}

export function removeSelector(properties: MuxifiedSubjectProperties, selector: KeyedSelector, id: number) {
  const s = properties.mappedSelectors.get(selector.keys);
  if (s) {
    if (s.ids.length - 1 === 0) {
      properties.mappedSelectors.delete(selector.keys);
    } else {
      properties.mappedSelectors.set(selector.keys, {selector, ids: s.ids.filter(idx => idx !== id)});
    }
  }
}
/*#>*/