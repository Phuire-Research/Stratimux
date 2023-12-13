/*<$
For the graph programming framework Stratimux, define the Selector model file.
This file will contain a series of selectors that can be used to engage with different parts of the Axium Conceptual Set.
$>*/
/*<#*/
import { Action } from './action';
import { Concept, Concepts } from './concept';

/**
 * Will have such be a list of state keys separated by spaces until someone yells at me to change this.
 */
export type KeyedSelector = {
  keys: string,
  selector: string[],
  index?: number
};

/**
 * For usage outside of the Axium, or when subscribed to other Axiums
 */
export const createConceptKeyedSelector =
  <T extends Record<string, unknown>>(conceptName: string, keys: DotPath<T>, index?: number): KeyedSelector => {
    const selector = [conceptName, ...keys.split('.')];
    return {
      keys,
      selector,
      index
    };
  };

/**
 * This will update a concepts KeyedSelector to its currently unified concept.
 * @Note Use this in place of createUnifiedSelector if you find yourself needing to lock deep values.
 */
export const updateUnifiedKeyedSelector =
  (concepts: Concepts, semaphore: number, keyedSelector: KeyedSelector): KeyedSelector | undefined => {
    if (concepts[semaphore]) {
      const selector = {...keyedSelector.selector};
      selector[0] = concepts[semaphore].name;
      if (keyedSelector.index) {
        return {
          selector,
          keys: selector.join('.'),
          index: keyedSelector.index
        };
      }
      return {
        selector,
        keys: selector.join('.')
      };
    } else {
      return undefined;
    }
  };

type Key = string | number | symbol;

type Join<L extends Key | undefined, R extends Key | undefined> = L extends
  | string
  | number
  ? R extends string | number
    ? `${L}.${R}`
    : L
  : R extends string | number
  ? R
  : undefined;

type Union<
  L extends unknown | undefined,
  R extends unknown | undefined
> = L extends undefined
  ? R extends undefined
    ? undefined
    : R
  : R extends undefined
  ? L
  : L | R;

// Use this type to define object types you want to skip (no path-scanning)
type ObjectsToIgnore = { new(...parms: any[]): any } | Date | Array<any>

type ValidObject<T> =  T extends object
  ? T extends ObjectsToIgnore
    ? false & 1
    : T
  : false & 1;

export type DotPath<
  T extends object,
  Prev extends Key | undefined = undefined,
  Path extends Key | undefined = undefined,
  PrevTypes extends object = T
> = string &
  {
    [K in keyof T]:
    // T[K] is a type already checked?
    T[K] extends PrevTypes | T
      //  Return all previous paths.
      ? Union<Union<Prev, Path>, Join<Path, K>>
      : // T[K] is an object?.
      Required<T>[K] extends ValidObject<Required<T>[K]>
      ? // Continue extracting
        DotPath<Required<T>[K], Union<Prev, Path>, Join<Path, K>, PrevTypes | T>
      :  // Return all previous paths, including current key.
      Union<Union<Prev, Path>, Join<Path, K>>;
  }[keyof T];
/**
 * Will create a new KeyedSelector during runtime, for usage within your principles.
 * @Note Will want to expand this later, so that we can select into objects and arrays.
 *  This would allow us to lock parts of such in later revisions, not an immediate concern.
 */
export const createUnifiedKeyedSelector = <T extends object>(
  concepts: Concepts,
  semaphore: number,
  keys: DotPath<T>,
  index?: number
): KeyedSelector | undefined => {
  const concept = concepts[semaphore];
  if (concept) {
    const selector = [concept.name, ...keys.split('.')];
    return {
      selector,
      keys: concept.name + '.' + keys,
      index
    };
  } else {
    return undefined;
  }
};

export function selectState<T>(concepts: Concepts, name: string): T | undefined {
  const conceptKeys = Object.keys(concepts);
  const length = conceptKeys.length;
  const select = (index: number): T | undefined => {
    if (concepts[Number(conceptKeys[index])].name === name) {
      return concepts[index].state as T;
    } else if (index < length) {
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
export function selectPayload<T>(action: Action): T {
  return action.payload as T;
}

// Note: The Concept Key within the selector has to be set Explicitly for now
export function selectSlice<T>(
  concepts: Concepts,
  keyed: KeyedSelector): T | undefined {
  const name = keyed.selector[0];
  const conceptKeys = Object.keys(concepts);
  const length = conceptKeys.length;
  const select = (index: number): Concept | undefined => {
    if (concepts[Number(conceptKeys[index])].name === name) {
      return concepts[index];
    } else if (index < length) {
      return select(index + 1);
    } else {
      return undefined;
    }
  };
  const concept: Concept | undefined = select(0);
  if (concept === undefined) {return undefined;}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cast = concept.state as Record<string, any>;
  let previous = cast;
  const slice = (index: number): T | undefined => {
    if (typeof previous === 'object' && previous[keyed.selector[index]] !== undefined) {
      previous = previous[keyed.selector[index]];
      if (index < keyed.selector.length) {
        return slice(index + 1);
      } else {
        if (keyed.index) {
          return previous[keyed.index] ? previous[keyed.index] as T : undefined;
        }
        return previous as T;
      }
    } else {
      return undefined;
    }
  };
  return slice(0);
}

export function selectConcept(concepts: Concepts, name: string): Concept | undefined {
  const conceptKeys = Object.keys(concepts).map(key => Number(key));
  const length = conceptKeys.length;
  const select = (index: number): Concept | undefined => {
    if (concepts[conceptKeys[index]].name === name) {
      return concepts[conceptKeys[index]];
    } else if (index < length) {
      return select(index + 1);
    } else {
      return undefined;
    }
  };
  return select(0);
}

/**
 * Allows for the Unification of Concepts and a form of Data Oriented Functional Inheritance.
 * @within_principles Simply pass the supplied semaphore passed to your PrincipleFunction to gain access to that State.
 * @outside_selection Use selectState targeting that Unified Concept Name
 */

// Either returns the current concept's unified state, or informs that the concept has been removed and the principles needs shutdown
export function selectUnifiedState<T>(concepts: Concepts, semaphore: number): T | undefined {
  const exists = Object.keys(concepts).includes(`${semaphore}`);
  if (exists) {
    return concepts[semaphore].state as T;
  } else {
    return undefined;
  }
}
/*#>*/