import { addQuality } from './qualities/add.quality';
import { subtractQuality } from './qualities/subtract.quality';
import { chainCountQuality } from './qualities/chainCount.quality';
import { createConcept } from '../../model/concept';
export { countingStrategy, primedCountingStrategy } from './strategies/counting.strategy';

export type Counter = {
    count: number
}

export const counterName = 'counter';

const initialCounterState: Counter = {
  count: 0
};

export const createCounterConcept = () => {
  return createConcept(
    counterName,
    initialCounterState,
    [
      addQuality,
      subtractQuality,
      chainCountQuality
    ]
  );
};
