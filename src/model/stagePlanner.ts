/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner model file.
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
import { Action, ActionType, Actions, AnyAction, createAction } from './action';
import { axiumSelectOpen } from '../concepts/axium/axium.selector';
import { ownershipSelectInitialized } from '../concepts/ownership/ownership.selector';
import { Axium, AxiumDeck, HandleHardOrigin, HandleOrigin, accessAxium, createOrigin, getAxiumState, isAxiumOpen } from './axium';
import { ownershipSetOwnerShipModeTopic } from '../concepts/ownership/strategies/setOwnerShipMode.strategy';
import { axiumTimeOut } from './time';
import { HInterface, UInterface } from './interface';
import { Qualities } from './quality';
import { AxiumQualities } from '../concepts/axium/qualities';
import { Deck, accessDeck } from './deck';

export type Plan<Q = void, C = void> = {
  id: number;
  space: number;
  conceptSemaphore: number;
  conceptName: string;
  title: string;
  stages: Staging<Q, C>[],
  stage: number;
  stageFailed: number;
  beat: number;
  offBeat: number;
  timer: NodeJS.Timeout[];
  changeAggregator: Record<string, KeyedSelector>;
}

export type Stage<Q, C> = (params: StageParams<Q, C>) => void;

export type StageParams<Q = void, C = void> = {
  concepts: Concepts,
  dispatch: (action: Action<any>, options: dispatchOptions, ) => void,
  changes: KeyedSelector[],
  stagePlanner: StagePlanner
} & UInterface<Q, C>

export type Planning<Q = void, C = void> = (title: string, planner: Planner<Q, C>) => StagePlanner;

export type Planner<Q = void, C = void> = (uI: HInterface<Q, C> & {
  stage: typeof createStage<Q, C>
  stageO: typeof stageWaitForOpenThenIterate,
  conclude: typeof stageConclude
}) => PartialStaging<Q, C>[];

export type Staging<Q = void, C = void> = {
  stage: Stage<Q, C>;
  selectors: KeyedSelector[];
  firstRun: boolean;
  priority?: number
  beat?: number,
};

export type PartialStaging<Q = void, C = void> = {
  stage: Stage<Q, C>;
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
  override?: boolean;
  hardOverride?: boolean;
  runOnce?: boolean;
  throttle?: number;
  iterateStage?: boolean;
  setStage?: number;
  setStageSelectors?: {
    stage: number,
    selectors: KeyedSelector[]
  };
  setStagePriority?: {
    stage: number,
    priority: number
  };
  setStageBeat?: {
    stage: number,
    beat: number
  };
  newSelectors?: KeyedSelector[];
  newPriority?: number;
  newBeat?: number;
}

export type Dispatcher = (action: Action, options: dispatchOptions) => void;

export type StageDelimiter = {
  stage: number,
  prevActions: ActionType[],
  unionExpiration: number[];
  runOnceMap: Map<string, boolean>
}

/**
 * Used in principle plans that are loaded during axium initialization
 */
export const stageWaitForOpenThenIterate = <Q, C>(func: () => AnyAction): Staging<Q, C> => (createStage(({concepts, dispatch}) => {
  if (isAxiumOpen(concepts)) {
    dispatch(func(), {
      iterateStage: true
    });
  }
}, { selectors: [axiumSelectOpen] }));

export const stageConclude = <Q, C>(): Staging<Q, C> => createStage(({stagePlanner}) => {stagePlanner.conclude();});

export const stageWaitForOwnershipThenIterate =
  <Q, C>(func: () => Action): Staging<Q, C> => (createStage(({concepts, dispatch}) => {
    if (selectSlice(concepts, ownershipSelectInitialized) && getAxiumState(concepts).lastStrategy === ownershipSetOwnerShipModeTopic) {
      dispatch(func(), {
        iterateStage: true
      });
    }
  }, { selectors: [ownershipSelectInitialized] }));
