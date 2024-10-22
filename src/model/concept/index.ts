/*<$
For the asynchronous graph programming framework Stratimux, define the Concept model file.
This file defines the Concept abstraction that the Muxium uses to Transform its functionality.
A concept is composed of name, muxified, state, qualities, semaphore, principles, and some meta attributes if necessary.
$>*/
/*<#*/
import { createConcept } from './concept';
import { muxifyConcepts } from './conceptAdvanced';
import { areConceptsLoaded, conceptsToString, conceptToString, forEachConcept, isConceptLoaded, qualityToString } from './conceptHelpers';

export const concept = {
  create: createConcept,
  muxify: muxifyConcepts,
  isLoaded: isConceptLoaded,
  areLoaded: areConceptsLoaded,
  forEach: forEachConcept,
  toString: conceptToString,
  toStringConcepts: conceptsToString,
  toStringQuality: qualityToString,
};
/*#>*/