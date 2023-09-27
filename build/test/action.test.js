"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_1 = require("../model/action");
const add_quality_1 = require("../concepts/counter/qualities/add.quality");
// export type ActionType = string;
// export type Action = {
//     type: ActionType;
//     semaphore: [number, number, number];
//     payload?: unknown;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// };
// export type ActionCreator = (payload?: unknown) => Action;
// export const createAction = (type: ActionType): ActionCreator => ((payload?: unknown): Action => {
//   return {
//     type,
//     semaphore: [0, 0, -1],
//     payload
//   };
// });
test('Axium add Concepts Strategy Test', (done) => {
    const something = (0, action_1.createAction)('something');
    expect(something.type).toBe('something');
    const add = (0, add_quality_1.counterAdd)();
    expect(add.type).toBe(add_quality_1.counterAddType);
    console.log(add.type);
    done();
});