/**
 * <Qualities, Concepts> Helper function to aid readability of composing plans, otherwise you may directly create a Staging Entity, selectors non optional
 * @param stage - (concepts, dispatch) => {}
 * @param selectors - Array of observed dependencies to execute your stage
 * @param priority - Adding this property will change the order in which your plan is notified on each state change
 * @param beat - Will fire once, then if informed again within your supplied beat, will fire after such time
 * @returns stage: Stage, selectors: KeyedSelector[], priority?: number, beat?: number
 */
export const createStage = <Q = void, C = void>(
  stage: Stage<Q, C>,
  options?: { selectors?: KeyedSelector[], priority?: number, beat?: number}
): Staging<Q, C> => {
  if (options) {
    return {
      stage,
      selectors: options.selectors ? options.selectors : [],
      firstRun: true,
      priority: options.priority,
      beat: options.beat
    };
  } else {
    return {
      stage,
      firstRun: true,
      selectors: []
    };
  }
};

// Token to denote ALL, using a selector that utilizes this token should return undefined
const ALL = '*4||*';

const handleRun =
  <Q, C>(stageDelimiter: StageDelimiter, plan: Plan<Q, C>, action: Action, options?: dispatchOptions)
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
  <Q, C>(plan: Plan<Q, C>, action: Action, delimiter?: StageDelimiter, options?: dispatchOptions): [StageDelimiter, boolean] => {
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

const Inner = 0;
const Base = 1;
const Outer = 2;

export class UnifiedSubject<Q = void, C = void> extends Subject<Concepts> {
  private planId = -1;
  private currentPlans: Map<number, Plan<any, any>> = new Map();
  private stageDelimiters: Map<number, StageDelimiter> = new Map();
  private concepts: Concepts = {};
  // Assemble front of line
  private priorityQue: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[] = [];
  private priorityExists: Map<string, boolean> = new Map();
  private frequencyMap: Map<string, number> = new Map();
  private selectors: Map<string, {selector: KeyedSelector, ids: number[]}> = new Map();
  // Assemble back of line, exempts priority que members
  private ques: {
    priorityQue: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[],
    generalQue: number[],
  }[] = [{generalQue: [], priorityQue: []}, {generalQue: [], priorityQue: []}, {generalQue: [], priorityQue: []}];
  // private generalQue: number[] = [];
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

  protected handleNewStageOptions = (plan: Plan<Q, C>, options: dispatchOptions, next: number): boolean => {
    let evaluate = false;
    if (options.newPriority) {
      plan.stages[plan.stage].priority = options.newPriority;
      evaluate = true;
    }
    if (options.newSelectors) {
      this.handleRemoveSelector(plan.stages[plan.stage].selectors, plan.id);
      plan.stages[plan.stage].selectors = options.newSelectors;
      this.handleAddSelector(plan.stages[plan.stage].selectors, plan.id);
      evaluate = true;
    }
    if (options.newBeat) {
      plan.stages[plan.stage].beat = options.newBeat;
      if (next === -1) {
        plan.beat = options.newBeat;
      }
      evaluate = true;
    }
    return evaluate;
  };

  protected handleSetStageOptions = (plan: Plan<Q, C>, options: dispatchOptions) => {
    if (options.setStageSelectors && plan.stages[options.setStageSelectors.stage]) {
      plan.stages[options.setStageSelectors.stage].selectors = options.setStageSelectors.selectors;
    }
    if (options.setStagePriority && plan.stages[options.setStagePriority.stage]) {
      plan.stages[options.setStagePriority.stage].priority = options.setStagePriority.priority;
    }
    if (options.setStageBeat && plan.stages[options.setStageBeat.stage]) {
      plan.stages[options.setStageBeat.stage].beat = options.setStageBeat.beat;
    }
  };

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

  protected createPlan = (
    title: string,
    planner: Planner<Q, C>,
    space: number,
    conceptSemaphore: number
  ): Plan<Q, C> => {
    const stages = planner({
      d__: accessDeck(this.concepts),
      e__: this.concepts[conceptSemaphore].actions as Actions<any>,
      c__: [],
      k__: {},
      stage: createStage,
      stageO: stageWaitForOpenThenIterate,
      conclude: stageConclude
    });
    const planId = this.planId;
    this.planId += 1;
    const staged: Staging<Q, C>[] = stages.map<Staging<Q, C>>(s => {
      return {
        stage: s.stage,
        selectors: s.selectors ? s.selectors : [],
        firstRun: true,
        priority: s.priority,
        beat: s.beat
      };
    });
    const beat = staged[0].beat;
    return {
      id: planId,
      space,
      conceptSemaphore,
      conceptName: this.concepts[conceptSemaphore].name,
      title,
      stages: staged,
      stage: 0,
      stageFailed: -1,
      beat: beat ? beat : -1,
      offBeat: -1,
      timer: [],
      changeAggregator: {}
    };
  };

  protected initPlan(plan: Plan<Q, C>): StagePlanner {
    this.currentPlans.set(plan.id, plan);
    this.handleAddSelector(plan.stages[plan.stage].selectors, plan.id);
    this.manageQues();
    const conclude = () => {
      this.deletePlan(plan.id);
    };
    axiumTimeOut(this.concepts, () => {
      this.next(this.concepts);
      return createAction('Conclude');
    }, 0);
    return {
      title: plan.title,
      planId: plan.id,
      conclude: conclude.bind(this)
    };
  }

  innerPlan: Planning<Q, C> = (title: string, planner: Planner<Q, C>) => {
    return this.initPlan(this.createPlan(title, planner, Inner, 0));
  };

  // [TODO] - IMPORTANT - LIMIT THIS TO WHITE LISTED VALUES
  outerPlan: Planning<Q, C> = (title: string, planner: Planner<Q, C>) => {
    return this.initPlan(this.createPlan(title, planner, Outer, 0));
  };

  plan = (conceptSemaphore: number): Planning<Q, C> => (title: string, planner: Planner<Q, C>): StagePlanner => {
    return this.initPlan(this.createPlan(title, planner, Base, conceptSemaphore));
  };

  protected deletePlan(planId: number) {
    const plan = this.currentPlans.get(planId);
    if (plan) {
      plan.timer.forEach(timer => clearTimeout(timer));
      plan.timer = [];
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
    const newList: {
      inner: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[],
      base: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[],
      outer: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[]
    } = {
      inner: [],
      base: [],
      outer: []
    };
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
        switch (plan.space) {
        case Inner: {
          newList.inner.push(entry);
          break;
        }
        case Base: {
          newList.base.push(entry);
          break;
        }
        case Outer: {
          newList.outer.push(entry);
          break;
        }
        default: {
          //
        }
        }
        this.priorityExists.set(key, true);
      }
    }
    if (!prioritize) {
      this.ques[Inner].priorityQue = [];
      this.ques[Base].priorityQue = [];
      this.ques[Outer].priorityQue = [];
    } else {
      this.ques[Inner].priorityQue = newList.inner.sort((a, b) => b.priority - a.priority);
      this.ques[Base].priorityQue = newList.base.sort((a, b) => b.priority - a.priority);
      this.ques[Outer].priorityQue = newList.outer.sort((a, b) => b.priority - a.priority);
    }
    // This will cause an issue
    this.priorityExists = priorityMap;
    this.updateFrequencyMap();
  }

  protected assembleGeneralQues() {
    const generalMap: {
      inner: Map<string, {selector: KeyedSelector, planIDs: number[], priorityAggregate: number}>
      base: Map<string, {selector: KeyedSelector, planIDs: number[], priorityAggregate: number}>
      outer: Map<string, {selector: KeyedSelector, planIDs: number[], priorityAggregate: number}>
    } = {
      inner: new Map(),
      base: new Map(),
      outer: new Map()
    };
    for (const [_, plan] of this.currentPlans) {
      // let map = generalMap;
      const stage = plan.stages[plan.stage];
      const priority = stage.priority;
      let target = generalMap.inner;
      switch (plan.space) {
      case Base: {
        target = generalMap.base;
        break;
      }
      case Outer: {
        target = generalMap.outer;
        break;
      }
      default: {
        //
      }
      }
      if (priority === undefined) {
        const prepareMap = (selector: KeyedSelector) => {
          const entry = target.get(selector.keys);
          const frequency = this.frequencyMap.get(selector.keys);
          if (entry) {
            entry.planIDs.push(plan.id);
          } else if (frequency) {
            target.set(selector.keys, {
              planIDs: [plan.id],
              priorityAggregate: frequency,
              selector: selector
            });
          } else {
            target.set(selector.keys, {
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
    const generalIdMap: {
      inner: Map<number, number>
      base: Map<number, number>
      outer: Map<number, number>
    } = {
      inner: new Map(),
      base: new Map(),
      outer: new Map()
    };
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
    generalMap.inner.forEach((slice) => {
      handleSlice(slice, generalIdMap.inner);
    });
    generalMap.base.forEach((slice) => {
      handleSlice(slice, generalIdMap.base);
    });
    generalMap.outer.forEach((slice) => {
      handleSlice(slice, generalIdMap.outer);
    });
    const flatten = (map: Map<number, number>) => {
      const flat = [];
      for (const [id, frequency] of map.entries()) {
        flat.push([id, frequency]);
      }
      flat.sort((a, b) => b[1] - a[1]);
      // We should add a selector union
      return flat.map(([id, _]) => id);
    };
    this.ques[Inner].generalQue = flatten(generalIdMap.inner);
    this.ques[Base].generalQue = flatten(generalIdMap.base);
    this.ques[Outer].generalQue = flatten(generalIdMap.outer);
  }

  protected manageQues() {
    this.assemblePriorityQue();
    this.assembleGeneralQues();
  }

  protected _dispatch(
    axiumState: AxiumState<Q extends void ? AxiumQualities: Q, C extends void ? AxiumDeck : C>,
    plan: Plan<Q, C>,
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
        const evaluate = this.handleNewStageOptions(plan, options, next);
        this.handleSetStageOptions(plan, options);
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
          if (plan.stages[plan.stage]) {
            this.handleAddSelector(plan.stages[plan.stage].selectors, plan.id);
          }
          this.manageQues();
          const beat = plan.stages[plan.stage].beat;
          plan.beat = beat !== undefined ? beat : -1;
          stageDelimiter.prevActions = [];
          stageDelimiter.unionExpiration = [];
          stageDelimiter.runOnceMap = new Map();
          plan.changeAggregator = {};
          this.stageDelimiters.set(plan.id, stageDelimiter);
        }
        if (evaluate && next === -1) {
          this.manageQues();
        }
        // Horrifying
        // Keep in place, this prevents branch prediction from creating ghost actions if there is an action overflow.
        if (plan.stageFailed === -1) {
          // Will set a the current stage's priority if no priority is set.
          action.origin = createOrigin([plan.title, plan.stage]);
          const settleOrigin = () => {
            if (options.hardOverride) {
              HandleHardOrigin(axiumState, action);
            } else if (options.override) {
              HandleOrigin(axiumState, action);
            } else {
              action$.next(action);
            }
          };
          if (plan.stages[plan.stage].priority && action.priority === undefined) {
            action.priority = plan.stages[plan.stage].priority;
            settleOrigin();
          } else {
            settleOrigin();
          }
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

  protected execute(plan: Plan<Q, C>, index: number, changes: KeyedSelector[]): void {
    const axiumState = getAxiumState<Q, C>(this.concepts);
    const dispatcher: Dispatcher = (() => (action: Action, options: dispatchOptions) => {
      this._dispatch(axiumState, plan, action, options);
    }).bind(this)();
    const conclude = () => {
      this.deletePlan(plan.id);
    };
    plan.stages[index].stage({
      concepts: this.concepts,
      dispatch: dispatcher,
      changes,
      stagePlanner: {
        title: plan.title,
        planId: plan.id,
        conclude: conclude.bind(this)
      },
      // [TODO WHY? Triggered by ownership test, for some reason the axium was the sole concept available here mid way through test]
      d: accessDeck(this.concepts),
      e: this.concepts[plan.conceptSemaphore] ? this.concepts[plan.conceptSemaphore].actions as Actions<any> : {},
      c: [],
      k: {},
    });
  }

  protected nextPlans() {
    this.currentPlans.forEach(plan => {
      this.nextPlan(plan, []);
    });
  }

  protected nextPlan(plan: Plan<Q, C>, changes: KeyedSelector[]) {
    const index = plan.stage;
    if (index < plan.stages.length) {
      if (plan.beat > -1) {
        const timer = plan.timer;
        const now = Date.now();
        if (plan.offBeat < now) {
          plan.offBeat = Date.now() + plan.beat;
          this.execute(plan, index, changes);
        } else if (timer.length === 0 && plan.offBeat > now) {
          // Logic to push changes into aggregator
          changes.forEach(key => {
            plan.changeAggregator[key.keys] = key;
          });
          timer.push(setTimeout(() => {
            const changeAggregation = Object.keys(plan.changeAggregator).map(k => plan.changeAggregator[k]);
            plan.changeAggregator = {};
            plan.timer = [];
            plan.offBeat = Date.now() + plan.beat;
            this.execute(plan, index, changeAggregation);
          }, plan.offBeat - Date.now()));
        } else {
          changes.forEach(key => {
            plan.changeAggregator[key.keys] = key;
          });
        }
      } else {
        this.execute(plan, index, changes);
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

  protected handleChange(concepts: Concepts, blocking = false) {
    const oldConcepts = this.concepts;
    this.concepts = concepts;
    const notifyIds: Map<number, KeyedSelector[]> = new Map();
    for (const [_, slice] of this.selectors) {
      const {selector, ids} = slice;
      let notify = false;
      if (slice.selector.conceptName === ALL) {
        notify = true;
      } else {
        const incoming = select.slice(this.concepts, selector);
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
    const notification = (id: number) => {
      const ready = notifyIds.get(id);
      const plan = this.currentPlans.get(id);
      if (plan && ready !== undefined) {
        this.nextPlan(plan as Plan<Q, C>, ready);
      } else if (plan && plan.stages[plan.stage].firstRun) {
        plan.stages[plan.stage].firstRun = false;
        this.nextPlan(plan as Plan<Q, C>, []);
      }
    };
    for (const p of this.ques[Inner].priorityQue) {
      notification(p.planID);
    }
    for (const g of this.ques[Inner].generalQue) {
      notification(g);
    }
    if (!blocking) {
      for (const p of this.ques[Base].priorityQue) {
        notification(p.planID);
      }
      for (const g of this.ques[Base].generalQue) {
        notification(g);
      }
      for (const p of this.ques[Outer].priorityQue) {
        notification(p.planID);
      }
      for (const g of this.ques[Outer].generalQue) {
        notification(g);
      }
    }
  }

  next(concepts: Concepts) {
    if (!this.closed) {
      this.handleChange(concepts);
      // We notify subs last to encourage actions being acted upon observations
      // Then by utilizing a set quality we may inform the next observation of the change
      this.nextSubs();
    }
  }
  init(concepts: Concepts) {
    this.concepts = concepts;
  }
  nextBlocking(concepts: Concepts) {
    if (!this.closed) {
      this.handleChange(concepts, true);
    }
  }
}
/*#>*/