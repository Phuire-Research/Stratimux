/*<$
For the asynchronous graph programming framework Stratimux,
generate a test that ensures that the functionality of different state selector consumer functions.
That specifically you can utilize the incoming semaphore to create new KeyedSelectors, or update old ones.
$>*/
/*<#*/
import { CounterState, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { createAxium } from '../model/axium';
import {
  KeyedSelector,
  createConceptKeyedSelector,
  createUnifiedKeyedSelector,
  select,
  selectSlice,
  updateUnifiedKeyedSelector
} from '../model/selector';
import { createStage } from '../model/stagePlanner';

test('Unified Selector Test', (done) => {
  const axium = createAxium('Selector Test via Counter', {
    counter: createCounterConcept()
  }, {logging: true, storeDialog: true});
  const plan = axium.plan('Plan: Counter Selector', ({stage}) => [
    stage(({concepts}) => {
      console.log('FIRED!!!');
      const concept = createConceptKeyedSelector<CounterState>(counterName, 'count');
      const updated = updateUnifiedKeyedSelector(concepts, 1, concept) as KeyedSelector;
      const unified = createUnifiedKeyedSelector<CounterState>(concepts, 1, 'count') as KeyedSelector;
      console.log('CHECK SELECTORS', concept, updated, unified);
      expect(select.slice(concepts, updated)).toBe(0);
      expect(select.slice(concepts, concept)).toBe(0);
      expect(select.slice(concepts, unified)).toBe(0);
      setTimeout(() => done(), 0);
      plan.conclude();
    }),
  ]);
});
/*#>*/