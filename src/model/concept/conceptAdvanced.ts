/*<$
For the asynchronous graph programming framework Stratimux, define the Concept Advanced model file.
This file defines the advanced utilization of concepts via the ability to muxify concepts into new emergent concepts.
Specifically what is defined here is a general utilization that uses ordering of concepts when attempting to muxify such into a new concept.
Users may also define their own process of muxifying concepts in order to handle specific creation of new concepts.
$>*/
/*<#*/
import { PrincipleFunction } from '../principle';
import { Qualities, Quality } from '../quality';
import { createConcept } from './concept';
import { AnyConcept, Concept, Mode, LoadConcepts, ConceptECK, Muxified } from './concept.type';
import { forEachConcept } from './conceptHelpers';
import { BundledSelectors, Selectors } from '../selector/selector.type';

/**
 * This will remove any duplicate qualities, principles, and modes.
 * Note that for now the check for mode and principle are based on concept name and loaded index;
 */
function filterSimilarQualities(concept: AnyConcept) {
  const newQualities: Quality<Record<string, unknown>>[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPrinciples: PrincipleFunction<Qualities, any, Record<string, unknown>>[] = [];
  const newMode: Mode[] = [];

  // Filter duplicate qualities
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

  // Filter duplicate principles
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

  // Filter duplicate modes
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
  // Merge all qualities, actions, comparators, selectors
  base.state = {
    ...base.state,
    ...target.state,
  };
  base.q = {
    ...base.q,
    ...target.q
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
  };  // Build deck composition - add target to the deck if it has a name
  if (target.name !== '') {
    const targetECK = {
      e: target.actions,
      c: target.comparators,
      k: {
        ...target.selectors,
        ...target.keyedSelectors
      } as BundledSelectors<Record<string, unknown>>
    };
    // (base.deck.d as Record<string, unknown>)[target.name] = targetECK;
  }

  // Update base deck's own e, c, k to reflect merged actions/comparators/selectors
  base.deck.d = {
    ...base.deck.d,
    ...target.deck.d
  };
  base.deck.e = base.actions;
  base.deck.c = base.comparators;
  base.deck.k = {
    ...base.selectors,
    ...base.keyedSelectors
  } as BundledSelectors<Record<string, unknown>> & Selectors<Record<string, unknown>>;

  // Handle principles
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

  // Handle modes
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

  // Handle meta
  if (target.meta) {
    if (base.meta) {
      base.meta = {
        ...base.meta,
        ...target.meta
      };
    } else {
      base.meta = {
        ...target.meta
      };
    }
  }
  return base as Concept<Record<string, unknown>, T & K>;
}
/**
 * This will muxify concepts while prioritizing qualities later in the provided concepts list via recomposition.
 * Then finally muxify the emergent concept with final priority.
 * Uses the deck system for functional composition instead of muxifiedRecord.
 */
export function muxifyConcepts<S extends Record<string, unknown>, T extends Qualities>(
  concepts: AnyConcept[],
  emergentConcept: AnyConcept
): AnyConcept {
  const dummy: Record<string, unknown> = {};
  let newConcept = createConcept<typeof dummy, T>('', dummy);

  // Track all muxified concepts for the final deck composition
  const allMuxifiedConcepts: LoadConcepts = {};
  let allDecks: {
      [x: string]: ConceptECK<Record<string, unknown>, unknown>;
  } | {
      [x: string]: ConceptECK<any, any>;
  } = {};

  // Muxify each input concept
  forEachConcept(concepts, (concept => {
    allDecks = {
      ...allDecks,
      ...concept.deck.d
    };
    newConcept = muxify(newConcept, concept);
    // Track each concept by name for deck composition
    if (concept.name !== '') {
      allMuxifiedConcepts[concept.name] = concept;
    }
  }));

  // Muxify the emergent concept last
  newConcept = muxify(newConcept, emergentConcept);

  // Set the final name to the emergent concept's name
  newConcept.name = emergentConcept.name;
  newConcept.deck.e = newConcept.actions;
  newConcept.deck.c = newConcept.comparators;
  newConcept.deck.k = {
    ...newConcept.selectors,
    ...newConcept.keyedSelectors
  } as BundledSelectors<Record<string, unknown>> & Selectors<Record<string, unknown>>;

  // Build the final deck with all tracked concepts
  // This creates the { d: { conceptName: { e, c, k } }, e, c, k } structure
  const finalDeckComposition = {} as Record<string, ConceptECK>;

  Object.keys(allMuxifiedConcepts).forEach(conceptName => {
    const concept = allMuxifiedConcepts[conceptName];
    finalDeckComposition[conceptName] = {
      e: concept.actions,
      c: concept.comparators,
      k: newConcept.deck.k
    };
  });
  // Update the concept's deck with the complete composition
  newConcept.deck.d = {
    ...finalDeckComposition,
    ...allDecks
  } as any;

  // Populate muxifiedRecord from the tracked concepts
  const muxifiedRecord: Record<string, Muxified> = {};
  Object.keys(allMuxifiedConcepts).forEach(conceptName => {
    const concept = allMuxifiedConcepts[conceptName];
    muxifiedRecord[conceptName] = {
      stateMap: Object.keys(concept.state),
      actionMap: Object.keys(concept.actions)
    };
  });
  newConcept.muxifiedRecord = muxifiedRecord;

  // Update string representations for debugging
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