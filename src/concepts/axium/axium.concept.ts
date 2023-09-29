import { BehaviorSubject, Subject, Subscriber } from 'rxjs';
import { Concept, ConceptCreator } from '../../model/concept';
import { Action } from '../../model/action';
import { axiumPrinciple } from './axium.principle';
import { blockingMode, permissiveMode } from './axium.mode';
import { openQuality } from './qualities/open.quality';
import { badActionQuality } from './qualities/badAction.quality';
import { closeQuality } from './qualities/close.quality';
import { logQuality } from './qualities/log.quality';
import { registerSubscriberQuality } from './qualities/registerSubscriber.quality';
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
import { Staged, UnifiedSubject } from '../../model/unifiedSubject';

export type NamedSubscriber = {
  name: string;
  subscriber: Subscriber<Action>;
}

export type AxiumState = {
  open: boolean;
  logging: boolean;
  dialog: string;
  storeDialog: boolean;
  lastStrategy: string;
  generation: number;
  cachedSemaphores: Map<string,Map<string,[number,number,number]>>
  modeIndex: number;
  defaultModeIndex: number;
  modeNames: string[]
  methodSubscribers: NamedSubscriber[];
  generalSubscribers: NamedSubscriber[];
  action$: Subject<Action>;
  concepts$: UnifiedSubject;
  addConceptQue: Concept[],
  removeConceptQue: Concept[],
  subConcepts$: UnifiedSubject;
  badStages: Staged[];
  badActions: Action[];
}

export const axiumName = 'axium';

const createAxiumState = (storeDialog?: boolean, logging?: boolean): AxiumState => {
  return {
    open: false,
    logging: logging ? logging : false,
    dialog: '',
    storeDialog: storeDialog ? storeDialog : false,
    lastStrategy: '',
    generation: 0,
    cachedSemaphores: new Map<string, Map<string, [number, number, number]>>(),
    modeIndex: 0,
    defaultModeIndex: 1,
    modeNames: [axiumName, axiumName],
    methodSubscribers: [] as NamedSubscriber[],
    generalSubscribers: [] as NamedSubscriber[],
    action$: new Subject<Action>(),
    concepts$: new UnifiedSubject(),
    addConceptQue: [] as Concept[],
    removeConceptQue: [] as Concept[],
    subConcepts$: new UnifiedSubject(),
    badStages: [],
    badActions: []
  };
};

export const createAxiumConcept = (storeDialog?: boolean, logging?: boolean): Concept =>  {
  return createConcept(
    axiumName,
    createAxiumState(storeDialog, logging),
    [
      openQuality,
      badActionQuality,
      closeQuality,
      appendActionListToDialogQuality,
      clearDialogQuality,
      logQuality,
      registerSubscriberQuality,
      initializePrinciplesQuality,
      setBlockingModeQuality,
      setDefaultModeQuality,
      setDefaultModeIndexQuality,
      addConceptsFromQueQuality,
      appendConceptsToAddQueQuality,
      appendConceptsToRemoveQueQuality,
      removeConceptsViaQueQuality,
      setModeQuality,
    ],
    [axiumPrinciple],
    [blockingMode, permissiveMode]
  );
};
