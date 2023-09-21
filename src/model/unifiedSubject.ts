import { BehaviorSubject, Observable, Subscriber, Observer, Subscription } from 'rxjs';
import { Concept } from './concept';
import { AxiumState } from '../concepts/axium/axium.concept';

export class UnifiedSubject extends BehaviorSubject<Concept[]> {
  constructor(concepts: Concept[]) {
    super(concepts);
  }
  stage(stage: Staged) {
    const axiumState = this.getValue()[0].state as AxiumState;
    // Provides a specific Dispatch Function that may be used to identify point of origin to stop action overflow
    //  via Subscription Notifications
    //  This becomes part of concept[0].state as AxiumState as this Subject is Designed for the Axium
    //  Dispatch would be action + options { dispatchOnce: boolean, dispatchAfterTopic: string, etc... }
    //    This is to provide an additional Abstraction that likewise is aware of its Context, Action Expiration, etc...
    //  With this addition, this overall System would move towards being Halting Complete and Release Ready alongside Paper.
  }
}

export class Staged extends Subscriber<Concept[]> {

}

export class Staging extends Subscription {

}