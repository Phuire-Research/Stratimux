import { Subject, Subscription } from 'rxjs';
import { Concept } from '../../model/concept';
import { Action } from '../../model/action';
import { axiumPrinciple } from './axium.principle';
import { blockingMode, permissiveMode } from './axium.mode';
import { openQuality } from './qualities/open.quality';
import { badActionQuality } from './qualities/badAction.quality';
import { closeQuality } from './qualities/close.quality';
import { logQuality } from './qualities/log.quality';
import { registerSubscriberQuality } from './qualities/registerSubscription.quality';
import { initializePrinciplesQuality } from './qualities/initializePrinciples.quality';
export { initializationStrategy } from './strategies/initialization.strategy';
import { setBlockingModeQuality } from './qualities/setBlockingMode.quality';
import { setDefaultModeQuality } from './qualities/setDefaultMode.quality';
import { addConceptsFromQueQuality } from './qualities/addConceptsFromQue.quality';
import { appendConceptsToAddQueQuality } from './qualities/appendConceptsToAddQue.quality';
import { appendConceptsToRemoveQueQuality } from './qualities/appendConceptsToRemoveQue.quality';
import { removeConceptsViaQueQuality } from './qualities/removeConceptsViaQue.quality';
import { appendActionListToDialogQuality } from './qualities/appendActionListToDialog.quality';
import { createConcept } from '../../model/concept';
import { setModeQuality } from './qualities/setMode.quality';
import { setDefaultModeIndexQuality } from './qualities/setDefaultModeIndex.quality';
import { clearDialogQuality } from './qualities/clearDialog.quality';
import { NamedStagePlanner, Plan, UnifiedSubject } from '../../model/stagePlanner';
import { clearBadActionTypeFromBadActionListQuality } from './qualities/clearBadActionTypeFromBadActionList.quality';
import { clearBadStrategyTopicFromBadActionListQuality } from './qualities/clearBadStrategyTopicFromBadActionList.quality';
import { clearBadPlanFromBadPlanListQuality } from './qualities/clearBadPlanFromBadPlanList.quality';
import { registerStagePlannerQuality } from './qualities/registerStagePlanner.quality';
import { kickQuality } from './qualities/kick.quality';

export type NamedSubscription = {
  name: string;
  subscription: Subscription;
}

export type AxiumState = {
  // Would be unique identifier on a network
  name: string;
  open: boolean;
  logging: boolean;
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
  generalSubscribers: NamedSubscription[];
  stagePlanners: NamedStagePlanner[];
  action$: Subject<Action>;
  concepts$: UnifiedSubject;
  addConceptQue: Concept[],
  removeConceptQue: Concept[],
  subConcepts$: UnifiedSubject;
  badPlans: Plan[];
  badActions: Action[];
}

export const axiumName = 'axium';

const createAxiumState = (name: string, storeDialog?: boolean, logging?: boolean): AxiumState => {
  return {
    name,
    open: false,
    logging: logging ? logging : false,
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
    generalSubscribers: [] as NamedSubscription[],
    stagePlanners: [] as NamedStagePlanner[],
    action$: new Subject<Action>(),
    concepts$: new UnifiedSubject(),
    addConceptQue: [] as Concept[],
    removeConceptQue: [] as Concept[],
    subConcepts$: new UnifiedSubject(),
    badPlans: [],
    badActions: []
  };
};

export const createAxiumConcept = (name: string, storeDialog?: boolean, logging?: boolean): Concept =>  {
  return createConcept(
    axiumName,
    createAxiumState(name, storeDialog, logging),
    [
      kickQuality,
      openQuality,
      badActionQuality,
      closeQuality,
      appendActionListToDialogQuality,
      clearDialogQuality,
      logQuality,
      registerSubscriberQuality,
      registerStagePlannerQuality,
      initializePrinciplesQuality,
      setBlockingModeQuality,
      setDefaultModeQuality,
      setDefaultModeIndexQuality,
      addConceptsFromQueQuality,
      appendConceptsToAddQueQuality,
      appendConceptsToRemoveQueQuality,
      removeConceptsViaQueQuality,
      setModeQuality,
      clearBadActionTypeFromBadActionListQuality,
      clearBadStrategyTopicFromBadActionListQuality,
      clearBadPlanFromBadPlanListQuality
    ],
    [axiumPrinciple],
    [blockingMode, permissiveMode]
  );
};
