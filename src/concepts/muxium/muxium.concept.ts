/* eslint-disable @typescript-eslint/no-explicit-any */
/*<$
For the asynchronous graph programming framework Stratimux generate the Muxium Concept that will manage Stratimux's functionality.
The Muxium is a set of concepts that create a greater whole via their associations
within strategies, plans, modes, qualities, and principles.
$>*/
/*<#*/
import { muxiumOpen } from './qualities/open.quality';
import { muxiumBadAction } from './qualities/badAction.quality';
import { muxiumClose} from './qualities/close.quality';
import { muxiumLog} from './qualities/log.quality';
import { muxiumRegisterSubscriber } from './qualities/registerSubscription.quality';
import { muxiumInitializePrinciples} from './qualities/initializePrinciples.quality';
import { muxiumSetBlockingMode } from './qualities/setBlockingMode.quality';
import { muxiumSetDefaultMode } from './qualities/setDefaultMode.quality';
import { muxiumAddConceptsFromQue } from './qualities/addConceptsFromQue.quality';
import { muxiumAppendConceptsToAddQue } from './qualities/appendConceptsToAddQue.quality';
import { muxiumAppendConceptsToRemoveQue } from './qualities/appendConceptsToRemoveQue.quality';
import { muxiumRemoveConceptsViaQue } from './qualities/removeConceptsViaQue.quality';
import { muxiumAppendActionListToDialog } from './qualities/appendActionListToDialog.quality';
import { muxiumSetMode } from './qualities/setMode.quality';
import { muxiumSetDefaultModeIndex } from './qualities/setDefaultModeIndex.quality';
import { muxiumClearDialog } from './qualities/clearDialog.quality';
import { muxiumClearBadActionTypeFromBadActionList } from './qualities/clearBadActionTypeFromBadActionList.quality';
import { muxiumClearBadStrategyTopicFromBadActionList } from './qualities/clearBadStrategyTopicFromBadActionList.quality';
import { muxiumClearBadPlanFromBadPlanList } from './qualities/clearBadPlanFromBadPlanList.quality';
import { muxiumRegisterStagePlanner } from './qualities/registerStagePlanner.quality';
import { muxiumKick } from './qualities/kick.quality';
import { muxiumPreClose } from './qualities/preClose.quality';
import { muxiumStitch } from './qualities/stitch.quality';
import { muxiumRegisterTimeOut } from './qualities/registerTimeOut.quality';
import { Subject, Subscription } from 'rxjs';
import { AnyConcept, Concept, Concepts, LoadConcepts } from '../../model/concept/concept.type';
import { muxiumPrinciple } from './muxium.principle';
import { muxiumClosePrinciple } from './muxium.close.principle';
import { blockingMode, permissiveMode } from './muxium.mode';
export { initializationStrategy } from './strategies/initialization.strategy';
import { createConcept } from '../../model/concept/concept';
import { MuxifiedSubject } from '../../model/stagePlanner/stagePlanner';
import { MuxiumQualities } from './qualities';
import { Decks } from '../../model/deck';
import { MuxiumLoad } from '../../model/muxium/muxium.type';
import { PrincipleFunction } from '../../model/principle';
import { Action, AnyAction } from '../../model/action/action.type';
import { NamedStagePlanner, Plan } from '../../model/stagePlanner/stagePlanner.type';

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

export const muxiumQualities = {
  muxiumKick,
  muxiumOpen,
  muxiumBadAction,
  muxiumClose,
  muxiumPreClose,
  muxiumAppendActionListToDialog,
  muxiumClearDialog,
  muxiumLog,
  muxiumRegisterSubscriber,
  muxiumRegisterStagePlanner,
  muxiumInitializePrinciples,
  muxiumSetBlockingMode,
  muxiumSetDefaultMode,
  muxiumSetDefaultModeIndex,
  muxiumAddConceptsFromQue,
  muxiumAppendConceptsToAddQue,
  muxiumAppendConceptsToRemoveQue,
  muxiumRemoveConceptsViaQue,
  muxiumSetMode,
  muxiumClearBadActionTypeFromBadActionList,
  muxiumClearBadStrategyTopicFromBadActionList,
  muxiumClearBadPlanFromBadPlanList,
  muxiumStitch,
  muxiumRegisterTimeOut
};

