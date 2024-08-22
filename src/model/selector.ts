/*<$
For the asynchronous graph programming framework Stratimux, define the Selector model file.
This file will contain a series of selectors that can be used to engage with different parts of the Axium Conceptual Set.
$>*/
/*<#*/
import { Action } from './action';
import { AnyConcept, Concept, Concepts } from './concept';
import { DotPath } from './dotPath';
import { Qualities } from './quality';

/**
 * Will have such be a list of state keys separated by spaces until someone yells at me to change this.
 */
export type SelectorFunction<T = void> = (obj: Record<string, unknown>) => T extends void ? unknown : T | undefined;
export type KeyedSelector<T = void> = {
  conceptName: string,
  conceptSemaphore: number,
  keys: string,
  select: () => T,
  _selector: SelectorFunction<T>,
  setKeys?: (number | string)[]
  setSelector?: SelectorFunction
};
export type KeyedSelectors<S = void> = {
  [K in keyof S]: S[K] extends KeyedSelector<void> ?
  KeyedSelector<void>
  :
  KeyedSelector<S[K]>
};


/**
 * Will create a new KeyedSelector based on a concept name comparison during runtime, mainly used for external usage
 * @param keys - type string - Format is 'key0.key1.key3' for deep nested key values
 * @tutorial *Note* This will only extend 6 levels into a deeply nested record.
 * @tutorial **Use createAdvancedKeys** function in place of keys if attempted to scaffold into through arrays
 */
export const createConceptKeyedSelector =
  <T extends Record<string, unknown>>(conceptName: string, keys: DotPath<T>, setKeys?: (number|string)[]): KeyedSelector => {
    const selectorBase = [conceptName, ...keys.split('.')];
    if (setKeys) {
      return {
        conceptName,
        conceptSemaphore: -1,
        keys: conceptName + '.' + keys,
        select: () => undefined,
        _selector: creation(selectorBase, selectorBase.length - 1, selectorBase.length) as SelectorFunction,
        setKeys,
        setSelector: setCreation(setKeys, setKeys.length - 1, setKeys.length)
      };
    }
    return {
      conceptName,
      conceptSemaphore: -1,
      keys: conceptName + '.' + keys,
      select: () => undefined,
      _selector: creation(selectorBase, selectorBase.length - 1, selectorBase.length) as SelectorFunction,
      setKeys
    };
  };

/**
 * Will create a new KeyedSelector during runtime, for usage throughout Stratimux
 * @param keys - type string - Format is 'key0.key1.key3' for deep nested key values
 * Uses type DotPath<T> to enable some DX in the IDE to quickly create the desired string format.
 * @tutorial *Note* This will only extend 6 levels into a deeply nested record.
 * @tutorial **Use createAdvancedKeys** function in place of keys if attempted to scaffold into through arrays
 */
