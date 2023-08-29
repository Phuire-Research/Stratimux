import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { createAxium, Concept, strategyBegin, selectState } from './mod.ts';
import { Counter, counterConcept, countingStrategy, primedCountingStrategy } from './src/concepts/counter/counter.concept.ts';
import { Server, serverConcept } from './src/concepts/server/server.concept.ts';
import { webSocketConcept } from "./src/concepts/webSocketServer/webSocket.concept.ts";
import { clientConcept } from "./src/concepts/client/client.concept.ts";
import { clientServerConcept } from "./src/concepts/clientServer/clientServer.concept.ts";
import { appendRequestToQueQuality } from "./src/concepts/clientServer/qualities/appendRequestEventToQue.quality.ts";

const serverState = serverConcept.state as Server;
serverState.handleRequestAction = appendRequestToQueQuality.action;
const axium = await createAxium([serverConcept, clientServerConcept]);
const sub = axium.subscribe((concepts: Concept[]) => {
    // console.log('Client Test', concepts.length);
});
