/*<$
For the asynchronous graph programming framework Stratimux, generate the Bounded Trux Concept.
This concept maps a uni-directional Trux relationship - a complete spatial mapping of all possible
positions in a uni-directional tree composition. The Trux defines every 
possible position, establishing vocabulary to describe the space. While the Higher Order
associations (the "reason" for points being in space) remain arbitrary to the Trux itself,
the Trux's formation encompasses all possible variants within its bounded domain.
$>*/
/*<#*/
import { createConcept } from '../../model/concept/concept';
import { Concept } from '../../model/concept/concept.type';
import { MuxiumDeck } from '../../concepts/muxium/muxium.concept';
import { truxPrepareSelector, TruxPrepareSelector } from './qualities/truxPrepareSelector.quality';
import { truxTimeout, TruxTimeout } from './qualities/truxTimeout.quality';
import { truxToggle, TruxToggle } from './qualities/truxToggle.quality';

/**
 * TruxNode represents a single position in the bounded spatial domain.
 * Each node maps uni-directional relationships to child nodes through
 * a finite set of branches (A, B, C, D, E for testing).
 */
export type TruxNode<T> = {
  value: T;
  children: Record<string, TruxNode<T>>;  // Uni-directional mapping to child positions
};

export type TruxState = {
  trux: TruxNode<boolean>;  // Root of the bounded Trux spatial mapping
  truxFlops: number;   // Counter for successful toggle operations
};

/**
 * Creates a bounded TruxNode structure with specified depth and branching.
 * This generates the complete spatial vocabulary for our test domain.
 * @param depth Current depth in the uni-directional graph
 * @param maxDepth Maximum depth of the bounded domain (default: 5)
 * @param branches Possible branches at each position (default: A,B,C,D,E)
 */
export const createTruxNode = (
  depth: number,
  maxDepth = 5,
  branches: string[] = ['A', 'B', 'C', 'D', 'E']
): TruxNode<boolean> => {
  const node: TruxNode<boolean> = {
    value: false,
    children: {}
  };

  // Continue mapping the space until we reach the boundary
  if (depth < maxDepth) {
    branches.forEach(branch => {
      node.children[branch] = createTruxNode(depth + 1, maxDepth, branches);
    });
  }

  return node;
};

const createTruxState = (): TruxState => ({
  trux: createTruxNode(0, 5, ['A', 'B', 'C', 'D', 'E']),
  truxFlops: 0
});

export const truxName = 'trux';

const truxQualities = {
  truxPrepareSelector,
  truxTimeout,
  truxToggle
};

export type TruxQualities = {
  truxPrepareSelector: TruxPrepareSelector,
  truxTimeout: TruxTimeout,
  truxToggle: TruxToggle
};

export type TruxConcept = Concept<TruxState, TruxQualities, TruxDeck & MuxiumDeck>;

export type TruxDeck = {
  trux: TruxConcept;
};

export const createTruxConcept = () => {
  return createConcept<TruxState, TruxQualities>(
    truxName,
    createTruxState(),
    truxQualities,
    []
  );
};
/*#>*/