export const createUnifiedKeyedSelector = <T extends Record<string, unknown>>(
  concepts: Concepts,
  semaphore: number,
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

export type CreateBufferedUnifiedKeyedSelector = <T = void> (semaphore: number) =>
  UnifiedKeyedSelector<T>;
export type UnifiedKeyedSelector<T = void> = (
  concepts: Concepts,
  keys: DotPath<T extends Record<string, unknown> ? T : Record<string, unknown>>,
  setKeys?: (number | string)[]
) => KeyedSelector | undefined;

export const createBufferedUnifiedKeyedSelector: CreateBufferedUnifiedKeyedSelector =
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

export type StateValidator<S = void> = S extends Record<string, unknown> ? S : Record<string, unknown>;
export type CreateBufferedStateSelector = <S = void>(semaphore: number) =>
  StateSelector<S>;
export type StateSelector<S = void> = (concepts: Concepts) => StateValidator<S> | undefined;

export const createBufferedStateSelector: CreateBufferedStateSelector =
  <S = void>(semaphore: number): StateSelector<S> => (concepts: Concepts):
    StateValidator<S> | undefined => {
    const concept = concepts[semaphore];
    if (concept) {
      return concept.state as StateValidator<S>;
    }
    return undefined;
  };

export type CreateBufferedConceptSelector = <C extends AnyConcept>(semaphore: number) =>
  ConceptSelector<C>;
export type ConceptSelector<C extends AnyConcept> = (concepts: Concepts) => C | undefined;

export const createBufferedConceptSelector: CreateBufferedConceptSelector =
  <C extends AnyConcept>(semaphore: number): ConceptSelector<C> => (concepts: Concepts) => {
    const concept = concepts[semaphore];
    if (concept) {
      return concept as C;
    }
    return undefined;
  };

// export type Selectors<S = void, C = void> = {
export type Selectors<S = void> = {
  create: UnifiedKeyedSelector<S>,
  state: StateSelector<S>,
  // concept: ConceptSelector<C>
}

// export const createBufferedSelectorsSet = <S extends Record<string, unknown>, C extends Concept<any, any>>(
export const createBufferedSelectorsSet = <S = void>(
  semaphore: number
): Selectors<S>   => {
  return {
    create: createBufferedUnifiedKeyedSelector<S>(semaphore),
    // concept: createBufferedConceptSelector<C>(semaphore),
    state: createBufferedStateSelector<S>(semaphore)
  };
};

export const createSelectors = <S = void>(
  semaphore: number
): Selectors<S> => ({
    create: createBufferedUnifiedKeyedSelector<S>(semaphore),
    state: createBufferedStateSelector<S>(semaphore)
  });

export const createDummySelectors = <S = void>(
): Selectors<S>   => {
  return {
    create: createBufferedUnifiedKeyedSelector<S>(-1),
    // concept: createBufferedConceptSelector<C>(semaphore),
    state: createBufferedStateSelector<S>(-1)
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
    (selectors as any)[key] = updateUnifiedKeyedSelector(concepts, semaphore, (selectors as any)[key]);
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
    const val = selectSlice(concepts, selector);
    selector.select = () => val;
    kss.push(selector);
  });
  return kss;
};

/**
 * This will update a concepts KeyedSelector to its currently unified concept.
 * @Note Use this in place of createUnifiedSelector if you find yourself needing to lock deep values.
 */
export const updateUnifiedKeyedSelector =
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

const recordReturn = (key: string, previous: SelectorFunction) => {
  return (obj: Record<string, unknown>) => {
    if (obj[key] !== undefined) {
      return previous(obj[key] as Record<string, unknown>);
    } else {
      return undefined;
    }
  };
};
const finalReturn = (key: string) => {
  return (obj: Record<string, unknown>) => {
    if (obj[key] !== undefined) {
      return obj[key];
    } else {
      return undefined;
    }
  };
};
const tupleReturn = (key: string | number, previous: SelectorFunction) => {
  return (obj: Record<string | number, unknown>) => {
    if (obj[key] !== undefined) {
      const previousSet = previous(obj);
      if (previousSet) {
        return [obj[key], ...previous(obj) as unknown[]];
      }
      return [obj[key]];
    } else {
      return undefined;
    }
  };
};
const finalTupleReturn = (key: string | number) => {
  return (obj: Record<string | number, unknown>) => {
    if (obj[key] !== undefined) {
      return [obj[key]];
    } else {
      return undefined;
    }
  };
};

const creation = (keys: string[], index: number, length: number, prev?: SelectorFunction | undefined): SelectorFunction | undefined => {
  let previous: SelectorFunction | undefined = prev;
  let i = index;
  if (index === length - 1) {
    previous = finalReturn(keys[i]);
    i--;
  }
  if (i !== 0 && previous) {
    previous = recordReturn(keys[i], previous);
    return creation(keys, i - 1, length, previous);
  } else if (previous) {
    return previous;
  } else {
    return undefined;
  }
};

