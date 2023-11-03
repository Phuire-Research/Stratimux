import { Counter, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
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
    (concepts, dispatch) => {
      expect(selectSlice(concepts, updateUnifiedKeyedSelector(concepts, 1, counterSelectCount) as KeyedSelector)).toBe(0);
      expect(selectSlice(concepts, createConceptKeyedSelector(concepts, counterName, counterSelectCount) as KeyedSelector)).toBe(0);
      expect(selectSlice(concepts, createUnifiedKeyedSelector<Counter>(concepts, 1, 'count') as KeyedSelector)).toBe(0);
      setTimeout(() => done(), 0);
      plan.conclude();
    },
  ]);
});
