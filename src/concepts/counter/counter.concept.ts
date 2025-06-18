/*<$
For the asynchronous graph programming framework Stratimux generate a Counter Concept that will keep track of a count in its state.
$>*/
/*<#*/
import { CounterAdd, counterAdd } from './qualities/add.quality';
import { CounterSubtract, counterSubtract } from './qualities/subtract.quality';
import { CounterSetCount, counterSetCount } from './qualities/setCount.quality';
import { createConcept } from '../../model/concept/concept';
import { Concept } from '../../model/concept/concept.type';
import { CounterMultiply, counterMultiply } from './qualities/multiply.quality';
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

export type CounterQualities = {
  counterAdd: CounterAdd,
  counterSubtract: CounterSubtract,
  counterSetCount: CounterSetCount,
  counterMultiply: CounterMultiply
};

export type CounterConcept = Concept<CounterState, CounterQualities>;
export type CounterDeck = {
  counter: Concept<CounterState, CounterQualities>,
};

export const createCounterConcept = () => {
  return createConcept<CounterState, CounterQualities>(
    counterName,
    initialCounterState,
    counterQualities
  );
};
/*#>*/