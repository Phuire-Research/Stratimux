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

type OpenPayload = {
  open: boolean
};

type AxiumBadActionPayload = {
  badActions: AnyAction[],
}

type AxiumClosePayload = {
  exit: boolean
};

type AxiumPreClosePayload = {
  exit: boolean
};

type AppendActionListToDialogPayload = {
  actionList: Array<string>;
  strategyTopic: string;
  strategyData: unknown;
}

type AxiumRegisterSubscriberPayload = {
  subscription: Subscription;
  name: string;
}

export type StagePlanner = {
  title: string;
  planId: number;
  conclude: () => void;
}

type AxiumRegisterStagePlannerPayload = {
  stagePlanner: StagePlanner;
  conceptName: string;
}

type AxiumInitializePrinciplesPayload = {
  concepts: Concepts;
}

type AxiumSetBlockingModePayload = {
  concepts: Concepts
}

type AxiumSetDefaultModePayload = {
  concepts: Concepts
}

export type AxiumSetDefaultModeIndexPayload = {
  index: number;
};

export type AxiumAppendConceptsToAddQuePayload = {
  concepts: AnyConcept[]
}

export type AxiumAppendConceptsToRemoveQuePayload = {
  concepts: AnyConcept[]
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
  axiumClearBadPlanFromBadPlanList: Quality<AxiumState<unknown, unknown>, void>,
  axiumStitch: Quality<Record<string, unknown>, void>,
  axiumRegisterTimeOut: Quality<AxiumState<unknown, unknown>, AxiumRegisterTimeOutPayload>
}

/*#>*/