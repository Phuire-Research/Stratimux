/* eslint-disable complexity */
import { Observer, Subscription, Subject } from 'rxjs';
import { Concept } from './concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { KeyedSelector, selectSlice } from './selector';
import { Action, ActionType } from './action';

export type Staged = {
  title: string;
  stages: Staging[],
  step: number;
  stepFailed: number;
}

export type dispatchOptions = {
  runOnce?: boolean;
  iterateStep?: boolean;
  setStep?: number;
  on?: {
    selector: KeyedSelector,
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
  step: number,
  prevActions: ActionType[],
  unionExpiration: number[];
  stageRunner: Map<string, boolean>
}

const handleRun =
  (value: Concept[], stageDelimiter: StageDelimiter, staged: Staged, action: Action, options?: dispatchOptions)
    : [StageDelimiter, boolean] => {
    if (options?.on) {
      if (selectSlice(value, options?.on.selector) === options?.on.expected) {
        const stageRunner = stageDelimiter.stageRunner.get(action.type + staged.step);
        if (stageRunner === undefined) {
          stageDelimiter.stageRunner.set(action.type + staged.step, true);
          return [
            stageDelimiter, true
          ];
        } else {
          stageDelimiter.stageRunner.set(action.type + staged.step, false);
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
      const stageRunner = stageDelimiter.stageRunner.get(action.type + staged.step);
      if (stageRunner === undefined) {
        stageDelimiter.stageRunner.set(action.type + staged.step, true);
        return [
          stageDelimiter, true
        ];
      } else {
        stageDelimiter.stageRunner.set(action.type + staged.step, false);
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
  (staged: Staged, action: Action, delimiter?: StageDelimiter, options?: dispatchOptions): [StageDelimiter, boolean] => {
    let stageDelimiter = delimiter;
    let goodAction = true;
    if (stageDelimiter &&
        stageDelimiter.prevActions.includes(action.type) &&
        options?.debounce === undefined) {
      if (staged.step !== stageDelimiter?.step) {
        stageDelimiter = {
          step: staged.step,
          prevActions: [action.type],
          unionExpiration: [action.expiration],
          stageRunner: new Map()
        };
      } else {
        goodAction = false;
      }
    } else if (stageDelimiter) {
      stageDelimiter = {
        step: staged.step,
        prevActions: [...stageDelimiter.prevActions ,action.type],
        unionExpiration: [...stageDelimiter.unionExpiration, action.expiration],
        stageRunner: new Map()
      };
    } else {
      stageDelimiter = {
        step: staged.step,
        prevActions: [action.type],
        unionExpiration: [action.expiration],
        stageRunner: new Map()
      };
    }
    return [
      stageDelimiter,
      goodAction
    ];
  };

export class UnifiedSubject extends Subject<Concept[]> {
  private stageId = 0;
  private currentStages: Map<number, Staged> = new Map();
  private stageDelimiters: Map<number, StageDelimiter> = new Map();
  constructor() {
    super();
  }
  stage(title: string, stages: Staging[]) {
    this.currentStages.set(this.stageId, {title, stages, step: 0, stepFailed: -1});
    this.stageId++;
    return {
      close: () => {
        this.currentStages.delete(this.stageId);
      }
    };
  }

  next(value: Concept[]) {
    if (!this.closed) {
      // Need a Stage Observer that would merely deconstruct to {concepts: Concept[], dispatch: Dispatcher}
      // Where Dispatcher would be (action$: Subject<Action>) => {}();
      const axiumState = value[0].state as AxiumState;
      this.currentStages.forEach((staged, key) => {
        const dispatcher: Dispatcher = (action: Action, options: dispatchOptions) => {
          let stageDelimiter = this.stageDelimiters.get(key);
          let debounce = false;
          let goodAction = true;
          let run = true;
          [stageDelimiter, goodAction] = handleStageDelimiter(staged, action, stageDelimiter, options);
          [stageDelimiter, run] = handleRun(value, stageDelimiter, staged, action, options);
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
                staged.step = options.setStep;
              }
              if (options?.iterateStep) {
                staged.step += 1;
              }
              // Horrifying
              if (staged.stepFailed === -1) {
                action$.next(action);
              }
            }
          } else if (options?.runOnce === undefined) {
            staged.stepFailed = staged.step;
            staged.step = staged.stages.length;
            const deleted = this.currentStages.delete(key);
            if (deleted) {
              axiumState.badStages.push(staged);
            }
          }
        };
        const index = staged.step;
        if (index < staged.stages.length) {
          staged.stages[index](value, dispatcher);
        }
      });
    }
    const {observers} = this;

    const len = observers.length;
    for (let i = 0; i < len; i++) {
      observers[i].next(value);
    }
  }
}
