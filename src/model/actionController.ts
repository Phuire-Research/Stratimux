import { Action, axiumBadAction, strategyFailed } from '../index';
import { Subject } from 'rxjs';
import { failureConditions, strategyData_appendFailure } from './actionStrategyData';

export class ActionController extends Subject<Action> {
  expiration: number;
  expired: boolean;
  timer: NodeJS.Timeout | undefined;
  action: Action;
  constructor(action: Action) {
    super();
    this.expiration = action.expiration;
    this.expired = false;
    this.action = action;
    if (this.expiration < Date.now()) {
      if (this.action.strategy) {
        this.fire(strategyFailed(
          this.action.strategy,
          strategyData_appendFailure(this.action.strategy, failureConditions.controllerExpired)
        ));
      } else {
        this.next(axiumBadAction([this.action]));
      }
    } else {
      this.timer = setTimeout(() => {
        this.expired = true;
        if (this.action.strategy) {
          this.next(strategyFailed(
            this.action.strategy,
            strategyData_appendFailure(this.action.strategy, failureConditions.controllerExpired)
          ));
        } else {
          this.next(axiumBadAction([this.action]));
        }
      }, this.expiration - Date.now());
    }
  }
  /**
   * Next fires once and then completes.
   * In case someone uses next over fire.
   */
  next(action: Action) {
    this.fire(action);
  }
  /**
   * Fires once and then completes.
   */
  fire(action: Action) {
    if (!this.closed) {
      if (!this.expired && this.timer) {
        clearTimeout(this.timer);
        this.timer.unref();
      }
      const { observers } = this;
      const len = observers.length;
      for (let i = 0; i < len; i++) {
        observers[i].next(action);
      }
      this.complete();
    }
  }
}

export const createActionController$ = (act: Action, controlling: (controller: ActionController, action: Action) => void) => {
  const ctrl = new ActionController(act);
  // Needs to have timeout so that subscribers have time to attach in case the controller fires synchronously.
  setTimeout(() => {
    // Logically Determined axiumConclude;
    if (act.semaphore[3] === 3) {
      ctrl.fire(act);
    } else {
      controlling(ctrl, act);
    }
  }, 0);
  return ctrl;
};
