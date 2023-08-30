import { defer, Observable, Subject, withLatestFrom, BehaviorSubject, Subscriber, map} from 'rxjs';
import { Concept } from '../../model/concept';
import { PrincipleFunction, createPrinciple$ } from '../../model/principle';
import { Action } from '../../model/action';
import { Server, serverConcept } from './server.concept';
import { handleRequest } from './qualities/handleRequest.quality';
import { selectConcept, selectState } from '../../model/selector';

export const serverPrinciple: PrincipleFunction = async (observer: Subscriber<Action>, concepts: Concept[]) => {
  // Start listening on port 8080 of localhost.
  // const serverState = selectState<Server>(concepts, serverConcept.key);
  // let currentHandleRequest = handleRequest;
  // if (serverState.handleRequestAction) {
  //   currentHandleRequest = serverState.handleRequestAction as Action;
  // }
  // let state: Server = {
  //   port: 8080,
  //   routes: []
  // };
  // if (concepts) {
  //   state = selectState<Server>(concepts, serverConcept.key) ;
  // }
  // const server = Deno.listen({ port: state.port });
  // console.log(`HTTP webserver running.  Access it at:  http://localhost:${state.port}/`);

  // // Connections to the server will be yielded up as an async iterable.

  // for await (const conn of server) {
  //   // In order to not be blocking, we need to handle each connection individually
  //   // without awaiting the function
  //   serveHttp(conn);
  // }

  // async function serveHttp(conn: Deno.Conn) {
  //   // This "upgrades" a network connection into an HTTP connection.
  //   const httpConn = Deno.serveHttp(conn);
  //   // Each request sent over the HTTP connection will be yielded as an async
  //   // iterator from the HTTP connection.
  //   for await (const requestEvent of httpConn) {
  //     // The native HTTP server uses the web standard `Request` and `Response`
  //     // objects.
  //     try {
  //       const handle = {...currentHandleRequest};
  //       handle.payload = {request: requestEvent};
  //       console.log(requestEvent.respondWith);
  //       observer.next(handle);
  //     } catch (error) {
  //       console.warn('Server Error' , error);
  //     }
  //   }
  // }
};
