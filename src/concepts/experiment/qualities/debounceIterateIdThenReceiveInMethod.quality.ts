/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the state ID.
Then debounce the quality of actions within a range. To dispatch the most recent action after the specified time elapses.
That will finally unify the state id and setId from the payload into the most recent strategies data field.
$>*/
/*<#*/
import { ExperimentState } from '../experiment.concept';
import { createMethodDebounceWithState } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { createQualityCardWithPayload } from '../../../model/quality';

export type ExperimentDebounceIterateIdThenReceiveInMethodPayload = {
  setId: number;
}

export const experimentDebounceIterateIdThenReceiveInMethod =
  createQualityCardWithPayload<ExperimentState, ExperimentDebounceIterateIdThenReceiveInMethodPayload>({
    type: 'Experiment debounce iterate ID then receive in Method via State',
    reducer: (state: ExperimentState) => {
      return {
        ...state,
        id: state.id + 1
      };
    },
    methodCreator: () => createMethodDebounceWithState((action, state) => {
      const payload = action.payload;
      if (action.strategy) {
        const data = strategyData_unifyData<ExperimentState & ExperimentDebounceIterateIdThenReceiveInMethodPayload>(action.strategy, {
          id: state.id,
          setId: payload.setId
        });
        const strategy = strategySuccess(action.strategy, data);
        return strategy;
      }
      return action;
    }, 500)
  });
/*#>*/