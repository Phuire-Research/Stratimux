/*<$
For the asynchronous graph programming framework Stratimux generate a Counter Concept that will keep track of a count in its state.
$>*/
/*<#*/
import { counterAddQuality } from './qualities/add.quality';
import { counterSubtractQuality } from './qualities/subtract.quality';
import { counterSetCountQuality } from './qualities/setCount.quality';
import { createConcept } from '../../model/concept';
export { countingStrategy, primedCountingStrategy } from './strategies/counting.strategy';

export type CounterState = {
    count: number
}

export const counterName = 'counter';

const initialCounterState: CounterState = {
  count: 0
};

export const createCounterConcept = () => {
  return createConcept(
    counterName,
    initialCounterState,
    [
      counterAddQuality,
      counterSubtractQuality,
      counterSetCountQuality
    ]
  );
};
/*#>*/