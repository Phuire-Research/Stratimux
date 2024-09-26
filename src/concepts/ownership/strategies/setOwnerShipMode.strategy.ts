/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, generate a strategy that will set the Muxium's mode to Ownership.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept, Concepts } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { OwnershipDeck, OwnershipQualities, OwnershipState, ownershipName } from '../ownership.concept';
import { MuxiumDeck, MuxiumState } from '../../muxium/muxium.concept';
import { Deck } from '../../../model/deck';
import { getMuxiumState } from '../../../model/muxium';

export const ownershipSetOwnerShipModeTopic = 'Muxium set Mode to Ownership then Initialize Ownership Principle';
export function ownershipSetOwnershipModeStrategy<T extends Deck<OwnershipDeck & MuxiumDeck>>(
  deck: T,
  concepts: Concepts,
  modeName: string
): ActionStrategy {
  const {
    ownershipInitializeOwnership
  } = deck.ownership.e;
  const {
    muxiumSetDefaultModeIndex,
    muxiumSetMode
  } = deck.muxium.e;
  let ownershipModeIndex = 2;
  getMuxiumState(concepts).modeNames.forEach((key, i) => {
    if (key === ownershipName) {
      ownershipModeIndex = i;
    }
  });

  const stepThree = createActionNode(ownershipInitializeOwnership(), {
    successNotes: {
      preposition: 'Set',
    },
  });
  const stepTwo = createActionNode(muxiumSetDefaultModeIndex({
    index: ownershipModeIndex
  }), {
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
  });
  const stepOne = createActionNode(muxiumSetMode({ modeIndex: ownershipModeIndex, modeName }), {
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