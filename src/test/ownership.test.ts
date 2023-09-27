import { createAxium  } from '../model/axium';
import { Concept } from '../model/concept';
import { selectState } from '../model/selector';
import { OwnershipState, createOwnershipConcept, ownershipName } from '../concepts/ownership/ownership.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { setOwnerShipModeTopic, setOwnershipModeStrategy } from '../concepts/ownership/strategies/setOwnerShipMode.strategy';
import { createCounterConcept } from '../concepts/counter/counter.concept';
import { createExperimentConcept } from '../concepts/experiment/experiment.concept';

// REFACTOR
// Create a Test Ownership Principle
// And a Dummy set of Strategies that utilize default Method and Reducer
// Refine as you Go

test('Ownership Test', (done) => {
  const axium = createAxium([createOwnershipConcept(), createCounterConcept(), createExperimentConcept()], true, true);
  const sub = axium.subscribe((concepts: Concept[]) => {
    const state = selectState<OwnershipState>(concepts, ownershipName);
    const axiumState = concepts[0].state as AxiumState;
    if (state.initialized && axiumState.lastStrategy === setOwnerShipModeTopic) {
      expect(state.initialized).toBe(true);
      setTimeout(() => {done();}, 500);
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
