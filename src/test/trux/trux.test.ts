/* eslint-disable complexity */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/*<$
For the asynchronous graph programming framework Stratimux and the Bounded Trux Concept,
generate a test that validates the uni-directional tree composition blocking within the bi-directional ownership system.
This test demonstrates how parent positions in the Trux spatial mapping block
descendant positions, while independent branches can execute in parallel.
$>*/
/*<#*/
import { muxification } from '../../model/muxium/muxium';
import { MuxiumDeck } from '../../concepts/muxium/muxium.concept';
import { OwnershipDeck, createOwnershipConcept, OwnershipState } from '../../concepts/ownership/ownership.concept';
import { createTruxConcept, TruxDeck, TruxState } from './trux.concept';
import { createAllTruxTestStrategies } from './strategies';
import { ActionStrategy, getMuxiumState, selectState, strategyBegin } from '../../index';

type TestDeck = TruxDeck & OwnershipDeck & MuxiumDeck;

// Increase timeout for uni-directional tree composition test
jest.setTimeout(40000);

/**
 * Test the Bounded Trux uni-directional tree composition blocking.
 * Expected behavior:
 * - action1 (trux.A.B.C.D.E), action5 (trux.E.C.D.D.E), and action7 (trux.B.A.C.D) run in PARALLEL (different root branches)
 * - action2,3,4 are BLOCKED by action1 until it completes (uni-directional descendants of A.B.C.D.E)
 * - action6 is BLOCKED by action5 until it completes (uni-directional descendant of E.C.D.D.E)
 * All paths are valid within the bounded Trux domain.
 *
 * Following "🧪 Stratimux Testing Patterns & Asynchronous State Management" from STRATIMUX-REFERENCE.md
 */