const setCreation =
  (keys: (string | number)[], index: number, length: number, prev?: SelectorFunction | undefined): SelectorFunction | undefined => {
    let previous: SelectorFunction | undefined = prev;
    let i = index;
    if (index === length - 1) {
      previous = finalTupleReturn(keys[i]);
      i--;
    }
    if (i !== -1 && previous) {
      previous = tupleReturn(keys[i], previous);
      return setCreation(keys, i - 1, length, previous);
    } else if (previous) {
      return previous;
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

export function selectState<T>(concepts: Concepts, name: string): T | undefined {
  const conceptKeys = Object.keys(concepts).map(key => Number(key));
  const length = conceptKeys.length;
  const select = (index: number): T | undefined => {
    if (concepts[conceptKeys[index]].name === name) {
      return concepts[conceptKeys[index]].state as T;
    } else if (index < length - 1) {
      return select(index + 1);
    } else {
      return undefined;
    }
  };
  return select(0);
}

/**
 * Simple helper function that returns payload casted to T.
 */
export function selectPayload<T>(action: Action<any>): T {
  return action.payload as T;
}

// Note: The Concept Key within the selector has to be set Explicitly for now
export function selectSlice<T>(
  concepts: Concepts,
  keyed: KeyedSelector): T | undefined {
  const concept: AnyConcept | undefined = (() => {
    if (keyed.conceptSemaphore === -1) {
      const name = keyed.conceptName;
      const conceptKeys = Object.keys(concepts);
      const length = conceptKeys.length;
      const select = (index: number): AnyConcept | undefined => {
        const i = Number(conceptKeys[index]);
        const possible = concepts[i];
        if (possible && possible.name === name) {
          return concepts[i];
        } else if (index < length) {
          return select(index + 1);
        } else {
          return undefined;
        }
      };
      return select(0);
    } else {
      return concepts[keyed.conceptSemaphore];
    }
  })();
  if (concept === undefined) {return undefined;}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cast = concept.state as Record<string, any>;
  return keyed._selector(cast) as T | undefined;
}

export function selectSet<T>(concepts: Concepts, keyed: KeyedSelector): T | undefined {
  const state: T | undefined = selectSlice<T>(concepts, keyed);
  if (keyed.setSelector) {
    return (keyed.setSelector(state as Record<string | number, unknown>)) as T;
  }
  return undefined;
}

export function selectConcept<
  S extends Record<string, unknown>, T = void
>(concepts: Concepts, name: string): Concept<S, T> | undefined {
  const conceptKeys = Object.keys(concepts);
  const length = conceptKeys.length;
  const select = (index: number): Concept<S, T> | undefined => {
    const i = Number(conceptKeys[index]);
    if (concepts[i] && concepts[i].name === name) {
      return concepts[i] as Concept<S, T>;
    } else if (index < length) {
      return select(index + 1);
    } else {
      return undefined;
    }
  };
  return select(0);
}

/**
 * Advanced functionality, set a custom key path that may include array indexes.
 * @example createAdvancedKeys(['some', 1, 'once', 2, 'me', 7, 'world', 4]) : some.1.once.2.m.7.world.4
 * @param arr a series of keys that points to your targeted slice
 * @returns DotPath<T extends object>
 */
export function createAdvancedKeys<T extends object>(arr: unknown[]): DotPath<T> {
  return arr.join('.') as DotPath<T>;
}

//createConceptKeyedSelector<{something: unknown}>('something', 'something.1' as DotPath<{something:unknown}>);
/**
 * Allows for the Unification of Concepts and a form of Data Oriented Functional Inheritance.
 * @within_principles Simply pass the supplied semaphore passed to your PrincipleFunction to gain access to that State.
 * @outside_selection Use selectState targeting that Unified Concept Name
 */

// Either returns the current concept's unified state, or informs that the concept has been removed and the principles needs shutdown
export function selectUnifiedState<T>(concepts: Concepts, semaphore: number): T | undefined {
  if (concepts[semaphore]) {
    return concepts[semaphore].state as T;
  } else {
    return undefined;
  }
}

export const select = ({
  createUnifiedKeyedSelector,
  createConceptKeyedSelector,
  createAdvancedKeys,
  updateUnifiedKeyedSelector,
  state: selectState,
  set: selectSet,
  payLoad: selectPayload,
  slice: selectSlice,
  concept: selectConcept,
  unifiedState: selectUnifiedState,
});
/*#>*/