import { map, Subject } from 'rxjs';
import { Quality, Reducer, Method, defaultReducer} from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { strategySuccess } from '../../../model/actionStrategy';
import { Server } from '../server.concept';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const serverHandleRequestType: ActionType = 'Server Handle Request';

// const handleRequestSubject = new Subject<Action>();
// const handleRequestMethod: Method = handleRequestSubject.pipe<Action>(
//   map((action: Action) => {
//     const requestEvent = action.payload as Deno.RequestEvent;
//     const body = `Your user-agent is:\n\n${
//       requestEvent.request.headers.get('user-agent') ?? 'Unknown'
//     }`;
//     // The requestEvent's `.respondWith()` method is how we send the response
//     // back to the client.
//     const response = new Response(body, {
//       status: 200,
//     });
//     response.headers.set('Content-Type', 'text/html');
//     requestEvent.respondWith(response);
//     if (action.strategy) {
//       return strategySuccess(action.strategy);
//     }
//     return endOfActionStrategy;
//   })
// );

export const handleRequestQuality = createQuality(
  serverHandleRequestType,
  defaultReducer,
  // handleRequestMethod,
  // handleRequestSubject
);
