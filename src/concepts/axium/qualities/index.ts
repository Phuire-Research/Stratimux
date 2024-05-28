import { axiumAddConceptsFromQueQuality } from './addConceptsFromQue.quality';
import { axiumAppendActionListToDialogQuality } from './appendActionListToDialog.quality';
import { axiumAppendConceptsToAddQueQuality } from './appendConceptsToAddQue.quality';
import { axiumAppendConceptsToRemoveQueQuality } from './appendConceptsToRemoveQue.quality';
import { axiumBadActionQuality } from './badAction.quality';
import { axiumClearBadActionTypeFromBadActionListQuality } from './clearBadActionTypeFromBadActionList.quality';
import { axiumClearBadPlanFromBadPlanListQuality } from './clearBadPlanFromBadPlanList.quality';
import { axiumClearBadStrategyTopicFromBadActionListQuality } from './clearBadStrategyTopicFromBadActionList.quality';
import { axiumClearDialogQuality } from './clearDialog.quality';
import { axiumCloseQuality } from './close.quality';
import { axiumInitializePrinciplesQuality } from './initializePrinciples.quality';
import { axiumKickQuality } from './kick.quality';
import { axiumLogQuality } from './log.quality';
import { axiumOpenQuality } from './open.quality';
import { axiumPreCloseQuality } from './preClose.quality';
import { axiumRegisterStagePlannerQuality } from './registerStagePlanner.quality';
import { axiumRegisterSubscriberQuality } from './registerSubscription.quality';
import { axiumRegisterTimeOutQuality } from './registerTimeOut.quality';
import { axiumRemoveConceptsViaQueQuality } from './removeConceptsViaQue.quality';
import { axiumSetBlockingModeQuality } from './setBlockingMode.quality';
import { axiumSetDefaultModeQuality } from './setDefaultMode.quality';
import { axiumSetDefaultModeIndexQuality } from './setDefaultModeIndex.quality';
import { axiumSetModeQuality } from './setMode.quality';
import { axiumStitchQuality } from './stitch.quality';

export const axiumQualities = {
  axiumKickQuality,
  axiumOpenQuality,
  axiumBadActionQuality,
  axiumCloseQuality,
  axiumPreCloseQuality,
  axiumAppendActionListToDialogQuality,
  axiumClearDialogQuality,
  axiumLogQuality,
  axiumRegisterSubscriberQuality,
  axiumRegisterStagePlannerQuality,
  axiumInitializePrinciplesQuality,
  axiumSetBlockingModeQuality,
  axiumSetDefaultModeQuality,
  axiumSetDefaultModeIndexQuality,
  axiumAddConceptsFromQueQuality,
  axiumAppendConceptsToAddQueQuality,
  axiumAppendConceptsToRemoveQueQuality,
  axiumRemoveConceptsViaQueQuality,
  axiumSetModeQuality,
  axiumClearBadActionTypeFromBadActionListQuality,
  axiumClearBadStrategyTopicFromBadActionListQuality,
  axiumClearBadPlanFromBadPlanListQuality,
  axiumStitchQuality,
  axiumRegisterTimeOutQuality
};

export type AxiumQualities = typeof axiumQualities;