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
  axiumKickQuality: Quality<Record<string, unknown>, void>,
  axiumOpenQuality: Quality<Record<string, unknown>, OpenPayload>,
  axiumBadActionQuality: Quality<AxiumState, AxiumBadActionPayload>,
  axiumCloseQuality: Quality<AxiumState, AxiumClosePayload>,
  axiumPreCloseQuality: Quality<AxiumState, AxiumPreClosePayload>,
  axiumAppendActionListToDialogQuality: Quality<AxiumState, AppendActionListToDialogPayload>,
  axiumClearDialogQuality: Quality<AxiumState, void>,
  axiumLogQuality: Quality<Record<string, unknown>, void>,
  axiumRegisterSubscriberQuality: Quality<AxiumState, AxiumRegisterSubscriberPayload>,
  axiumRegisterStagePlannerQuality: Quality<AxiumState, AxiumRegisterStagePlannerPayload>,
  axiumInitializePrinciplesQuality: Quality<AxiumState, AxiumInitializePrinciplesPayload>,
  axiumSetBlockingModeQuality: Quality<AxiumState, AxiumSetBlockingModePayload>,
  axiumSetDefaultModeQuality: Quality<AxiumState, AxiumSetDefaultModePayload>,
  axiumSetDefaultModeIndexQuality: Quality<AxiumState, AxiumSetDefaultModeIndexPayload>,
  axiumAddConceptsFromQueQuality: Quality<AxiumState, void>,
  axiumAppendConceptsToAddQueQuality: Quality<AxiumState, AxiumAppendConceptsToAddQuePayload>,
  axiumAppendConceptsToRemoveQueQuality: Quality<AxiumState, AxiumAppendConceptsToRemoveQuePayload>,
  axiumRemoveConceptsViaQueQuality: Quality<AxiumState, void>,
  axiumSetModeQuality: Quality<AxiumState, AxiumSetModePayload>,
  axiumClearBadActionTypeFromBadActionListQuality: Quality<AxiumState, AxiumClearBadActionTypeFromBadActionListPayload>,
  axiumClearBadStrategyTopicFromBadActionListQuality: Quality<AxiumState, AxiumClearBadStrategyTopicFromBadActionListPayload>,
  axiumClearBadPlanFromBadPlanListQuality: Quality<AxiumState, void>,
  axiumStitchQuality: Quality<Record<string, unknown>, void>,
  axiumRegisterTimeOutQuality: Quality<AxiumState, AxiumRegisterTimeOutPayload>
}


/*#>*/