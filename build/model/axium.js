"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAxium = exports.defaultMethodSubscription = exports.blockingMethodSubscription = void 0;
const rxjs_1 = require("rxjs");
const action_1 = require("./action");
const actionStrategy_1 = require("./actionStrategy");
const axium_concept_1 = require("../concepts/axium/axium.concept");
const badAction_quality_1 = require("../concepts/axium/qualities/badAction.quality");
const close_quality_1 = require("../concepts/axium/qualities/close.quality");
const appendActionListToDialog_quality_1 = require("../concepts/axium/qualities/appendActionListToDialog.quality");
const conclude_quality_1 = require("../concepts/axium/qualities/conclude.quality");
const blockingMethodSubscription = (action$, action) => {
    if (action.strategy &&
        action.type === conclude_quality_1.axiumConcludeType) {
        // Allows for reducer next in sequence
        const appendToDialog = (0, action_1.createAction)(appendActionListToDialog_quality_1.axiumAppendActionListToDialogType);
        appendToDialog.payload = {
            actionList: action.strategy.actionList,
            strategyTopic: action.strategy.topic
        };
        action$.next(appendToDialog);
    }
    else if (action.strategy &&
        action.type !== badAction_quality_1.axiumBadActionType) {
        action$.next(action);
    }
};
exports.blockingMethodSubscription = blockingMethodSubscription;
const defaultMethodSubscription = (action$, action) => {
    if (action.strategy &&
        action.type === conclude_quality_1.axiumConcludeType) {
        // Allows for reducer next in sequence
        const appendToDialog = (0, action_1.createAction)(appendActionListToDialog_quality_1.axiumAppendActionListToDialogType);
        appendToDialog.payload = {
            actionList: action.strategy.actionList,
            strategyTopic: action.strategy.topic
        };
        setTimeout(() => {
            action$ === null || action$ === void 0 ? void 0 : action$.next(appendToDialog);
        }, 0);
    }
    else if (action.strategy &&
        action.type !== badAction_quality_1.axiumBadActionType) {
        setTimeout(() => {
            action$ === null || action$ === void 0 ? void 0 : action$.next(action);
        }, 0);
    }
};
exports.defaultMethodSubscription = defaultMethodSubscription;
function createAxium(initialConcepts, logging, storeDialog) {
    // const action$: Subject<Action> = new Subject();
    const concepts = [(0, axium_concept_1.createAxiumConcept)(logging, storeDialog), ...initialConcepts];
    let axiumState = concepts[0].state;
    axiumState.cachedSemaphores = (0, action_1.createCacheSemaphores)(concepts);
    concepts.forEach((concept, _index) => {
        concept.qualities.forEach((quality, index) => {
            if (quality.methodCreator) {
                const [method, subject] = quality.methodCreator(axiumState.subConcepts$);
                quality.method = method;
                quality.subject = subject;
                const methodSub = quality.method.subscribe((action) => {
                    (0, exports.blockingMethodSubscription)(axiumState.action$, action);
                });
                axiumState = concepts[0].state;
                axiumState.methodSubscribers.push({
                    name: concept.name,
                    subscriber: methodSub,
                });
            }
        });
        if (_index !== 0 && concept.mode !== undefined) {
            axiumState = concepts[0].state;
            const names = axiumState.modeNames;
            const modes = concepts[0].mode;
            concept.mode.forEach((mode) => {
                modes.push(mode);
                names.push(concept.name);
            });
        }
        // if (concept.principles) {
        //     const axiumState = selectState<AxiumState>(concepts, _axium.key);
        //     concept.principles.forEach((principle) => {
        //         const sub = createPrinciple$(principle, concept).subscribe(action => action$.next(action)) as Subscriber<Action>;
        //         axiumState.subscribers.push({
        //             key: concept.key,
        //             subscriber: sub,
        //         });
        //     })
        // }
    });
    // const concepts$: BehaviorSubject<Concept[]> = new BehaviorSubject(concepts);
    axiumState.action$
        .pipe((0, rxjs_1.withLatestFrom)(axiumState.concepts$), 
    // This will be where the Ownership Principle will be Loaded
    // As Such is a Unique Principle in the Scope of State Management
    // This will also allow for Actions to be added to the Stream to Update to most Recent Values
    (0, rxjs_1.catchError)((err, caught) => {
        // Will need to Refine this Function Continuously
        if (axiumState.logging) {
            console.error('ACTION STREAM ERROR', err);
        }
        return caught;
    }))
        .subscribe(([action, _concepts]) => {
        // Would be notifying methods
        // console.log('Check Length', concepts.length)
        const _axiumState = _concepts[0].state;
        const modeIndex = _axiumState.modeIndex;
        const modes = _concepts[0].mode;
        const mode = modes[modeIndex];
        mode([action, _concepts, _axiumState.action$, _axiumState.concepts$]);
    });
    axiumState = concepts[0].state;
    const action$ = axiumState.action$;
    const subConcepts$ = axiumState.subConcepts$;
    axiumState.concepts$.next(concepts);
    axiumState.action$.next((0, actionStrategy_1.strategyBegin)((0, axium_concept_1.initializationStrategy)(concepts)));
    return {
        subscribe: subConcepts$.subscribe.bind(subConcepts$),
        unsubscribe: subConcepts$.unsubscribe.bind(subConcepts$),
        close: () => {
            action$.next((0, action_1.createAction)(close_quality_1.axiumCloseType));
        },
        dispatch: (action) => {
            action$.next(action);
        },
        stage: subConcepts$.stage.bind(subConcepts$),
    };
}
exports.createAxium = createAxium;