export const muxiumStaticQualities = {
  muxiumKick,
  muxiumOpen,
  muxiumBadAction,
  muxiumClose,
  muxiumPreClose,
  muxiumAppendActionListToDialog,
  muxiumClearDialog,
  muxiumLog,
  muxiumRegisterSubscriber,
  muxiumRegisterStagePlanner,
  muxiumInitializePrinciples,
  muxiumSetBlockingMode,
  muxiumSetDefaultMode,
  muxiumSetDefaultModeIndex,
  muxiumSetMode,
  muxiumClearBadActionTypeFromBadActionList,
  muxiumClearBadStrategyTopicFromBadActionList,
  muxiumClearBadPlanFromBadPlanList,
  muxiumStitch,
  muxiumRegisterTimeOut
};

export type NamedSubscription = {
  name: string;
  subscription: Subscription;
}

export type MuxiumState<Q, C extends LoadConcepts> = {
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
  lastStrategyActionList: Array<string>;
  lastStrategyData: unknown;
  lastStrategyDialog: string;
  generation: number;
  cachedSemaphores: Map<string,Map<string,[number,number,number, number]>>
  modeIndex: number;
  defaultModeIndex: number;
  modeNames: string[]
  methodSubscribers: NamedSubscription[];
  principleSubscribers: NamedSubscription[];
  generalSubscribers: NamedSubscription[];  stagePlanners: NamedStagePlanner[];
  action$: Subject<Action<unknown>>;
  actionConcepts$: Subject<Concepts>;
  concepts$: MuxifiedSubject<Q, C, MuxiumState<Q, C>>;
  deck: Decks<MuxiumQualities, MuxiumState<Q, C>, MuxiumLoad<C>>,
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

export type MuxiumDeck = {
  muxium: Concept<MuxiumState<MuxiumQualities, LoadConcepts>, MuxiumQualities>
};

export const muxiumName = 'muxium';

const muxificationState = <Q, C extends LoadConcepts>(
  name: string,
  storeDialog?: boolean,
  logging?: boolean,
  logActionStream?: boolean
): MuxiumState<Q, C> => {
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
    lastStrategyActionList: [],
    lastStrategyData: '',
    lastStrategyDialog: '',
    generation: 0,
    cachedSemaphores: new Map<string, Map<string, [number, number, number, number]>>(),
    modeIndex: 0,
    defaultModeIndex: 1,
    modeNames: [muxiumName, muxiumName],
    methodSubscribers: [] as NamedSubscription[],
    principleSubscribers: [] as NamedSubscription[],
    generalSubscribers: [] as NamedSubscription[],    stagePlanners: [] as NamedStagePlanner[],
    action$: new Subject<Action>(),
    head: [],
    body: [],
    tail: [],
    actionConcepts$: new Subject<Concepts>(),
    concepts$: new MuxifiedSubject<Q, C, MuxiumState<Q, C>>(),
    deck: {} as Decks<MuxiumQualities, MuxiumState<Q, C>, MuxiumLoad<C>>,
    addConceptQue: {},
    removeConceptQue: {},
    badPlans: [],
    badActions: [],
    timer: [],
    tailTimer: [],
    timerLedger: new Map()
  };
};
const muxiumStaticPrinciple = [muxiumClosePrinciple];
export type MuxiumPrinciple = PrincipleFunction<MuxiumQualities, MuxiumDeck, MuxiumState<MuxiumQualities, LoadConcepts>>;

export const muxiumConcept = <Q, C extends LoadConcepts>(
  name: string,
  storeDialog?: boolean,
  logging?: boolean,
  logActionStream?: boolean,
  dynamic?: boolean,
): AnyConcept =>  {
  const state = muxificationState<Q, C>(name, storeDialog, logging, logActionStream);
  if (dynamic) {
    const c = createConcept<MuxiumState<Q, C>, MuxiumQualities>(
      muxiumName,
      state,
      muxiumQualities,
      [muxiumPrinciple, muxiumClosePrinciple],
      [blockingMode, permissiveMode]
    );
    return c;
  } else {
    const c = createConcept<MuxiumState<Q, C>, MuxiumQualities>(
      muxiumName,
      state,
      muxiumStaticQualities,
      muxiumStaticPrinciple,
      [blockingMode, permissiveMode]
    );
    return c;
  }
};
/*#>*/