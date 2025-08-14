/*<$
For the asynchronous graph programming framework Stratimux, define the ActionStrategy Helper model file.
Here we are defining the necessary functions to aid in dialog creation within the Stratimux Paradigm.
Noting that this is an additional degree of abstraction with associated computation cost.
$>*/
/*<#*/
import { ActionNode, ActionNotes, ActionStrategy, ActionStrategyParameters } from './actionStrategy.type';
import { KeyedSelector } from '../../selector/selector.type';

export function isNotPunctuated(str: string): boolean {
  const punctuatedList = ['.', ',', '?', '!', ';'];
  let notPunctuated = true;
  for (const punctuated of punctuatedList) {
    if (str.charAt(0) === punctuated) {
      notPunctuated = false;
      break;
    }
  }
  return notPunctuated;
}

export function createSentence(actionNode: ActionNode, actionNotes?: ActionNotes): string {
  const preposition = actionNotes?.preposition !== undefined ? `${actionNotes.preposition} ` : '';
  const body = `${actionNode.actionType}`;
  let denoter = '.';
  if (actionNotes?.denoter !== undefined) {
    if (isNotPunctuated(actionNotes.denoter)) {
      denoter = ` ${actionNotes.denoter}`;
    } else {
      denoter = actionNotes.denoter;
    }
  }
  return preposition + body + denoter;
}

/**
 * Merges KeyedSelectors from current and next arrays, removing duplicates based on keys.
 * Preserves the first occurrence of each unique key.
 * @param currentSelectors - Existing KeyedSelectors (may be undefined)
 * @param nextSelectors - New KeyedSelectors to merge (may be undefined)
 * @returns Array with unique selectors (first occurrence of each key), or undefined if both inputs are undefined
 */
export const mergeKeyedSelectors = <T>(
  currentSelectors?: KeyedSelector<T>[],
  nextSelectors?: KeyedSelector<T>[]
): KeyedSelector<T>[] | undefined => {
  // If neither has selectors, return undefined
  if (!currentSelectors && !nextSelectors) {
    return undefined;
  }
  
  // If only one has selectors, return that one
  if (!currentSelectors) {
    return nextSelectors;
  }
  if (!nextSelectors) {
    return currentSelectors;
  }
  
  // Combine both arrays
  const combined = [...currentSelectors, ...nextSelectors];
  
  // Track which keys we've seen
  const seenKeys: Record<string, number> = {};
  const uniqueSelectors: KeyedSelector<T>[] = [];
  
  // Iterate through combined array
  for (const selector of combined) {
    const key = selector.keys;
    
    // If we haven't seen this key yet, add it
    if (!seenKeys[key]) {
      seenKeys[key] = 1;
      uniqueSelectors.push(selector);
    } else {
      // We've seen it, just increment the count
      seenKeys[key]++;
    }
  }
  
  return uniqueSelectors;
};

/*#>*/