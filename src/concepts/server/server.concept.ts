import { Subscriber } from 'rxjs';
import { Concept, Principle } from '../../model/concept';
import { Action  } from '../../model/action';
import { serverPrinciple } from './server.principle';
import { handleRequestQuality } from './qualities/handleRequest.quality';
import { createConcept } from '../../model/concept';

export type Server = {
    port: number;
    routes: unknown[];
    handleRequestAction?: Action
}

const initialServerState: Server = {
  port: 8080,
  routes: [] as unknown[],
};

export const serverConcept = createConcept(
  'server',
  initialServerState,
  [handleRequestQuality],
  [serverPrinciple]
);
