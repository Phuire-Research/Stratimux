import { Subscriber } from 'rxjs';
import { Concept, ConceptCreator, Principle } from '../../model/concept';
import { webSocketPrinciple } from './webSocket.principle';
import { handleRequestQuality } from './qualities/handleRequest.quality';
import { createConcept } from '../../model/concept';

export type Server = {
    port: number;
    routes: unknown[];
};

export const webSocketKey = 'Web Socket';

const initialWebSocketState: Server = {
  port: 7070,
  routes: [] as unknown[],
};

export const createWebSocketConcept: ConceptCreator = () => {
  return createConcept(
    webSocketKey,
    initialWebSocketState,
    [handleRequestQuality],
    [webSocketPrinciple],
  );
};
