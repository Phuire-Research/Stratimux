import { map, Subject } from 'rxjs';
import { Action, ActionType } from '../../../model/action';
import { Quality, Reducer, Method, defaultReducer } from '../../../model/concept';
import { strategySuccess } from '../../../model/actionStrategy';
import { ClientServer } from '../clientServer.concept';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const handleClientServerRequestType: ActionType = 'Client Server Handle Request';

export type HandleClientServerRequestPayload = {
    // request: Deno.RequestEvent,
    html: string,
    // nextRequestQue: Deno.RequestEvent[]
}

function handleClientServerRequestReducer(state: ClientServer, action: Action) {
  const payload = action.payload as HandleClientServerRequestPayload;
  return {
    ...state,
    // requestQue: payload.nextRequestQue
  } as ClientServer;
}

// const handleClientServerRequestSubject = new Subject<Action>();
// const handleClientServerRequestMethod: Method = handleClientServerRequestSubject.pipe<Action>(
//   map((action: Action) => {
//     const payload = action.payload as HandleClientServerRequestPayload;
//     // The requestEvent's `.respondWith()` method is how we send the response
//     // back to the client.
//     try {
//       const response = new Response(payload.html, {
//         status: 200,
//       });
//       response.headers.set('Content-Type', 'text/html');

//       payload.request.respondWith(response);
//     } catch (error) {
//       console.log('Response Error', error);
//     }
//     if (action.strategy) {
//       return strategySuccess(action.strategy);
//     }
//     return endOfActionStrategy;
//   })
// );

export const handleClientServerRequestQuality = createQuality(
  handleClientServerRequestType,
  handleClientServerRequestReducer,
  // handleClientServerRequestMethod,
  // handleClientServerRequestSubject
);
