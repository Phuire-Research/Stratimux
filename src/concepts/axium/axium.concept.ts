import { BehaviorSubject, Subject, Subscriber } from 'rxjs';
import { Concept } from '../../model/concept';
import { Action } from '../../model/action';
import { axiumPrinciple } from './axium.principle';
import { defaultMode, blockingMode } from './axium.mode';
import { openQuality } from './qualities/open.quality';
import { badActionQuality } from './qualities/badAction.quality';
import { closeQuality } from './qualities/close.quality';
import { logQuality } from './qualities/log.quality';
import { registerStreamsQuality } from './qualities/registerStreams.quality';
export { registerStreams } from './qualities/registerStreams.quality';
import { registerSubscriberQuality } from './qualities/registerSubscriber.quality';
import { initializePrinciplesQuality } from './qualities/initializePrinciples.quality';
export { initializePrinciples } from './qualities/initializePrinciples.quality';
export { initializationStrategy } from './strategies/initialization.strategy';
import { setBlockingModeQuality } from './qualities/setBlockingMode.quality';
export { setBlockingMode } from './qualities/setBlockingMode.quality';
import { setDefaultModeQuality } from './qualities/setDefaultMode.quality';
import { addConceptsFromQueQuality } from './qualities/addConceptsFromQue.quality';
import { appendConceptsToAddQueQuality } from './qualities/appendConceptsToAddQue.quality';
import { appendConceptsToRemoveQueQuality } from './qualities/appendConceptsToRemoveQue.quality';
import { removeConceptsViaQueQuality } from './qualities/removeConceptsViaQue.quality';
import { createConcept } from '../../model/concept';
export { setDefaultMode } from './qualities/setDefaultMode.quality';

export type KeyedSub = {
  key: string;
  subscriber: Subscriber<Action>;
}

export type AxiumState = {
  logging: boolean;
  generation: number;
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

const initialAxiumState: AxiumState = {
  logging: true,
  generation: 0,
  modeIndex: 0,
  modeKeys: ['axium'],
  methodSubscribers: [] as KeyedSub[],
  generalSubscribers: [] as KeyedSub[],
  addConceptQue: [] as Concept[],
  removeConceptQue: [] as Concept[],
  subConcepts$: new Subject<Concept[]>(),
};

export const _axium = createConcept(
  'axium',
  initialAxiumState,
  [
    openQuality,
    badActionQuality,
    closeQuality,
    logQuality,
    registerStreamsQuality,
    registerSubscriberQuality,
    initializePrinciplesQuality,
    setBlockingModeQuality,
    setDefaultModeQuality,
    addConceptsFromQueQuality,
    appendConceptsToAddQueQuality,
    appendConceptsToRemoveQueQuality,
    removeConceptsViaQueQuality
  ],
  [axiumPrinciple],
  [blockingMode, defaultMode]
);
