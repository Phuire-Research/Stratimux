import { map, Subject } from 'npm:rxjs@^7.8.1';
import { Action, Quality, Reducer, Method, strategySuccess, endOfActionStrategy } from "../../../../mod.ts";
import { Counter } from '../counter.concept.ts';
import { createAction } from '../../../model/action.ts';
import { createQuality } from '../../../model/concept.ts';

export const add: Action = createAction('Counter Add');

export function addReducer(state: Counter, _: Action) {
    return {
        ...state,
        count: state.count + 1
    };
}
const addSubject = new Subject<Action>();
const addMethod: Method = addSubject.pipe<Action>(
    map((action: Action) => {
        console.log('ADDITION');
        if(action.strategy) {
            return strategySuccess(action.strategy);
        }
        return endOfActionStrategy;
    })
)

export const addQuality = createQuality(
    add,
    addReducer,
    addMethod,
    addSubject
)