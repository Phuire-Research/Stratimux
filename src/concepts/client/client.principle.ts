import { Action } from '../../model/action';
import { Concept } from '../../model/concept';
import { PrincipleFunction } from '../../model/principle';
import { Subject, Subscriber } from 'rxjs';
import { Client, clientConcept } from './client.concept';
import { selectState } from '../../model/selector';
import { log } from '../axium/qualities/log.quality';

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
  // let clientState = selectState<Client>(concepts, clientConcept.key);
  // const clientLog = log;
  // let connected = false;
  // let socket: WebSocket;
  // clientLog.payload = `Client Web Socket Principle: ${clientState.webSocketTarget}`;
  // if (clientState.webSocketTarget !== 'testing') {
  //   socket = new WebSocket(
  //     clientState.webSocketTarget,
  //   );
  //   connected = true;
  // }

  // const sub = concepts$.subscribe(concepts => {
  //   if (!connected)
  //   {clientState = selectState<Client>(concepts, clientConcept.key);}
  //   if (!connected && clientState.webSocketTarget !== 'testing') {
  //     socket = new WebSocket(
  //       clientState.webSocketTarget,
  //     );
  //     connected = true;
  //     sub.unsubscribe();
  //   }
  // });
  // observer.next(log);
};