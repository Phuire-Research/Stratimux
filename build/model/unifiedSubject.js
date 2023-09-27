"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedSubject = void 0;
/* eslint-disable complexity */
const rxjs_1 = require("rxjs");
const selector_1 = require("./selector");
const handleRun = (value, stageDelimiter, staged, action, options) => {
    if (options === null || options === void 0 ? void 0 : options.on) {
        if ((0, selector_1.selectSlice)(value, options === null || options === void 0 ? void 0 : options.on.selector) === (options === null || options === void 0 ? void 0 : options.on.expected)) {
            const stageRunner = stageDelimiter.stageRunner.get(action.type + staged.step);
            if (stageRunner === undefined) {
                stageDelimiter.stageRunner.set(action.type + staged.step, true);
                return [
                    stageDelimiter, true
                ];
            }
            else {
                stageDelimiter.stageRunner.set(action.type + staged.step, false);
                return [
                    stageDelimiter, false
                ];
            }
        }
        else {
            return [
                stageDelimiter, false
            ];
        }
    }
    else if (options === null || options === void 0 ? void 0 : options.runOnce) {
        const stageRunner = stageDelimiter.stageRunner.get(action.type + staged.step);
        if (stageRunner === undefined) {
            stageDelimiter.stageRunner.set(action.type + staged.step, true);
            return [
                stageDelimiter, true
            ];
        }
        else {
            stageDelimiter.stageRunner.set(action.type + staged.step, false);
            return [
                stageDelimiter, false
            ];
        }
    }
    return [
        stageDelimiter,
        true
    ];
};
const handleStageDelimiter = (staged, action, delimiter, options) => {
    let stageDelimiter = delimiter;
    let goodAction = true;
    if (stageDelimiter &&
        stageDelimiter.prevActions.includes(action.type) &&
        (options === null || options === void 0 ? void 0 : options.debounce) === undefined) {
        if (staged.step !== (stageDelimiter === null || stageDelimiter === void 0 ? void 0 : stageDelimiter.step)) {
            stageDelimiter = {
                step: staged.step,
                prevActions: [action.type],
                unionExpiration: [action.expiration],
                stageRunner: new Map()
            };
        }
        else {
            goodAction = false;
        }
    }
    else if (stageDelimiter) {
        stageDelimiter = {
            step: staged.step,
            prevActions: [...stageDelimiter.prevActions, action.type],
            unionExpiration: [...stageDelimiter.unionExpiration, action.expiration],
            stageRunner: new Map()
        };
    }
    else {
        stageDelimiter = {
            step: staged.step,
            prevActions: [action.type],
            unionExpiration: [action.expiration],
            stageRunner: new Map()
        };
    }
    return [
        stageDelimiter,
        goodAction
    ];
};
class UnifiedSubject extends rxjs_1.Subject {
    constructor() {
        super();
        this.stageId = 0;
        this.currentStages = new Map();
        this.stageDelimiters = new Map();
    }
    stage(title, stages) {
        this.currentStages.set(this.stageId, { title, stages, step: 0, stepFailed: -1 });
        this.stageId++;
        return {
            close: () => {
                this.currentStages.delete(this.stageId);
            }
        };
    }
    next(value) {
        if (!this.closed) {
            // Need a Stage Observer that would merely deconstruct to {concepts: Concept[], dispatch: Dispatcher}
            // Where Dispatcher would be (action$: Subject<Action>) => {}();
            const axiumState = value[0].state;
            this.currentStages.forEach((staged, key) => {
                const dispatcher = (action, options) => {
                    let stageDelimiter = this.stageDelimiters.get(key);
                    let debounce = false;
                    let goodAction = true;
                    let run = true;
                    [stageDelimiter, goodAction] = handleStageDelimiter(staged, action, stageDelimiter, options);
                    [stageDelimiter, run] = handleRun(value, stageDelimiter, staged, action, options);
                    this.stageDelimiters.set(key, stageDelimiter);
                    if (goodAction && run) {
                        const action$ = axiumState.action$;
                        if ((options === null || options === void 0 ? void 0 : options.debounce) !== undefined) {
                            let previousExpiration = 0;
                            for (let i = 0; i < stageDelimiter.prevActions.length; i++) {
                                if (stageDelimiter.prevActions[i] === action.type) {
                                    previousExpiration = stageDelimiter.unionExpiration[i];
                                    break;
                                }
                            }
                            if (previousExpiration !== action.expiration && action.expiration - previousExpiration < (options === null || options === void 0 ? void 0 : options.debounce)) {
                                debounce = true;
                            }
                            else {
                                for (let i = 0; i < stageDelimiter.prevActions.length; i++) {
                                    if (stageDelimiter.prevActions[i] === action.type) {
                                        stageDelimiter.unionExpiration[i] = action.expiration;
                                        break;
                                    }
                                }
                            }
                        }
                        this.stageDelimiters.set(key, stageDelimiter);
                        if (!debounce && run) {
                            if (options === null || options === void 0 ? void 0 : options.setStep) {
                                staged.step = options.setStep;
                            }
                            if (options === null || options === void 0 ? void 0 : options.iterateStep) {
                                staged.step += 1;
                            }
                            // Horrifying
                            if (staged.stepFailed === -1) {
                                action$.next(action);
                            }
                        }
                    }
                    else if ((options === null || options === void 0 ? void 0 : options.runOnce) === undefined) {
                        staged.stepFailed = staged.step;
                        staged.step = staged.stages.length;
                        const deleted = this.currentStages.delete(key);
                        if (deleted) {
                            axiumState.badStages.push(staged);
                        }
                    }
                };
                const index = staged.step;
                if (index < staged.stages.length) {
                    staged.stages[index](value, dispatcher);
                }
            });
        }
        const { observers } = this;
        const len = observers.length;
        for (let i = 0; i < len; i++) {
            observers[i].next(value);
        }
    }
}
exports.UnifiedSubject = UnifiedSubject;
