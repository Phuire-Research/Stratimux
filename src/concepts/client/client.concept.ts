import { createConcept } from "../../model/concept.ts";
import { clientWebSocketPrinciple } from "./client.principle.ts";

export type Client = {
    webSocketTarget: string;
};

const initialClientState: Client = {
    webSocketTarget: 'testing'
}

export const clientConcept = createConcept(
    'client',
    initialClientState,
    [],
    [clientWebSocketPrinciple]
)
