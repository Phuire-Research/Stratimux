"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePrinciplesQuality = exports.initializePrinciplesReducer = exports.axiumInitializePrinciplesType = void 0;
const concept_1 = require("../../../model/concept");
const principle_1 = require("../../../model/principle");
const concept_2 = require("../../../model/concept");
exports.axiumInitializePrinciplesType = 'initialize Principles and set new Subscribers to General Subscribers list';
function initializePrinciplesReducer(state, _action) {
    const payload = _action.payload;
    const concepts = payload.concepts;
    const action$ = state.action$;
    const subConcepts$ = state.concepts$;
    const subscribers = state.generalSubscribers;
    concepts.forEach((concept) => {
        if (concept.principles) {
            concept.principles.forEach(principle => {
                const observable = (0, principle_1.createPrinciple$)(principle, concepts, subConcepts$);
                subscribers.push({
                    name: concept.name,
                    subscriber: observable.subscribe((action) => action$.next(action)),
                });
            });
        }
    });
    return Object.assign(Object.assign({}, state), { subscribers });
}
exports.initializePrinciplesReducer = initializePrinciplesReducer;
exports.initializePrinciplesQuality = (0, concept_2.createQuality)(exports.axiumInitializePrinciplesType, initializePrinciplesReducer, concept_1.createDefaultMethodCreator);
