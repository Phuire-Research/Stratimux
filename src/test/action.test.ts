import { createAction } from '../model/action';
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
  const something = createAction('something');
  expect(something.type).toBe('something');
  done();
});
