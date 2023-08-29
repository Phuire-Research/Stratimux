import { Subscriber, Subject } from 'rxjs';
import { Action, Concept, PrincipleFunction } from '../../index';
import { Chain, chainConcept } from './chain.concept';
import { selectState } from '../../model/selector';
import { AxiumState } from '../axium/axium.concept';
import {
    RegisterSubscriberPayload,
    registerSubscriber,
} from '../axium/qualities/registerSubscriber.quality';
import { primeAction } from '../../model/action';

export const chainPrinciple: PrincipleFunction = (
    observer: Subscriber<Action>,
    concepts: Concept[],
    concepts$: Subject<Concept[]>,
) => {
    // let pass = true;
    // setInterval(() => {
    //     pass = true;
    // }, 50);
    const subscriber = concepts$.subscribe((concepts) => {
        const chainState = selectState<Chain>(concepts, chainConcept.key);
        if (chainState.actionQue.length > 0) {
            // pass = false;
            const newActionQue = [...chainState.actionQue];
            const nextAction = newActionQue.pop() as Action;
            chainState.actionQue = newActionQue;
            concepts$.next(concepts);
            const axiumState = concepts[0].state as AxiumState;
            axiumState.action$?.next(nextAction);
        }
    });
    const primedRegisterSubscriber = primeAction(concepts, registerSubscriber);
    primedRegisterSubscriber.payload = {
        subscriber,
        key: chainConcept.key,
    } as RegisterSubscriberPayload;
    observer.next(primedRegisterSubscriber);
};
