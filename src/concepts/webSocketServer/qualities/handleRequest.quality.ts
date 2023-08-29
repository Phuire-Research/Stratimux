import { map, Subject } from 'rxjs';
import { defaultReducer} from '../../../model/concept';
import { Server } from '../webSocket.concept';
import { Action, createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const handleRequest: Action = createAction('WebSocket Handle Request');

// const handleRequestSubject = new Subject<Action>();
// const handleRequestMethod: Method = handleRequestSubject.pipe<Action>(
//     map((action: Action) => {
//         const requestEvent = action.payload as Deno.RequestEvent;
//         console.log(requestEvent);
//         if(action.strategy) {
//             return strategySuccess(action.strategy);
//         }
//         return endOfActionStrategy;
//     })
// )

export const handleRequestQuality = createQuality(
  handleRequest,
  defaultReducer,
  // handleRequestMethod,
  // handleRequestSubject
);
