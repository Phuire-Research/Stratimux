import { map, Subject } from 'npm:rxjs@^7.8.1';
import { Action, Quality, Reducer, Method, strategySuccess, endOfActionStrategy, defaultReducer} from "../../../../mod.ts";
import { Server } from '../server.concept.ts';
import { createAction } from '../../../model/action.ts';
import { createQuality } from '../../../model/concept.ts';

export const handleRequest: Action = createAction('Server Handle Request');

const handleRequestSubject = new Subject<Action>();
const handleRequestMethod: Method = handleRequestSubject.pipe<Action>(
    map((action: Action) => {
        const requestEvent = action.payload as Deno.RequestEvent;
        const body = `Your user-agent is:\n\n${
        requestEvent.request.headers.get("user-agent") ?? "Unknown"
        }`;
        // The requestEvent's `.respondWith()` method is how we send the response
        // back to the client.
        const response = new Response(body, {
            status: 200,
        })
        response.headers.set('Content-Type', 'text/html');
        requestEvent.respondWith(response);
        if(action.strategy) {
            return strategySuccess(action.strategy);
        }
        return endOfActionStrategy;
    })
)

export const handleRequestQuality = createQuality(
    handleRequest,
    defaultReducer,
    handleRequestMethod,
    handleRequestSubject
)
