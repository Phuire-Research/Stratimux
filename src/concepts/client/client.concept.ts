import { createConcept } from '../../model/concept';
import { clientWebSocketPrinciple } from './client.principle';

export type Client = {
  webSocketTarget: string;
};

const initialClientState: Client = {
  webSocketTarget: 'testing'
};

export const clientConcept = createConcept(
  'client',
  initialClientState,
  [],
  [clientWebSocketPrinciple]
);
