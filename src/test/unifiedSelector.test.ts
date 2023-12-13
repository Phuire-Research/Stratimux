/*<$
For the graph programming framework Stratimux,
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
  selectSlice,
  updateUnifiedKeyedSelector
} from '../model/selector';

test('Unified Selector Test', (done) => {
  const axium = createAxium('Selector Test via Counter', [
    createCounterConcept()
  ], true, true);
  const plan = axium.stage('Plan: Counter Selector', [
    (concepts, _) => {
      const concept = createConceptKeyedSelector<CounterState>(counterName, 'count');
      const updated = updateUnifiedKeyedSelector(concepts, 1, concept) as KeyedSelector;
      const unified = createUnifiedKeyedSelector<CounterState>(concepts, 1, 'count') as KeyedSelector;
      console.log('CHECK SELECTORS', concept, updated, unified);
      expect(selectSlice(concepts, updated)).toBe(0);
      expect(selectSlice(concepts, concept)).toBe(0);
      expect(selectSlice(concepts, unified)).toBe(0);
      setTimeout(() => done(), 0);
      plan.conclude();
    },
  ]);
});
/*#>*/