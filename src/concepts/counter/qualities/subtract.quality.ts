import { map, Subject } from 'npm:rxjs@^7.8.1';
import { Action, Quality, Reducer, Method, strategySuccess, endOfActionStrategy } from "../../../../mod.ts";
import { Counter } from '../counter.concept.ts';
import { createAction } from '../../../model/action.ts';
import { createQuality } from '../../../model/concept.ts';

export const subtract: Action = createAction('Counter Subtract');

export function subtractReducer(state: Counter) {
    return {
        ...state,
        count: state.count - 1
    };
}
const subtractSubject = new Subject<Action>();
const subtractMethod: Method = subtractSubject.pipe<Action>(
    map((action: Action) => {
        console.log('SUBTRACT');
        if(action.strategy) {
            return strategySuccess(action.strategy);
        }
        return endOfActionStrategy;
    })
)

export const subtractQuality = createQuality(
    subtract,
    subtractReducer,
    subtractMethod,
    subtractSubject
)
