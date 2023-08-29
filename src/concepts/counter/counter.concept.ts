import { Concept } from '../../../mod.ts';
import { addQuality } from './qualities/add.quality.ts';
export { add } from './qualities/add.quality.ts';
import { subtractQuality } from './qualities/subtract.quality.ts';
export { subtract } from './qualities/subtract.quality.ts';
import { chainCountQuality } from './qualities/chainCount.quality.ts';
import { createConcept } from '../../model/concept.ts';
export { chainCount } from './qualities/chainCount.quality.ts';
export { countingStrategy, primedCountingStrategy } from './strategies/counting.strategy.ts';

export type Counter = {
    count: number
}

const initialCounterState: Counter = {
    count: 0
}

export const counterConcept = createConcept(
    'counter',
    initialCounterState,
    [
        addQuality,
        subtractQuality,
        chainCountQuality
    ]
)
