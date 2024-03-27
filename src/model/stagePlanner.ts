/*<$
For the graph programming framework Stratimux, define the Stage Planner model file.
This file introduces the Unified Subject, that allows for users to stage plans based on observation of the Concepts stream.
The Stage Planner paradigm is what allows for the ease of working within a recursive run time, via setting plans to specific stages
in order to prevent action overflow. Action overflow is when a function is stuck within a recursive loop. This paradigm
also ensures Stratimux of its own provable termination in majority of configurations.
$>*/
/*<#*/
/* eslint-disable complexity */
import { Subject } from 'rxjs';
import { Concepts } from './concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { KeyedSelector, createConceptKeyedSelector, select, selectSlice } from './selector';
import { Action, ActionType } from './action';
import { axiumSelectOpen } from '../concepts/axium/axium.selector';
import { ownershipSelectInitialized } from '../concepts/ownership/ownership.selector';
import { getAxiumState, isAxiumOpen } from './axium';

export type Plan = {
  id: number;
  // [TODO Unify Streams]
  // outer: boolean;
  title: string;
  stages: Staging[],
  stage: number;
  stageFailed: number;
  beat: number;
  offBeat: number;
  timer: NodeJS.Timeout[]
}

export type Stage = (concepts: Concepts,
    dispatch: (action: Action, options: dispatchOptions) => void
  ) => void;

export type Staging = {
  stage: Stage;
  selectors: KeyedSelector[];
  priority?: number
  beat?: number,
};

export type PartialStaging = {
  stage: Stage;
  selectors?: KeyedSelector[];
  priority?: number
  beat?: number,
};

export type StagePlanner = {
  title: string;
  planId: number;
  conclude: () => void;
}

export type NamedStagePlanner = {
  name: string;
  title: string;
  planId: number;
  conclude: () => void;
}

export type dispatchOptions = {
  runOnce?: boolean;
  iterateStage?: boolean;
  setStage?: number;
  throttle?: number;
}

export type Dispatcher = (action: Action, options: dispatchOptions) => void;

export type StageDelimiter = {
  stage: number,
  prevActions: ActionType[],
  unionExpiration: number[];
  runOnceMap: Map<string, boolean>
}

export const stageWaitForOpenThenIterate = (func: () => Action): Staging => (createStage((concepts: Concepts, dispatch: Dispatcher) => {
  if (isAxiumOpen(concepts)) {
    dispatch(func(), {
      iterateStage: true
    });
  }
}, [axiumSelectOpen]));

export const stageWaitForOwnershipThenIterate =
  (func: () => Action): Staging => (createStage((concepts: Concepts, dispatch: Dispatcher) => {
    if (selectSlice(concepts, ownershipSelectInitialized)) {
      dispatch(func(), {
        iterateStage: true
      });
    }
  }, [ownershipSelectInitialized]));

/**
 * Helper function to aid readability of composing plans, otherwise you may directly create a Staging Entity, selectors non optional
 * @param stage - (concepts, dispatch) => {}
 * @param selectors - Array of observed dependencies to execute your stage
 * @param priority - Adding this property will change the order in which your plan is notified on each state change
 * @param beat - Will fire once, then if informed again within your supplied beat, will fire after such time
 * @returns stage: Stage, selectors: KeyedSelector[], priority?: number, beat?: number
 */
export const createStage = (stage: Stage, selectors?: KeyedSelector[], priority?: number, beat?: number): Staging => {
  return {
    stage,
    selectors: selectors ? selectors : [],
    priority,
    beat
  };
};

// Token to denote ALL, using a selector that utilizes this token should return undefined
const ALL = '*4||*';

const handleRun =
  (stageDelimiter: StageDelimiter, plan: Plan, action: Action, options?: dispatchOptions)
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

