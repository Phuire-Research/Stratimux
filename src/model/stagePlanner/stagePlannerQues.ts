/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner Que model file.
This file defines helper functions that handle the shortest path of notification within a Muxium and its
varying points of observation. Allowing for a Muxified Subject to be both General and Specific with its
notifications. Using generalities as a fallback for developer experience.
$>*/
/*<#*/
/* eslint-disable complexity */
import { createConceptKeyedSelector } from '../selector/selector';
import { KeyedSelector } from '../selector/selector.type';
import { MuxifiedSubjectProperties } from './stagePlanner.type';
import { createPriorityKey } from './stagePlannerHelpers';

const Inner = 0;
const Base = 1;
const Outer = 2;

// Token to denote ALL, using a selector that utilizes this token should return undefined
const ALL = '*4||*';

export function updateFrequencyMap(properties: MuxifiedSubjectProperties) {
  const que = properties.priorityQue;
  const map: typeof properties.frequencyMap = new Map();

  que.forEach(plan => {
    plan.selectors.forEach(selector => {
      const frequency = map.get(selector.keys);
      if (frequency) {
        map.set(selector.keys, frequency + plan.priority);
      } else {
        map.set(selector.keys, plan.priority);
      }
    });
  });

  properties.frequencyMap = map;
}

export function assemblePriorityQue(properties: MuxifiedSubjectProperties) {
  let prioritize = false;
  const priorityMap: typeof properties.priorityExists = new Map();
  const newList: {
    inner: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[],
    base: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[],
    outer: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[]
  } = {
    inner: [],
    base: [],
    outer: []
  };
  for (const [_, plan] of properties.currentPlans) {
    const stage = plan.stages[plan.stage];
    const priority = stage.priority;
    if (priority) {
      prioritize = true;
      const key = createPriorityKey(plan.id, plan.stage);
      const selectors = plan.stages[plan.stage].selectors;
      priorityMap.set(key, true);
      const entry = {
        planID: plan.id,
        priority,
        stage: plan.stage,
        selectors,
      };
      switch (plan.space) {
      case Inner: {
        newList.inner.push(entry);
        break;
      }
      case Base: {
        newList.base.push(entry);
        break;
      }
      case Outer: {
        newList.outer.push(entry);
        break;
      }
      default: {
        //
      }
      }
      properties.priorityExists.set(key, true);
    }
  }
  if (!prioritize) {
    properties.ques[Inner].priorityQue = [];
    properties.ques[Base].priorityQue = [];
    properties.ques[Outer].priorityQue = [];
  } else {
    properties.ques[Inner].priorityQue = newList.inner.sort((a, b) => b.priority - a.priority);
    properties.ques[Base].priorityQue = newList.base.sort((a, b) => b.priority - a.priority);
    properties.ques[Outer].priorityQue = newList.outer.sort((a, b) => b.priority - a.priority);
  }
  // properties will cause an issue
  properties.priorityExists = priorityMap;
  updateFrequencyMap(properties);
}

export function assembleGeneralQues(properties: MuxifiedSubjectProperties) {
  const generalMap: {
    inner: Map<string, {selector: KeyedSelector, planIDs: number[], priorityAggregate: number}>
    base: Map<string, {selector: KeyedSelector, planIDs: number[], priorityAggregate: number}>
    outer: Map<string, {selector: KeyedSelector, planIDs: number[], priorityAggregate: number}>
  } = {
    inner: new Map(),
    base: new Map(),
    outer: new Map()
  };
  for (const [_, plan] of properties.currentPlans) {
    // let map = generalMap;
    const stage = plan.stages[plan.stage];
    const priority = stage.priority;
    let target = generalMap.inner;
    switch (plan.space) {
    case Base: {
      target = generalMap.base;
      break;
    }
    case Outer: {
      target = generalMap.outer;
      break;
    }
    default: {
      //
    }
    }
    if (priority === undefined) {
      const prepareMap = (selector: KeyedSelector) => {
        const entry = target.get(selector.keys);
        const frequency = properties.frequencyMap.get(selector.keys);
        if (entry) {
          entry.planIDs.push(plan.id);
        } else if (frequency) {
          target.set(selector.keys, {
            planIDs: [plan.id],
            priorityAggregate: frequency,
            selector: selector
          });
        } else {
          target.set(selector.keys, {
            planIDs: [plan.id],
            priorityAggregate: 0,
            selector: selector
          });
        }
      };
      if (stage.selectors.length === 0) {
        prepareMap(createConceptKeyedSelector(ALL, ALL));
      } else {
        for (const selector of stage.selectors) {
          prepareMap(selector);
        }
      }
    }
  }
  const generalIdMap: {
    inner: Map<number, number>
    base: Map<number, number>
    outer: Map<number, number>
  } = {
    inner: new Map(),
    base: new Map(),
    outer: new Map()
  };
  const handleSlice = (slice: {selector: KeyedSelector, planIDs: number[], priorityAggregate: number}, map: Map<number, number>) => {
    slice.planIDs.forEach(id => {
      const priority = map.get(id);
      if (priority) {
        map.set(id, priority + slice.priorityAggregate);
      } else {
        map.set(id, slice.priorityAggregate);
      }
    });
  };
  generalMap.inner.forEach((slice) => {
    handleSlice(slice, generalIdMap.inner);
  });
  generalMap.base.forEach((slice) => {
    handleSlice(slice, generalIdMap.base);
  });
  generalMap.outer.forEach((slice) => {
    handleSlice(slice, generalIdMap.outer);
  });
  const flatten = (map: Map<number, number>) => {
    const flat = [];
    for (const [id, frequency] of map.entries()) {
      flat.push([id, frequency]);
    }
    flat.sort((a, b) => b[1] - a[1]);
    // We should add a selector union
    return flat.map(([id, _]) => id);
  };
  properties.ques[Inner].generalQue = flatten(generalIdMap.inner);
  properties.ques[Base].generalQue = flatten(generalIdMap.base);
  properties.ques[Outer].generalQue = flatten(generalIdMap.outer);
}

export function manageQues(properties: MuxifiedSubjectProperties) {
  assemblePriorityQue(properties);
  assembleGeneralQues(properties);
}

/*#>*/