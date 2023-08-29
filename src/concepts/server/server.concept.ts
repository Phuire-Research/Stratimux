import { Subscriber } from 'npm:rxjs@^7.8.1';
import { Action, Concept, Principle } from '../../../mod.ts';
import { serverPrinciple } from './server.principle.ts';
import { handleRequestQuality } from './qualities/handleRequest.quality.ts';
import { createConcept } from '../../model/concept.ts';

export type Server = {
    port: number;
    routes: unknown[];
    handleRequestAction?: Action
}

const initialServerState: Server = {
    port: 8080,
    routes: [] as unknown[],
}

export const serverConcept = createConcept(
    'server',
    initialServerState,
    [handleRequestQuality],
    [serverPrinciple]
)
