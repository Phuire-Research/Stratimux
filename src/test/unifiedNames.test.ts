/*<$
For the graph programming framework Stratimux, generate a test that ensures that unified concepts inherit their unified names as intended.
$>*/
/*<#*/
import { createConcept, unifyConcepts } from '../model/concept';

test('Unified Names Test', (done) => {
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
  const unified = unifyConcepts([
    one, two, two, three, four, five, five
  ],
  createConcept('unified', {})
  );
  console.log('CHECK UNIFIED', unified.unified, unified);
  expect(unified.unified.length).toBe([one, two, three, four, five].length);
  done();
});
/*#>*/