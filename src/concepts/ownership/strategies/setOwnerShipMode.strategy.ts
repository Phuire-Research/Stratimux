import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { primeAction } from '../../../model/action';
import { initializeOwnership } from '../qualities/initializeOwnership.quality';
import { setMode, SetModePayload } from '../../axium/qualities/setMode.quality';

export function setOwnershipModeStrategy(concepts: Concept[]): ActionStrategy {
  const primedInitializeOwnership = primeAction(concepts, initializeOwnership);
  const primedSetMode = primeAction(concepts, setMode);

  const stepTwo: ActionNode = {
    action: primedInitializeOwnership,
    successNode: null,
  };
  const stepOne: ActionNode = {
    action: primedSetMode,
    successNode: stepTwo,
    payload: { modeIndex: 2 } as SetModePayload
  };
  const params: ActionStrategyParameters = {
    initialNode: stepOne,
  };

  return createStrategy(params);
}