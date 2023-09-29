import { createAxium  } from '../model/axium';
import { Concept } from '../model/concept';
import { selectState } from '../model/selector';
import { OwnershipState, createOwnershipConcept, ownershipName } from '../concepts/ownership/ownership.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { setOwnerShipModeTopic } from '../concepts/ownership/strategies/setOwnerShipMode.strategy';
import { Counter, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { createExperimentConcept } from '../concepts/experiment/experiment.concept';
import { puntCountingStrategy } from '../concepts/experiment/strategies/puntCounting.strategy';
import { strategyBegin } from '../model/actionStrategy';
import { primedCountingStrategy, countingTopic, primedCountingTopic } from '../concepts/experiment/strategies/experimentCounting.strategy';
import { axiumLog } from '../concepts/axium/qualities/log.quality';
import { counterSetCount } from '../concepts/counter/qualities/setCount.quality';

test('Ownership Test', (done) => {
  const orderOfTopics: string[] = [];
  let finalRun = true;
  const axium = createAxium([createOwnershipConcept(), createCounterConcept(), createExperimentConcept()], true, true);
  const staged = axium.stage(
    'Testing Ownership Staging', [
      (cpts, dispatch) => {
        const axiumState = cpts[0].state as AxiumState;
        if (axiumState.lastStrategy === setOwnerShipModeTopic) {
          const ownership = selectState<OwnershipState>(cpts, ownershipName);
          console.log('Stage 1', ownership.ownershipLedger, ownership.pendingActions);
          const counter = selectState<Counter>(cpts, counterName);
          console.log('Count: ', counter.count);
          dispatch(strategyBegin(puntCountingStrategy()), {
            iterateStep: true
          });
        }
      },
      (_, dispatch) => {
        // Will fire at the end after both strategies conclude
        console.log('SET COUNT');
        dispatch(counterSetCount({newCount: 1000}, undefined, 7000), { iterateStep: true});
      },
      (cpts, dispatch) => {
        const ownership = selectState<OwnershipState>(cpts, ownershipName);
        console.log('Stage 2', ownership.ownershipLedger, ownership.pendingActions);
        const counter = selectState<Counter>(cpts, counterName);
        console.log('Count: ', counter.count);
        // dispatch(counterSetCount({newCount: 1000}, undefined, 7000), { runOnce: true});
        dispatch(strategyBegin(primedCountingStrategy(cpts)), {
          iterateStep: true
        });
      },
      (cpts, dispatch) => {
        const axiumState = cpts[0].state as AxiumState;
        const counter = selectState<Counter>(cpts, counterName);
        // console.log('Stage 3', axiumState.lastStrategy, orderOfTopics);
        if (orderOfTopics.length === 2 && finalRun) {
          finalRun = false;
          // This will be the final test to be triggered by a log action.
          console.log('Stage 3, If 3 Count: ', counter.count, orderOfTopics);
          expect(orderOfTopics[0]).toBe(countingTopic);
          expect(counter.count).toBe(3);
          staged.close();
        } else if (
          (axiumState.lastStrategy === countingTopic ||
          axiumState.lastStrategy === primedCountingTopic) &&
          orderOfTopics.length === 0) {
          console.log('Stage 3, If 1 Count: ', counter.count);
          orderOfTopics.push(axiumState.lastStrategy);
        } else if (
          (axiumState.lastStrategy === countingTopic ||
          axiumState.lastStrategy === primedCountingTopic) &&
          orderOfTopics.length === 1) {
          if (orderOfTopics[0] !== axiumState.lastStrategy) {
            console.log('Stage 3, If 2 Count: ', counter.count);
            orderOfTopics.push(axiumState.lastStrategy);
            // Due to the halting behavior of a Unified Turing Machine, this will trigger the final test.
            dispatch(axiumLog(), {
              runOnce: true
            });
          }
        }
      }
    ]);
  const sub = axium.subscribe((concepts: Concept[]) => {
    const state = selectState<OwnershipState>(concepts, ownershipName);
    const _axiumState = concepts[0].state as AxiumState;
    if (state.initialized && _axiumState.lastStrategy === setOwnerShipModeTopic) {
      expect(state.initialized).toBe(true);
    }
    const counter = selectState<Counter>(concepts, counterName);
    if (counter.count >= 1000) {
      console.log('Subscription, Final Count: ', counter.count, orderOfTopics);
      expect(counter.count).toBe(1000);
      setTimeout(() => {done();}, 1000);
      sub.unsubscribe();
      axium.close();
    }
  });
});
