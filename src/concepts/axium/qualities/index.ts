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
  axiumBadAction: Quality<AxiumState<unknown>, AxiumBadActionPayload>,
  axiumClose: Quality<AxiumState<unknown>, AxiumClosePayload>,
  axiumPreClose: Quality<AxiumState<unknown>, AxiumPreClosePayload>,
  axiumAppendActionListToDialog: Quality<AxiumState<unknown>, AppendActionListToDialogPayload>,
  axiumClearDialog: Quality<AxiumState<unknown>, void>,
  axiumLog: Quality<Record<string, unknown>, void>,
  axiumRegisterSubscriber: Quality<AxiumState<unknown>, AxiumRegisterSubscriberPayload>,
  axiumRegisterStagePlanner: Quality<AxiumState<unknown>, AxiumRegisterStagePlannerPayload>,
  axiumInitializePrinciples: Quality<AxiumState<unknown>, AxiumInitializePrinciplesPayload>,
  axiumSetBlockingMode: Quality<AxiumState<unknown>, AxiumSetBlockingModePayload>,
  axiumSetDefaultMode: Quality<AxiumState<unknown>, AxiumSetDefaultModePayload>,
  axiumSetDefaultModeIndex: Quality<AxiumState<unknown>, AxiumSetDefaultModeIndexPayload>,
  axiumAddConceptsFromQue: Quality<AxiumState<unknown>, void>,
  axiumAppendConceptsToAddQue: Quality<AxiumState<unknown>, AxiumAppendConceptsToAddQuePayload>,
  axiumAppendConceptsToRemoveQue: Quality<AxiumState<unknown>, AxiumAppendConceptsToRemoveQuePayload>,
  axiumRemoveConceptsViaQue: Quality<AxiumState<unknown>, void>,
  axiumSetMode: Quality<AxiumState<unknown>, AxiumSetModePayload>,
  axiumClearBadActionTypeFromBadActionList: Quality<AxiumState<unknown>, AxiumClearBadActionTypeFromBadActionListPayload>,
  axiumClearBadStrategyTopicFromBadActionList: Quality<AxiumState<unknown>, AxiumClearBadStrategyTopicFromBadActionListPayload>,
  axiumClearBadPlanFromBadPlanList: Quality<AxiumState<unknown>, void>,
  axiumStitch: Quality<Record<string, unknown>, void>,
  axiumRegisterTimeOut: Quality<AxiumState<unknown>, AxiumRegisterTimeOutPayload>
}

/*#>*/