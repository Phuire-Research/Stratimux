/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, devise a test that will ensure that the concept is working as intended.
$>*/
/*<#*/
import { createAxium, getAxiumState  } from '../model/axium';
import { ConceptDeck, Concepts } from '../model/concept';
import { selectConcept, selectState } from '../model/selector';
import { OwnershipState, createOwnershipConcept, ownershipName } from '../concepts/ownership/ownership.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { ownershipSetOwnerShipModeTopic } from '../concepts/ownership/strategies/setOwnerShipMode.strategy';
import { CounterState, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { createExperimentState, createExperimentConcept } from '../concepts/experiment/experiment.concept';
import { experimentPuntCountingStrategy } from '../concepts/experiment/strategies/puntCounting.strategy';
import { strategyBegin } from '../model/actionStrategy';
import {
  experimentCountingStrategy,
  experimentCountingTopic,
} from '../concepts/experiment/strategies/experimentCounting.strategy';
import { axiumLog } from '../concepts/axium/qualities/log.quality';
import { counterSetCount } from '../concepts/counter/qualities/setCount.quality';
import { experimentCheckInStrategy } from '../concepts/experiment/qualities/checkInStrategy.quality';
import { experimentActionQuePrincipleCreator } from '../concepts/experiment/experiment.principle';
import { additionalCountingStrategyTopic } from '../concepts/counter/strategies/counting.strategy';

test('Ownership Test', (done) => {
  const orderOfTopics: string[] = [];
  let finalRun = true;
  const qualities = {experimentCheckInStrategy};
  const deck = {
    ownership: createOwnershipConcept(),
    counter: createCounterConcept(),
    experiment: createExperimentConcept(createExperimentState(), qualities, [experimentActionQuePrincipleCreator<typeof qualities>()])
  };
  const axium = createAxium<typeof deck>('ownershipTest', deck, {logging: true, storeDialog: true});
  const plan = axium.plan(
    'Testing Ownership Staging', ({stage}) => [
      stage(({stagePlanner, concepts, dispatch, d}) => {
        const axiumState = getAxiumState(concepts);
        console.log(axiumState.lastStrategy);
        if (axiumState.lastStrategy === ownershipSetOwnerShipModeTopic) {
          const ownership = selectState<OwnershipState>(concepts, ownershipName);
          if (ownership) {
            console.log('Stage 1', ownership.ownershipLedger, ownership.pendingActions);
            console.log('CHECK CONCEPTS', Object.keys(concepts).map(k => concepts[Number(k)].name));
            const counter = selectState<CounterState>(concepts, counterName);
            console.log('Count: ', counter?.count);
            // This will place a counting strategy in the experiment actionQue to be later dispatched.
            //    Via its principle, to simulate an action moving off premise.
            const str = experimentPuntCountingStrategy(d);
            if (str) {
              dispatch(strategyBegin(str), {
                iterateStage: true
              });
            } else {
              stagePlanner.conclude();
              expect(false).toBe(true);
              setTimeout(() => {done();}, 500);
            }
          }
        }
      }),
      // Comment out if testing log and the halting quality of the Unified Turing Machine.
      stage(({concepts, dispatch, d}) => {
        // Will be ran after both counting strategies conclude.
        const ownership = selectState<OwnershipState>(concepts, ownershipName);
        if (ownership) {
          console.log('Stage 2', ownership.ownershipLedger, ownership.pendingActions);
          console.log('CHECK CONCEPTS', Object.keys(concepts).map(k => concepts[Number(k)].name));
          dispatch(d.counter.e.counterSetCount({newCount: 1000}, {agreement: 7000} ), { iterateStage: true});
        }
      }),
      stage(({concepts, dispatch, d}) => {
        const ownership = selectState<OwnershipState>(concepts, ownershipName);
        if (ownership) {
          console.log('Stage 3', ownership.ownershipLedger, ownership.pendingActions);
          console.log('CHECK CONCEPTS', Object.keys(concepts).map(k => concepts[Number(k)].name));
          const counter = selectState<CounterState>(concepts, counterName);
          console.log('Count: ', counter?.count);
          dispatch(strategyBegin(experimentCountingStrategy(d)), {
            iterateStage: true
          });
        }
      }),
      stage(({concepts, dispatch, e}) => {
        const axiumState = getAxiumState(concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        if (counter) {
          console.log('Stage 4', axiumState.lastStrategy, orderOfTopics, selectConcept(concepts, ownershipName)?.state);
          console.log('CHECK CONCEPTS', Object.keys(concepts).map(k => concepts[Number(k)].name));
          if (orderOfTopics.length === 2 && finalRun) {
            finalRun = false;
            // This will be the final test to be triggered by a log action.
            console.log('Stage 3, If #3 | Count: ', counter.count, orderOfTopics);
            expect(orderOfTopics[0]).toBe(experimentCountingTopic);
            expect(counter.count).toBe(3);
            // Comment in if testing the halting ability of log and setCount stage is commented out.
            // setTimeout(() => {done();}, 1000);
            plan.conclude();
          } else if (
            (axiumState.lastStrategy === experimentCountingTopic || axiumState.lastStrategy === additionalCountingStrategyTopic) &&
            orderOfTopics.length === 0) {
            console.log('Stage 3, If #1 | Count: ', counter.count);
            orderOfTopics.push(axiumState.lastStrategy);
          } else if (
            (axiumState.lastStrategy === experimentCountingTopic || axiumState.lastStrategy === additionalCountingStrategyTopic) &&
            orderOfTopics.length === 1) {
            if (orderOfTopics[0] !== axiumState.lastStrategy) {
              console.log('Stage 3, If #2 | Count: ', counter.count);
              orderOfTopics.push(axiumState.lastStrategy);
              // Due to the halting behavior of a Unified Turing Machine, this will trigger before set Count at step 2.
              //  If commented out, set Count will trigger the the "If #3" check.
              //  If commenting out setCount stage, disable the test in the subscription
              //    Then be sure to enabled the final done check in "If #3".
              //    Then enabling the axiumLog dispatch will allow the test to conclude.
              //    But disabling the axiumLog will never trigger the "If #3" check and disallow the test to conclude.
              //      This proves Stratimux as a Unified Turing Machine and this configuration Halting Complete.
              dispatch(e.axiumLog(), {
                runOnce: true
              });
            }
          }
        }
      })
    ]);
  const sub = axium.subscribe((concepts: Concepts) => {
    const state = selectState<OwnershipState>(concepts, ownershipName);
    if (state) {
      const _axiumState = getAxiumState(concepts);
      if (state.initialized && _axiumState.lastStrategy === ownershipSetOwnerShipModeTopic) {
        expect(state.initialized).toBe(true);
      }
      const counter = selectState<CounterState>(concepts, counterName);
      // This will run last, despite setCount being the second staged dispatch.
      if (counter && counter.count >= 1000) {
        console.log('Subscription, Final Count: ', counter.count, orderOfTopics);
        expect(counter.count).toBe(1000);
        // Comment out if setCount stage is disabled and instead testing axiumLogs of "If #2" halting interaction.
        setTimeout(() => {done();}, 1000);
        sub.unsubscribe();
        axium.close();
      }
    }
  });
});
/*#>*/