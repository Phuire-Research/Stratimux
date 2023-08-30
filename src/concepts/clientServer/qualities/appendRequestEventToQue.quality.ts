import { Action } from '../../../model/action';
import { ClientServer } from '../clientServer.concept';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const appendRequestToQue: Action = createAction('Append Request to Que');

export type AppendRequestToQuePayload = {
    // request: Deno.RequestEvent,
}

function appendRequestToQueReducer(state: ClientServer, action: Action) {
  const payload = action.payload as AppendRequestToQuePayload;
  console.log('Request', payload);
  return {
    ...state,
    // requestQue: [...state.requestQue, payload.request]
  } as ClientServer;
}

export const appendRequestToQueQuality = createQuality(
  appendRequestToQue,
  appendRequestToQueReducer
);
