import {
  defer,
  Observable,
  Subject,
  withLatestFrom,
  BehaviorSubject,
  Subscriber,
  map,
} from 'rxjs';
import { PrincipleFunction, createPrinciple$ } from '../../model/principle';
import { Concept } from '../../model/concept';
import { Action } from '../../model/action';
import { Server, webSocketConcept } from './webSocket.concept';
import { handleRequest } from './qualities/handleRequest.quality';
import { selectState } from '../../model/selector';

export const webSocketPrinciple: PrincipleFunction = async (
  observer: Subscriber<Action>,
  concepts: Concept[],
) => {
  // Replace with NPM Equivalent
  // Start listening on port 8080 of localhost.
  // let state: Server = {
  //     port: 7070,
  //     routes: []
  // }
  // if (concepts) {
  //     state = selectState<Server>(concepts, webSocketConcept.key) ;
  // }
  // const connectedClients = new Map();
  // const app = new Application();
  // const port = state.port;
  // const router = new Router();
  // // send a message to all connected clients
  // function broadcast(message: unknown) {
  // for (const client of connectedClients.values()) {
  //     client.send(message);
  // }
  // }
  // // send updated users list to all connected clients
  // function broadcast_usernames() {
  // const usernames = [...connectedClients.keys()];
  // console.log(
  //     "Sending updated username list to all clients: " +
  //     JSON.stringify(usernames),
  // );
  // broadcast(
  //     JSON.stringify({
  //     event: "update-users",
  //     usernames: usernames,
  //     }),
  // );
  // }
  // router.get("/websocket", async (ctx: any) => {
  // const socket = await ctx.upgrade();
  // const username = 'TESTER';
  // // const username = ctx.request.url.searchParams.get("username");
  // if (connectedClients.has(username)) {
  //     socket.close(1008, `Username ${username} is already taken`);
  //     return;
  // }
  // socket.username = username;
  // connectedClients.set(username, socket);
  // console.log(`New client connected: ${username}`);
  // // broadcast the active users list when a new user logs in
  // socket.onopen = () => {
  //     broadcast_usernames();
  // };
  // // when a client disconnects, remove them from the connected clients list
  // // and broadcast the active users list
  // socket.onclose = () => {
  //     console.log(`Client ${socket.username} disconnected`);
  //     connectedClients.delete(socket.username);
  //     broadcast_usernames();
  // };
  // // broadcast new message if someone sent one
  // socket.onmessage = (m: any) => {
  //     const data = JSON.parse(m.data);
  //     switch (data.event) {
  //     case "send-message":
  //         broadcast(
  //         JSON.stringify({
  //             event: "send-message",
  //             username: socket.username,
  //             message: data.message,
  //         }),
  //         );
  //         break;
  //     }
  // };
  // });
  // app.use(router.routes());
  // app.use(router.allowedMethods());
  // app.use(async (context: any) => {
  // await context.send({
  //     root: `${Deno.cwd()}/`,
  //     index: "public/index.html",
  // });
  // });
  // console.log("Listening at http://localhost:" + port);
  // await app.listen({ port });
};
