/*<$
For the asynchronous graph programming framework Stratimux, generate a comprehensive test to verify that action origin tracking is functioning correctly, ensuring actions can be traced back to their source concepts and that the origin information is properly maintained throughout the action lifecycle.
$>*/
/*<#*/
import { CounterAdd, counterAdd } from '../concepts/counter/qualities/add.quality';
import { muxification } from '../model/muxium/muxium';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { CounterDeck, CounterState } from '../concepts/counter/counter.concept';
import { CounterSetCount, counterSetCount } from '../concepts/counter/qualities/setCount.quality';
import { Concept } from '../model/concept/concept.type';
import { Quality } from '../model/quality';
import { muxifyConcepts } from '../model/concept/conceptAdvanced';
import { createConcept } from '../model/concept/concept';

test('Test Name and State Access', (done) => {
  const experimentCounterQualities = {
    counterAdd,
    counterSetCount
  };
  type ExperimentCounterQualities = {
    counterAdd: CounterAdd,
    counterSetCount: CounterSetCount
  };
  type DECK = {
    experiment: Concept<CounterState, Quality<CounterState, ExperimentCounterQualities>, CounterDeck>
  }
  const muxium = muxification<DECK>('Override actions based on Plan and Stage', {
    experiment: createExperimentConcept<CounterState, ExperimentCounterQualities>({
      count: 0,
    } as CounterState,
    experimentCounterQualities, [
      ({plan}) => {
        const stageName = 'Test Override';
        plan(stageName, ({stage, stageO, d__}) => [
          stage(({stagePlanner, concepts, k}) => {
            expect(k.getName(concepts)).toBe(experimentName);
            console.log(k.getName(concepts), ' and ', k.getState(concepts));
            expect(k.getState(concepts) !== undefined).toBe(true);
            stagePlanner.conclude();
            setTimeout(() => {
              muxium.close();
              done();
            }, 100);
          }),
        ]);
      }
    ])}, {
  });
  muxium.plan<DECK>('Outer Name and State', ({stage}) => [
    stage(({concepts, d, stagePlanner}) => {
      expect(d.experiment.k.getName(concepts)).toBe(experimentName);
      console.log(d.experiment.k.getName(concepts), ' and ', d.experiment.k.getState(concepts));
      expect(d.experiment.k.getState(concepts) !== undefined).toBe(true);
      stagePlanner.conclude();
    })
  ]);
});

test('Muxified Name and State Access', (done) => {
  const experimentCounterQualities = {
    counterAdd,
    counterSetCount
  };
  type ExperimentCounterQualities = {
    counterAdd: CounterAdd,
    counterSetCount: CounterSetCount
  };
  type ExperimentDECK = {
    experiment: Concept<CounterState, ExperimentCounterQualities, CounterDeck>
  }
  const experiment = () => createExperimentConcept<CounterState, ExperimentCounterQualities>({
    count: 0,
  } as CounterState,
  experimentCounterQualities, [
    ({plan}) => {
      const stageName = 'Test Override';
      plan(stageName, ({stage, stageO, d__}) => [
        stage(({stagePlanner, concepts, k}) => {
          // expect(k.name(concepts)).toBe(experimentName);
          // console.log(k.name(concepts), ' and ', k.state(concepts));
          expect(k.getState(concepts) !== undefined).toBe(true);
          stagePlanner.conclude();
          setTimeout(() => {
            muxium.close();
            done();
          }, 100);
        }),
      ]);
    }
  ]);

  type DECK = {
    experiment: Concept<CounterState, ExperimentCounterQualities, CounterDeck>
    client: Concept<CounterState, ExperimentCounterQualities, ExperimentDECK>
  }
  const muxium = muxification<DECK>('Override actions based on Plan and Stage', {
    experiment: experiment(),
    client: muxifyConcepts([experiment()], createConcept('client', {
      //
    }))
  }, {
  });
  muxium.plan<DECK>('Outer Name and State', ({stage, conclude}) => [
    stage(({concepts, d, dispatch}) => {
      console.log(
        'base client Experiments',
        d.client.d.experiment.k.getName(concepts),
        ' and ',
        d.client.d.experiment.k.getState(concepts)
      );
      console.log('base Experiments', d.experiment.k.getName(concepts), ' and ', d.experiment.k.getState(concepts));
      console.log(
        'Check Selectors',
        d.experiment.k,
        d.client.d.experiment.k,
        Object.is(
          d.experiment.k.getName,
          d.client.d.experiment.k.getName
        )
      );
      expect(d.experiment.k.getName(concepts)).toBe(experimentName);
      expect(d.experiment.k.getState(concepts) !== undefined).toBe(true);
      expect(d.client.d.experiment.k.getName(concepts)).toBe('client');
      console.log(d.client.k.getName);
      console.log(Object.is(d.experiment, d.client.d.experiment));
      expect(d.client.d.experiment.k.getState(concepts) !== undefined).toBe(true);
      dispatch(d.muxium.e.muxiumKick(), {
        iterateStage: true
      });
    }, {
      beat: 33
    }),
    conclude()
  ]);
});
/*#>*/