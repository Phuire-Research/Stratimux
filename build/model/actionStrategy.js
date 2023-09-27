"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.puntStrategy = exports.strategyDecide = exports.strategyFailed = exports.strategySuccess = exports.strategyBegin = exports.createStrategy = exports.setDenoter = exports.setPreposition = void 0;
const conclude_quality_1 = require("../concepts/axium/qualities/conclude.quality");
const action_1 = require("./action");
const nullActionType = 'null';
function isNotPunctuated(str) {
    const punctuatedList = ['.', ',', '?', '!', ';'];
    let notPunctuated = true;
    for (const punctuated of punctuatedList) {
        if (str.charAt(0) === punctuated) {
            notPunctuated = false;
            break;
        }
    }
    return notPunctuated;
}
function createSentence(actionNode, decisionKey) {
    const preposition = actionNode.preposition ? `${actionNode.preposition} ` : '';
    const decision = decisionKey ? `${decisionKey} ` : '';
    const body = `${actionNode.actionType}`;
    let denoter = '.';
    if (actionNode.denoter) {
        if (isNotPunctuated(actionNode.denoter)) {
            denoter = ` ${actionNode.denoter}`;
        }
        else {
            denoter = actionNode.denoter;
        }
    }
    return preposition + decision + body + denoter;
}
function setPreposition(strategy, preposition) {
    const target = strategy.currentNode;
    target.preposition = preposition;
}
exports.setPreposition = setPreposition;
function setDenoter(strategy, denoter) {
    const target = strategy.currentNode;
    target.denoter = denoter;
}
exports.setDenoter = setDenoter;
function createStrategy(params) {
    const data = params.data;
    const currentNode = params.initialNode;
    const actionList = [params.topic + '.'];
    return {
        topic: params.topic,
        data,
        currentNode,
        actionList,
        lastActionNode: {
            actionType: nullActionType,
            successNode: null,
            failureNode: null
        },
    };
}
exports.createStrategy = createStrategy;
const strategyBegin = (strategy, data) => {
    strategy.currentNode.action = (0, action_1.createAction)(strategy.currentNode.actionType, strategy.currentNode.payload, strategy.currentNode.keyedSelectors, strategy.currentNode.agreement);
    strategy.currentNode.action.strategy = Object.assign(Object.assign({}, strategy), { topic: strategy.topic, data: data ? data : strategy.data, currentNode: strategy.currentNode, actionList: strategy.actionList, lastActionNode: strategy.lastActionNode });
    if (strategy.currentNode.action !== null) {
        return strategy.currentNode.action;
    }
    else {
        return (0, action_1.createAction)(conclude_quality_1.axiumConcludeType);
    }
};
exports.strategyBegin = strategyBegin;
/**
 * strategySuccess(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
const strategySuccess = (_strategy, data) => {
    var _a;
    const strategy = Object.assign({}, _strategy);
    // console.log('SUCCESS', strategy.payload);
    let nextAction;
    const actionListEntry = createSentence(strategy.currentNode, strategy.currentNode.preposition !== undefined ? '' : 'Success with');
    if (strategy.currentNode.successNode !== null) {
        const nextNode = strategy.currentNode.successNode;
        nextAction = (0, action_1.createAction)(nextNode.actionType, nextNode.payload, nextNode.keyedSelectors, nextNode.agreement, nextNode.semaphore);
        nextNode.action = nextAction;
        nextAction.strategy = Object.assign(Object.assign({}, strategy), { topic: strategy.topic, data: data ? data : strategy.data, currentNode: nextNode, actionList: [...strategy.actionList, actionListEntry], lastActionNode: strategy.currentNode });
        return nextAction;
    }
    else {
        strategy.actionList = [...strategy.actionList, actionListEntry, '\n'];
        if (strategy.puntedStrategy !== undefined &&
            ((_a = strategy.puntedStrategy) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
            const nextStrategy = strategy.puntedStrategy.shift();
            const nextEntry = `${nextStrategy.topic}.`;
            nextStrategy.actionList = [
                ...strategy.actionList,
                ...nextEntry,
            ];
            return (0, exports.strategyBegin)(nextStrategy);
        }
        const conclude = {
            actionType: conclude_quality_1.axiumConcludeType,
            successNode: null,
            failureNode: null,
        };
        conclude.action = (0, action_1.createAction)(conclude.actionType);
        conclude.action.strategy = Object.assign(Object.assign({}, strategy), { currentNode: conclude, lastActionNode: strategy.currentNode });
        return conclude.action;
    }
};
exports.strategySuccess = strategySuccess;
/**
 * strategyFailed(strategy: ActionStrategy, data?: any)
 * Returns the failure stage's Action and reassigns ActionStrategy to that Action's strategy parameter.
 * If no failureNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
function strategyFailed(_strategy, data) {
    var _a;
    const strategy = Object.assign({}, _strategy);
    let nextAction;
    const actionListEntry = createSentence(strategy.currentNode, strategy.currentNode.preposition !== undefined ? '' : 'Failed with');
    if (strategy.currentNode.failureNode !== null) {
        const nextNode = strategy.currentNode.failureNode;
        nextAction = (0, action_1.createAction)(strategy.currentNode.failureNode.actionType, strategy.currentNode.failureNode.payload, strategy.currentNode.failureNode.keyedSelectors, strategy.currentNode.agreement, strategy.currentNode.semaphore);
        nextNode.action = nextAction;
        strategy.actionList = [...strategy.actionList, actionListEntry];
        nextAction = Object.assign({}, nextAction);
        nextAction.strategy = Object.assign(Object.assign({}, strategy), { topic: strategy.topic, data: strategy.data, currentNode: strategy.currentNode, actionList: strategy.actionList, lastActionNode: strategy.currentNode });
        return nextAction;
    }
    else {
        strategy.actionList = [...strategy.actionList, actionListEntry, '\n'];
        if (strategy.puntedStrategy !== undefined &&
            ((_a = strategy.puntedStrategy) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
            const nextStrategy = strategy.puntedStrategy.shift();
            const nextEntry = `${nextStrategy.topic}.`;
            nextStrategy.actionList = [
                ...strategy.actionList,
                ...nextEntry,
            ];
            return (0, exports.strategyBegin)(nextStrategy);
        }
        const conclude = {
            actionType: conclude_quality_1.axiumConcludeType,
            successNode: null,
            failureNode: null
        };
        conclude.action = (0, action_1.createAction)(conclude.actionType);
        conclude.action.strategy = Object.assign(Object.assign({}, strategy), { currentNode: conclude, lastActionNode: strategy.currentNode });
        return conclude.action;
    }
}
exports.strategyFailed = strategyFailed;
/**
 * strategyDecide(strategy: ActionStrategy, index:number, data?: any)
 * Returns the DecisionNode of Index reassigns ActionStrategy to that Action's strategy parameter.
 * If no decisionNode is found, will return EndOfActionStrategy instead.
 * @param data - OPTIONAL, if used will override the ActionStrategy's payload
 */
