import { Concept } from '../../model/concept';
import { addQuality } from './qualities/add.quality';
export { add } from './qualities/add.quality';
import { subtractQuality } from './qualities/subtract.quality';
export { subtract } from './qualities/subtract.quality';
import { chainCountQuality } from './qualities/chainCount.quality';
import { createConcept } from '../../model/concept';
export { chainCount } from './qualities/chainCount.quality';
export { countingStrategy, primedCountingStrategy } from './strategies/counting.strategy';

export type Counter = {
    count: number
}

export const counterKey = 'counter';

const initialCounterState: Counter = {
  count: 0
};

export const counterConcept = createConcept(
  counterKey,
  initialCounterState,
  [
    addQuality,
    subtractQuality,
    chainCountQuality
  ]
);