## 🌐 LocalPrinciple Pattern - Bidirectional Framework Integration

**LocalPrinciple enables components from any framework to access Stratimux's PrincipleFunction interface locally, creating bidirectional separation of concerns without garbage collection issues.**

### 🎯 Pattern Overview

LocalPrinciple solves a critical integration challenge: How can external frameworks (Vue, React, etc.) utilize Stratimux's planning capabilities without creating circular dependencies or GC issues?

#### The Solution: Bidirectional Separation
```typescript
// Components create local principles that:
// 1. Access the muxium's existing action$ stream (no new observers)
// 2. Manage their own lifecycle internally (no external references)
// 3. Return void to enforce pure consumption pattern

createLocalPrinciple('ComponentName', muxium, ({plan}) => {
  // Component has full access to planning capabilities
  const localPlanner = plan('Local Strategy Plan', ({stage}) => [
    stage(({dispatch, d}) => {
      // Local principle logic with full DECK access
      dispatch(d.concept.e.action(), { iterateStage: true });
    })
  ]);
  
  // Component manages cleanup internally
  onComponentUnmount(() => {
    localPlanner.conclude();
  });
});
```

### 🏗️ Architecture

#### Parameter Recomposition
LocalPrinciple derives the exact same interface as global principles:

```typescript
export type LocalPrincipleInterface<C extends LoadConcepts, Q = void, S = void> = {
  observer: Subscriber<Action>;      // Muxium's action$ stream
  concepts_: Concepts;                // Current concepts
  subscribe: ConceptsSubscriber;      // Concept subscription
  plan: Planning<C, Q, S>;           // Stage planning capability
  nextC: (concepts: Concepts) => void;
  nextA: (action: AnyAction) => void;
  conceptSemaphore: number;          // Negative for local principles
  d_: Deck<C>;                       // Full DECK access
  e_: Actions<Q>;                    // Actions
  c_: Comparators<Q>;                // Comparators
  k_: BundledSelectors<S>;          // Selectors
};
```

### 🔧 Implementation Pattern

#### Basic Usage with Cleanup
```typescript
// From the test example - demonstrates internal lifecycle management
createLocalPrinciple('Test Local Counter Principle', muxium, ({plan}) => {
  // Create a local plan with full access to Stratimux capabilities
  const stagePlanner = plan<DECK>('Counting Strategy Plan', ({stage}) => [
    stage(({stagePlanner, dispatch, d, e}) => {
      const str = countingStrategy(d);
      if (str) {
        dispatch(strategyBegin(str), {
          iterateStage: true
        });
      } else {
        stagePlanner.conclude();
      }
    }),
    stage(({concepts, d, stagePlanner}) => {
      const muxiumState = getMuxiumState(concepts);
      if (muxiumState.lastStrategy === countingTopic) {
        const counter = selectState<CounterState>(concepts, counterName);
        expect(counter?.count).toBe(1);
        // Cleanup when done
        stagePlanner.conclude();
        muxium.close();
      }
    })
  ]);
  
  // The component would handle cleanup on unmount
  // In a real component: onUnmounted(() => stagePlanner.conclude())
});
```

### 🚨 Critical Design Principles

#### 1. No External Reference Storage
```typescript
// ❌ WRONG: Storing references externally
let globalPlanner;
createLocalPrinciple('Bad', muxium, ({plan}) => {
  globalPlanner = plan('Some Plan', /*...*/);  // GC issue!
});

// ✅ CORRECT: Internal management only
createLocalPrinciple('Good', muxium, ({plan}) => {
  const localPlanner = plan('Some Plan', /*...*/);
  // Manage lifecycle internally
  onCleanup(() => localPlanner.conclude());
});
```

#### 2. Access Existing Streams
```typescript
// The key difference from createPrinciple$:
// - createPrinciple$ creates new Observable with new observer
// - createLocalPrinciple accesses muxium's existing action$ stream

// Inside createLocalPrinciple implementation:
const muxiumState = getMuxiumState(concepts);
const observer = muxiumState.action$;  // Use existing stream
const subscribe = muxiumState.concepts$.subscribe;
const nextC = muxiumState.concepts$.next;
const nextA = observer.next;
```

#### 3. Void Return Pattern
```typescript
// Function signature enforces no reference leakage
export function createLocalPrinciple<C extends LoadConcepts, Q = void, S = void>(
  componentName: string,
  muxium: Muxium<LoadConcepts & MuxiumDeck, MaybeEnhancedMuxiumQualities>,
  principleFunc: LocalPrincipleFunction<C, Q, S>,
): void {  // Returns void - pure consumption
  // Implementation...
}
```

### 🎯 Use Cases

#### Vue Component Integration
```typescript
// In Vue setup()
const muxium = inject<Muxium>('muxium');

onMounted(() => {
  createLocalPrinciple('VueComponent', muxium, ({plan, d_, k_}) => {
    const planner = plan('Component Logic', ({stage}) => [
      stage(() => {
        // React to Stratimux state
        const state = k_.someProperty.select();
        // Component-specific logic
      })
    ]);
    
    onUnmounted(() => {
      planner.conclude();  // Clean bidirectional separation
    });
  });
});
```

#### React Hook Pattern
```typescript
// Custom React hook
function useLocalPrinciple(name: string, muxium: Muxium) {
  useEffect(() => {
    let planner: StagePlanner | null = null;
    
    createLocalPrinciple(name, muxium, ({plan}) => {
      planner = plan('React Integration', /*...*/);
    });
    
    return () => {
      planner?.conclude();  // Cleanup on unmount
    };
  }, [name, muxium]);
}
```

### 📊 Benefits

1. **Framework Agnostic**: Works with any framework that can manage lifecycle
2. **GC-Safe**: No external references prevent garbage collection
3. **Full Stratimux Access**: Components get complete planning capabilities
4. **Clean Separation**: Stratimux doesn't know about the framework, framework doesn't store Stratimux references
5. **Atomic Integration**: Each component manages its own integration independently

### 🔑 Key Insights

- **Bidirectional Contract**: Stratimux provides capability, component manages lifecycle
- **Pure Consumption**: Void return prevents reference leakage
- **Local Semaphores**: Negative values (-1) prevent conflicts with global principles
- **Stream Reuse**: Leverages existing muxium streams instead of creating new ones

This pattern enables truly modular integration where any component from any framework can temporarily become a Stratimux principle, perform complex staged operations, and cleanly disconnect without leaving traces in either system.