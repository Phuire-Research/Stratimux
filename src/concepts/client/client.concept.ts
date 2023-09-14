import { ConceptCreator, createConcept } from '../../model/concept';
import { clientWebSocketPrinciple } from './client.principle';

export type Client = {
  webSocketTarget: string;
};

export const clientName = 'Client';

const initialClientState: Client = {
  webSocketTarget: 'testing'
};

export const createClientConcept: ConceptCreator = () => {
  return createConcept(
    clientName,
    initialClientState,
    [],
    [clientWebSocketPrinciple]
  );
};
