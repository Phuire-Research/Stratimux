/*<$
For the asynchronous graph programming framework Stratimux generate the Axium Qualities Index file.
$>*/
/*<#*/
import { Subscription } from 'rxjs';
import { Actions, AnyAction } from '../../../model/action';
import { Quality } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { AnyConcept, Concepts } from '../../../model/concept';
import { ActionType } from '../../../model/method';

export type OpenPayload = {
  open: boolean
};

export type AxiumBadActionPayload = {
  badActions: AnyAction[],
}

/**
 * @parm exit - If set to true, will exit the current process.
 */
export type AxiumClosePayload = {
  exit: boolean
};

/**
 * @parm exit - If set to true, will exit the current process.
 */
export type AxiumPreClosePayload = {
  exit: boolean
};

export type AppendActionListToDialogPayload = {
  actionList: Array<string>;
  strategyTopic: string;
  strategyData: unknown;
}

export type AxiumRegisterSubscriberPayload = {
  subscription: Subscription;
  name: string;
}

export type StagePlanner = {
  title: string;
  planId: number;
  conclude: () => void;
}

export type AxiumRegisterStagePlannerPayload = {
  stagePlanner: StagePlanner;
  conceptName: string;
}

export type AxiumInitializePrinciplesPayload = {
  concepts: Concepts;
}

export type AxiumSetBlockingModePayload = {
  concepts: Concepts
}

export type AxiumSetDefaultModePayload = {
  concepts: Concepts
}

export type AxiumSetDefaultModeIndexPayload = {
  index: number;
};

export type AxiumAppendConceptsToAddQuePayload = {
  concepts: Record<string, AnyConcept>;
}

export type AxiumAppendConceptsToRemoveQuePayload = {
  concepts: Record<string, AnyConcept>;
}

export type AxiumClearBadPlanFromBadPlanListPayload = {
  title: string;
}

export type AxiumSetModePayload = {
  modeIndex: number;
  modeName: string;
}

export type AxiumClearBadActionTypeFromBadActionListPayload = {
  actionType: ActionType
};

export type AxiumClearBadStrategyTopicFromBadActionListPayload = {
  topic: string
};

export type AxiumRegisterTimeOutPayload = {
  act: AnyAction;
  timeOut: number
}

export type AxiumQualities = {
  axiumKick: Quality<Record<string, unknown>, void>,
  axiumOpen: Quality<Record<string, unknown>, OpenPayload>,
  axiumBadAction: Quality<AxiumState<unknown, any>, AxiumBadActionPayload>,
  axiumClose: Quality<AxiumState<unknown, any>, AxiumClosePayload>,
  axiumPreClose: Quality<AxiumState<unknown, any>, AxiumPreClosePayload>,
  axiumAppendActionListToDialog: Quality<AxiumState<unknown, any>, AppendActionListToDialogPayload>,
  axiumClearDialog: Quality<AxiumState<unknown, any>, void>,
  axiumLog: Quality<Record<string, unknown>, void>,
  axiumRegisterSubscriber: Quality<AxiumState<unknown, any>, AxiumRegisterSubscriberPayload>,
  axiumRegisterStagePlanner: Quality<AxiumState<unknown, any>, AxiumRegisterStagePlannerPayload>,
  axiumInitializePrinciples: Quality<AxiumState<unknown, any>, AxiumInitializePrinciplesPayload>,
  axiumSetBlockingMode: Quality<AxiumState<unknown, any>, AxiumSetBlockingModePayload>,
  axiumSetDefaultMode: Quality<AxiumState<unknown, any>, AxiumSetDefaultModePayload>,
  axiumSetDefaultModeIndex: Quality<AxiumState<unknown, any>, AxiumSetDefaultModeIndexPayload>,
  axiumAddConceptsFromQue: Quality<AxiumState<unknown, any>, void>,
  axiumAppendConceptsToAddQue: Quality<AxiumState<unknown, any>, AxiumAppendConceptsToAddQuePayload>,
  axiumAppendConceptsToRemoveQue: Quality<AxiumState<unknown, any>, AxiumAppendConceptsToRemoveQuePayload>,
  axiumRemoveConceptsViaQue: Quality<AxiumState<unknown, any>, void>,
  axiumSetMode: Quality<AxiumState<unknown, any>, AxiumSetModePayload>,
  axiumClearBadActionTypeFromBadActionList: Quality<AxiumState<unknown, any>, AxiumClearBadActionTypeFromBadActionListPayload>,
  axiumClearBadStrategyTopicFromBadActionList: Quality<AxiumState<unknown, any>, AxiumClearBadStrategyTopicFromBadActionListPayload>,
  axiumClearBadPlanFromBadPlanList: Quality<AxiumState<unknown, any>, AxiumClearBadPlanFromBadPlanListPayload>,
  axiumStitch: Quality<Record<string, unknown>, void>,
  axiumRegisterTimeOut: Quality<AxiumState<unknown, any>, AxiumRegisterTimeOutPayload>
}

/*#>*/