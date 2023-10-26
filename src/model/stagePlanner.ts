/* eslint-disable complexity */
import { Subject } from 'rxjs';
import { Concept } from './concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { KeyedSelector, selectSlice } from './selector';
import { Action, ActionType } from './action';
import { axiumSelectOpen } from '../concepts/axium/axium.selector';
import { ownershipSelectInitialized } from '../concepts/ownership/ownership.selector';

export type Plan = {
  title: string;
  stages: Staging[],
  stage: number;
  stageFailed: number;
}

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
export type Staging = (
  concepts: Concept[],
  dispatch: (action: Action, options: dispatchOptions) => void
) => void;
export type StageDelimiter = {
  stage: number,
  prevActions: ActionType[],
  unionExpiration: number[];
  runOnceMap: Map<string, boolean>
}

export const stageWaitForOpenThenIterate = (action: Action): Staging => (concepts: Concept[], dispatch: Dispatcher) => {
  dispatch(action, {
    on: {
      selector: axiumSelectOpen,
      expected: true
    },
    iterateStage: true
  });
};

export const stageWaitForOwnershipThenIterate = (action: Action): Staging => (concepts: Concept[], dispatch: Dispatcher) => {
  dispatch(action, {
    on: {
      selector: ownershipSelectInitialized,
      expected: true
    },
    iterateStage: true
  });
};

const handleRun =
  (value: Concept[], stageDelimiter: StageDelimiter, plan: Plan, action: Action, options?: dispatchOptions)
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

export class UnifiedSubject extends Subject<Concept[]> {
  private planId = 0;
  private currentStages: Map<number, Plan> = new Map();
  private stageDelimiters: Map<number, StageDelimiter> = new Map();
  constructor() {
    super();
  }
  stage(title: string, stages: Staging[]): StagePlanner {
    const planId = this.planId;
    this.planId++;
    this.currentStages.set(planId, {title, stages, stage: 0, stageFailed: -1});
    const conclude = () => {
      this.currentStages.delete(planId);
    };
    return {
      title: title,
      planId: planId,
      conclude: conclude.bind(this)
    };
  }

  protected _dispatch(
    axiumState: AxiumState,
    key: number, plan: Plan,
    value: Concept[],
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
          plan.stage += 1;
        }
        if (options?.setStage) {
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
      const deleted = this.currentStages.delete(key);
      if (deleted) {
        axiumState.badPlans.push(plan);
      }
    }
  }

  next(value: Concept[]) {
    const concepts = [
      ...value
    ];
    if (!this.closed) {
      // Need a Stage Observer that would merely deconstruct to {concepts: Concept[], dispatch: Dispatcher}
      // Where Dispatcher would be (action$: Subject<Action>) => {}();
      const axiumState = value[0].state as AxiumState;
      this.currentStages.forEach((plan, key) => {
        const dispatcher: Dispatcher = (action: Action, options: dispatchOptions) => {
          this._dispatch(axiumState, key, plan, concepts, action, options);
        };
        const index = plan.stage;
        if (index < plan.stages.length) {
          plan.stages[index](value, dispatcher);
        }
      });
      const {observers} = this;

      const len = observers.length;
      for (let i = 0; i < len; i++) {
        if (observers[i]) {
          observers[i].next(concepts);
        }
      }
    }
  }
}
