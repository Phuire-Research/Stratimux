import { createConcept, muxifyConcepts } from '../model/concept/concept';
import { demuxifyDeck, muxification } from '../model/muxium/muxium';
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

  const demuxifed = demuxifyDeck(muxified);
  demuxifed.forEach(u => {
    console.log(u.eck);
  });
  console.log(demuxifed);
  console.log(muxified.muxifiedRecord);
  expect(demuxifed.length).toBe(3);
  expect(Object.keys(demuxifed[1].eck.c)[0]).toBe('twoSomething');
  const muxium = muxification('some muxium', {
    somethingRandom: muxified
  });
  muxium.plan('some plan', ({stage}) => [
    stage(({concepts, d}) => {
      console.log(Object.keys(d));
      expect(Object.keys(d).length).toBe(5);
      setTimeout(() => {
        done();
      }, 50);
    })
  ]);
});
