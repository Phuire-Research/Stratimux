import { Action, Quality, Reducer, defaultReducer } from "../../../../mod.ts";
import { createAction } from "../../../model/action.ts";
import { createQuality } from "../../../model/concept.ts";

export const chainCount: Action = createAction('Counter Chain Count');

export const chainCountQuality = createQuality(
    chainCount,
    defaultReducer
)
