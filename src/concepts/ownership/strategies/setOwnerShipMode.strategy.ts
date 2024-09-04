/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, generate a strategy that will set the Axium's mode to Ownership.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept, Concepts } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { OwnershipDeck, OwnershipQualities, OwnershipState, ownershipName } from '../ownership.concept';
import { AxiumDeck, AxiumState } from '../../axium/axium.concept';
import { Deck } from '../../../model/deck';
import { getAxiumState } from '../../../model/axium';

export const ownershipSetOwnerShipModeTopic = 'Axium set Mode to Ownership then Initialize Ownership Principle';
export function ownershipSetOwnershipModeStrategy<T extends Deck<OwnershipDeck & AxiumDeck>>(
  deck: T,
  concepts: Concepts,
  modeName: string
): ActionStrategy {
  const {
    ownershipInitializeOwnership
  } = deck.ownership.e;
  const {
    axiumSetDefaultModeIndex,
    axiumSetMode
  } = deck.axium.e;
  let ownershipModeIndex = 2;
  getAxiumState(concepts).modeNames.forEach((key, i) => {
    if (key === ownershipName) {
      ownershipModeIndex = i;
    }
  });

  const stepThree = createActionNode(ownershipInitializeOwnership(), {
    successNotes: {
      preposition: 'Set',
    },
  });
  const stepTwo = createActionNode(axiumSetDefaultModeIndex({
    index: ownershipModeIndex
  }), {
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
  });
  const stepOne = createActionNode(axiumSetMode({ modeIndex: ownershipModeIndex, modeName }), {
    successNode: stepTwo,
    successNotes: {
      preposition: 'Successfully'
    },
  });

  return createStrategy({
    topic: ownershipSetOwnerShipModeTopic,
    initialNode: stepOne,
  });
}
/*#>*/