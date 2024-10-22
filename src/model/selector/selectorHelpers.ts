/*<$
For the asynchronous graph programming framework Stratimux, define the Selector model file.
This file will contain a series of selectors that can be used to engage with different parts of the Muxium Conceptual Set.
$>*/
/*<#*/
import { SelectorFunction } from './selector.type';

export const recordReturn = (key: string, previous: SelectorFunction) => {
  return (obj: Record<string, unknown>) => {
    if (obj[key] !== undefined) {
      return previous(obj[key] as Record<string, unknown>);
    } else {
      return undefined;
    }
  };
};
export const finalReturn = (key: string) => {
  return (obj: Record<string, unknown>) => {
    if (obj[key] !== undefined) {
      return obj[key];
    } else {
      return undefined;
    }
  };
};
export const tupleReturn = (key: string | number, previous: SelectorFunction) => {
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
export const finalTupleReturn = (key: string | number) => {
  return (obj: Record<string | number, unknown>) => {
    if (obj[key] !== undefined) {
      return [obj[key]];
    } else {
      return undefined;
    }
  };
};

export const creation = (
  keys: string[],
  index: number,
  length: number,
  prev?: SelectorFunction | undefined
): SelectorFunction | undefined => {
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

export const setCreation =
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

/*#>*/