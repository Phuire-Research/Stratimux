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
import { getAxiumState } from './axium';

export type Plan = {
  id: number;
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

export type NamedStagePlanner = {
  name: string;
  title: string;
  planId: number;
  conclude: () => void;
}

export type StagePlanner = {
  title: string;
  planId: number;
  conclude: () => void;
}

export type dispatchOptions = {
  runOnce?: boolean;
  iterateStage?: boolean;
  setStage?: number;
  on?: {
    selector: KeyedSelector,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expected: any
  },
  throttle?: number;
}

export type Dispatcher = (action: Action, options: dispatchOptions) => void;

export type StageDelimiter = {
  stage: number,
  prevActions: ActionType[],
  unionExpiration: number[];
  runOnceMap: Map<string, boolean>
}

export const stageWaitForOpenThenIterate = (action: Action): Stage => (concepts: Concepts, dispatch: Dispatcher) => {
  dispatch(action, {
    on: {
      selector: axiumSelectOpen,
      expected: true
    },
    iterateStage: true
  });
};

export const stageWaitForOwnershipThenIterate = (action: Action): Stage => (concepts: Concepts, dispatch: Dispatcher) => {
  dispatch(action, {
    on: {
      selector: ownershipSelectInitialized,
      expected: true
    },
    iterateStage: true
  });
};

export const createStage = (stage: Stage, selector?: KeyedSelector[], priority?: number, beat?: number): Staging => {
  return {
    stage,
    selectors: selector ? selector : [],
    priority,
    beat
  };
};

const ALL = '*4||*';

const handleRun =
  (value: Concepts, stageDelimiter: StageDelimiter, plan: Plan, action: Action, options?: dispatchOptions)
    : [StageDelimiter, boolean] => {
    if (options?.on) {
      if (selectSlice(value, options?.on.selector) === options?.on.expected) {
        if (options.runOnce) {
          const runOnceMap = stageDelimiter.runOnceMap.get(action.type + plan.stage);
          if (runOnceMap === undefined) {
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
        } else {
          return [
            stageDelimiter, true
          ];
        }
      } else {
        const unionExpiration: number[] = [];
        stageDelimiter.prevActions = stageDelimiter.prevActions.filter((at, i) => {
          if (at !== action.type && stageDelimiter.unionExpiration[i] !== action.expiration) {
            unionExpiration.push(unionExpiration[i]);
            return true;
          } else {
            return false;
          }
        });
        stageDelimiter.unionExpiration = unionExpiration;
        return [
          stageDelimiter, false
        ];
      }
    } else if (options?.runOnce) {
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
  private planId = 0;
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
  // The above approach is enhanced by a onChange dict
  constructor() {
    super();
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

  plan(title: string, stages: PartialStaging[], beat?: number): StagePlanner {
    const planId = this.planId;
    this.planId++;
    const staged: Staging[] = stages.map<Staging>(s => {
      return {
        stage: s.stage,
        selectors: s.selectors ? s.selectors : [],
        priority: s.priority,
        beat: s.beat
      };
    });
    const plan: Plan = {id: planId, title, stages: staged, stage: 0, stageFailed: -1, beat: beat ? beat : -1, offBeat: -1, timer: []};
    this.currentPlans.set(planId, plan);
    this.manageQues();
    this.handleAddSelector(plan.stages[plan.stage].selectors, plan.id);
    // this.registerStagedSelector(plan);
    const conclude = () => {
      this.deletePlan(planId);
    };
    return {
      title: title,
      planId: planId,
      conclude: conclude.bind(this)
    };
  }

  protected deletePlan(planId: number) {
    const plan = this.currentPlans.get(planId);
    if (plan) {
      // this.removePlanSelector(plan);
      this.currentPlans.delete(planId);
      this.manageQues();
      this.handleRemoveSelector(plan.stages[plan.stage].selectors, plan.id);
    }
  }

  protected updateFrequencyMap() {
    // Logic to add each unique priority number together per unique selector
    // Add such to a dictionary that we then use to control the generalized list.
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
        let added = false;
        let newList: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[] = [];
        for (const [i, slice] of this.priorityQue.entries()) {
          if (slice.priority < priority && slice.planID !== entry.planID) {
            const remainder = this.priorityQue.slice(i);
            newList = [
              ...newList,
              entry,
              ...remainder
            ];
            added = true;
            break;
          } else {
            newList.push(slice);
          }
        }
        if (!added) {
          newList.push(entry);
        }
        this.priorityQue = newList;
        this.priorityExists.set(key, true);
      }
    }
    if (!prioritize) {
      this.priorityQue = [];
    }
    this.priorityExists = priorityMap;
    this.updateFrequencyMap();
  }

  protected assembleGeneralQue() {
    // Fresh assemble
    const generalMap: Map<string, {selector: KeyedSelector, planIDs: number[], priorityAggregate: number}> = new Map();
    for (const [_, plan] of this.currentPlans) {
      console.log('CHECK PLAN', plan);
      const stage = plan.stages[plan.stage];
      const priority = stage.priority;
      if (priority === undefined) {
        const prepareGeneralMap = (selector: KeyedSelector) => {
          const entry = generalMap.get(selector.keys);
          const frequency = this.frequencyMap.get(selector.keys);
          if (entry) {
            entry.planIDs.push(plan.id);
          } else if (frequency) {
            generalMap.set(selector.keys, {
              planIDs: [plan.id],
              priorityAggregate: frequency,
              selector: selector
            });
          } else {
            generalMap.set(selector.keys, {
              planIDs: [plan.id],
              priorityAggregate: 0,
              selector: selector
            });
          }
        };
        if (stage.selectors.length === 0) {
          prepareGeneralMap(createConceptKeyedSelector(ALL, ALL));
        } else {
          for (const selector of stage.selectors) {
            prepareGeneralMap(selector);
          }
        }
      }
    }
    // Then based on the aggregate frequency per stage selector in total
    // Add such to general que.
    // Where we assume no frequency may be any order.
    const planIdMap: Map<number, number> = new Map();
    for (const [_, slice] of generalMap.entries()) {
      slice.planIDs.forEach(id => {
        const priority = planIdMap.get(id);
        if (priority) {
          planIdMap.set(id, priority + slice.priorityAggregate);
        } else {
          planIdMap.set(id, slice.priorityAggregate);
        }
      });
    }
    const flat = [];
    for (const [id, frequency] of planIdMap.entries()) {
      flat.push([id, frequency]);
    }
    flat.sort((a, b) => b[1] - a[1]);
    // We should add a selector union
    this.generalQue = flat.map(([id, _]) => id);
    console.log('CHECK: ', planIdMap, flat, this.generalQue);
  }

  // To rebuild each time, or to change atomically that is the question
  // Generalized example
  // Devise priority frequency map
  // For each selector, create a dictionary that stores the total priority within that list
  // Then from highest to lowest assemble a priority dispatch que
  // Where this que checks in order of priority slices of state that changed
  // If changed dispatches.
  // Replaces old next rotation
  // Specific Example
  // Would be to replace the above to utilize a priority list for specific parts
  // Then to utilize the above again to finish notifying the generalized aspect
  // Best of both worlds Specifics Generalized
  protected manageQues() {
    this.assemblePriorityQue();
    this.assembleGeneralQue();
  }

  // protected registerStagedSelector(plan: Plan) {
  //   const insert = (key: string) => {
  //     const range = this.selectors.get(key);
  //     if (range) {
  //       const priority = plan.stages[plan.stage].priority;
  //       if (priority) {
  //         let found = false;
  //         const newList: number[] = [];
  //         for (let i = 0; i < range.length; i++) {
  //           const p = this.currentPlans.get(range[i]);
  //           if (p) {
  //             const pPriority = p.stages[p.stage].priority;
  //             if (pPriority && pPriority < priority) {
  //               newList.push(plan.id);
  //               found = true;
  //               this.selectors.set(s.keys, [
  //                 ...newList,
  //                 ...range.slice(i)
  //               ]);
  //               break;
  //             } else {
  //               newList.push(p.id);
  //             }
  //           }
  //         }
  //         if (!found) {
  //           this.selectors.set(key, [
  //             plan.id,
  //             ...newList,
  //           ]);
  //         }
  //       } else {
  //         this.selectors.set(key, [
  //           ...range,
  //           plan.id
  //         ]);
  //       }
  //     } else {
  //       this.selectors.set(key, [plan.id]);
  //     }
  //   };

  //   const selectors = plan.stages[plan.stage].selectors;
  //   if (selectors.length === 0) {
  //     insert(ALL);
  //   } else {
  //     selectors.forEach(s => {
  //       insert(s.keys);
  //     });
  //   }
  // }

  // protected removePlanSelector(plan: Plan) {
  //   const remove = (key: string) => {
  //     const range = this.selectors.get(key);
  //     if (range) {
  //       const newList: number[] = [];
  //       for (let i = 0; i < range.length; i++) {
  //         if (range[i] !== plan.id) {
  //           newList.push(range[i]);
  //         }
  //       }
  //       if (newList.length === 0) {
  //         this.selectors.delete(key);
  //       } else {
  //         this.selectors.set(key, newList);
  //       }
  //     }
  //   };
  //   const selectors = plan.stages[plan.stage].selectors;
  //   if (selectors.length === 0) {
  //     remove(ALL);
  //   } else {
  //     selectors.forEach(s => {
  //       remove(s.keys);
  //     });
  //   }
  // }

  // protected updatePlanSelector(plan: Plan, start: number, end?: number) {
  //   this.removePlanSelector({...plan, stage: start});
  //   if (end) {
  //     this.registerStagedSelector({...plan, stage: end});
  //   }
  // }

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
    [stageDelimiter, run] = handleRun(value, stageDelimiter, plan, action, options);
    // console.log('HIT', action, goodAction, run);
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
          console.log('CHECK ERROR', plan);
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
      (options.on === undefined ||
      (options.on && (!options.throttle && (options.iterateStage === undefined || options.setStage === plan.stage)))
      )) {
      plan.stageFailed = plan.stage;
      plan.stage = plan.stages.length;
      const deleted = this.currentPlans.delete(plan.id);
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
      const incoming = selector.selector(concepts);
      const original = selector.selector(this.concepts);
      let notify = false;
      if (slice.selector.conceptName === ALL) {
        notify = true;
      } else if (typeof incoming === 'object' && Object.is(incoming, original)) {
        // stuff
        notify = true;
      } else if (incoming !== original) {
        notify = true;
      }
      if (notify) {
        ids.forEach(id => notifyIds.set(id, id));
      }
    }
    this.concepts = concepts;

    console.log('HITTING!!!', notifyIds, this.priorityQue, this.generalQue);

    for (const p of this.priorityQue) {
      const ready = notifyIds.has(p.planID);
      console.log('CHECK!!!', ready);
      const plan = this.currentPlans.get(p.planID);
      if (plan && ready) {
        this.nextPlan(plan as Plan);
      }
    }
    for (const g of this.generalQue) {
      const ready = notifyIds.has(g);
      console.log('CHECK!!!', ready);
      const plan = this.currentPlans.get(g);
      if (plan && ready) {
        this.nextPlan(plan as Plan);
      }
    }
  }

  // Per next we will check old versus new concepts for changed values via a list of selectors
  // These selectors are aggregated from incoming plans
  // If said selector has been triggered, store a map of changes based on selector
  // Then cycle through priorityQue then generalQue notifying each plan only once that a change happened
  // To increase the speed of this after initialization, we may use semaphores.
  next(concepts: Concepts) {
    if (!this.closed) {
      // Need a Stage Observer that would merely deconstruct to {concepts: Concepts , dispatch: Dispatcher}
      // Where Dispatcher would be (action$: Subject<Action>) => {}();

      // Next up to do: Add back in ALL option.
      this.handleChange(concepts);
      this.nextSubs();
    }
  }
}
/*#>*/