/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that actions are being created as intended.
$>*/
/*<#*/
import { createAction } from '../model/action';
import { counterAdd, counterAddType } from '../concepts/counter/qualities/add.quality';

test('Axium add Concepts Strategy Test', (done) => {
  const something = createAction('something');
  expect(something.type).toBe('something');
  const somethingElse = createAction('somethingElse', {payload: {
    name: 'somethingElse'
  }});
  expect(somethingElse.payload?.name).toBe('somethingElse');
  const add = counterAdd();
  expect(add.type).toBe(counterAddType);
  console.log(add.type);
  done();
});
/*#>*/