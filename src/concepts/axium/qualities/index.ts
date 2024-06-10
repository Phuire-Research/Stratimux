/*<$
For the asynchronous graph programming framework Stratimux generate the Axium Qualities Index file.
$>*/
/*<#*/
import { Subscription } from 'rxjs';
import { AnyAction } from '../../../model/action';
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
  axiumBadAction: Quality<AxiumState<unknown, unknown>, AxiumBadActionPayload>,
  axiumClose: Quality<AxiumState<unknown, unknown>, AxiumClosePayload>,
  axiumPreClose: Quality<AxiumState<unknown, unknown>, AxiumPreClosePayload>,
  axiumAppendActionListToDialog: Quality<AxiumState<unknown, unknown>, AppendActionListToDialogPayload>,
  axiumClearDialog: Quality<AxiumState<unknown, unknown>, void>,
  axiumLog: Quality<Record<string, unknown>, void>,
  axiumRegisterSubscriber: Quality<AxiumState<unknown, unknown>, AxiumRegisterSubscriberPayload>,
  axiumRegisterStagePlanner: Quality<AxiumState<unknown, unknown>, AxiumRegisterStagePlannerPayload>,
  axiumInitializePrinciples: Quality<AxiumState<unknown, unknown>, AxiumInitializePrinciplesPayload>,
  axiumSetBlockingMode: Quality<AxiumState<unknown, unknown>, AxiumSetBlockingModePayload>,
  axiumSetDefaultMode: Quality<AxiumState<unknown, unknown>, AxiumSetDefaultModePayload>,
  axiumSetDefaultModeIndex: Quality<AxiumState<unknown, unknown>, AxiumSetDefaultModeIndexPayload>,
  axiumAddConceptsFromQue: Quality<AxiumState<unknown, unknown>, void>,
  axiumAppendConceptsToAddQue: Quality<AxiumState<unknown, unknown>, AxiumAppendConceptsToAddQuePayload>,
  axiumAppendConceptsToRemoveQue: Quality<AxiumState<unknown, unknown>, AxiumAppendConceptsToRemoveQuePayload>,
  axiumRemoveConceptsViaQue: Quality<AxiumState<unknown, unknown>, void>,
  axiumSetMode: Quality<AxiumState<unknown, unknown>, AxiumSetModePayload>,
  axiumClearBadActionTypeFromBadActionList: Quality<AxiumState<unknown, unknown>, AxiumClearBadActionTypeFromBadActionListPayload>,
  axiumClearBadStrategyTopicFromBadActionList: Quality<AxiumState<unknown, unknown>, AxiumClearBadStrategyTopicFromBadActionListPayload>,
  axiumClearBadPlanFromBadPlanList: Quality<AxiumState<unknown, unknown>, AxiumClearBadPlanFromBadPlanListPayload>,
  axiumStitch: Quality<Record<string, unknown>, void>,
  axiumRegisterTimeOut: Quality<AxiumState<unknown, unknown>, AxiumRegisterTimeOutPayload>
}

/*#>*/