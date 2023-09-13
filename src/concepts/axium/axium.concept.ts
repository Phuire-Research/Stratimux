import { BehaviorSubject, Subject, Subscriber } from 'rxjs';
import { Concept, ConceptCreator } from '../../model/concept';
import { Action } from '../../model/action';
import { axiumPrinciple } from './axium.principle';
import { defaultMode, blockingMode } from './axium.mode';
import { openQuality } from './qualities/open.quality';
import { badActionQuality } from './qualities/badAction.quality';
import { closeQuality } from './qualities/close.quality';
import { logQuality } from './qualities/log.quality';
import { registerStreamsQuality } from './qualities/registerStreams.quality';
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

export type KeyedSub = {
  key: string;
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
  modeKeys: string[]
  methodSubscribers: KeyedSub[];
  generalSubscribers: KeyedSub[];
  action$?: Subject<Action>;
  concepts$?: BehaviorSubject<Concept[]>;
  addConceptQue: Concept[],
  removeConceptQue: Concept[],
  subConcepts$: Subject<Concept[]>;
}

export const axiumKey = 'Axium';

const createAxiumState = (logging?: boolean, storeDialog?: boolean): AxiumState => {
  return {
    open: false,
    logging: logging ? logging : false,
    dialog: '',
    storeDialog: storeDialog ? storeDialog : false,
    lastStrategy: '',
    generation: 0,
    cachedSemaphores: new Map<string, Map<string, [number, number, number]>>(),
    modeIndex: 0,
    modeKeys: [axiumKey, axiumKey],
    methodSubscribers: [] as KeyedSub[],
    generalSubscribers: [] as KeyedSub[],
    addConceptQue: [] as Concept[],
    removeConceptQue: [] as Concept[],
    subConcepts$: new Subject<Concept[]>(),
  };
};

export const createAxiumConcept = (logging?: boolean, storeDialog?: boolean): Concept =>  {
  return createConcept(
    axiumKey,
    createAxiumState(logging, storeDialog),
    [
      openQuality,
      badActionQuality,
      closeQuality,
      appendActionListToDialogQuality,
      logQuality,
      registerStreamsQuality,
      registerSubscriberQuality,
      initializePrinciplesQuality,
      setBlockingModeQuality,
      setDefaultModeQuality,
      addConceptsFromQueQuality,
      appendConceptsToAddQueQuality,
      appendConceptsToRemoveQueQuality,
      removeConceptsViaQueQuality,
      setModeQuality
    ],
    [axiumPrinciple],
    [blockingMode, defaultMode]
  );
};
