/*<$
For the asynchronous graph programming framework Stratimux generate the Axium Concept that will manage Stratimux's functionality.
The Axium is a set of concepts that create a greater whole via their associations
within strategies, plans, modes, qualities, and principles.
$>*/
/*<#*/
import { Subject, Subscription } from 'rxjs';
import { Concept, Concepts } from '../../model/concept';
import { Action } from '../../model/action';
import { axiumPrinciple } from './axium.principle';
import { axiumClosePrinciple } from './axium.close.principle';
import { blockingMode, permissiveMode } from './axium.mode';
import { axiumOpenQuality } from './qualities/open.quality';
import { axiumBadActionQuality } from './qualities/badAction.quality';
import { axiumCloseQuality } from './qualities/close.quality';
import { axiumLogQuality } from './qualities/log.quality';
import { axiumRegisterSubscriberQuality } from './qualities/registerSubscription.quality';
import { axiumInitializePrinciplesQuality } from './qualities/initializePrinciples.quality';
export { initializationStrategy } from './strategies/initialization.strategy';
import { axiumSetBlockingModeQuality } from './qualities/setBlockingMode.quality';
import { axiumSetDefaultModeQuality } from './qualities/setDefaultMode.quality';
import { axiumAddConceptsFromQueQuality } from './qualities/addConceptsFromQue.quality';
import { axiumAppendConceptsToAddQueQuality } from './qualities/appendConceptsToAddQue.quality';
import { axiumAppendConceptsToRemoveQueQuality } from './qualities/appendConceptsToRemoveQue.quality';
import { axiumRemoveConceptsViaQueQuality } from './qualities/removeConceptsViaQue.quality';
import { axiumAppendActionListToDialogQuality } from './qualities/appendActionListToDialog.quality';
import { createConcept } from '../../model/concept';
import { axiumSetModeQuality } from './qualities/setMode.quality';
import { axiumSetDefaultModeIndexQuality } from './qualities/setDefaultModeIndex.quality';
import { axiumClearDialogQuality } from './qualities/clearDialog.quality';
import { NamedStagePlanner, Plan, UnifiedSubject } from '../../model/stagePlanner';
import { axiumClearBadActionTypeFromBadActionListQuality } from './qualities/clearBadActionTypeFromBadActionList.quality';
import { axiumClearBadStrategyTopicFromBadActionListQuality } from './qualities/clearBadStrategyTopicFromBadActionList.quality';
import { axiumClearBadPlanFromBadPlanListQuality } from './qualities/clearBadPlanFromBadPlanList.quality';
import { axiumRegisterStagePlannerQuality } from './qualities/registerStagePlanner.quality';
import { axiumKickQuality } from './qualities/kick.quality';
import { axiumPreCloseQuality } from './qualities/preClose.quality';
import { axiumStitchQuality } from './qualities/stitch.quality';
import { axiumRegisterTimeOutQuality } from './qualities/registerTimeOut.quality';

export type NamedSubscription = {
  name: string;
  subscription: Subscription;
}

export type AxiumState = {
  // Would be unique identifier on a network
  name: string;
  open: boolean;
  prepareClose: boolean;
  exit: boolean;
  conceptCounter: number;
  logging: boolean;
  logActionStream: boolean;
  dialog: string;
  storeDialog: boolean;
  lastStrategy: string;
  lastStrategyData: unknown;
  lastStrategyDialog: string;
  generation: number;
  cachedSemaphores: Map<string,Map<string,[number,number,number, number]>>
  modeIndex: number;
  defaultModeIndex: number;
  modeNames: string[]
  methodSubscribers: NamedSubscription[];
  principleSubscribers: NamedSubscription[];
  generalSubscribers: NamedSubscription[];
  stagePlanners: NamedStagePlanner[];
  action$: Subject<Action>;
  actionConcepts$: Subject<Concepts>;
  concepts$: UnifiedSubject;
  addConceptQue: Concept[],
  removeConceptQue: Concept[],
  badPlans: Plan[];
  badActions: Action[];
  timer: NodeJS.Timeout[];
  timerLedger: Map<number, (() => Action)[]>
  head: Action[];
  body: Action[];
  tail: Action[];
  tailTimer: NodeJS.Timeout[];
}

export const axiumName = 'axium';

const createAxiumState = (name: string, storeDialog?: boolean, logging?: boolean, logActionStream?: boolean): AxiumState => {
  return {
    name,
    open: false,
    prepareClose: false,
    exit: false,
    conceptCounter: 0,
    logging: logging ? logging : false,
    logActionStream: logActionStream ? logActionStream : false,
    dialog: '',
    storeDialog: storeDialog ? storeDialog : false,
    lastStrategy: '',
    lastStrategyData: '',
    lastStrategyDialog: '',
    generation: 0,
    cachedSemaphores: new Map<string, Map<string, [number, number, number, number]>>(),
    modeIndex: 0,
    defaultModeIndex: 1,
    modeNames: [axiumName, axiumName],
    methodSubscribers: [] as NamedSubscription[],
    principleSubscribers: [] as NamedSubscription[],
    generalSubscribers: [] as NamedSubscription[],
    stagePlanners: [] as NamedStagePlanner[],
    action$: new Subject<Action>(),
    head: [],
    body: [],
    tail: [],
    actionConcepts$: new Subject<Concepts>(),
    concepts$: new UnifiedSubject(),
    addConceptQue: [] as Concept[],
    removeConceptQue: [] as Concept[],
    badPlans: [],
    badActions: [],
    timer: [],
    tailTimer: [],
    timerLedger: new Map()
  };
};
const axiumQualities = {
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
console.log('CHECK AXIUM Q', axiumQualities.axiumLogQuality, axiumQualities.axiumRegisterTimeOutQuality);

export const createAxiumConcept = (
  name: string,
  storeDialog?: boolean,
  logging?: boolean,
  logActionStream?: boolean
): Concept<AxiumQualities> =>  {
  return createConcept<AxiumQualities>(
    axiumName,
    createAxiumState(name, storeDialog, logging, logActionStream),
    axiumQualities,
    [axiumPrinciple, axiumClosePrinciple],
    [blockingMode, permissiveMode]
  );
};
/*#>*/