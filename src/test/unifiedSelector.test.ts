import { CounterState, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { counterSelectCount } from '../concepts/counter/counter.selector';
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
      const updated = updateUnifiedKeyedSelector(concepts, 1, counterSelectCount) as KeyedSelector;
      const concept = createConceptKeyedSelector(concepts, counterName, counterSelectCount) as KeyedSelector;
      const unified = createUnifiedKeyedSelector<CounterState>(concepts, 1, 'count') as KeyedSelector;
      expect(selectSlice(concepts, updated)).toBe(0);
      expect(selectSlice(concepts, concept)).toBe(0);
      expect(selectSlice(concepts, unified)).toBe(0);
      setTimeout(() => done(), 0);
      plan.conclude();
    },
  ]);
});