const handleStageDelimiter =
  (plan: Plan, action: Action, delimiter?: StageDelimiter, options?: dispatchOptions): [StageDelimiter, boolean] => {
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

export class UnifiedSubject extends Subject<Concepts> {
  private planId = -1;
  private currentPlans: Map<number, Plan> = new Map();
  private stageDelimiters: Map<number, StageDelimiter> = new Map();
  private concepts: Concepts = {};
  // Assemble front of line
  private priorityQue: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[] = [];
  private priorityExists: Map<string, boolean> = new Map();
  private frequencyMap: Map<string, number> = new Map();
  private selectors: Map<string, {selector: KeyedSelector, ids: number[]}> = new Map();
  // Assemble back of line, exempts priority que members
  private generalQue: number[] = [];
  // [TODO Unify Streams]: Simplify streams into one single UnifiedSubject
  // [Experiment notes]: When attempting to unify all streams the chain test presented a ghost count repeating at 14 with both 0 and 2
  // [Punt]: The main issue with this simplification is the order in which withLatest is notified
  // In order to fully facilitate this change we would need to add an innerQue, but likewise can just have 3 streams
  // private outerQue: number[] = [];
  // The above approach is enhanced by a onChange dict
  constructor() {
    super();
    this.planId = 0;
  }

  protected createPriorityKey(planId: number, stage: number) {
    return `${planId}${stage}`;
  }

  protected handleAddSelector(selectors: KeyedSelector[], id: number) {
    if (selectors.length === 0) {
      const ALL_SELECTOR = select.createConceptKeyedSelector(ALL, ALL);
      this.addSelector(ALL_SELECTOR, id);
    }
    selectors.forEach(selector => this.addSelector(selector, id));
  }

  protected addSelector(selector: KeyedSelector, id: number) {
    const s = this.selectors.get(selector.keys);
    if (s) {
      this.selectors.set(selector.keys, {selector, ids: [...s.ids, id]});
    } else {
      this.selectors.set(selector.keys, {selector, ids: [id]});
    }
  }

  protected handleRemoveSelector(selectors: KeyedSelector[], id: number) {
    if (selectors.length === 0) {
      const ALL_SELECTOR = select.createConceptKeyedSelector(ALL, ALL);
      this.removeSelector(ALL_SELECTOR, id);
    }
    selectors.forEach(selector => this.removeSelector(selector, id));
  }

  protected removeSelector(selector: KeyedSelector, id: number) {
    const s = this.selectors.get(selector.keys);
    if (s) {
      if (s.ids.length - 1 === 0) {
        this.selectors.delete(selector.keys);
      } else {
        this.selectors.set(selector.keys, {selector, ids: s.ids.filter(idx => idx !== id)});
      }
    }
  }

  protected createPlan(title: string, stages: PartialStaging[], beat?: number): Plan {
  // [TODO Unify Streams]
  // protected createPlan(title: string, stages: PartialStaging[], outer: boolean, beat?: number): Plan {
    const planId = this.planId;
    this.planId += 1;
    const staged: Staging[] = stages.map<Staging>(s => {
      return {
        stage: s.stage,
        selectors: s.selectors ? s.selectors : [],
        priority: s.priority,
        beat: s.beat
      };
    });
    return {id: planId, title, stages: staged, stage: 0, stageFailed: -1, beat: beat ? beat : -1, offBeat: -1, timer: []};
    // [TODO Unify Streams]
    // return {id: planId, outer, title, stages: staged, stage: 0, stageFailed: -1, beat: beat ? beat : -1, offBeat: -1, timer: []};
  }

  protected initPlan(plan: Plan): StagePlanner {
    this.currentPlans.set(plan.id, plan);
    this.handleAddSelector(plan.stages[plan.stage].selectors, plan.id);
    this.manageQues();
    const conclude = () => {
      this.deletePlan(plan.id);
    };
    return {
      title: plan.title,
      planId: plan.id,
      conclude: conclude.bind(this)
    };
  }

  // [TODO Unify Streams]
  // outerPlan(title: string, stages: PartialStaging[], beat?: number) {
  //   return this.initPlan(this.createPlan(title, stages, true, beat));
  // }

  plan(title: string, stages: PartialStaging[], beat?: number): StagePlanner {
    // [TODO Unify Streams]
    // return this.initPlan(this.createPlan(title, stages, false, beat));
    return this.initPlan(this.createPlan(title, stages, beat));
  }

  protected deletePlan(planId: number) {
    const plan = this.currentPlans.get(planId);
    if (plan) {
      this.currentPlans.delete(planId);
      const selectors = plan.stages[plan.stage]?.selectors;
      if (selectors) {
        this.handleRemoveSelector(selectors, plan.id);
      }
      this.manageQues();
    }
    return plan;
  }

  protected updateFrequencyMap() {
    const que = this.priorityQue;
    const map: typeof this.frequencyMap = new Map();

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

    this.frequencyMap = map;
  }

  protected assemblePriorityQue() {
    let prioritize = false;
    const priorityMap: typeof this.priorityExists = new Map();
    const newList: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[] = [];
    for (const [_, plan] of this.currentPlans) {
      const stage = plan.stages[plan.stage];
      const priority = stage.priority;
      if (priority) {
        prioritize = true;
        const key = this.createPriorityKey(plan.id, plan.stage);
        const selectors = plan.stages[plan.stage].selectors;
        priorityMap.set(key, true);
        const entry = {
          planID: plan.id,
          priority,
          stage: plan.stage,
          selectors,
        };
        newList.push(entry);
        this.priorityExists.set(key, true);
      }
    }
    if (!prioritize) {
      this.priorityQue = [];
    } else {
      this.priorityQue = newList.sort((a, b) => b.priority - a.priority);
    }
    this.priorityExists = priorityMap;
    this.updateFrequencyMap();
  }

  protected assembleGeneralQues() {
    const generalMap: Map<string, {selector: KeyedSelector, planIDs: number[], priorityAggregate: number}> = new Map();
    // const outerMap: Map<string, {selector: KeyedSelector, planIDs: number[], priorityAggregate: number}> = new Map();
    for (const [_, plan] of this.currentPlans) {
      const map = generalMap;
      // [TODO Unify Streams]
      // if (plan.outer) {
      //   map = outerMap;
      // }
      const stage = plan.stages[plan.stage];
      const priority = stage.priority;
      if (priority === undefined) {
        const prepareMap = (selector: KeyedSelector) => {
          const entry = generalMap.get(selector.keys);
          const frequency = this.frequencyMap.get(selector.keys);
          if (entry) {
            entry.planIDs.push(plan.id);
          } else if (frequency) {
            map.set(selector.keys, {
              planIDs: [plan.id],
              priorityAggregate: frequency,
              selector: selector
            });
          } else {
            map.set(selector.keys, {
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
    const generalIdMap: Map<number, number> = new Map();
    // [TODO Unify Streams]
    // const outerIdMap: Map<number, number> = new Map();
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
    generalMap.forEach((slice) => {
      handleSlice(slice, generalIdMap);
    });
    // [TODO] Unify streams
    // outerMap.forEach((slice) => {
    //   handleSlice(slice, outerIdMap);
    // });
    const flatten = (map: Map<number, number>) => {
      const flat = [];
      for (const [id, frequency] of map.entries()) {
        flat.push([id, frequency]);
      }
      flat.sort((a, b) => b[1] - a[1]);
      // We should add a selector union
      return flat.map(([id, _]) => id);
    };
    this.generalQue = flatten(generalIdMap);
    // [TODO] Unify streams
    // this.outerQue = flatten(outerIdMap);
  }

  protected manageQues() {
    this.assemblePriorityQue();
    this.assembleGeneralQues();
  }

  protected _dispatch(
    axiumState: AxiumState,
    plan: Plan,
    value: Concepts,
    action: Action,
    options: dispatchOptions): void {
    let stageDelimiter = this.stageDelimiters.get(plan.id);
    let throttle = false;
    let goodAction = true;
    let run = true;
    [stageDelimiter, goodAction] = handleStageDelimiter(plan, action, stageDelimiter, options);
    [stageDelimiter, run] = handleRun(stageDelimiter, plan, action, options);
    this.stageDelimiters.set(plan.id, stageDelimiter);
    if (goodAction && run) {
      const action$ = axiumState.action$ as Subject<Action>;
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
      this.stageDelimiters.set(plan.id, stageDelimiter);
      if (!throttle && run) {
        let next = -1;
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
            this.handleRemoveSelector(plan.stages[plan.stage].selectors, plan.id);
          }
          plan.stage = next;
          this.manageQues();
          if (plan.stages[plan.stage]) {
            this.handleAddSelector(plan.stages[plan.stage].selectors, plan.id);
          }
          stageDelimiter.prevActions = [];
          stageDelimiter.unionExpiration = [];
          stageDelimiter.runOnceMap = new Map();
          this.stageDelimiters.set(plan.id, stageDelimiter);
        }
        // Horrifying
        // Keep in place, this prevents branch prediction from creating ghost actions if there is an action overflow.
        if (plan.stageFailed === -1) {
          action$.next(action);
        }
      }
    } else if (
      options?.runOnce === undefined &&
      (!options.throttle && (options.iterateStage === undefined || options.setStage === plan.stage))
    ) {
      plan.stageFailed = plan.stage;
      plan.stage = plan.stages.length;
      console.error('DELETED PLAN: ', plan.id);
      const deleted = this.deletePlan(plan.id);
      if (deleted) {
        axiumState.badPlans.push(plan);
      }
    }
  }

  protected execute(plan: Plan, index: number): void {
    const axiumState = getAxiumState(this.concepts);
    const dispatcher: Dispatcher = (() => (action: Action, options: dispatchOptions) => {
      this._dispatch(axiumState, plan, this.concepts, action, options);
    }).bind(this)();
    plan.stages[index].stage(this.concepts, dispatcher);
  }

  protected nextPlans() {
    this.currentPlans.forEach(plan => {
      this.nextPlan(plan);
    });
  }

  protected nextPlan(plan: Plan) {
    const index = plan.stage;
    if (index < plan.stages.length) {
      const timer = plan.timer;
      const now = Date.now();
      if (plan.beat > -1) {
        if (plan.offBeat < now) {
          plan.offBeat = Date.now() + plan.beat;
          this.execute(plan, index);
        } else if (timer.length === 0 && plan.offBeat > now) {
          timer.push(setTimeout(() => {
            plan.timer = [];
            plan.offBeat = Date.now() + plan.beat;
            this.execute(plan, index);
          }, plan.offBeat - Date.now()));
        }
      } else {
        this.execute(plan, index);
      }
    }
  }

  protected nextSubs() {
    const {observers} = this;
    const len = observers.length;
    const nextSub = (index: number) => {
      if (observers[index]) {
        observers[index].next(this.concepts);
      }
      if (index < len - 1) {
        nextSub(index + 1);
      }
    };
    nextSub(0);
  }

  protected handleChange(concepts: Concepts) {
    const notifyIds: Map<number, number> = new Map();
    for (const [_, slice] of this.selectors) {
      const {selector, ids} = slice;
      let notify = false;
      if (slice.selector.conceptName === ALL) {
        notify = true;
      } else {
        const incoming = select.slice(concepts, selector);
        const original = select.slice(this.concepts, selector);
        if (typeof incoming === 'object' && !Object.is(incoming, original)) {
          // stuff
          notify = true;
        } else if (incoming !== original) {
          notify = true;
        }
      }
      if (notify) {
        ids.forEach(id => notifyIds.set(id, id));
      }
    }

    this.concepts = concepts;

    const notification = (id: number) => {
      const ready = notifyIds.has(id);
      const plan = this.currentPlans.get(id);
      if (plan && ready) {
        this.nextPlan(plan as Plan);
      }
    };

    for (const p of this.priorityQue) {
      notification(p.planID);
    }
    for (const g of this.generalQue) {
      notification(g);
    }
    // [TODO] Unify streams
    // if (axium.isOpen(concepts)) {
    //   for (const o of this.outerQue) {
    //     notification(o);
    //   }
    // }
  }

  next(concepts: Concepts) {
    if (!this.closed) {
      this.handleChange(concepts);
      // We notify subs last to encourage actions being acted upon observations
      // Then by utilizing a set quality we may inform the next observation of the change
      this.nextSubs();
    }
  }
}
/*#>*/