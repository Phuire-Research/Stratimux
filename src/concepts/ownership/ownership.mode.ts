/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate mode that will govern the ownership system.
This mode will pay attention to an ActionStrategy's assigned KeyedSelector and if it currently does not have
ownership of the value that the selector would return via the selectSlice helper function.
Ownership will add that action to its actionList. That will then be monitored via an ownership principle.
This mode will also relieve ownership upon receiving concluding parts of a strategy, such as conclusion, or even
a bad action that signifies that the associated action was invalidated.
$>*/
/*<#*/
import { Subject } from 'rxjs';
import { Action, AnyAction } from '../../model/action/action.type';
import { Concepts } from '../../model/concept/concept';
import { Mode } from '../../model/concept/concept';
import { permissiveMode, blockingMode } from '../muxium/muxium.mode';
import { checkIn, clearStubs, ownershipShouldBlock, updateAddToPendingActions } from '../../model/ownership';
import { MuxifiedSubject } from '../../model/stagePlanner/stagePlanner';
import { failureConditions, strategyData_appendFailure } from '../../model/action/actionStrategyData';
import { getMuxiumState } from '../../model/muxium/muxium';
import { strategyFailed } from '../../model/action/strategy/actionStrategyConsumers';
import { ActionStrategy } from '../../model/action/strategy/actionStrategy.type';

export const ownershipMode: Mode = (
  [_action, _concepts, action$, concepts$] : [Action, Concepts, Subject<Action>, MuxifiedSubject]
) => {
  let action = _action;
  let concepts = _concepts;
  const conceptsSize = Object.keys(concepts).length;
  let finalMode: Mode = permissiveMode;
  const muxiumState = getMuxiumState(concepts);
  const deck = muxiumState.deck;
  // Logical Determination: setBlockingModeType
  if (action.semaphore[3] === 4) {
    finalMode = blockingMode;
  } else {
    // This assumes that ownership will be treated as the new default mode.
    finalMode = (concepts[0].mode as Mode[])[1];
  }
  // Logical Determination: muxiumConcludeType
  // If generation is set to -1, then the action is not primed.
  //  Therefore we pass straight to finalMode which will recall this Mode after priming the action.
  //  This guarantees that action beyond this function will have a semaphore not set to [0, 0, -1, 0]
  if (conceptsSize > 1) {
    if (action.semaphore[3] !== 3 && action.semaphore[3] !== 1 && action.semaphore[2] !== muxiumState.generation) {
    // Check In Logic
      const shouldBlock = ownershipShouldBlock(concepts, action);
      if (shouldBlock) {
        if (action.strategy) {
          const strategy = action.strategy;
          if (action.strategy.currentNode.failureNode === null) {
          // This assumes that the Strategy does not account for the Block
            let nextAction: AnyAction = strategyFailed(
              strategy,
              strategyData_appendFailure(strategy, failureConditions.ownershipBlocked)
            );
            // Logical Determination: muxiumConcludeType
            // eslint-disable-next-line max-depth
            if (nextAction.semaphore[3] === 3) {
              concepts = clearStubs(concepts, nextAction.strategy as ActionStrategy);
              nextAction = deck.d.muxium.e.muxiumAppendActionListToDialog({
                actionList: action.strategy.actionList,
                strategyTopic: action.strategy.topic,
                strategyData: action.strategy.data
              });
            }
            finalMode([nextAction, concepts, action$, concepts$]);
          } else {
          // This assumes that the Strategy is accounting for the Block
            [concepts, action] = checkIn(concepts, action);
            const nextAction = strategyFailed(
              strategy,
              strategyData_appendFailure(strategy, failureConditions.ownershipBlocked)
            );
            concepts = updateAddToPendingActions(concepts, nextAction);
            concepts$.next(concepts);
          }
        }  else {
        // Principle is then responsible to dispatch these actions;
          concepts = updateAddToPendingActions(concepts, action);
          concepts$.next(concepts);
        }
      // } else if (action.keyedSelectors) {
      } else if (action.strategy) {
        [concepts, action] = checkIn(concepts, action);
        finalMode([action, concepts, action$, concepts$]);
      } else {
      // Free to Run
        finalMode([action, concepts, action$, concepts$]);
      }
    // Logical Determination: muxiumConcludeType
    } else if (action.semaphore[3] !== 3 && action.semaphore[1] !== 1) {
      finalMode([action, concepts, action$, concepts$]);

    // Logical Determination: muxiumConcludeType, muxiumBadActionType
    } else if (action.strategy?.stubs && (action.semaphore[3] === 3 || action.semaphore[3] === 1)) {
      concepts = clearStubs(concepts, action.strategy);
      concepts$.next(concepts);
      if (action.semaphore[3] === 1) {
        finalMode([action, concepts, action$, concepts$]);
      }
    } else if (action.semaphore[3] === 1) {
      finalMode([action, concepts, action$, concepts$]);
    }
  } else {
    finalMode([action, concepts, action$, concepts$]);
  }
};
/*#>*/