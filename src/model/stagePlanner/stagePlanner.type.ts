/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner Type model file.
This file defines the type definitions necessary for the smooth operation of a Muxified Subject and the management of its
inner workings.
$>*/
/*<#*/
/* eslint-disable complexity */
import { Concepts } from '../concept/concept.type';
import { KeyedSelector } from '../selector/selector.type';
import { HInterface, UInterface } from '../interface';
import { Action, ActionType } from '../action/action.type';
import { createStage, stageConclude, stageWaitForOpenThenIterate } from './stagePlannerHelpers';

export type MuxifiedSubjectProperties = {
  planId: number;
  currentPlans: Map<number, Plan<any, any, any>>;
  stageDelimiters: Map<number, StageDelimiter>;
  concepts: Concepts;
  // Assemble front of line
  priorityQue: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[];
  priorityExists: Map<string, boolean>;
  frequencyMap: Map<string, number>;
  mappedSelectors: Map<string, {selector: KeyedSelector, ids: number[]}>;
  // Assemble back of line, exempts priority que members
  ques: {
    priorityQue: {planID: number, priority: number, stage: number, selectors: KeyedSelector[]}[],
    generalQue: number[],
  }[];
}

export type Plan<Q = void, C = void, S = void> = {
  id: number;
  space: number;
  conceptSemaphore: number;
  conceptName: string;
  title: string;
  stages: Staging<Q, C, S>[],
  stage: number;
  stageFailed: number;
  beat: number;
  offBeat: number;
  timer: NodeJS.Timeout[];
  changeAggregator: Record<string, KeyedSelector>;
}

export type Stage<Q, C, S> = (params: StageParams<Q, C, S>) => void;

export type StageParams<Q = void, C = void, S = void> = {
  concepts: Concepts,
  dispatch: (action: Action<any>, options: dispatchOptions, ) => void,
  changes: KeyedSelector[],
  stagePlanner: StagePlanner
} & UInterface<Q, C, S>

export type Planning<Q = void, C = void, S = void> = (title: string, planner: Planner<Q, C, S>) => StagePlanner;

export type Planner<Q = void, C = void, S = void> = (uI: HInterface<Q, C, S> & {
  stage: typeof createStage<Q, C, S>
  stageO: typeof stageWaitForOpenThenIterate,
  conclude: typeof stageConclude
}) => PartialStaging<Q, C, S>[];

export type Staging<Q = void, C = void, S = void> = {
  stage: Stage<Q, C, S>;
  selectors: KeyedSelector[];
  firstRun: boolean;
  priority?: number
  beat?: number,
};

export type PartialStaging<Q = void, C = void, S = void> = {
  stage: Stage<Q, C, S>;
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
/*#>*/