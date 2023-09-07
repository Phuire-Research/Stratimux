import { ConceptCreator, createConcept } from '../../model/concept';
import { clientServerPrinciple } from './clientServer.principle';
import { appendRequestToQueQuality } from './qualities/appendRequestEventToQue.quality';
import { handleClientServerRequestQuality } from './qualities/handleClientServerRequest.quality';

export type ClientServer = {
    webSocketTarget: string;
    routes: routeHTML[];
    // requestQue: Deno.RequestEvent[]
};

export const clientServerKey = 'Client Server';

export type routeHTML = {
    route: string;
    html: string;
    // bindings : {
    //  Selection
    //  Quality Binding
    //    EXAMPLE: registerOnClick of Selection with Action
    // }[]
    // Noting that Client Server is what Serves the Client Concept
    // Where a Unified Server Concept would be Both the Server and Websocket Connection
    // And the Unified Application that of the Server, Client, and Database
}

const initialClientServerState: ClientServer = {
  webSocketTarget: 'testing',
  routes: [],
  // requestQue: [],
};

export const createClientServerConcept: ConceptCreator = () => {
  return createConcept(
    clientServerKey,
    initialClientServerState,
    [handleClientServerRequestQuality, appendRequestToQueQuality],
    [clientServerPrinciple]
  );
};
