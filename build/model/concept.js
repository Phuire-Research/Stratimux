"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMethodCreator = exports.defaultReducer = exports.createQuality = exports.createConcept = void 0;
const rxjs_1 = require("rxjs");
const action_1 = require("./action");
const actionStrategy_1 = require("./actionStrategy");
const rxjs_2 = require("rxjs");
const conclude_quality_1 = require("../concepts/axium/qualities/conclude.quality");
function createConcept(name, state, qualities, principles, mode) {
    return {
        name,
        state,
        qualities,
        principles,
        mode
    };
}
exports.createConcept = createConcept;
// Worry about this Functionality Later
// export function unifyConcepts(
//   baseConcept: Concept,
//   targetConcept: Concept,
//   key?: string,
// ): Concept {
//   const baseConceptState = baseConcept.state as object;
//   const targetConceptState = targetConcept.state as object;
//   let baseConceptPrinciples: PrincipleFunction[] = [];
//   if (baseConcept.principles) {
//     baseConceptPrinciples = baseConcept.principles;
//   }
//   let targetConceptPrinciples: PrincipleFunction[] = [];
//   if (targetConcept.principles) {
//     targetConceptPrinciples = targetConcept.principles;
//   }
//   let baseConceptMode: Mode[] = [];
//   if (baseConcept.mode) {
//     baseConceptMode = baseConcept.mode;
//   }
//   let targetConceptMode: Mode[] = [];
//   if (targetConcept.mode) {
//     targetConceptMode = targetConcept.mode;
//   }
//   return {
//     key: key ? key : targetConcept.key,
//     qualities: [...baseConcept.qualities, ...targetConcept.qualities],
//     state: {
//       ...baseConceptState,
//       ...targetConceptState,
//     },
//     principles: [...baseConceptPrinciples, ...targetConceptPrinciples],
//     mode: [...baseConceptMode, ...targetConceptMode],
//   };
// }
function createQuality(actionType, reducer, methodCreator, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
keyedSelectors) {
    return {
        actionType,
        reducer,
        methodCreator,
        keyedSelectors
    };
}
exports.createQuality = createQuality;
function defaultReducer(state, _) {
    return state;
}
exports.defaultReducer = defaultReducer;
const defaultMethodCreator = () => {
    const defaultSubject = new rxjs_1.Subject();
    const defaultMethod = defaultSubject.pipe((0, rxjs_2.map)((action) => {
        if (action.strategy) {
            return (0, actionStrategy_1.strategySuccess)(action.strategy);
        }
        return (0, action_1.createAction)(conclude_quality_1.axiumConcludeType);
    }));
    return [defaultMethod, defaultSubject];
};
exports.defaultMethodCreator = defaultMethodCreator;
