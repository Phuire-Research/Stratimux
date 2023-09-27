"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockingMode = exports.permissiveMode = exports.isActionable = void 0;
const action_1 = require("../../model/action");
const badAction_quality_1 = require("./qualities/badAction.quality");
const setBlockingMode_quality_1 = require("./qualities/setBlockingMode.quality");
const conclude_quality_1 = require("./qualities/conclude.quality");
const isActionable = (axiumState, action) => {
    let actionable = true;
    if (action.type === badAction_quality_1.axiumBadActionType &&
        action.type === conclude_quality_1.axiumConcludeType) {
        actionable = false;
        if (axiumState.logging && action.type === badAction_quality_1.axiumBadActionType) {
            console.warn('Bad Action', action);
        }
    }
    return actionable;
};
exports.isActionable = isActionable;
const permissiveMode = ([action, concepts, action$, concepts$]) => {
    const axiumState = concepts[0].state;
    if ((0, exports.isActionable)(axiumState, action)) {
        if (action.type !== setBlockingMode_quality_1.axiumSetBlockingModeType) {
            if (action.semaphore[2] !== -1 && action.semaphore[2] === axiumState.generation) {
                // console.log('DEFAULT INNER: ', action.type);
                // console.log(concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer)
                let subject;
                if (concepts[action.semaphore[0]].qualities[action.semaphore[1]].method) {
                    subject = concepts[action.semaphore[0]].qualities[action.semaphore[1]].subject;
                    subject.next(action);
                }
                const reduce = concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer;
                const state = concepts[action.semaphore[0]].state;
                concepts[action.semaphore[0]].state = reduce(state, action);
                // console.log('Default Mode Check Length: ', concepts.length)
                concepts$.next(concepts);
                axiumState.subConcepts$.next(concepts);
            }
            else {
                // console.log('DEFAULT TESTING 2', action.type, action.semaphore, AxiumState.generation);
                const nextAction = (0, action_1.primeAction)(concepts, action);
                if (nextAction.type === badAction_quality_1.axiumBadActionType) {
                    const payload = Object.assign({}, action);
                    nextAction.payload = payload;
                }
                if (nextAction.semaphore[2] === axiumState.generation) {
                    action$.next(nextAction);
                }
            }
        }
        else {
            (0, exports.blockingMode)([action, concepts, action$, concepts$]);
        }
    }
};
exports.permissiveMode = permissiveMode;
// Note that Methods are altered during this Mode if the Axium is created in a Synchronous Context
//  Thus the Reducer needs to Run before the Method
const blockingMode = ([action, concepts, action$, concepts$]) => {
    const axiumState = concepts[0].state;
    if ((0, exports.isActionable)(axiumState, action)) {
        if (action.semaphore[2] !== -1 && action.semaphore[2] === axiumState.generation) {
            const reduce = concepts[action.semaphore[0]].qualities[action.semaphore[1]].reducer;
            const state = concepts[action.semaphore[0]].state;
            concepts[action.semaphore[0]].state = reduce(state, action);
            concepts$.next(concepts);
            let subject;
            if (concepts[action.semaphore[0]].qualities[action.semaphore[1]].method) {
                subject = concepts[action.semaphore[0]].qualities[action.semaphore[1]].subject;
                subject.next(action);
            }
        }
        else {
            const nextAction = (0, action_1.primeAction)(concepts, action);
            if (nextAction.type === badAction_quality_1.axiumBadActionType) {
                const payload = Object.assign({}, action);
                nextAction.payload = payload;
            }
            if (nextAction.semaphore[2] === axiumState.generation) {
                (0, exports.blockingMode)([
                    nextAction,
                    concepts,
                    action$,
                    concepts$
                ]);
            }
        }
    }
};
exports.blockingMode = blockingMode;
