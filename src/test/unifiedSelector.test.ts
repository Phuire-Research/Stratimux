/*<$
For the asynchronous graph programming framework Stratimux,
generate a test that ensures that the functionality of different state selector consumer functions.
That specifically you can utilize the incoming semaphore to create new KeyedSelectors, or update old ones.
$>*/
/*<#*/
import { CounterState, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { muxification } from '../model/muxium/muxium';
import { select } from '../model/selector';

import { KeyedSelector } from '../model/selector/selector.type';

test('Muxified Selector Test', (done) => {
  const muxium = muxification('Selector Test via Counter', {
    counter: createCounterConcept()
  }, {logging: true, storeDialog: true});
  const plan = muxium.plan('Plan: Counter Selector', ({stage}) => [
    stage(({concepts}) => {
      console.log('FIRED!!!');
      const concept = select.createConceptKeyedSelector<CounterState>(counterName, 'count');
      const updated = select.updateMuxifiedKeyedSelector(concepts, 1, concept) as KeyedSelector;
      const muxified = select.createMuxifiedKeyedSelector<CounterState>(concepts, 1, 'count') as KeyedSelector;
      console.log('CHECK SELECTORS', concept, updated, muxified);
      expect(select.slice(concepts, updated)).toBe(0);
      expect(select.slice(concepts, concept)).toBe(0);
      expect(select.slice(concepts, muxified)).toBe(0);
      setTimeout(() => done(), 0);
      plan.conclude();
    }),
  ]);
});
/*#>*/