const strategyDecide = (strategy, decideKey, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
data) => {
    var _a;
    let nextAction;
    const actionListEntry = createSentence(strategy.currentNode, decideKey);
    if (strategy.currentNode.decisionNodes) {
        const decisionNodes = strategy.currentNode.decisionNodes;
        if (decisionNodes[decideKey] !== null) {
            const nextNode = decisionNodes[decideKey];
            nextAction = (0, action_1.createAction)(decisionNodes[decideKey].actionType, decisionNodes[decideKey].payload, decisionNodes[decideKey].keyedSelectors, decisionNodes[decideKey].agreement, decisionNodes[decideKey].semaphore);
            nextNode.action = nextAction;
            strategy.actionList = [...strategy.actionList, actionListEntry];
            nextAction.strategy = Object.assign(Object.assign({}, strategy), { topic: strategy.topic, data: data ? data : strategy.data, currentNode: nextNode, actionList: strategy.actionList, lastActionNode: strategy.currentNode });
            return nextAction;
        }
    }
    strategy.actionList = [...strategy.actionList, actionListEntry, '\n'];
    if (strategy.puntedStrategy !== undefined &&
        ((_a = strategy.puntedStrategy) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
        const nextStrategy = strategy.puntedStrategy.shift();
        const nextEntry = `${nextStrategy.topic}.`;
        nextStrategy.actionList = [
            ...strategy.actionList,
            ...nextEntry,
        ];
        return (0, exports.strategyBegin)(nextStrategy);
    }
    const conclude = {
        actionType: conclude_quality_1.axiumConcludeType,
        successNode: null,
        failureNode: null
    };
    conclude.action = (0, action_1.createAction)(conclude.actionType);
    conclude.action.strategy = Object.assign(Object.assign({}, strategy), { currentNode: conclude, lastActionNode: strategy.currentNode });
    return conclude.action;
};
exports.strategyDecide = strategyDecide;
// Remember Water Boy
const puntStrategy = (puntedStrategy, newStrategy) => {
    let puntList = [];
    if (puntedStrategy.puntedStrategy !== undefined) {
        puntList = [...puntedStrategy.puntedStrategy, puntedStrategy];
    }
    else {
        puntList.push(puntedStrategy);
    }
    newStrategy.puntedStrategy = puntList;
    return newStrategy;
};
exports.puntStrategy = puntStrategy;
