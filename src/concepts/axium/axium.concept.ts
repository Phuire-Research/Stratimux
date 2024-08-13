/*<$
For the asynchronous graph programming framework Stratimux generate the Axium Concept that will manage Stratimux's functionality.
The Axium is a set of concepts that create a greater whole via their associations
within strategies, plans, modes, qualities, and principles.
$>*/
/*<#*/
import { axiumOpen } from './qualities/open.quality';
import { axiumBadAction } from './qualities/badAction.quality';
import { axiumClose} from './qualities/close.quality';
import { axiumLog} from './qualities/log.quality';
import { axiumRegisterSubscriber } from './qualities/registerSubscription.quality';
import { axiumInitializePrinciples} from './qualities/initializePrinciples.quality';
import { axiumSetBlockingMode } from './qualities/setBlockingMode.quality';
import { axiumSetDefaultMode } from './qualities/setDefaultMode.quality';
import { axiumAddConceptsFromQue } from './qualities/addConceptsFromQue.quality';
import { axiumAppendConceptsToAddQue } from './qualities/appendConceptsToAddQue.quality';
import { axiumAppendConceptsToRemoveQue } from './qualities/appendConceptsToRemoveQue.quality';
import { axiumRemoveConceptsViaQue } from './qualities/removeConceptsViaQue.quality';
import { axiumAppendActionListToDialog } from './qualities/appendActionListToDialog.quality';
import { axiumSetMode } from './qualities/setMode.quality';
import { axiumSetDefaultModeIndex } from './qualities/setDefaultModeIndex.quality';
import { axiumClearDialog } from './qualities/clearDialog.quality';
import { axiumClearBadActionTypeFromBadActionList } from './qualities/clearBadActionTypeFromBadActionList.quality';
import { axiumClearBadStrategyTopicFromBadActionList } from './qualities/clearBadStrategyTopicFromBadActionList.quality';
import { axiumClearBadPlanFromBadPlanList } from './qualities/clearBadPlanFromBadPlanList.quality';
import { axiumRegisterStagePlanner } from './qualities/registerStagePlanner.quality';
import { axiumKick } from './qualities/kick.quality';
import { axiumPreClose } from './qualities/preClose.quality';
import { axiumStitch } from './qualities/stitch.quality';
import { axiumRegisterTimeOut } from './qualities/registerTimeOut.quality';
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
import { Deck } from '../../model/deck';
import { AxiumDeck } from '../../model/axium';

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
  axiumKick,
  axiumOpen,
  axiumBadAction,
  axiumClose,
  axiumPreClose,
  axiumAppendActionListToDialog,
  axiumClearDialog,
  axiumLog,
  axiumRegisterSubscriber,
  axiumRegisterStagePlanner,
  axiumInitializePrinciples,
  axiumSetBlockingMode,
  axiumSetDefaultMode,
  axiumSetDefaultModeIndex,
  axiumAddConceptsFromQue,
  axiumAppendConceptsToAddQue,
  axiumAppendConceptsToRemoveQue,
  axiumRemoveConceptsViaQue,
  axiumSetMode,
  axiumClearBadActionTypeFromBadActionList,
  axiumClearBadStrategyTopicFromBadActionList,
  axiumClearBadPlanFromBadPlanList,
  axiumStitch,
  axiumRegisterTimeOut
};

export const axiumStaticQualities = {
  axiumKick,
  axiumOpen,
  axiumBadAction,
  axiumClose,
  axiumPreClose,
  axiumAppendActionListToDialog,
  axiumClearDialog,
  axiumLog,
  axiumRegisterSubscriber,
  axiumRegisterStagePlanner,
  axiumInitializePrinciples,
  axiumSetBlockingMode,
  axiumSetDefaultMode,
  axiumSetDefaultModeIndex,
  axiumSetMode,
  axiumClearBadActionTypeFromBadActionList,
  axiumClearBadStrategyTopicFromBadActionList,
  axiumClearBadPlanFromBadPlanList,
  axiumStitch,
  axiumRegisterTimeOut
};

export type NamedSubscription = {
  name: string;
  subscription: Subscription;
}

export type AxiumState<Q, C> = {
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
  concepts$: UnifiedSubject<Q, C>;
  deck: Deck<C>,
  addConceptQue: Record<string, AnyConcept>,
  removeConceptQue: Record<string, AnyConcept>,
  badPlans: Plan<any, any, any>[];
  badActions: Action[];
  timer: NodeJS.Timeout[];
  timerLedger: Map<number, (() => Action)[]>
  head: AnyAction[];
  body: AnyAction[];
  tail: AnyAction[];
  tailTimer: NodeJS.Timeout[];
}

export const axiumName = 'axium';

const createAxiumState = <Q, C>(name: string, storeDialog?: boolean, logging?: boolean, logActionStream?: boolean): AxiumState<Q, C> => {
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
    deck: {} as Deck<C>,
    addConceptQue: {},
    removeConceptQue: {},
    badPlans: [],
    badActions: [],
    timer: [],
    tailTimer: [],
    timerLedger: new Map()
  };
};
const axiumStaticPrinciple = [axiumClosePrinciple];

export const createAxiumConcept = <Q, C>(
  name: string,
  storeDialog?: boolean,
  logging?: boolean,
  logActionStream?: boolean,
  dynamic?: boolean,
): Concept<AxiumState<Q, C>, AxiumQualities> =>  {
  const state = createAxiumState<Q, C>(name, storeDialog, logging, logActionStream);
  if (dynamic) {
    const c = createConcept<AxiumState<Q, C>, AxiumQualities>(
      axiumName,
      state,
      axiumQualities,
      [axiumPrinciple, axiumClosePrinciple],
      [blockingMode, permissiveMode]
    );
    return c;
  } else {
    const c = createConcept<AxiumState<Q, C>, AxiumQualities>(
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