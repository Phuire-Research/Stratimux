import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { Counter, createCounterConcept, countingStrategy, primedCountingStrategy, counterName } from '../concepts/counter/counter.concept';
import { addConceptsToAddQueThenBlockStrategy } from '../concepts/axium/strategies/addConcept.strategy';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';

test('Axium add Concepts Strategy Test', (done) => {
  const axium = createAxium('axiumAddConceptTest',[], true, true);
  const staged = axium.stage('Add Concepts Stage',[
    (concepts, dispatch) => {
      dispatch(
        strategyBegin(
          addConceptsToAddQueThenBlockStrategy(concepts,[createCounterConcept()])
        ),
        {
          iterateStage: true
        }
      );
    },
    (concepts, dispatch) => {
      let exists = false;
      if (concepts[1].name === counterName) {
        exists = true;
        dispatch(strategyBegin(countingStrategy()), {
          iterateStage: true
        });
      }
      expect(exists).toBe(true);
    },
    (concepts) => {
      const axiumState = concepts[0].state as AxiumState;
      if (axiumState.lastStrategy === countingTopic) {
        const counter = selectState<Counter>(concepts, counterName);
        expect(counter.count).toBe(1);
        setTimeout(() => {done();}, 500);
        staged.close();
      }
    }
  ]);
});
