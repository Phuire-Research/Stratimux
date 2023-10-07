/* eslint-disable complexity */
import { Subject } from 'rxjs';
import { Concept } from './concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { KeyedSelector, selectSlice } from './selector';
import { Action, ActionType } from './action';

export type Plan = {
  title: string;
  stages: Staging[],
  stage: number;
  stageFailed: number;
}

export type dispatchOptions = {
  runOnce?: boolean;
  iterateStep?: boolean;
  setStep?: number;
  on?: {
    selector: KeyedSelector,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expected: any
  },
  debounce?: number;
}

export type Dispatcher = (action: Action, options: dispatchOptions) => void;
export type Staging = (
  concepts: Concept[],
  dispatch: (action: Action, options: dispatchOptions) => void
) => void;
// export type Stage = (id: number) => () => void;
export type StageDelimiter = {
  stage: number,
  prevActions: ActionType[],
  unionExpiration: number[];
  runOnceMap: Map<string, boolean>
}

const handleRun =
  (value: Concept[], stageDelimiter: StageDelimiter, plan: Plan, action: Action, options?: dispatchOptions)
    : [StageDelimiter, boolean] => {
    if (options?.on) {
      if (selectSlice(value, options?.on.selector) === options?.on.expected) {
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
        options?.debounce === undefined) {
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
      stageDelimiter = {
        stage: plan.stage,
        prevActions: [...stageDelimiter.prevActions ,action.type],
        unionExpiration: [...stageDelimiter.unionExpiration, action.expiration],
        runOnceMap: new Map()
      };
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
  private stageId = 0;
  private currentStages: Map<number, Plan> = new Map();
  private stageDelimiters: Map<number, StageDelimiter> = new Map();
  constructor() {
    super();
  }
  stage(title: string, stages: Staging[]) {
    this.currentStages.set(this.stageId, {title, stages, stage: 0, stageFailed: -1});
    this.stageId++;
    const close = () => {
      this.currentStages.delete(this.stageId);
    };
    return {
      close: close.bind(this)
    };
  }

  protected _dispatch(
    axiumState: AxiumState,
    key: number, plan: Plan,
    value: Concept[],
    action: Action,
    options: dispatchOptions): void {
    let stageDelimiter = this.stageDelimiters.get(key);
    let debounce = false;
    let goodAction = true;
    let run = true;
    [stageDelimiter, goodAction] = handleStageDelimiter(plan, action, stageDelimiter, options);
    [stageDelimiter, run] = handleRun(value, stageDelimiter, plan, action, options);
    this.stageDelimiters.set(key, stageDelimiter);
    if (goodAction && run) {
      const action$ = axiumState.action$ as Subject<Action>;
      if (options?.debounce !== undefined) {
        let previousExpiration = 0;
        for (let i = 0; i < stageDelimiter.prevActions.length; i++) {
          if (stageDelimiter.prevActions[i] === action.type) {
            previousExpiration = stageDelimiter.unionExpiration[i];
            break;
          }
        }
        if (previousExpiration !== action.expiration && action.expiration - previousExpiration < options?.debounce) {
          debounce = true;
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
      if (!debounce && run) {
        if (options?.setStep) {
          plan.stage = options.setStep;
        }
        if (options?.iterateStep) {
          plan.stage += 1;
        }
        // Horrifying
        // Keep in place, this prevents branch prediction from creating ghost actions if there is an action overflow.
        if (plan.stageFailed === -1) {
          action$.next(action);
        }
      }
    } else if (options?.runOnce === undefined) {
      plan.stageFailed = plan.stage;
      plan.stage = plan.stages.length;
      const deleted = this.currentStages.delete(key);
      if (deleted) {
        axiumState.badPlans.push(plan);
      }
    }
  }

  next(value: Concept[]) {
    if (!this.closed) {
      // Need a Stage Observer that would merely deconstruct to {concepts: Concept[], dispatch: Dispatcher}
      // Where Dispatcher would be (action$: Subject<Action>) => {}();
      const axiumState = value[0].state as AxiumState;
      this.currentStages.forEach((plan, key) => {
        const dispatcher: Dispatcher = (action: Action, options: dispatchOptions) => {
          this._dispatch(axiumState, key, plan, value, action, options);
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
          observers[i].next(value);
        }
      }
    }
  }
}
