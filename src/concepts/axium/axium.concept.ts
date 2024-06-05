/*<$
For the asynchronous graph programming framework Stratimux generate the Axium Concept that will manage Stratimux's functionality.
The Axium is a set of concepts that create a greater whole via their associations
within strategies, plans, modes, qualities, and principles.
$>*/
/*<#*/
import { OpenPayload, axiumOpenQuality } from './qualities/open.quality';
import { AxiumBadActionPayload, axiumBadActionQuality } from './qualities/badAction.quality';
import { AxiumClosePayload, axiumCloseQuality } from './qualities/close.quality';
import { axiumLogQuality } from './qualities/log.quality';
import { AxiumRegisterSubscriberPayload, axiumRegisterSubscriberQuality } from './qualities/registerSubscription.quality';
import { AxiumInitializePrinciplesPayload, axiumInitializePrinciplesQuality } from './qualities/initializePrinciples.quality';
import { AxiumSetBlockingModePayload, axiumSetBlockingModeQuality } from './qualities/setBlockingMode.quality';
import { AxiumSetDefaultModePayload, axiumSetDefaultModeQuality } from './qualities/setDefaultMode.quality';
import { axiumAddConceptsFromQueQuality } from './qualities/addConceptsFromQue.quality';
import { AxiumAppendConceptsToAddQuePayload, axiumAppendConceptsToAddQueQuality } from './qualities/appendConceptsToAddQue.quality';
import { AxiumAppendConceptsToRemoveQuePayload, axiumAppendConceptsToRemoveQueQuality } from './qualities/appendConceptsToRemoveQue.quality';
import { axiumRemoveConceptsViaQueQuality } from './qualities/removeConceptsViaQue.quality';
import { AppendActionListToDialogPayload, axiumAppendActionListToDialogQuality } from './qualities/appendActionListToDialog.quality';
import { AxiumSetModePayload, axiumSetModeQuality } from './qualities/setMode.quality';
import { AxiumSetDefaultModeIndexPayload, axiumSetDefaultModeIndexQuality } from './qualities/setDefaultModeIndex.quality';
import { axiumClearDialogQuality } from './qualities/clearDialog.quality';
import { AxiumClearBadActionTypeFromBadActionListPayload, axiumClearBadActionTypeFromBadActionListQuality } from './qualities/clearBadActionTypeFromBadActionList.quality';
import { AxiumClearBadStrategyTopicFromBadActionListPayload, axiumClearBadStrategyTopicFromBadActionListQuality } from './qualities/clearBadStrategyTopicFromBadActionList.quality';
import { axiumClearBadPlanFromBadPlanListQuality } from './qualities/clearBadPlanFromBadPlanList.quality';
import { AxiumRegisterStagePlannerPayload, axiumRegisterStagePlannerQuality } from './qualities/registerStagePlanner.quality';
import { axiumKickQuality } from './qualities/kick.quality';
import { AxiumPreClosePayload, axiumPreCloseQuality } from './qualities/preClose.quality';
import { axiumStitchQuality } from './qualities/stitch.quality';
import { AxiumRegisterTimeOutPayload, axiumRegisterTimeOutQuality } from './qualities/registerTimeOut.quality';
import { Subject, Subscription } from 'rxjs';
import { AnyConcept, Concept, ConceptDeck, Concepts } from '../../model/concept';
import { Action, AnyAction } from '../../model/action';
import { axiumPrinciple } from './axium.principle';
import { axiumClosePrinciple } from './axium.close.principle';
import { blockingMode, permissiveMode } from './axium.mode';
export { initializationStrategy } from './strategies/initialization.strategy';
import { createConcept } from '../../model/concept';
import { NamedStagePlanner, Plan, UnifiedSubject } from '../../model/stagePlanner';
import { AxiumQualities } from './qualities';

export type SelectorFunction = (obj: Record<string, unknown>) => unknown | undefined;
export type KeyedSelector = {
  conceptName: string,
  conceptSemaphore: number,
  keys: string,
  selector: SelectorFunction,
  setKeys?: (number | string)[]
  setSelector?: SelectorFunction
};
export type KeyedSelectors =  Record<string, KeyedSelector>;

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

export const axiumStaticQualities = {
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
  axiumSetModeQuality,
  axiumClearBadActionTypeFromBadActionListQuality,
  axiumClearBadStrategyTopicFromBadActionListQuality,
  axiumClearBadPlanFromBadPlanListQuality,
  axiumStitchQuality,
  axiumRegisterTimeOutQuality
};

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
  action$: Subject<Action<unknown>>;
  actionConcepts$: Subject<Concepts>;
  concepts$: UnifiedSubject;
  deck: ConceptDeck<Record<string, unknown>>,
  addConceptQue: AnyConcept[],
  removeConceptQue: AnyConcept[],
  badPlans: Plan<any>[];
  badActions: Action[];
  timer: NodeJS.Timeout[];
  timerLedger: Map<number, (() => Action)[]>
  head: AnyAction[];
  body: AnyAction[];
  tail: AnyAction[];
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
    deck: {},
    addConceptQue: [] as AnyConcept[],
    removeConceptQue: [] as AnyConcept[],
    badPlans: [],
    badActions: [],
    timer: [],
    tailTimer: [],
    timerLedger: new Map()
  };
};
const axiumStaticPrinciple = [axiumClosePrinciple];

export const createAxiumConcept = (
  name: string,
  storeDialog?: boolean,
  logging?: boolean,
  logActionStream?: boolean,
  dynamic?: boolean,
): Concept<AxiumState, AxiumQualities> =>  {
  const state = createAxiumState(name, storeDialog, logging, logActionStream);
  if (dynamic) {
    const c = createConcept<AxiumState, AxiumQualities>(
      axiumName,
      state,
      axiumQualities,
      [axiumPrinciple, axiumClosePrinciple],
      [blockingMode, permissiveMode]
    );
    return c;
  } else {
    const c = createConcept<AxiumState, AxiumQualities>(
      axiumName,
      state,
      axiumStaticQualities,
      axiumStaticPrinciple,
      [blockingMode, permissiveMode]
    );
    return c;
  }
};
/*#>*/