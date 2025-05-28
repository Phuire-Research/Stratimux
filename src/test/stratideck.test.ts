/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that a single dispatched counterAdd sets the current State to 1.
This test is based on strategy.test.ts patterns.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { CounterState, createCounterConcept, CounterQualities, CounterDeck } from '../concepts/counter/counter.concept';
import { Concept } from '../model/concept/concept.type';
import { muxifyConcepts } from '../model/concept/conceptAdvanced';
import { Deck } from '../model/deck';
import { createActionNode, createStrategy } from '../model/action/strategy/actionStrategy';
import { createConcept } from '../model/concept/concept';
import { ActionStrategy } from '../model/action/strategy/actionStrategy.type';

export const randomCountingTopic = 'Random Counting Strategy';
export function randomCountingStrategy(deck: Deck<CounterDeck>): ActionStrategy | undefined {
  if (deck.counter) {
    const {
      counterSubtract,
      counterAdd
    } = deck.counter.e;

    const stepFive = createActionNode(counterSubtract(), {
      successNotes: {
        preposition: 'and finally',
        denoter: 'One.',
      },
    });
    const stepFour = createActionNode(counterAdd(), {
      successNode: stepFive,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });
    const stepThree = createActionNode(counterAdd(), {
      successNode: stepFour,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });
    const stepTwo = createActionNode(counterSubtract(), {
      successNode: stepThree,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });
    const stepOne = createActionNode(counterAdd(), {
      successNode: stepTwo,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });

    return createStrategy({
      topic: randomCountingTopic,
      initialNode: stepOne,
    });
  } else {
    return undefined;
  }
}

test('Stratideck Unique Counter per Muxified Concept', (done) => {
  const counterOne = muxifyConcepts([createCounterConcept()], createConcept('counterOne', {}));
  const counterTwo = muxifyConcepts([createCounterConcept()], createConcept('counterTwo', {}));
  const counterThree = muxifyConcepts([createCounterConcept()], createConcept('counterThree', {}));
  const cpts = {
    counter: createCounterConcept(),
    counterOne,
    counterTwo,
    counterThree,
  };
  type DECK = {
    counter: Concept<CounterState, CounterQualities>;
    counterOne: Concept<CounterState, CounterQualities, CounterDeck>;
    counterTwo: Concept<CounterState, CounterQualities>;
    counterThree: Concept<CounterState, CounterQualities>;
  };

  const muxium = muxification('stratideck test', cpts, {logging: true, storeDialog: true});
  const plan = muxium.plan<DECK>('Counter Add Plan',
    ({stage}) => [
      stage(({dispatch, d}) => {
        // const strategy = randomCountingStrategy(d.counterOne);
        // Dispatch a single counterAdd action
        console.log('CHECK ACTION: ', d.counter.e.counterAdd());
        dispatch(d.counterOne.e.counterAdd(), {
          iterateStage: true
        });
      }),
      stage(({d}) => {
        expect(d.counterOne.d.counter.k.count.select()).toBe(1);
        expect(d.counter.k.count.select()).toBe(0);
        expect(d.counterTwo.k.count.select()).toBe(0);
        expect(d.counterThree.k.count.select()).toBe(0);
        // Clean up and complete the test
        plan.conclude();
        muxium.close();
        setTimeout(() => {done();}, 100);
      })
    ]);
});

test('Stratideck Unique Counter per Muxified Concept', (done) => {
  const counterOne = muxifyConcepts([createCounterConcept()], createConcept('counterOne', {}));
  const counterTwo = muxifyConcepts([createCounterConcept()], createConcept('counterTwo', {}));
  const counterThree = muxifyConcepts([createCounterConcept()], createConcept('counterThree', {}));
  const counterMuxed = muxifyConcepts([counterOne, counterTwo, counterThree], createConcept('counterMuxed', {}));
  const cpts = {
    counter: createCounterConcept(),
    counterOne,
    counterMuxed,
  };
  type DECK = {
    counter: Concept<CounterState, CounterQualities>;
    counterOne: Concept<CounterState, CounterQualities, CounterDeck>;
    counterMuxed: Concept<CounterState, CounterQualities, {
      counterOne: Concept<CounterState, CounterQualities, CounterDeck>;
      counterTwo: Concept<CounterState, CounterQualities, CounterDeck>;
      counterThree: Concept<CounterState, CounterQualities, CounterDeck>;
    }>;
  }

  const muxium = muxification('stratideck test', cpts, {logging: true, storeDialog: true});
  const plan = muxium.plan<DECK>('Counter Add Plan',
    ({stage}) => [
      stage(({dispatch, d}) => {
        console.log('CHECK ACTION: ', d.counterMuxed.e.counterAdd());
        dispatch(d.counterMuxed.e.counterAdd(), {
          iterateStage: true
        });
      }),
      stage(({d, concepts}) => {
        console.log(JSON.stringify(d.counter.k.count.select()));
        expect(d.counter.k.count.select()).toBe(0);
        console.log(JSON.stringify(d.counter.k));
        console.log(JSON.stringify(d.counterMuxed.k.count.select()));
        expect(d.counterMuxed.k.count.select()).toBe(1);
        console.log(JSON.stringify(d.counterMuxed.k.count.select()));
        expect(d.counterMuxed.d.counter.k.count.select()).toBe(1);
        plan.conclude();
        muxium.close();
        setTimeout(() => {done();}, 100);
      })
    ]);
});
/*#>*/
