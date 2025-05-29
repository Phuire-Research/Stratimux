/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner model file.
This file introduces the Muxified Subject, that allows for users to stage plans based on observation of the Concepts stream.
The Stage Planner paradigm is what allows for the ease of working within a recursive run time, via setting plans to specific stages
in order to prevent action overflow. Action overflow is when a function is stuck within a recursive loop. This paradigm
also ensures Stratimux of its own provable termination in logically consistent configurations.
$>*/
/*<#*/
/* eslint-disable complexity */
import { Subject } from 'rxjs';
import { Concepts } from '../concept/concept.type';
import { MuxiumDeck, MuxiumState } from '../../concepts/muxium/muxium.concept';
import { KeyedSelector } from '../selector/selector.type';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { Action } from '../action/action.type';
import { dispatchOptions, MuxifiedSubjectProperties, Plan, Planner, Planning, StagePlanner } from './stagePlanner.type';
import {
  addSelector, handleAddSelector, handleNewStageOptions, handleRemoveSelector, handleSetStageOptions, removeSelector
} from './stagePlannerHandlers';
import { createPlan, deletePlan, initPlan, nextPlan, nextPlans } from './stagePlannerPlan';
import { assembleGeneralQues, assemblePriorityQue, manageQues, updateFrequencyMap } from './stagePlannerQues';
import { _dispatch, execute } from './stagePlannerEntropy';
import { handleChange } from './stagePlannerHandleChange';

const Inner = 0;
const Base = 1;
export const Outer = 2;

export class MuxifiedSubject<Q = void, C = void, S = void> extends Subject<Concepts> {
  private properties: MuxifiedSubjectProperties;

  constructor() {
    super();
    this.properties = {
      planId: 0,
      currentPlans: new Map(),
      stageDelimiters: new Map(),
      concepts: {},
      priorityQue: [],
      priorityExists: new Map(),
      frequencyMap: new Map(),
      mappedSelectors: new Map(),
      // Assemble back of line, exempts priority que members
      ques: [{generalQue: [], priorityQue: []}, {generalQue: [], priorityQue: []}, {generalQue: [], priorityQue: []}]
    };
  }

  protected createPriorityKey = (planId: number, stage: number) => `${planId}${stage}`;

  protected handleAddSelector = (selectors: KeyedSelector[], id: number) => handleAddSelector(this.properties, selectors, id);

  protected handleNewStageOptions = (plan: Plan<Q, C, S>, options: dispatchOptions, next: number): boolean =>
    handleNewStageOptions(this.properties, plan, options, next);

  protected handleSetStageOptions = (plan: Plan<Q, C, S>, options: dispatchOptions) =>
    handleSetStageOptions(plan, options);

  protected addSelector = (selector: KeyedSelector, id: number) => addSelector(this.properties, selector, id);

  protected handleRemoveSelector = (selectors: KeyedSelector[], id: number) => handleRemoveSelector(this.properties, selectors, id);

  protected removeSelector = (selector: KeyedSelector, id: number) => removeSelector(this.properties, selector, id);

  protected createPlan = (
    title: string,
    planner: Planner<Q, C, S>,
    space: number,
    conceptSemaphore: number
  ): Plan<Q, C, S> => createPlan(this.properties, title, planner, space, conceptSemaphore);
  protected initPlan = (plan: Plan<Q, C, S>): StagePlanner => initPlan(this.properties, plan, this.next.bind(this));  innerPlan: Planning<Q, C, S> = (title: string, planner: Planner<Q, C, S>) =>
    this.initPlan(this.createPlan(title, planner, Inner, 0));

  outerPlan: Planning<Q, C, S> = (title: string, planner: Planner<Q, C, S>) => 
    this.initPlan(this.createPlan(title, planner, Outer, 0));

  plan = (conceptSemaphore: number): Planning<Q, C, S> =>
    (title: string, planner: Planner<Q, C, S>): StagePlanner =>
      this.initPlan(this.createPlan(title, planner, Base, conceptSemaphore));

  protected deletePlan = (planId: number) => deletePlan(this.properties, planId);

  protected updateFrequencyMap = () => updateFrequencyMap(this.properties);

  protected assemblePriorityQue = () => assemblePriorityQue(this.properties);

  protected assembleGeneralQues = () => assembleGeneralQues(this.properties);

  protected manageQues = () => manageQues(this.properties);

  protected _dispatch = (
    muxiumState: MuxiumState<MuxiumQualities, MuxiumDeck>,
    plan: Plan<Q, C, S>,
    action: Action,
    options: dispatchOptions) => _dispatch(this.properties, muxiumState, plan, action, options);

  protected execute = (plan: Plan<Q, C, S>, index: number, changes: KeyedSelector[]) =>

    execute(this.properties, plan, index, changes);
  protected nextPlans = () => nextPlans(this.properties);

  protected nextPlan = (plan: Plan<Q, C, S>, changes: KeyedSelector[]) => nextPlan(this.properties, plan, changes);

  protected nextSubs() {
    const {observers} = this;
    const len = observers.length;
    const nextSub = (index: number) => {
      if (observers[index]) {
        observers[index].next(this.properties.concepts);
      }
      if (index < len - 1) {
        nextSub(index + 1);
      }
    };
    nextSub(0);
  }

  protected handleChange = (concepts: Concepts, blocking = false, keyedSelectors?: KeyedSelector<any>[]) =>
    handleChange(this.properties, concepts, blocking, keyedSelectors);

  next(concepts: Concepts, keyedSelectors?: KeyedSelector<any>[]) {
    if (!this.closed) {
      if (keyedSelectors && keyedSelectors.length !== 0) {
        this.handleChange(concepts, false, keyedSelectors);
      } else {
        this.handleChange(concepts, false);
      }
      // We notify subs last to encourage actions being acted upon observations
      // Then by utilizing a set quality we may inform the next observation of the change
      this.nextSubs();
    }
  }

  init(concepts: Concepts) {
    this.properties.concepts = concepts;
  }

  nextBlocking(concepts: Concepts, keyedSelectors?: KeyedSelector<any>[]) {
    if (!this.closed) {
      if (keyedSelectors && keyedSelectors.length !== 0) {
        this.handleChange(concepts, true, keyedSelectors);
      } else {
        this.handleChange(concepts, true);
      }
    }
  }
}

/*#>*/