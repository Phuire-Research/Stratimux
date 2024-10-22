/*<$
For the asynchronous graph programming framework Stratimux, define the Concept model file.
This file defines the Concept abstraction that the Muxium uses to Transform its functionality.
A concept is composed of name, muxified, state, qualities, semaphore, principles, and some meta attributes if necessary.
$>*/
/*<#*/
import { PrincipleFunction } from '../principle';
import { Qualities, Quality } from '../quality';
import { createConcept } from './concept';
import { AnyConcept, Concept, Mode, Muxified } from './concept.type';
import { forEachConcept } from './conceptHelpers';

/**
 * This will remove any duplicate qualities, principles, and modes.
 * Note that for now the check for mode and principle are based on concept name and loaded index;
 */
function filterSimilarQualities(concept: AnyConcept) {
  const newQualities: Quality<Record<string, unknown>>[] = [];
  const newMuxified: Record<string, Muxified> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPrinciples: PrincipleFunction<Qualities, any, Record<string, unknown>>[] = [];
  const newMode: Mode[] = [];
  for (let i = 0; i < concept.qualities.length; i++) {
    let found = false;
    for (let j = i + 1; j < concept.qualities.length; j++) {
      if (concept.qualities[i].actionType === concept.qualities[j].actionType) {
        found = true;
        break;
      }
    }
    if (!found) {
      newQualities.push(concept.qualities[i]);
    }
  }
  concept.qualities = newQualities;
  const muxifiedKeys = Object.keys(concept.muxifiedRecord);
  for (let i = 0; i < muxifiedKeys.length; i++) {
    let found = false;
    for (let j = i + 1; j < muxifiedKeys.length; j++) {
      if (muxifiedKeys[i] === muxifiedKeys[j]) {
        found = true;
        break;
      }
    }
    if (!found) {
      newMuxified[muxifiedKeys[i]] = concept.muxifiedRecord[muxifiedKeys[i]];
    }
  }
  concept.muxifiedRecord = newMuxified;
  if (concept.principles) {
    for (let i = 0; i < concept.principles.length; i++) {
      let found = false;
      for (let j = i + 1; j < concept.principles.length; j++) {
        if (concept.principles[i].toString() === concept.principles[j].toString()) {
          found = true;
          break;
        }
      }
      if (!found) {
        newPrinciples.push(concept.principles[i]);
      }
    }
    concept.principles = newPrinciples;
  }
  if (concept.mode) {
    for (let i = 0; i < concept.mode.length; i++) {
      let found = false;
      for (let j = i + 1; j < concept.mode.length; j++) {
        if (concept.mode[i].toString() === concept.mode[j].toString()) {
          found = true;
          break;
        }
      }
      if (!found) {
        newMode.push(concept.mode[i]);
      }
    }
    concept.mode = newMode;
  }
  return concept;
}

function muxify<T extends Qualities, K extends Qualities>(
  base: Concept<Record<string, unknown>, T>,
  target: Concept<Record<string, unknown>, K> | AnyConcept
): Concept<Record<string, unknown>, T & K> {
  if (target.name !== '') {
    base.muxifiedRecord[target.name] = {
      actionMap: Object.keys(target.actions),
      stateMap: Object.keys(target.state)
    };
  }
  base.muxifiedRecord = {
    ...base.muxifiedRecord,
    ...target.muxifiedRecord
  };
  base.state = {
    ...base.state,
    ...target.state,
  };
  base.qualities = [
    ...base.qualities,
    ...target.qualities,
  ];
  base.actions = {
    ...base.actions,
    ...target.actions
  };
  base.comparators = {
    ...base.comparators,
    ...target.comparators
  };
  base.keyedSelectors = {
    ...base.keyedSelectors,
    ...target.keyedSelectors
  };
  if (target.principles) {
    if (base.principles) {
      const principles = [
        ...base.principles,
        ...target.principles
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any;
      base.principles = principles;
    } else {
      const principles = [
        ...target.principles
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any;
      base.principles = principles;
    }
  }
  if (target.mode) {
    if (base.mode) {
      base.mode = [
        ...base.mode,
        ...target.mode
      ];
    } else {
      base.mode = [
        ...target.mode
      ];
    }
  }
  if (target.meta) {
    if (base.meta) {
      base.meta = {
        ...base.meta,
        ...target.meta
      };
    } else {
      base.meta = {
        ...target.mode
      };
    }
  }
  return base as Concept<Record<string, unknown>, T & K>;
}
/**
 * This will muxify concepts while prioritizing qualities later in the provided concepts list via recomposition.
 *  Then finally muxify the emergent concept with final priority.
 */
export function muxifyConcepts<S extends Record<string, unknown>, T extends Qualities>(
  concepts: AnyConcept[],
  emergentConcept: AnyConcept
): AnyConcept {
  const dummy: Record<string, unknown> = {};
  let newConcept = createConcept<typeof dummy, T>('', dummy);
  forEachConcept(concepts, (concept => {
    newConcept = muxify(newConcept, concept);
  }));
  newConcept = muxify(newConcept, emergentConcept);
  const newMuxifiedRecord: Record<string, Muxified> = {};
  Object.keys(newConcept.muxifiedRecord).forEach(name => {
    if (name !== emergentConcept.name) {
      newMuxifiedRecord[name] = newConcept.muxifiedRecord[name];
    }
  });
  newConcept.muxifiedRecord = newMuxifiedRecord;
  newConcept.name = emergentConcept.name;
  if (newConcept.mode) {
    newConcept.mode.forEach((m, i) => {
      m.toString = () => `MODE: ${newConcept.name} ${i}`;
    });
  }
  if (newConcept.principles) {
    newConcept.principles.forEach((p, i) => {
      p.toString = () => `PRINCIPLE: ${newConcept.name} ${i}`;
    });
  }
  return filterSimilarQualities(newConcept as AnyConcept) as Concept<S, T>;
}


/*#>*/