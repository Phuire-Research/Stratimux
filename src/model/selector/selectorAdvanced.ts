/*<$
For the asynchronous graph programming framework Stratimux, define the Selector model file.
This file will contain a series of selectors that can be used to engage with different parts of the Muxium Conceptual Set.
$>*/
/*<#*/
import { AnyConcept, Concepts } from '../concept/concept.type';
import { DotPath } from '../dotPath';
import { selectMuxifiedName, selectSlice } from './selector';
import {
  ConceptSelector,
  CreateBufferedConceptSelector,
  CreateBufferedMuxifiedKeyedSelector,
  CreateBufferedMuxifiedNameSelector,
  CreateBufferedStateSelector,
  KeyedSelector,
  KeyedSelectors,
  SelectorFunction,
  Selectors,
  StateSelector,
  StateValidator
} from './selector.type';
import { creation, setCreation } from './selectorHelpers';

export const createBufferedMuxifiedKeyedSelector: CreateBufferedMuxifiedKeyedSelector =
  <T extends Record<string, unknown>> (semaphore: number) => (
    concepts: Concepts,
    keys: DotPath<T>,
    setKeys?: (number | string)[]
  ): KeyedSelector | undefined => {
    const concept = concepts[semaphore];
    try {
      if (concept) {
        const selectorBase = [concept.name, ...keys.split('.')];
        if (setKeys) {
          return {
            conceptName: concept.name,
            conceptSemaphore: semaphore,
            _selector: creation(selectorBase, selectorBase.length - 1, selectorBase.length) as SelectorFunction,
            select: () => undefined,
            keys: concept.name + '.' + keys,
            setKeys,
            setSelector: setCreation(setKeys, setKeys.length - 1, setKeys.length)
          };
        }
        return {
          conceptName: concept.name,
          conceptSemaphore: semaphore,
          select: () => undefined,
          _selector: creation(selectorBase, selectorBase.length - 1, selectorBase.length) as SelectorFunction,
          keys: concept.name + '.' + keys,
        };
      }
    } catch (err) {
      console.error(err);
      console.warn('ERROR AT: ', keys);
    }
    return undefined;
  };

export const createBufferedStateSelector: CreateBufferedStateSelector =
  <S = void>(semaphore: number): StateSelector<S> => (concepts: Concepts):
    StateValidator<S> | undefined => {
    const concept = concepts[semaphore];
    if (concept) {
      return concept.state as StateValidator<S>;
    }
    return undefined;
  };

export const createBufferedConceptSelector: CreateBufferedConceptSelector =
  <C extends AnyConcept>(semaphore: number): ConceptSelector<C> => (concepts: Concepts) => {
    const concept = concepts[semaphore];
    if (concept) {
      return concept as C;
    }
    return undefined;
  };

export const createBufferedMuxifiedNameSelector: CreateBufferedMuxifiedNameSelector = (semaphore) =>
  (concepts) => selectMuxifiedName(concepts, semaphore);

export const createSelectors = <S = void>(
  semaphore: number
): Selectors<S> => ({
    create: createBufferedMuxifiedKeyedSelector<S>(semaphore),
    state: createBufferedStateSelector<S>(semaphore),
    name: createBufferedMuxifiedNameSelector(semaphore)
  });

export const createDummySelectors = <S = void>(
): Selectors<S>   => {
  return {
    create: createBufferedMuxifiedKeyedSelector<S>(-1),
    // concept: createBufferedConceptSelector<C>(semaphore),
    state: createBufferedStateSelector<S>(-1),
    name: createBufferedMuxifiedNameSelector(-1)
  };
};

export const createDummyKeyedSelectors = <S = void>(
  state: S
): KeyedSelectors<S> => {
  const selectors = {} as KeyedSelectors<any>;
  const keys = Object.keys(state as Record<string, unknown>);
  keys.forEach(key => {
    selectors[key] = {
      conceptName: '',
      conceptSemaphore: -1,
      select: () => undefined,
      keys: 'dummy.' + key,
      _selector: () => undefined
    };
  });
  return selectors;
};

export const updateKeyedSelectors = <S = void>(
  concepts: Concepts,
  selectors: KeyedSelectors<S>,
  semaphore: number
): void => {
  const keys = Object.keys(selectors);
  keys.forEach(key => {
    (selectors as any)[key] = updateMuxifiedKeyedSelector(concepts, semaphore, (selectors as any)[key]);
    const keyed = (selectors as any)[key] as KeyedSelector<any>;
    const val = selectSlice<any>(concepts, keyed);
    keyed.select = () => val;
  });
};

export const updateSelects = <S= void>(
  concepts: Concepts,
  selectors: KeyedSelectors<S>,
): void => {
  const keys = Object.keys(selectors);
  keys.forEach(key => {
    const keyed = (selectors as any)[key] as KeyedSelector<any>;
    const val = selectSlice<any>(concepts, keyed);
    keyed.select = () => val;
  });
};

export const updateAtomicSelects = <S = void>(
  concepts: Concepts,
  selectors: KeyedSelectors<S>,
  partialState: Partial<S extends Record<string, unknown> ? S : Record<string, unknown>>,
): KeyedSelector<any>[] => {
  const kss: KeyedSelector<any>[] = [];
  Object.keys(partialState).forEach(key => {
    const selector = ((selectors as any)[key] as KeyedSelector<any>);
    if (selector) {
      const val = selectSlice(concepts, selector);
      selector.select = () => val;
      kss.push(selector);
    }
  });
  return kss;
};

/**
 * This will update a concepts KeyedSelector to its currently muxified concept.
 * @Note Use this in place of createMuxifiedSelector if you find yourself needing to lock deep values.
 */
export const updateMuxifiedKeyedSelector =
  (concepts: Concepts, semaphore: number, keyedSelector: KeyedSelector): KeyedSelector | undefined => {
    if (concepts[semaphore]) {
      const selectorBase = keyedSelector.keys.split('.');
      selectorBase[0] = concepts[semaphore].name;
      const _selector = creation(selectorBase, selectorBase.length - 1, selectorBase.length) as SelectorFunction;
      if (keyedSelector.setKeys) {
        return {
          conceptName: concepts[semaphore].name,
          conceptSemaphore: semaphore,
          _selector,
          select: () => undefined,
          keys: selectorBase.join('.'),
          setKeys: keyedSelector.setKeys,
          setSelector: keyedSelector.setSelector
        };
      }
      return {
        conceptName: concepts[semaphore].name,
        conceptSemaphore: semaphore,
        _selector,
        select: () => undefined,
        keys: selectorBase.join('.')
      };
    } else {
      return undefined;
    }
  };
// Temporary until there is a better means to create this form of deep selection
//  As already I am having to go off script for specific array indexes, despite being able to assemble the logic
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const assembleDynamicSelection = (selection: unknown[]): any => {
  return selection.join('.');
};

/*#>*/