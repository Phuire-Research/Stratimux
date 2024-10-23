/*<$
For the asynchronous graph programming framework Stratimux,
generate a test to that selectSlice is capable of performing shallow and deep state selections.
$>*/
/*<#*/
import { createConcept } from '../model/concept/concept';
import { Concept, Concepts } from '../model/concept/concept.type';
import { createMuxifiedKeyedSelector, selectSlice } from '../model/selector/selector';
import { assembleDynamicSelection } from '../model/selector/selectorAdvanced';

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
    1: experiment as Concept<any>
  };
  const entry = generateBaseDataSetEntry();
  const selector = createMuxifiedKeyedSelector<typeof simulated>(
    concepts, 1,
    assembleDynamicSelection(['trainingData', 0, 'dataSet', 0, 'prompt'])
  );
  const shallow = createMuxifiedKeyedSelector<typeof simulated>(concepts, 1, 'shallow');

  console.log('CHECK SHALLOW', shallow);
  if (selector && shallow) {
    expect(selectSlice(concepts, selector)).toBe(entry.prompt);
    expect(selectSlice(concepts, shallow)).toBe(true);
    done();
  }
});
/*#>*/