/*<$
For the asynchronous graph programming framework Stratimux, define the ActionStrategy Helper model file.
Here we are defining the necessary functions to aid in dialog creation within the Stratimux Paradigm.
Noting that this is an additional degree of abstraction with associated computation cost.
$>*/
/*<#*/
import { ActionNode, ActionNotes, ActionStrategy, ActionStrategyParameters } from './actionStrategy.type';

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

/*#>*/