import { Action, Quality, Reducer, Method, strategySuccess, endOfActionStrategy, defaultReducer} from "../../../../mod.ts";
import { ClientServer } from '../clientServer.concept.ts';
import { createAction } from '../../../model/action.ts';
import { createQuality } from '../../../model/concept.ts';

export const appendRequestToQue: Action = createAction('Append Request to Que');

export type AppendRequestToQuePayload = {
    request: Deno.RequestEvent,
}

function appendRequestToQueReducer(state: ClientServer, action: Action) {
    const payload = action.payload as AppendRequestToQuePayload;
    console.log('Request', payload)
    return {
        ...state,
        requestQue: [...state.requestQue, payload.request]
    } as ClientServer
}

export const appendRequestToQueQuality = createQuality(
    appendRequestToQue,
    appendRequestToQueReducer
)
