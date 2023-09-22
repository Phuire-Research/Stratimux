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
    //  Dispatch would be action + options { dispatchOnce: boolean, afterTopic: string, etc... }
    //    This is to provide an additional Abstraction that likewise is aware of its Context, Action Expiration, etc...
    //  With this addition, this overall System would move towards being Halting Complete and Release Ready alongside Paper.
  }
}

export class Staged extends Subscriber<Concept[]> {

}

export class Staging extends Subscription {

}

// # Goal
//  Allow for a Set of Stages that can be Iterated or Set
//  While still allowing the complete cancellation of the Stage if the actions overflow
//  If the Stage is Cancelled, Group is added to axium.failedStages
//  This allows for Concepts to Reinitialize, but only by specific design if that Staging Fails
//
// ## Mock
// axium.stage("Some Group",[
//   (concepts: Concept[], dispatch: Dispatcher) => {
//     // Init
//     dispatch(someAction,{
//       iterateStage: true,
//     });
// },
//   (concepts: Concept[], dispatch: Dispatcher) => {
//     dispatch(anotherAction,{
//       afterTopic: someTopic,
//       iterateStage: true,
//     });
// },
//   (concepts: Concept[], dispatch: Dispatcher) => {
//     dispatch(anotherAction,{
//       on: {
//         selector: keyedSelector,
//         expected: value
//       },
//       setStage: 0,
//     });
//     dispatch(anotherAction,{
//       on: {
//         selector: keyedSelector,
//         expected: value,
//         debounce: 5000
//       },
//     });
// ]);
