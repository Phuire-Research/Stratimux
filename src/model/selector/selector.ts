/*<$
For the asynchronous graph programming framework Stratimux, define the Selector model file.
This file will contain a series of selectors that can be used to engage with different parts of the Muxium Conceptual Set.
$>*/
/*<#*/
import { Action } from '../action/action.type';
import { AnyConcept, Concept, Concepts } from '../concept/concept.type';
import { DotPath } from '../dotPath';
import { KeyedSelector, SelectorFunction } from './selector.type';
import { creation, setCreation } from './selectorHelpers';

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
export const createMuxifiedKeyedSelector = <T extends Record<string, unknown>>(
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
export const selectMuxifiedName = (concepts: Concepts, semaphore: number): string | undefined => (concepts[semaphore]?.name);

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
 * Allows for the Muxification of Concepts and a form of Data Oriented Functional Inheritance.
 * @within_principles Simply pass the supplied semaphore passed to your PrincipleFunction to gain access to that State.
 * @outside_selection Use selectState targeting that Muxified Concept Name
 */

// Either returns the current concept's muxified state, or informs that the concept has been removed and the principles needs shutdown
export function selectMuxifiedState<T>(concepts: Concepts, semaphore: number): T | undefined {
  if (concepts[semaphore]) {
    return concepts[semaphore].state as T;
  } else {
    return undefined;
  }
}
/*#>*/