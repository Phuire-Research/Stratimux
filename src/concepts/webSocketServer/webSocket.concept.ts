import { Subscriber } from 'rxjs';
import { Concept, Principle } from '../../model/concept';
import { webSocketPrinciple } from './webSocket.principle';
import { handleRequestQuality } from './qualities/handleRequest.quality';
import { createConcept } from '../../model/concept';

export type Server = {
    port: number;
    routes: unknown[];
};

const initialWebSocketState: Server = {
  port: 7070,
  routes: [] as unknown[],
};

export const webSocketConcept = createConcept(
  'webSocket',
  initialWebSocketState,
  [handleRequestQuality],
  [webSocketPrinciple],
);
