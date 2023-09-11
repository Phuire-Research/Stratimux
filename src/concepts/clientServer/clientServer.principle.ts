import { Concept } from '../../model/concept';
import { Action,  } from '../../model/action';
import { PrincipleFunction } from '../../model/principle';
import { Subject, Subscriber } from 'rxjs';
import { ClientServer, createClientServerConcept } from './clientServer.concept';
import { selectState } from '../../model/selector';

// export const clientPrinciple: PrincipleFunction = (
//         observer: Subscriber<Action>,
//         concepts: Concept[]
//     ) => {

// }

export const clientServerPrinciple: PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concept[],
  concepts$: Subject<Concept[]>,
) => {
  // let clientState = selectState<ClientServer>(concepts, clientServerConcept.key);
  // const sub = concepts$.subscribe(concepts => {
  //   const clientServerState = selectState<ClientServer>(concepts, clientServerConcept.key);
  //   // console.log('Check Client Server State: ', clientServerState);
  //   if (clientServerState.requestQue.length > 0) {
  //     const routes = clientServerState.routes;
  //     const nextRequest = clientServerState.requestQue.pop();
  //     if (clientServerState.requestQue === undefined) {
  //       clientServerState.requestQue = [];
  //     }
  //     const newRequestQue = [
  //       ...clientServerState.requestQue,
  //     ];
  //     const response = handleClientServerRequest;
  //     for (let i = 0; i < routes.length; i++) {
  //       if (nextRequest?.request.url.includes(routes[i].route)) {
  //         response.payload = {
  //           request: nextRequest,
  //           html: routes[i].html,
  //           newRequestQue: newRequestQue
  //         };
  //         break;
  //       }
  //     }
  //     console.log('New Request', newRequestQue);
  //     if (response.payload) {
  //       observer.next(response);
  //     } else {
  //       response.payload = {
  //         request: nextRequest,
  //         html:
  //                       `<!DOCTYPE html>
  //                       <html lang="en">
  //                         <head>
  //                           <title>404 Page Not Found</title>
  //                         </head>
  //                         <body>
  //                           <h1>404 Page Not Found</h1>
  //                         </body>
  //                       </html>`,
  //         nextRequestQue: newRequestQue
  //       };
  //       observer.next(response);
  //     }
  //   }
  // });
  // log.payload = 'Client Server Principle Initialized';
  // observer.next(log);
};