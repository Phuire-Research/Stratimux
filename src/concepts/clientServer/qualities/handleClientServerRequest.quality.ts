import { map, Subject } from 'npm:rxjs@^7.8.1';
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { Action, Quality, Reducer, Method, strategySuccess, endOfActionStrategy, defaultReducer} from "../../../../mod.ts";
import { ClientServer } from '../clientServer.concept.ts';
import { createAction } from '../../../model/action.ts';
import { createQuality } from '../../../model/concept.ts';
import { debounce } from 'npm:rxjs@^7.8.1';
import { interval } from 'npm:rxjs@^7.8.1';

export const handleClientServerRequest: Action = createAction('Client Server Handle Request');

export type HandleClientServerRequestPayload = {
    request: Deno.RequestEvent,
    html: string,
    nextRequestQue: Deno.RequestEvent[]
}

function handleClientServerRequestReducer(state: ClientServer, action: Action) {
    const payload = action.payload as HandleClientServerRequestPayload;
    return {
        ...state,
        requestQue: payload.nextRequestQue
    } as ClientServer
}

const handleClientServerRequestSubject = new Subject<Action>();
const handleClientServerRequestMethod: Method = handleClientServerRequestSubject.pipe<Action>(
    map((action: Action) => {
        const payload = action.payload as HandleClientServerRequestPayload;
        // The requestEvent's `.respondWith()` method is how we send the response
        // back to the client.
        try {
            const response = new Response(payload.html, {
                status: 200,
            })
            response.headers.set('Content-Type', 'text/html');

            payload.request.respondWith(response);
        } catch (error){
            console.log('Response Error', error)
        }
        if(action.strategy) {
            return strategySuccess(action.strategy);
        }
        return endOfActionStrategy;
    })
)

export const handleClientServerRequestQuality = createQuality(
    handleClientServerRequest,
    handleClientServerRequestReducer,
    handleClientServerRequestMethod,
    handleClientServerRequestSubject
)
