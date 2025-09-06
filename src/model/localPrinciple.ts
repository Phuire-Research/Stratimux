/*<$
For the asynchronous graph programming framework Stratimux, define the LocalPrinciple model file.
This file allows components to create local principles that derive the same PrincipleFunction interface
from a Muxium instance, enabling bidirectional separation of concerns between Stratimux and external paradigms.
$>*/
/*<#*/
import { Subscriber } from 'rxjs';
import { Concepts, ConceptsSubscriber, LoadConcepts } from './concept/concept.type';
import { Action, Actions, AnyAction } from './action/action.type';
import { BundledSelectors } from './selector/selector.type';
import { Comparators } from './interface';
import { Deck, Stratideck } from './deck';
import { BasePlanner, Planning, StagePlanner } from './stagePlanner/stagePlanner.type';
import { MaybeEnhancedMuxiumQualities, Muxium, MuxiumLoad } from './muxium/muxium.type';
import { Qualities } from './quality';
import { getMuxiumState } from './muxium/muxiumHelpers';
import { MuxiumDeck, MuxiumState } from '../concepts/muxium/muxium.concept';
import { MuxiumQualities } from '../concepts/muxium/qualities';

/**
 * LocalPrincipleInterface - Same structure as PrincipleInterface but for local context
 * This type enables components to have the same programming model as global principles
 */
export type LocalPrincipleInterface<C extends LoadConcepts, Q = void, S = void> = {
  observer: Subscriber<Action>;
  concepts_: Concepts;
  subscribe: ConceptsSubscriber;
  plan: <Co extends LoadConcepts = C>(
    title: string,
    planner: BasePlanner<
    MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities,
    Co & MuxiumDeck,
    MuxiumState<
      MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities,
      Co & MuxiumDeck
      >
    >) => StagePlanner,
  nextC: (concepts: Concepts) => void,
  nextA: (action: AnyAction) => void,
  conceptSemaphore: number,
  d_: Stratideck<MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities, MuxiumState<Q, C>, MuxiumLoad<C>>,
  e_: Actions<MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities>,
  c_: Comparators<MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities>,
  k_: BundledSelectors<MuxiumState<
      MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities,
      C & MuxiumDeck
      >>
};

/**
 * LocalPrincipleFunction - Consumer function that receives the LocalPrincipleInterface
 * Matches the PrincipleFunction pattern exactly for consistency
 */
export type LocalPrincipleFunction<C extends LoadConcepts, Q = void, S = void> = (baseI: LocalPrincipleInterface<C, Q,  S>) => void;

/**
 * createLocalPrinciple$ - Consumer function pattern matching createPrinciple$
 *
 * This function enables bidirectional separation of concerns:
 * - Stratimux provides planning capability without holding component references
 * - Components manage lifecycle internally without storing Stratimux references
 * - Returns void to enforce pure consumption pattern (GC-safe)
 *
 * The critical difference from createPrinciple$:
 * - createPrinciple$ creates a new Observable with a new observer
 * - createLocalPrinciple$ accesses the existing muxium action$ stream
 *
 * @param principleFunc - The local principle function to execute
 * @param muxium - The muxium instance to derive parameters from
 * @param componentName - Name of the component creating the local principle
 * @returns void - Pure consumption, no reference storage
 */
export function createLocalPrinciple<C extends LoadConcepts, Q = void, S = void>(
  componentName: string,
  muxium: Muxium<LoadConcepts & MuxiumDeck, MaybeEnhancedMuxiumQualities>,
  principleFunc: LocalPrincipleFunction<C, Q, S>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): void {
  const origin = `LocalPrinciple:${componentName}`;

  // Create a planning scope to derive and recompose parameters
  muxium.plan(`${origin}:Execution`, ({ stage, conclude }) => [
    stage(({ concepts, dispatch, d, k, e, c }) => {
      // Parameter Recomposition - matching createPrinciple$ pattern
      // CRITICAL: Access the muxium's existing action$ stream, not create a new one
      const muxiumState = getMuxiumState(concepts);

      // Create observer that subscribes to the existing action$ stream
      // This is the key difference - we're using the muxium's action$ Observable
      const observer = muxiumState.action$;

      // Direct concepts reference
      const concepts_ = concepts;

      // Create subscription function for KeyedSelectors
      const subscribe = muxiumState.concepts$.subscribe;

      // Create plan function bound to local scope
      // CRITICAL: plan returns StagePlanner but callback manages reference internally

      // Concept notification function
      const nextC = muxiumState.concepts$.next;

      // Action dispatch function
      const nextA = observer.next;

      // Local principle semaphore (negative to avoid conflicts with global principles)
      const conceptSemaphore = -1;
      const plan = muxium.plan;

      // CRITICAL: Direct callback invocation with recomposed parameters
      // The callback can internally manage its own GC references
      // This creates bidirectional separation of concerns
      principleFunc({
        observer: observer as unknown as Subscriber<Action>,
        concepts_,
        subscribe,
        plan,
        nextC,
        nextA,
        d_: muxiumState.deck as unknown as Stratideck<MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities, MuxiumState<Q, C>, MuxiumLoad<C>>,
        e_: e,
        c_: c,
        k_: k as unknown as BundledSelectors<MuxiumState<
        MaybeEnhancedMuxiumQualities<Q> & MuxiumQualities,
        C & MuxiumDeck
        >>,
        conceptSemaphore,
      });

      // Continue stage execution
      dispatch(muxium.deck.e.muxiumKick(), { iterateStage: true });
    }),
    conclude(),
  ]);
}

/*#>*/
