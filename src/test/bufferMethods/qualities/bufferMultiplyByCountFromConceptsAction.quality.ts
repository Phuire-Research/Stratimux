/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a method that will buffer
the dispatch of an action assigned to payload.
$>*/
/*<#*/
import { defaultReducer } from '../../../model/concept';
import { createMethodBufferWithConcepts } from '../../../model/method';
import { createActionNode, createStrategy, strategyBegin, } from '../../../model/actionStrategy';
import { createQualitySet } from '../../../model/quality';
import { selectState } from '../../../model/selector';
import { CounterState, counterName } from '../../../concepts/counter/counter.concept';
import { counterMultiply } from '../../../concepts/counter/qualities/multiply.quality';

export const [
  experimentBufferMultiplyByCountFromConcepts,
  experimentBufferMultiplyByCountFromConceptsType,
  experimentBufferMultiplyByCountFromConceptsQuality
] = createQualitySet({
  type: 'Experiment will buffer multiply count using concepts accessing counter state',
  reducer: defaultReducer,
  methodCreator: (c, s) => createMethodBufferWithConcepts((_, concepts) => {
    const counterState = selectState<CounterState>(concepts, counterName);
    return strategyBegin(createStrategy({
      initialNode: createActionNode(counterMultiply({
        by: counterState?.count as number
      })),
      topic: 'Buffered Action Topic'
    }));
  }, c, s, 10)
});
/*#>*/