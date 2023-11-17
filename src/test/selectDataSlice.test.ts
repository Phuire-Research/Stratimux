import { Concepts, createConcept } from '../model/concept';
import { KeyedSelector, createUnifiedKeyedSelector, selectSlice } from '../model/selector';

export type BaseDataSet = {
  prompt: string,
  content: string,
}

export type NamedDataSet = {
  name: string,
  dataSet: BaseDataSet[]
}

export const generateBaseDataSetEntry = (): BaseDataSet => {
  return {
    prompt: '#insert prompt#',
    content: '#insert chosen output#',
  };
};

export const generateDefaultNamedDataSet = (name: string): NamedDataSet => ({
  name,
  dataSet: [generateBaseDataSetEntry()]
});

test('userInterfaceBindingsToString', (done) => {
  const simulated = {
    trainingData: [generateDefaultNamedDataSet('something')],
    shallow: true,
  };
  const experiment = createConcept(
    'experiment',
    simulated
  );
  const concepts: Concepts = {
    1: experiment
  };
  const entry = generateBaseDataSetEntry();
  const selector = createUnifiedKeyedSelector(concepts, 1, 'trainingData 0 dataSet 0 prompt') as KeyedSelector;
  const shallow = createUnifiedKeyedSelector(concepts, 1, 'shallow') as KeyedSelector;
  const getUndefined = {...selector};
  getUndefined.conceptName = 'something';
  expect(selectSlice(concepts, selector)).toBe(entry.prompt);
  expect(selectSlice(concepts, shallow)).toBe(true);
  expect(selectSlice(concepts, getUndefined)).toBe(undefined);
  done();
});