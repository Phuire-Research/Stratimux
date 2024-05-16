/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a method that will buffer asynchronously
the dispatch of an action assigned to payload.
$>*/
/*<#*/
import { defaultReducer } from '../../../model/concept';
import { createActionNode, createStrategy, strategyBegin, } from '../../../model/actionStrategy';
import { createQualitySet, } from '../../../model/quality';
import { selectState } from '../../../model/selector';
import { CounterState, counterName } from '../../../concepts/counter/counter.concept';
import { counterMultiply } from '../../../concepts/counter/qualities/multiply.quality';
import { createAsyncMethodBufferWithConcepts } from '../../../model/method';

export const [
  experimentAsyncBufferMultiplyByCountFromConcepts,
  experimentAsyncBufferMultiplyByCountFromConceptsType,
  experimentAsyncBufferMultiplyByCountFromConceptsQuality
] = createQualitySet({
  type: 'Experiment will asynchronously buffer multiply count using concepts accessing counter state',
  reducer: defaultReducer,
  methodCreator: (c, s) => createAsyncMethodBufferWithConcepts((controller, _, concepts) => {
    setTimeout(() => {
      const counterState = selectState<CounterState>(concepts, counterName);
      controller.fire(strategyBegin(createStrategy({
        initialNode: createActionNode(counterMultiply({
          by: counterState?.count as number
        })),
        topic: 'AsyncBuffered Action Topic'
      })));
    }, 50);
  }, c, s, 10)
});
/*#>*/