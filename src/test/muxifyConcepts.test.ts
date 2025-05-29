import { createConcept } from '../model/concept/concept';
import { muxifyConcepts } from '../model/concept/conceptAdvanced';
import { muxification } from '../model/muxium/muxium';
import { createQualityCard, defaultReducer } from '../model/quality';

test('Concepts exists', (done) => {
  const one = createConcept('ONE', {
    one: 1
  }, {
    oneSomething: createQualityCard({
      type: 'ONE SOMETHING',
      reducer: defaultReducer
    })
  });
  const two = createConcept('TWO', {
    two: 2
  }, {
    twoSomething: createQualityCard({
      type: 'TWO SOMETHING',
      reducer: defaultReducer
    })
  });
  const three = createConcept('THREE', {
    three: 2
  }, {
    threeSomething: createQualityCard({
      type: 'THREE SOMETHING',
      reducer: defaultReducer
    })
  });
  const muxified = muxifyConcepts([one, two, three], createConcept('ONEtwoTHREE', {
    fin: true
  }));
  console.log(muxified.muxifiedRecord);
  const muxium = muxification('some muxium', {
    muxified: muxified
  });
  muxium.plan('some plan', ({stage}) => [
    stage(({concepts, d}) => {
      // console.log('CHECK', d);
      expect(Object.keys(d).length).toBe(2);
      // Muxified Concepts + Base Muxified Concept + Muxium
      expect(Object.keys(d.muxified.d).length).toBe(5);
      setTimeout(() => {
        done();
      }, 50);
    })
  ]);
});
