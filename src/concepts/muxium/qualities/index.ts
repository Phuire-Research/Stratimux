/*<$
For the asynchronous graph programming framework Stratimux generate the Muxium Qualities Index file.
$>*/
/*<#*/
import { Subscription } from 'rxjs';
import { Quality } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { AnyConcept, Concepts } from '../../../model/concept/concept.type';
import { ActionType, AnyAction } from '../../../model/action/action.type';

export type OpenPayload = {
  open: boolean
};

export type MuxiumBadActionPayload = {
  badActions: AnyAction[],
}

/**
 * @parm exit - If set to true, will exit the current process.
 */
export type MuxiumClosePayload = {
  exit: boolean
};

/**
 * @parm exit - If set to true, will exit the current process.
 */
export type MuxiumPreClosePayload = {
  exit: boolean
};

export type AppendActionListToDialogPayload = {
  actionList: Array<string>;
  strategyTopic: string;
  strategyData: unknown;
}

export type MuxiumRegisterSubscriberPayload = {
  subscription: Subscription;
  name: string;
}

export type StagePlanner = {
  title: string;
  planId: number;
  conclude: () => void;
}

export type MuxiumRegisterStagePlannerPayload = {
  stagePlanner: StagePlanner;
  conceptName: string;
}

export type MuxiumUnregisterStagePlannerPayload = {
  conceptName: string;
  title: string;
}

export type MuxiumInitializePrinciplesPayload = {
  concepts: Concepts;
}

export type MuxiumSetBlockingModePayload = {
  concepts: Concepts
}

export type MuxiumSetDefaultModePayload = {
  concepts: Concepts
}

export type MuxiumSetDefaultModeIndexPayload = {
  index: number;
};

export type MuxiumAppendConceptsToAddQuePayload = {
  concepts: Record<string, AnyConcept>;
}

export type MuxiumAppendConceptsToRemoveQuePayload = {
  concepts: Record<string, AnyConcept>;
}

export type MuxiumClearBadPlanFromBadPlanListPayload = {
  title: string;
}

export type MuxiumSetModePayload = {
  modeIndex: number;
  modeName: string;
}

export type MuxiumClearBadActionTypeFromBadActionListPayload = {
  actionType: ActionType
};

export type MuxiumClearBadStrategyTopicFromBadActionListPayload = {
  topic: string
};

export type MuxiumRegisterTimeOutPayload = {
  act: AnyAction;
  timeOut: number
}

export type MuxiumQualities = {
  muxiumKick: Quality<Record<string, unknown>, void>,
  muxiumOpen: Quality<Record<string, unknown>, OpenPayload>,
  muxiumBadAction: Quality<MuxiumState<unknown, any>, MuxiumBadActionPayload>,
  muxiumClose: Quality<MuxiumState<unknown, any>, MuxiumClosePayload>,
  muxiumPreClose: Quality<MuxiumState<unknown, any>, MuxiumPreClosePayload>,
  muxiumAppendActionListToDialog: Quality<MuxiumState<unknown, any>, AppendActionListToDialogPayload>,
  muxiumClearDialog: Quality<MuxiumState<unknown, any>, void>,
  muxiumLog: Quality<Record<string, unknown>, void>,
  muxiumRegisterSubscriber: Quality<MuxiumState<unknown, any>, MuxiumRegisterSubscriberPayload>,
  muxiumRegisterStagePlanner: Quality<MuxiumState<unknown, any>, MuxiumRegisterStagePlannerPayload>,
  muxiumUnregisterStagePlanner: Quality<MuxiumState<unknown, any>, MuxiumUnregisterStagePlannerPayload>,
  muxiumInitializePrinciples: Quality<MuxiumState<unknown, any>, MuxiumInitializePrinciplesPayload>,
  muxiumSetBlockingMode: Quality<MuxiumState<unknown, any>, MuxiumSetBlockingModePayload>,
  muxiumSetDefaultMode: Quality<MuxiumState<unknown, any>, MuxiumSetDefaultModePayload>,
  muxiumSetDefaultModeIndex: Quality<MuxiumState<unknown, any>, MuxiumSetDefaultModeIndexPayload>,
  muxiumAddConceptsFromQue: Quality<MuxiumState<unknown, any>, void>,
  muxiumAppendConceptsToAddQue: Quality<MuxiumState<unknown, any>, MuxiumAppendConceptsToAddQuePayload>,
  muxiumAppendConceptsToRemoveQue: Quality<MuxiumState<unknown, any>, MuxiumAppendConceptsToRemoveQuePayload>,
  muxiumRemoveConceptsViaQue: Quality<MuxiumState<unknown, any>, void>,
  muxiumSetMode: Quality<MuxiumState<unknown, any>, MuxiumSetModePayload>,
  muxiumClearBadActionTypeFromBadActionList: Quality<MuxiumState<unknown, any>, MuxiumClearBadActionTypeFromBadActionListPayload>,
  muxiumClearBadStrategyTopicFromBadActionList: Quality<MuxiumState<unknown, any>, MuxiumClearBadStrategyTopicFromBadActionListPayload>,
  muxiumClearBadPlanFromBadPlanList: Quality<MuxiumState<unknown, any>, MuxiumClearBadPlanFromBadPlanListPayload>,
  muxiumStitch: Quality<Record<string, unknown>, void>,
  muxiumRegisterTimeOut: Quality<MuxiumState<unknown, any>, MuxiumRegisterTimeOutPayload>
}

/*#>*/