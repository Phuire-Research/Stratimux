"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendActionListToDialogQuality = exports.appendActionListToDialogReducer = exports.axiumAppendActionListToDialogType = void 0;
const rxjs_1 = require("rxjs");
const action_1 = require("../../../model/action");
const concept_1 = require("../../../model/concept");
const conclude_quality_1 = require("./conclude.quality");
exports.axiumAppendActionListToDialogType = 'append Action List to Axium\'s Dialog';
// const createAppendActionListToDialogMethodCreator: MethodCreator = (concepts$: UnifiedSubject) => {
const createAppendActionListToDialogMethodCreator = () => {
    const logSubject = new rxjs_1.Subject();
    const logMethod = logSubject.pipe(
    // withLatestFrom(subConcepts$),
    // map(([action, concepts]) => {
    (0, rxjs_1.map)(() => {
        // const axiumState = concepts[0].state as AxiumState;
        // if (axiumState.logging) {
        //   const payload = action.payload as AppendActionListToDialogPayload;
        //   let newDialog = payload.strategyKey + '. ';
        //   payload.actionList.forEach(str => {newDialog += str + ' ';});
        //   console.log(newDialog);
        // }
        return (0, action_1.createAction)(conclude_quality_1.axiumConcludeType);
    }));
    return [
        logMethod,
        logSubject
    ];
};
function appendActionListToDialogReducer(state, action) {
    const payload = action.payload;
    let newDialog = '';
    if (state.storeDialog) {
        payload.actionList.forEach(str => { newDialog += str + ' '; });
        if (state.logging) {
            console.log(newDialog);
        }
        return Object.assign(Object.assign({}, state), { dialog: state.dialog + newDialog, lastStrategy: payload.strategyTopic });
    }
    return Object.assign(Object.assign({}, state), { lastStrategy: payload.strategyTopic });
}
exports.appendActionListToDialogReducer = appendActionListToDialogReducer;
exports.appendActionListToDialogQuality = (0, concept_1.createQuality)(exports.axiumAppendActionListToDialogType, appendActionListToDialogReducer);
