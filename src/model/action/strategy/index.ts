/*<$
For the asynchronous graph programming framework Stratimux, define the ActionStrategy Index model file.
This file defines the strategy object that bundles all necessary ActionStrategy consumer functions needed for production.
$>*/
/*<#*/
import {
  createActionNode,
  createActionNodeFromStrategy,
  createStrategy,
} from './actionStrategy';
import { strategyBegin, strategyDecide, strategyFailed, strategySuccess } from './actionStrategyConsumers';
import { strategyBackTrack, strategyDetermine, strategyPunt, strategyRecurse, strategySequence } from './actionStrategyConsumersAdvanced';

export const strata = ({
  createActionNode,
  createActionNodeFromStrategy,
  create: createStrategy,
  begin: strategyBegin,
  success: strategySuccess,
  failed: strategyFailed,
  decide: strategyDecide,
  determine: strategyDetermine,
  punt: strategyPunt,
  sequence: strategySequence,
  backTrack: strategyBackTrack,
  recurse: strategyRecurse,
});
/*#>*/