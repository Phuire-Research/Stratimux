"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCounterConcept = exports.counterName = exports.primedCountingStrategy = exports.countingStrategy = void 0;
const add_quality_1 = require("./qualities/add.quality");
const subtract_quality_1 = require("./qualities/subtract.quality");
const setCount_quality_1 = require("./qualities/setCount.quality");
const concept_1 = require("../../model/concept");
var counting_strategy_1 = require("./strategies/counting.strategy");
Object.defineProperty(exports, "countingStrategy", { enumerable: true, get: function () { return counting_strategy_1.countingStrategy; } });
Object.defineProperty(exports, "primedCountingStrategy", { enumerable: true, get: function () { return counting_strategy_1.primedCountingStrategy; } });
exports.counterName = 'counter';
const initialCounterState = {
    count: 0
};
const createCounterConcept = () => {
    return (0, concept_1.createConcept)(exports.counterName, initialCounterState, [
        add_quality_1.addQuality,
        subtract_quality_1.subtractQuality,
        setCount_quality_1.setCountQuality
    ]);
};
exports.createCounterConcept = createCounterConcept;
