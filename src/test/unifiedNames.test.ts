/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that muxified concepts inherit their muxified names as intended.
$>*/
/*<#*/
import { createConcept } from '../model/concept/concept';
import { muxifyConcepts } from '../model/concept/conceptAdvanced';

test('Muxified Names Test', (done) => {
  const one = createConcept(
    'one',
    {},
  );
  const two = createConcept(
    'two',
    {},
  );
  const three = createConcept(
    'three',
    {},
  );
  const four = createConcept(
    'four',
    {},
  );
  const five = createConcept(
    'five',
    {},
  );
  const muxified = muxifyConcepts([
    one, two, two, three, four, five, five
  ],
  createConcept('muxified', {})
  );
  console.log('CHECK MUXIFIED', muxified.muxifiedRecord, muxified);
  expect(Object.keys(muxified.muxifiedRecord).length).toBe([one, two, three, four, five].length);
  done();
});
/*#>*/