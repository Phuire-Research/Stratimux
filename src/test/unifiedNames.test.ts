/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that unified concepts inherit their unified names as intended.
$>*/
/*<#*/
import { createConcept, unifyConcepts } from '../model/concept';

test('Unified Names Test', (done) => {
  const one = createConcept<any>(
    'one',
    {},
  );
  const two = createConcept<any>(
    'two',
    {},
  );
  const three = createConcept<any>(
    'three',
    {},
  );
  const four = createConcept<any>(
    'four',
    {},
  );
  const five = createConcept<any>(
    'five',
    {},
  );
  const unified = unifyConcepts<any>([
    one, two, two, three, four, five, five
  ],
  createConcept('unified', {})
  );
  console.log('CHECK UNIFIED', unified.unified, unified);
  expect(unified.unified.length).toBe([one, two, three, four, five].length);
  done();
});
/*#>*/