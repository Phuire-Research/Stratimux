import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { Counter, counterConcept, countingStrategy, primedCountingStrategy } from '../concepts/counter/counter.concept';
import { addConceptsToAddQueThenBlockStrategy } from '../concepts/axium/strategies/addConcept.strategy';
import { log } from '../concepts/axium/qualities/log.quality';
import { AxiumState } from '../concepts/axium/axium.concept';

test('Axium add Concepts Strategy Test', () => {
  let count = 0;
  const axium = createAxium([]);
  console.log('Add Concepts Begin');
  const sub = axium.subscribe((concepts: Concept[]) => {
    count++;
    // const counter = selectState<Counter>(concepts, counterConcept.key);
    console.log(`${count}: Loaded Concepts: ${concepts.length}`);
    if (count === 1) {
      axium.dispatch(
        strategyBegin(
          addConceptsToAddQueThenBlockStrategy(concepts,[counterConcept])
        )
      );
    }
    if (count === 2) {
      let exists = false;
      if (concepts[1].key === counterConcept.key) {
        exists = true;
        axium.dispatch(strategyBegin(countingStrategy()));
      }
      it('Should have added the Counter Concept', () => {
        expect(exists).toBe(true);
      });
      // sub.unsubscribe();
    }
    if (count > 2) {
      const counter = selectState<Counter>(concepts, counterConcept.key);
      console.log('Counter: ', counter.count);
    }
    if (count === 7) {
      const counter = selectState<Counter>(concepts, counterConcept.key);
      it('Should count to 1', () => {
        expect(counter.count).toBe(1);
      });
    }
  });
});
