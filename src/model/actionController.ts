/*<$
For the asynchronous graph programming framework Stratimux, define the Action Controller model file.
This file defines the asynchronous functionality for Methods.
That will utilize an Action's expiration as a means to invalidate an Action if the asynchronous functionality has
reached its expiration. Emitting a Strategy Failed if the Action was a Strategy, or bad action if the strategy was
not provided.
$>*/
/*<#*/
import { Action, AnyAction, muxiumBadAction, createAction, Deck, strategyFailed } from '../index';
import { Subject } from 'rxjs';
import { failureConditions, strategyData_appendFailure } from './actionStrategyData';
import { ActionDeck, Self } from './concept';

const badAction = (payload: {
  badActions: AnyAction[]
}) => createAction('Muxium received a Bad Action', {
  payload
});

export class ActionController extends Subject<[Action<any>, boolean]> {
  expiration: number;
  expired: boolean;
  timer: NodeJS.Timeout | undefined;
  action: AnyAction;
  deck: Deck<any>;
  constructor(act: ActionDeck<any, any>) {
    super();
    const {action, deck} = act;
    this.expiration = action.expiration;
    this.expired = false;
    this.action = action;
    this.deck = deck;
    if (this.expiration < Date.now()) {
      if (this.action.strategy) {
        this.fire(strategyFailed(
          this.action.strategy,
          strategyData_appendFailure(this.action.strategy, failureConditions.controllerExpired)
        ));
      } else {
        this.next([badAction({badActions: [this.action]}) as unknown as Action<void>, true]);
      }
    } else {
      this.timer = setTimeout(() => {
        this.expired = true;
        if (this.action.strategy) {
          this.next([strategyFailed(
            this.action.strategy,
            strategyData_appendFailure(this.action.strategy, failureConditions.controllerExpired)
          ), true]);
        } else {
          this.next([badAction({badActions: [this.action]}) as unknown as Action<void>, true]);
        }
      }, this.expiration - Date.now());
    }
  }
  /**
   * Next fires once and then completes.
   * In case someone uses next over fire.
   */
  next(union: [Action, boolean]) {
    this.fire(union[0]);
  }
  /**
   * Fires once and then completes.
   */
  fire(action: Action<any>) {
    if (!this.closed) {
      if (!this.expired && this.timer) {
        clearTimeout(this.timer);
        this.timer.unref();
      }
      const { observers } = this;
      const len = observers.length;
      for (let i = 0; i < len; i++) {
        observers[i].next([action, true]);
      }
      this.complete();
    }
  }
}

export type ActionControllerParams<T = void, C = void> = {
controller: ActionController, action: Action<T>, deck: Deck<C>, self: Self<T>
}

export const createActionController$ = <T = void, C = void>(
  act: ActionDeck<T, C>,
  controlling: (params: ActionControllerParams<T, C>) => void
) => {
  const ctrl = new ActionController(act);
  const {action, deck, self} = act;
  // Needs to have timeout so that subscribers have time to attach in case the controller fires synchronously.
  setTimeout(() => {
    // Logically Determined muxiumConclude;
    if (action.semaphore[3] === 3) {
      ctrl.fire(action);
    } else {
      controlling({controller: ctrl, action, deck, self});
    }
  }, 0);
  return ctrl;
};

export class ActionControllerForEach extends Subject<Action> {
  constructor(actions: Action[]) {
    super();
    setTimeout(() => {
      actions.forEach(action => {
        if (action.expiration < Date.now()) {
          this.fire(action);
        } else if (action.strategy) {
          this.fire(
            strategyFailed(action.strategy,
              strategyData_appendFailure(action.strategy, failureConditions.muxiumExpired)));
        } else {
          this.fire(action);
        }
      });
      this.complete();
    }, 0);
  }
  // next(action: Action[]) {

  // }
  fire(action: Action) {
    if (!this.closed) {
      const { observers } = this;
      const len = observers.length;
      for (let i = 0; i < len; i++) {
        observers[i].next(action);
      }
    }
  }
}

export const createActionControllerForEach$ = (acts: Action[]) => {
  const ctrl = new ActionControllerForEach(acts);
  return ctrl;
};

export const actionController = ({
  create$: createActionController$
});
/*#>*/