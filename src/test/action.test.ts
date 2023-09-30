import { createAction } from '../model/action';
import { counterAdd, counterAddType } from '../concepts/counter/qualities/add.quality';

test('Axium add Concepts Strategy Test', (done) => {
  const something = createAction('something');
  expect(something.type).toBe('something');
  const add = counterAdd();
  expect(add.type).toBe(counterAddType);
  console.log(add.type);
  done();
});
