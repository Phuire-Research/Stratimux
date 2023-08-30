import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { Counter, counterConcept, countingStrategy, primedCountingStrategy } from '../concepts/counter/counter.concept';
import { addConceptsToRemovalQueThenBlockStrategy } from '../concepts/axium/strategies/removeConcept.strategy';
import { log } from '../concepts/axium/qualities/log.quality';
import { AxiumState } from '../concepts/axium/axium.concept';

test('Axium remove Concepts Strategy Test', async () => {
  it('Counter should not Exist', async () => {
    let count = 0;
    const axium = await createAxium([counterConcept]);
    console.log('Remove Concepts Begin');
    const sub = axium.subscribe((concepts: Concept[]) => {
      count++;
      // const counter = selectState<Counter>(concepts, counterConcept.key);
      console.log(`${count}: Loaded Concepts: ${concepts.length}`);
      if (count === 1) {
        axium.dispatch(
          strategyBegin(
            addConceptsToRemovalQueThenBlockStrategy(concepts,[counterConcept])
          )
        );
      }
      if (count === 2) {
        let exists = false;
        concepts.forEach(concept => {
          if (concept.key === counterConcept.key) {
            exists = true;
          }
        });
        expect(exists).toBe(false);
      }
    // sub.unsubscribe();
    });
  }, 200);
});