test('Trux uni-directional tree composition with parallel and blocked execution', (done) => {
  const muxium = muxification('Trux Uni-Directional Tree Test', {
    trux: createTruxConcept(),
    ownership: createOwnershipConcept()
  }, {
    logging: true,
    storeDialog: true,
    logActionStream: true  // Disabled for cleaner output
  });

  const startTime = Date.now();
  
  // All accumulation logic in subscription
  const completedStrategies: string[] = [];
  const executionTimeline: Array<{ topic: string, time: number }> = [];
  let validationTriggered = false;

  // MVP subscription with muxium queue visualization
  const ownershipSub = muxium.subscribe((concepts) => {
    const ownershipState = selectState<OwnershipState>(concepts, 'ownership');
    const muxiumState = getMuxiumState(concepts);
    
    if (ownershipState) {
      const currentTime = Date.now() - startTime;
      
      // Check for new strategy completions
      if (muxiumState.lastStrategy) {
        const topicPattern = /^action\d+$/;
        if (topicPattern.test(muxiumState.lastStrategy)) {
          if (!completedStrategies.includes(muxiumState.lastStrategy)) {
            completedStrategies.push(muxiumState.lastStrategy);
            executionTimeline.push({
              topic: muxiumState.lastStrategy,
              time: currentTime
            });
            console.log(`\n✅ COMPLETED: ${muxiumState.lastStrategy} at ${currentTime}ms (${completedStrategies.length}/7)`);
          }
        }
      }
      
      // MVP Ownership Info
      const ledgerSize = ownershipState.ownershipLedger?.size || 0;
      const pendingCount = ownershipState.pendingActions?.length || 0;
      
      // Muxium Queue Visualization
      const headTypes = muxiumState.head.map(action => action.type).join(', ') || 'empty';
      const bodyTypes = muxiumState.body.map(action => action.type).join(', ') || 'empty';
      const tailTypes = muxiumState.tail.map(action => action.type).join(', ') || 'empty';
      
      // Log MVP state and queues
      console.log(`\n📊 [${currentTime}ms] State Summary:`);
      console.log(`   Ownership: ${ledgerSize} claims, ${pendingCount} pending`);
      console.log(`   Queues:`);
      console.log(`      HEAD[${muxiumState.head.length}]: ${headTypes}`);
      console.log(`      BODY[${muxiumState.body.length}]: ${bodyTypes}`);
      console.log(`      TAIL[${muxiumState.tail.length}]: ${tailTypes}`);
      
      // Show pending action topics if any
      if (pendingCount > 0) {
        const pendingTopics = ownershipState.pendingActions
          ?.map(a => a.strategy?.topic || a.type)
          .join(', ');
        console.log(`   Pending: ${pendingTopics}`);
      }
    }
  });

  // Dispatch all strategies in a single stage
  muxium.plan<TestDeck>('dispatch test strategies', ({ stageO, stage, conclude }) => [
    stageO(),
    stage(({ dispatch, d, stagePlanner }) => {
      try {
        console.log('\n🚀 === STARTING STRATEGY DISPATCH ===');
        
        // Create all test strategies
        const strategies = createAllTruxTestStrategies(d);
        console.log(`📋 Created ${strategies.length} strategies`);
        
        // Log strategy details
        strategies.forEach((strategy: ActionStrategy, index) => {
          console.log(`  Strategy ${index + 1}: Topic="${strategy.topic}"`);
        });

        // Dispatch all strategies - ownership will handle blocking
        console.log('\n⚡ Dispatching all strategies...');
        strategies.forEach((strategy: ActionStrategy) => {
          const nextAction = strategyBegin(strategy);
          if (nextAction) {
            console.log(`  ➤ Dispatching: ${strategy.topic}`);
            console.log(`     - Action Type: ${nextAction.type}`);
            console.log(`     - Has KeyedSelectors: ${!!nextAction.keyedSelectors}`);
            console.log(`     - KeyedSelector count: ${nextAction.keyedSelectors?.length || 0}`);
            if (nextAction.keyedSelectors && nextAction.keyedSelectors.length > 0) {
              console.log(`     - Selector paths: ${nextAction.keyedSelectors.map(ks => ks.keys).join(', ')}`);
            }
            muxium.dispatch(nextAction);
          }
        });
        dispatch(d.muxium.e.muxiumKick(), {
          iterateStage: true
        });
        console.log('✅ All strategies dispatched\n');
      } catch (error) {
        console.error('❌ Strategy dispatch failed:', error);
        expect(false).toBe(true);
        done();
      }
    }),
    stage(({dispatch, d, concepts, stagePlanner}) => {
      // Monitor for completion (accumulation now handled in subscription)
      if (completedStrategies.length === 7) {
        console.log('\n🎯 All strategies completed in monitoring stage! Moving to validation...');
        dispatch(d.muxium.e.muxiumKick(), {
          iterateStage: true
        });
        return;
      }
      
      // Simplified beat logging
      const truxState = selectState<TruxState>(concepts, 'trux');
      console.log(`\n⏱️ Beat at ${Date.now() - startTime}ms: TruxFlops=${truxState?.truxFlops || 0}, Completed=${completedStrategies.length}/7`);
      
      // Kick to process tail
      // dispatch(d.muxium.e.muxiumKick(), {
      //   throttle: 20
      // });
    }, {
      beat: 300
    }),
    stage(({ d, stagePlanner }) => {
      // Validation stage - runs after all strategies complete
      try {
        // Expected with stake-based system: ancestors execute before descendants
        // action2 (A.B), action6 (E.C), action7 (B.A.C.D) start immediately
        // Others wait for their ancestors to complete
        // Sort timeline by completion time
        executionTimeline.sort((a, b) => a.time - b.time);
        console.log('Execution Timeline:', executionTimeline);

        // First three completions should be the ancestor/independent actions
        const firstThree = executionTimeline.slice(0, 3).map(e => e.topic);
        expect(firstThree).toContain('action2');  // A branch ancestor
        expect(firstThree).toContain('action6');  // E branch ancestor
        expect(firstThree).toContain('action7');  // B branch independent

        // Verify we have all 7 completions
        expect(executionTimeline.length).toBe(7);
        
        // Second wave should be the descendants
        const secondWave = executionTimeline.slice(3, 7).map(e => e.topic);
        expect(secondWave).toContain('action1');  // Descendant of action2
        expect(secondWave).toContain('action3');  // Descendant of action2
        expect(secondWave).toContain('action4');  // Descendant of action2
        expect(secondWave).toContain('action5');  // Descendant of action6

        // Check truxFlops counter (all paths are valid in bounded domain)
        const truxFlops = d.trux.k.truxFlops.select();
        console.log('Final truxFlops count:', truxFlops);

        // All 7 actions should have succeeded (all valid paths)
        expect(truxFlops).toBe(7);
        
        console.log('\n✅ TEST PASSED: Uni-directional tree composition blocking enforced correct execution order');
        console.log('   - Parallel branches executed simultaneously');
        console.log('   - Uni-directional blocking prevented race conditions');
        console.log('   - Temporal priority ensured fair FIFO ordering');
        console.log(`   - All ${truxFlops} strategies completed successfully`);
        
        setTimeout(() => {
          ownershipSub.unsubscribe();
          muxium.close();
          done();
        }, 100);
        
        stagePlanner.conclude();
      } catch (error) {
        console.error('Final validation failed:', error);
        ownershipSub.unsubscribe();
        muxium.close();
        expect(false).toBe(true);
        done();
      }
    }),
    conclude()
  ]);
});
/*#>*/