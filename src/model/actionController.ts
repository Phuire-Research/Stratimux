import { Action, ActionStrategy, axiumBadAction, axiumConclude, axiumConcludeType, strategyFailed } from '../index';
import { Subject } from 'rxjs';
import { failureConditions, strategyData_appendFailure } from './actionStrategyData';

export class ActionController extends Subject<Action> {
  expiration: number;
  expired: boolean;
  timer: NodeJS.Timeout;
  action: Action;
  constructor(action: Action) {
    super();
    this.expiration = action.expiration;
    this.expired = false;
    this.action = action;
    this.timer = setTimeout(() => {
      this.expired = true;
      if (this.action.strategy) {
        this.next(strategyFailed(
          this.action.strategy,
          strategyData_appendFailure(this.action.strategy, failureConditions.controllerExpired)
        ));
      } else {
        const badAction = axiumBadAction([this.action]);
        if (this.action.strategy) {
          badAction.strategy = this.action.strategy;
          (badAction.strategy as ActionStrategy).currentNode.action = badAction;
          (badAction.strategy as ActionStrategy).currentNode.actionType = badAction.type;
        }
        this.next(axiumBadAction([this.action]));
      }
    }, this.expiration - Date.now());
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
      if (!this.expired) {
        clearTimeout(this.timer);
        this.timer.unref();
      }
      let nextAction;
      if (action.strategy) {
        nextAction = action;
      } else if (action.semaphore[3] !== 1) {
        const conclude = axiumConclude();
        nextAction = {
          ...action,
          ...conclude
        };
      } else {
        nextAction = action;
      }
      const { observers } = this;
      const len = observers.length;
      for (let i = 0; i < len; i++) {
        observers[i].next(nextAction);
      }
      this.complete();
    }
  }
}

export const createActionController$ = (act: Action, controlling: (controller: ActionController, action: Action) => void) => {
  const ctrl = new ActionController(act);
  // Needs to have timeout so that subscribers have time to attach in case the controller fires synchronously.
  setTimeout(() => {
    controlling(ctrl, act);
  }, 0);
  return ctrl;
};
