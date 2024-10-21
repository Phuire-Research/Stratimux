/*<$
For the asynchronous graph programming framework Stratimux generate a Counter Concept that will keep track of a count in its state.
$>*/
/*<#*/
import { counterAdd } from './qualities/add.quality';
import { counterSubtract } from './qualities/subtract.quality';
import { counterSetCount } from './qualities/setCount.quality';
import { Concept, createConcept } from '../../model/concept/concept';
import { counterMultiply } from './qualities/multiply.quality';
export { countingStrategy } from './strategies/counting.strategy';

export type CounterState = {
    count: number
}

export const counterName = 'counter';

const initialCounterState: CounterState = {
  count: 0
};

const counterQualities = {
  counterAdd,
  counterSubtract,
  counterSetCount,
  counterMultiply
};

export type CounterDeck = {
  counter: Concept<CounterState, typeof counterQualities>,
};

export type CounterQualities = typeof counterQualities;

export const createCounterConcept = () => {
  return createConcept<CounterState, CounterQualities>(
    counterName,
    initialCounterState,
    counterQualities
  );
};
/*#>*/