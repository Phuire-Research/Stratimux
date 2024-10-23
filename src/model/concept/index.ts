/*<$
For the asynchronous graph programming framework Stratimux, define the Concept Index model file.
This file defines a bundled concept object, that enables ease of access to the handling of concepts within
a Muxium.
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