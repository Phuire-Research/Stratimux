"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectConcept = exports.selectSlice = exports.selectState = void 0;
function selectState(concepts, name) {
    let concept;
    for (let i = 0; i < concepts.length; i++) {
        if (concepts[i].name === name) {
            concept = concepts[i];
            break;
        }
    }
    return concept === null || concept === void 0 ? void 0 : concept.state;
}
exports.selectState = selectState;
// Note: The Concept Key within the selector has to be set Explicitly for now
function selectSlice(concepts, selector) {
    let concept;
    const conceptKey = selector.conceptName;
    for (let i = 0; i < concepts.length; i++) {
        if (concepts[i].name === conceptKey) {
            concept = concepts[i];
            break;
        }
        else if (i === concepts.length - 1) {
            return undefined;
        }
    }
    const keys = selector.stateKeys.split(' ');
    if (concept === undefined) {
        return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cast = concept.state;
    const existsKeys = Object.keys(cast);
    let exists = false;
    existsKeys.forEach(key => { key === keys[0] ? exists = true : null; });
    if (!exists) {
        return undefined;
    }
    if (keys.length === 1) {
        return cast[keys[0]];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let target = cast[keys.shift()];
    let finalKey = '';
    for (const [i, key] of keys.entries()) {
        let aspectExists = false;
        const aspectExistsKeys = Object.keys(target);
        aspectExistsKeys.forEach(_key => { _key === key ? aspectExists = true : null; });
        if (!aspectExists) {
            return undefined;
        }
        if (i !== keys.length - 1) {
            target = target[key];
        }
        else {
            finalKey = key;
        }
    }
    return target[finalKey];
}
exports.selectSlice = selectSlice;
function selectConcept(concepts, name) {
    let concept;
    for (let i = 0; i < concepts.length; i++) {
        if (concepts[i].name === name) {
            concept = concepts[i];
            break;
        }
    }
    return concept;
}
exports.selectConcept = selectConcept;
