/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that actions are being created as intended.
$>*/
/*<#*/
import { createAction } from '../model/action';
import { counterAdd } from '../concepts/counter/qualities/add.quality';

test('Muxium add Concepts Strategy Test', (done) => {
  const something = createAction('something');
  expect(something.type).toBe('something');
  const somethingElse = createAction('somethingElse', {payload: {
    name: 'somethingElse'
  }});
  expect(somethingElse.payload?.name).toBe('somethingElse');
  // Testing purposes only, access action creators via the Deck Interface in production.
  const add = counterAdd.actionCreator();
  expect(add.type).toBe('Counter Add');
  console.log(add.type);
  done();
});
/*#>*/