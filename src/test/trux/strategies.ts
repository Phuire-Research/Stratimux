/*<$
For the asynchronous graph programming framework Stratimux and the Bounded Trux Concept,
generate the ActionStrategy creator functions for testing uni-directional ownership.
These strategies test the spatial mapping and blocking behavior of the Trux structure.
$>*/
/*<#*/
import { 
  createActionNode, 
  createStrategy, 
  selectStratiDECK,
  ActionStrategy,
  StratiDECK
} from '../../index';
import { TruxConcept, truxName } from './trux.concept';
import { TruxPrepareSelectorPayload } from './qualities/truxPrepareSelector.quality';
import { TruxTimeoutPayload } from './qualities/truxTimeout.quality';
import { OwnershipConcept, ownershipName } from '../../concepts/ownership/ownership.concept';

/**
 * Creates a three-action strategy for testing Trux spatial ownership.
 * Each strategy: 1) Prepares KeyedSelector, 2) Reserves position for 300ms, 3) Toggles value.
 * 
 * Following "🔧 selectStratiDECK Pattern for Strategy Creator Functions" from STRATIMUX-REFERENCE.md
 * 
 * @param deck - Unknown type due to TypeScript design limitations with complex type constraints
 * @param path - Path in the Trux spatial mapping (e.g., "trux.A.B.C.D")
 * @param topic - Unique topic to identify this strategy in execution order
 */
export function createTruxTestStrategy(
  deck: unknown,  // ALWAYS use unknown type per STRATIMUX-REFERENCE.md
  path: string,
  topic: string
): ActionStrategy | undefined {
  
  // Access the Trux concept using selectStratiDECK
  const truxDeck: StratiDECK<TruxConcept> | undefined = selectStratiDECK<TruxConcept>(
    deck,
    truxName
  );
  
  // Access the Ownership concept for backtrack action
  const ownershipDeck: StratiDECK<OwnershipConcept> | undefined = selectStratiDECK<OwnershipConcept>(
    deck,
    ownershipName
  );
  
  // Guard clause: Return undefined if concepts unavailable
  if (!truxDeck || !ownershipDeck) {
    console.warn(`Strategy ${topic}: Cannot create strategy - Required concepts not found`);
    return undefined;
  }
  
  // Validate path segments exist in bounded domain
  const segments = path.split('.');
  if (segments[0] !== 'trux') {
    console.warn(`Strategy ${topic}: Invalid path - must start with 'trux'`);
    return undefined;
  }
  
  // Create the strategy with three actions: prepare selector, timeout, then toggle
  const prepareSelectorPayload: TruxPrepareSelectorPayload = { path };
  const timeoutPayload: TruxTimeoutPayload = { path };
  
  // Create ownership backtrack node for handling blocking
  const backTrack = createActionNode(ownershipDeck.e.ownershipBackTrack({}));
  
  return createStrategy({
    topic,
    initialNode: createActionNode(
      // First action: Create and attach KeyedSelector dynamically
      truxDeck.e.truxPrepareSelector(prepareSelectorPayload, { agreement: 30000 }),
      {
        failureNode: backTrack,  // Handle ownership blocking
        successNode: createActionNode(
          // Second action: Reserve ownership for 300ms (uses attached KeyedSelector)
          truxDeck.e.truxTimeout(timeoutPayload, { agreement: 30000 }),
          {
            failureNode: backTrack,  // Handle ownership blocking
            // KeyedSelectors will be attached dynamically by truxPrepareSelector
            successNode: createActionNode(
              // Third action: Toggle the value at this position
              truxDeck.e.truxToggle({ path }, { agreement: 30000 }),
              {
                failureNode: backTrack  // Handle ownership blocking
              }
            )
          }
        )
      }
    )
  });
}

/**
 * Create all test strategies for the uni-directional ownership test.
 * These test various scenarios in the bounded Trux spatial mapping:
 * - Deep paths (5 levels)
 * - Overlapping paths demonstrating uni-directional blocking
 * - Independent branches demonstrating parallel execution
 * All paths are valid within the bounded domain (A,B,C,D,E).
 */
export function createAllTruxTestStrategies(deck: unknown): ActionStrategy[] {
  const testCases = [
    { path: 'trux.A.B.C.D.E', topic: 'action1' },  // Deepest in A branch - blocked by action2
    { path: 'trux.A.B', topic: 'action2' },        // A branch ancestor - executes first
    { path: 'trux.A.B.C', topic: 'action3' },      // Blocked by action2 (ancestor)
    { path: 'trux.A.B.C.D', topic: 'action4' },    // Blocked by action2 (ancestor)
    { path: 'trux.E.C.D.D.E', topic: 'action5' },  // Deepest in E branch - blocked by action6
    { path: 'trux.E.C', topic: 'action6' },        // E branch ancestor - executes first
    { path: 'trux.B.A.C.D', topic: 'action7' }     // Independent B branch - executes immediately
  ];
  
  const strategies: ActionStrategy[] = [];
  
  for (const testCase of testCases) {
    const strategy = createTruxTestStrategy(deck, testCase.path, testCase.topic);
    if (strategy) {
      strategies.push(strategy);
    }
  }
  
  return strategies;
}
/*#>*/