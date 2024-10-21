/*<$
For the asynchronous graph programming framework Stratimux, define the Stage Planner model file.
This file introduces the Muxified Subject, that allows for users to stage plans based on observation of the Concepts stream.
The Stage Planner paradigm is what allows for the ease of working within a recursive run time, via setting plans to specific stages
in order to prevent action overflow. Action overflow is when a function is stuck within a recursive loop. This paradigm
also ensures Stratimux of its own provable termination in majority of configurations.
$>*/
/*<#*/
/* eslint-disable complexity */
import { Subject } from 'rxjs';
import { Concepts } from '../concept/concept';
import { MuxiumDeck, MuxiumState } from '../../concepts/muxium/muxium.concept';
import {
  BundledSelectors,
  KeyedSelector,
  createConceptKeyedSelector,
  select,
  selectSlice,
} from '../selectors/selector';
import { muxiumSelectOpen } from '../../concepts/muxium/muxium.selector';
import { ownershipSelectInitialized } from '../../concepts/ownership/ownership.selector';
import { HandleHardOrigin, HandleOrigin, createOrigin, getMuxiumState, isMuxiumOpen } from '../muxium/muxium';
import { ownershipSetOwnerShipModeTopic } from '../../concepts/ownership/strategies/setOwnerShipMode.strategy';
import { muxiumTimeOut } from '../time';
import { Comparators, HInterface, UInterface } from '../interface';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { accessDeck } from '../deck';
import { Action, Actions, ActionType, AnyAction } from '../action/action.type';
import { createAction } from '../action/action';
import { createStage, stageConclude, stageWaitForOpenThenIterate } from './stagePlannerHelpers';

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