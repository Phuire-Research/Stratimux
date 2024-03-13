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
import { KeyedSelector, selectSlice } from './selector';
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
  // Selector key, number is planId
  private selectors: Map<string, number[]> = new Map();
  private priorityQue: string[] = [];
  constructor() {
    super();
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
    this.registerStagedSelector(plan);
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
      this.removePlanSelector(plan);
      this.currentPlans.delete(planId);
    }
  }

  protected updatePriorityQue() {
    const newList: string[] = [];
    // Generalized example
    // Devise priority heatmap
    // For each selector, create a dictionary that stores the total priority within that list
    // Then from highest to lowest assemble a priority dispatch que
    // Where this que checks in order of priority slices of state that changed
    // If changed dispatches.
    // Replaces old next rotation
    // Specific Example
    // Would be to replace the above to utilize a priority list for specific parts
    // Then to utilize the above again to finish notifying the generalized aspect
    // Best of both worlds
  }

  protected registerStagedSelector(plan: Plan) {
    const insert = (key: string) => {
      const range = this.selectors.get(key);
      if (range) {
        const priority = plan.stages[plan.stage].priority;
        if (priority) {
          let found = false;
          const newList: number[] = [];
          for (let i = 0; i < range.length; i++) {
            const p = this.currentPlans.get(range[i]);
            if (p) {
              const pPriority = p.stages[p.stage].priority;
              if (pPriority && pPriority < priority) {
                newList.push(plan.id);
                found = true;
                this.selectors.set(s.keys, [
                  ...newList,
                  ...range.slice(i)
                ]);
                break;
              } else {
                newList.push(p.id);
              }
            }
          }
          if (!found) {
            this.selectors.set(key, [
              plan.id,
              ...newList,
            ]);
          }
        } else {
          this.selectors.set(key, [
            ...range,
            plan.id
          ]);
        }
      } else {
        this.selectors.set(key, [plan.id]);
      }
    };

    const selectors = plan.stages[plan.stage].selectors;
    if (selectors.length === 0) {
      insert(ALL);
    } else {
      selectors.forEach(s => {
        insert(s.keys);
      });
    }
  }

  protected removePlanSelector(plan: Plan) {
    const remove = (key: string) => {
      const range = this.selectors.get(key);
      if (range) {
        const newList: number[] = [];
        for (let i = 0; i < range.length; i++) {
          if (range[i] !== plan.id) {
            newList.push(range[i]);
          }
        }
        if (newList.length === 0) {
          this.selectors.delete(key);
        } else {
          this.selectors.set(key, newList);
        }
      }
    };
    const selectors = plan.stages[plan.stage].selectors;
    if (selectors.length === 0) {
      remove(ALL);
    } else {
      selectors.forEach(s => {
        remove(s.keys);
      });
    }
  }

  protected updatePlanSelector(plan: Plan, start: number, end?: number) {
    this.removePlanSelector({...plan, stage: start});
    if (end) {
      this.registerStagedSelector({...plan, stage: end});
    }
  }

  protected _dispatch(
    axiumState: AxiumState,
    key: number, plan: Plan,
    value: Concepts,
    action: Action,
    options: dispatchOptions): void {
    let stageDelimiter = this.stageDelimiters.get(key);
    let throttle = false;
    let goodAction = true;
    let run = true;
    [stageDelimiter, goodAction] = handleStageDelimiter(plan, action, stageDelimiter, options);
    [stageDelimiter, run] = handleRun(value, stageDelimiter, plan, action, options);
    // console.log('HIT', action, goodAction, run);
    this.stageDelimiters.set(key, stageDelimiter);
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
      this.stageDelimiters.set(key, stageDelimiter);
      if (!throttle && run) {
        if (options?.iterateStage) {
          const next = plan.stage + 1;
          this.updatePlanSelector(plan, plan.stage, next < plan.stages.length ? next : undefined);
          plan.stage = next;
        }
        if (options?.setStage !== undefined) {
          plan.stage = options.setStage;
        }
        if (options?.iterateStage || (options?.setStage && options.setStage !== plan.stage)) {
          stageDelimiter.prevActions = [];
          stageDelimiter.unionExpiration = [];
          stageDelimiter.runOnceMap = new Map();
          this.stageDelimiters.set(key, stageDelimiter);
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
      const deleted = this.currentPlans.delete(key);
      if (deleted) {
        axiumState.badPlans.push(plan);
      }
    }
  }

  protected execute(plan: Plan, key: number, index: number): void {
    const axiumState = getAxiumState(this.concepts);
    const dispatcher: Dispatcher = (() => (action: Action, options: dispatchOptions) => {
      this._dispatch(axiumState, key, plan, this.concepts, action, options);
    }).bind(this)();
    plan.stages[index].stage(this.concepts, dispatcher);
  }

  protected nextPlans() {
    this.currentPlans.forEach((plan, key) => {
      const index = plan.stage;
      if (index < plan.stages.length) {
        const timer = plan.timer;
        const now = Date.now();
        if (plan.beat > -1) {
          if (plan.offBeat < now) {
            plan.offBeat = Date.now() + plan.beat;
            this.execute(plan, key, index);
          } else if (timer.length === 0 && plan.offBeat > now) {
            timer.push(setTimeout(() => {
              plan.timer = [];
              plan.offBeat = Date.now() + plan.beat;
              this.execute(plan, key, index);
            }, plan.offBeat - Date.now()));
          }
        } else {
          this.execute(plan, key, index);
        }
      }
    });
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

  next(concepts: Concepts) {
    this.concepts = {
      ...concepts
    };
    if (!this.closed) {
      // Need a Stage Observer that would merely deconstruct to {concepts: Concepts , dispatch: Dispatcher}
      // Where Dispatcher would be (action$: Subject<Action>) => {}();
      this.nextPlans();
      this.nextSubs();
    }
  }
}
/*#>*/