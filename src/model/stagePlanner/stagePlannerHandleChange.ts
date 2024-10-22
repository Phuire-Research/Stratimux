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
import { select } from '../selector/';
import { KeyedSelector } from '../selector/selector.type';
import { MuxifiedSubjectProperties, Plan  } from './stagePlanner.type';
import { nextPlan } from './stagePlannerPlan';

const Inner = 0;
const Base = 1;
const Outer = 2;

// Token to denote ALL, using a selector that utilizes this token should return undefined
const ALL = '*4||*';
const ALL_KEYS = '*4||*.*4||*';

export function handleChange<Q,C,S>(
  properties: MuxifiedSubjectProperties,
  concepts: Concepts,
  blocking = false,
  keyedSelectors?: KeyedSelector<any>[]
) {
  const oldConcepts = properties.concepts;
  properties.concepts = concepts;
  const notifyIds: Map<number, KeyedSelector[]> = new Map();
  if (keyedSelectors) {
    // Specific shortest path
    const all = properties.mappedSelectors.get(ALL_KEYS);
    if (all) {
      const {ids} = all;
      ids.forEach(id => {
        notifyIds.set(id, []);
      });
    }
    keyedSelectors.forEach(ks => {
      const selectorSet = properties.mappedSelectors.get(ks.keys);
      if (selectorSet) {
        let notify = false;
        const incoming = ks.select();
        const original = select.slice(oldConcepts, ks);
        if (typeof incoming === 'object' && !Object.is(incoming, original)) {
          // stuff
          notify = true;
        } else if (incoming !== original) {
          notify = true;
        }
        const {ids, selector} = selectorSet;
        if (notify) {
          ids.forEach(id => {
            const n = notifyIds.get(id);
            if (n) {
              n.push(selector);
            } else {
              notifyIds.set(id, [selector]);
            }
          });
        }
      }
    });
  } else {
    // Generalized search for user comfort
    for (const [_, slice] of properties.mappedSelectors) {
      const {selector, ids} = slice;
      let notify = false;
      if (slice.selector.conceptName === ALL) {
        notify = true;
      } else {
        const incoming = select.slice(properties.concepts, selector);
        const original = select.slice(oldConcepts, selector);
        if (typeof incoming === 'object' && !Object.is(incoming, original)) {
          // stuff
          notify = true;
        } else if (incoming !== original) {
          notify = true;
        }
      }
      if (notify) {
        ids.forEach(id => {
          const n = notifyIds.get(id);
          if (n && selector.conceptName !== ALL) {
            n.push(selector);
          } else if (selector.conceptName !== ALL) {
            notifyIds.set(id, [selector]);
          } else {
            notifyIds.set(id, []);
          }
        });
      }
    }
  }
  const notification = (id: number) => {
    const ready = notifyIds.get(id);
    const plan = properties.currentPlans.get(id);
    if (plan && ready !== undefined) {
      nextPlan(properties, plan as Plan<Q, C, S>, ready);
    } else if (plan && plan.stages[plan.stage].firstRun) {
      plan.stages[plan.stage].firstRun = false;
      nextPlan(properties, plan as Plan<Q, C, S>, []);
    }
  };
  for (const p of properties.ques[Inner].priorityQue) {
    notification(p.planID);
  }
  for (const g of properties.ques[Inner].generalQue) {
    notification(g);
  }
  if (!blocking) {
    for (const p of properties.ques[Base].priorityQue) {
      notification(p.planID);
    }
    for (const g of properties.ques[Base].generalQue) {
      notification(g);
    }
    for (const p of properties.ques[Outer].priorityQue) {
      notification(p.planID);
    }
    for (const g of properties.ques[Outer].generalQue) {
      notification(g);
    }
  }
}
/*#>*/