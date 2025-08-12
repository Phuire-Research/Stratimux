/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner Type model file.
This file defines the type definitions necessary for the smooth operation of a Muxified Subject and the management of its
inner workings.
$>*/
/*<#*/
/* eslint-disable complexity */
import { Concepts } from '../concept/concept.type';
import { KeyedSelector } from '../selector/selector.type';
import { HInterface, OInterface, UInterface } from '../interface';
import { Action, ActionType } from '../action/action.type';
import {
  baseStageConclude,
  createBaseStage,
  createBaseStages,
  createStage,
  createStages,
  stageConclude
} from './stagePlannerHelpers';

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
export type BaseStage<Q, C, S> = (params: BaseStageParams<Q, C, S>) => void;

export type StageParams<Q = void, C = void, S = void> = {
  concepts: Concepts,
  dispatch: (action: Action<any>, options: dispatchOptions, ) => void,
  changes: KeyedSelector[],
  stagePlanner: StagePlanner,
  origin: string,
} & UInterface<Q, C, S>

export type BaseStageParams<Q = void, C = void, S = void> = {
  concepts: Concepts,
  dispatch: (action: Action<any>, options: dispatchOptions, ) => void,
  changes: KeyedSelector[],
  stagePlanner: StagePlanner,
  origin: string,
} & OInterface<Q, C, S>

export type Planning<Q = void, C = void, S = void> = (title: string, planner: Planner<Q, C, S>) => StagePlanner;

// Post-curry types for stageO after concepts are bound
export type StageOCurried<Q = void, C = void, S = void> =
  (skipOwnershipInit?: true) => Staging<Q, C, S>;

export type BaseStageOCurried<Q = void, C = void, S = void> =
  (skipOwnershipInit?: true) => BaseStaging<Q, C, S>;

export type Planner<Q = void, C = void, S = void> = (uI: HInterface<Q, C, S> & {
  stage: typeof createStage<Q, C, S>
  stageO: StageOCurried<Q, C, S>,
  conclude: typeof stageConclude,
  staging: typeof createStages<Q, C, S>
}) => PartialStaging<Q, C, S>[];

export type BasePlanner<Q = void, C = void, S = void> = (uI: HInterface<Q, C, S> & {
  stage: typeof createBaseStage<Q, C, S>
  stageO: BaseStageOCurried<Q, C, S>,
  conclude: typeof baseStageConclude,
  staging: typeof createBaseStages<Q, C, S>
}) => BasePartialStaging<Q, C, S>[];

export type Staging<Q = void, C = void, S = void> = {
  stage: Stage<Q, C, S>;
  selectors: KeyedSelector[];
  firstRun: boolean;
  priority?: number
  beat?: number,
};

export type BaseStaging<Q = void, C = void, S = void> = {
  stage: BaseStage<Q, C, S>;
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

export type BasePartialStaging<Q = void, C = void, S = void> = {
  stage: BaseStage<Q, C, S>;
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
  conceptOverride?: boolean;
  planOverride?: boolean;
  specificOverride?: number;
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