"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logQuality = exports.axiumLog = exports.axiumLogType = void 0;
const rxjs_1 = require("rxjs");
const concept_1 = require("../../../model/concept");
const action_1 = require("../../../model/action");
const action_2 = require("../../../model/action");
const concept_2 = require("../../../model/concept");
const conclude_quality_1 = require("./conclude.quality");
const actionStrategy_1 = require("../../../model/actionStrategy");
exports.axiumLogType = 'logged a message passed to Axium';
exports.axiumLog = (0, action_1.prepareActionCreator)(exports.axiumLogType);
const createLogMethodCreator = () => {
    const logSubject = new rxjs_1.Subject();
    const logMethod = logSubject.pipe((0, rxjs_1.map)((action) => {
        console.log('Logging: ', action);
        if (action.strategy) {
            return (0, actionStrategy_1.strategySuccess)(action.strategy);
        }
        return (0, action_2.createAction)(conclude_quality_1.axiumConcludeType);
    }));
    return [
        logMethod,
        logSubject
    ];
};
exports.logQuality = (0, concept_2.createQuality)(exports.axiumLogType, concept_1.defaultReducer, createLogMethodCreator);
