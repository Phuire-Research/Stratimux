"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiumPrinciple = void 0;
const action_1 = require("../../model/action");
const axium_concept_1 = require("./axium.concept");
const registerSubscriber_quality_1 = require("./qualities/registerSubscriber.quality");
const action_2 = require("../../model/action");
const actionStrategy_1 = require("../../model/actionStrategy");
const addConcept_strategy_1 = require("./strategies/addConcept.strategy");
const removeConcept_strategy_1 = require("./strategies/removeConcept.strategy");
const axium_mode_1 = require("./axium.mode");
const axiumPrinciple = (observer, concepts, concepts$) => {
    let allowAdd = true;
    let allowRemove = true;
    const subscriber = concepts$.subscribe(_concepts => {
        var _a;
        const axiumState = _concepts[0].state;
        if (axiumState.addConceptQue.length === 0) {
            allowAdd = true;
        }
        if (axiumState.addConceptQue.length !== 0 && allowAdd) {
            allowAdd = false;
            axiumState.generation += 1;
            axiumState.addConceptQue.forEach((concept, _index) => {
                if (concept.mode !== undefined) {
                    const names = axiumState.modeNames;
                    const modes = concepts[0].mode;
                    concept.mode.forEach((mode) => {
                        modes.push(mode);
                        names.push(concept.name);
                    });
                }
            });
            const newConcepts = [
                ...concepts,
                ...axiumState.addConceptQue
            ];
            const newAxiumState = newConcepts[0].state;
            newAxiumState.cachedSemaphores = (0, action_1.createCacheSemaphores)(newConcepts);
            (_a = axiumState.concepts$) === null || _a === void 0 ? void 0 : _a.next(newConcepts);
            const action$ = axiumState.action$;
            observer.next((0, actionStrategy_1.strategyBegin)((0, addConcept_strategy_1.addConceptsFromQueThenUnblockStrategy)(action$, newConcepts)));
        }
        if (axiumState.removeConceptQue.length === 0) {
            allowRemove = true;
        }
        if (axiumState.removeConceptQue.length > 0 && allowRemove) {
            allowRemove = false;
            const newConcepts = [];
            axiumState.generation += 1;
            const newModes = [axium_mode_1.blockingMode, axium_mode_1.permissiveMode];
            const newModeNames = [axium_concept_1.axiumName, axium_concept_1.axiumName];
            concepts.forEach(concept => {
                axiumState.removeConceptQue.forEach(target => {
                    if (concept.name !== target.name) {
                        newConcepts.push(concept);
                    }
                });
            });
            const newAxiumState = newConcepts[0].state;
            newAxiumState.modeNames.forEach((modeName, modeIndex) => {
                let shouldAdd = false;
                axiumState.removeConceptQue.forEach(removeTarget => {
                    if (modeName !== axium_concept_1.axiumName) {
                        if (modeName !== removeTarget.name) {
                            shouldAdd = true;
                        }
                        else if (modeName === removeTarget.name && modeIndex === newAxiumState.defaultModeIndex) {
                            newAxiumState.defaultModeIndex = 1;
                        }
                    }
                });
                if (shouldAdd) {
                    newModeNames.push(modeName);
                    newModes.push(concepts[0].mode[modeIndex]);
                }
                shouldAdd = false;
            });
            newConcepts[0].mode = newModes;
            newAxiumState.modeNames = newModeNames;
            newAxiumState.cachedSemaphores = (0, action_1.createCacheSemaphores)(newConcepts);
            axiumState.concepts$.next(newConcepts);
            observer.next((0, actionStrategy_1.strategyBegin)((0, removeConcept_strategy_1.removeConceptsViaQueThenUnblockStrategy)(newConcepts)));
        }
    });
    const primedRegisterSubscriber = (0, action_2.primeAction)(concepts, (0, action_1.createAction)(registerSubscriber_quality_1.axiumRegisterSubscriberType));
    primedRegisterSubscriber.payload = { subscriber, name: axium_concept_1.axiumName };
    observer.next(primedRegisterSubscriber);
};
exports.axiumPrinciple = axiumPrinciple;
