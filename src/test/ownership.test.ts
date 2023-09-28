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
// import { countingTopic, primedCountingTopic } from '../concepts/counter/strategies/counting.strategy';
import { primedCountingStrategy, countingTopic, primedCountingTopic } from '../concepts/experiment/strategies/experimentCounting.strategy';
import { axiumLog } from '../concepts/axium/qualities/log.quality';

// REFACTOR
// Create a Test Ownership Principle
// And a Dummy set of Strategies that utilize default Method and Reducer
// Refine as you Go

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
      (cpts, dispatch) => {
        const ownership = selectState<OwnershipState>(cpts, ownershipName);
        console.log('Stage 2', ownership.ownershipLedger, ownership.pendingActions);
        const counter = selectState<Counter>(cpts, counterName);
        console.log('Count: ', counter.count);
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
          console.log('Stage 3, If 3 Count: ', counter.count);
          expect(orderOfTopics[0]).toBe(countingTopic);
          staged.close();
          axium.close();
          setTimeout(() => {done();}, 1000);
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
      // const staged = axium.stage(
      //   'Testing Ownership Staging', [
      //     (_, dispatch) => {
      //       console.log('Stage 1');
      //       dispatch(strategyBegin(puntCountingStrategy()), {
      //         iterateStep: true
      //       });
      //     },
      //     (cpts, dispatch) => {
      //       console.log('Stage 2');
      //       dispatch(strategyBegin(primedCountingStrategy(cpts)), {
      //         iterateStep: true
      //       });
      //     },
      //     (cpts, _) => {
      //       console.log('Stage 3', orderOfTopics.length);
      //       const axiumState = cpts[0].state as AxiumState;
      //       if (orderOfTopics.length === 2) {
      //         expect(orderOfTopics[1]).toBe(primedCountingTopic);
      //         setTimeout(() => {done();}, 500);
      //         staged.close();
      //       } else if (
      //         (axiumState.lastStrategy === countingTopic ||
      //         axiumState.lastStrategy === countingTopic) &&
      //         orderOfTopics.length === 0) {
      //         orderOfTopics.push(axiumState.lastStrategy);
      //       } else if (
      //         (axiumState.lastStrategy === countingTopic ||
      //         axiumState.lastStrategy === countingTopic) &&
      //         orderOfTopics.length === 1) {
      //         orderOfTopics.push(axiumState.lastStrategy);
      //       }
      //     }
      //   ]);

      expect(state.initialized).toBe(true);
      // const ownership = selectState<OwnershipState>(concepts, ownershipName);
      // console.log('Ready to Stage', staged, ownership.ownershipLedger, ownership.pendingActions);
      sub.unsubscribe();
    }
  });
});

// PUNT Additional Test: Have two Axiums interact with One Another
// Going to Punt for now. Moving back towards creating the UI
// As this system is Reserved for a Complex Set Up and the Interaction
//  And the Interaction with the File System by default is that Set Up
// When this becomes important again. The requirement for a FailureNode to be that of Null
// Kicks in. As a Block of a Key is a Failure by Default
