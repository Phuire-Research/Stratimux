import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { Action, Concept, PrincipleFunction } from "../../../mod.ts";
import { Subject, Subscriber } from "npm:rxjs@^7.8.1";
import { Client, clientConcept } from "./client.concept.ts";
import { selectState } from "../../model/selector.ts";
import { log } from "../axium/qualities/log.quality.ts";


// export const clientPrinciple: PrincipleFunction = (
//         observer: Subscriber<Action>,
//         concepts: Concept[]
//     ) => {

// }

export const clientWebSocketPrinciple: PrincipleFunction = (
        observer: Subscriber<Action>,
        concepts: Concept[],
        concepts$: Subject<Concept[]>,
    ) => {
    let clientState = selectState<Client>(concepts, clientConcept.key);
    const clientLog = log;
    let connected = false;
    let socket: WebSocket;
    clientLog.payload = `Client Web Socket Principle: ${clientState.webSocketTarget}`
    if(clientState.webSocketTarget !== 'testing') {
        socket = new WebSocket(
            clientState.webSocketTarget,
        );
        connected = true;
    }

    const sub = concepts$.subscribe(concepts => {
        if(!connected)
            clientState = selectState<Client>(concepts, clientConcept.key);
        if(!connected && clientState.webSocketTarget !== 'testing') {
            socket = new WebSocket(
                clientState.webSocketTarget,
            );
            connected = true;
            sub.unsubscribe()
        }
    })
    observer.next(log);
}