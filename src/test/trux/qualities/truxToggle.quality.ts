/*<$
For the asynchronous graph programming framework Stratimux and the Bounded Trux Concept,
generate the truxToggle quality. This quality toggles the boolean value at a specific
position in the Trux spatial mapping, demonstrating state changes within the
uni-directional graph structure.
$>*/
/*<#*/
import { createQualityCardWithPayload, defaultMethodCreator } from '../../../model/quality';
import { TruxState, TruxNode } from '../trux.concept';

export type TruxTogglePayload = {
  path: string;  // Path in the Trux space, e.g., "trux.A.B.C.D"
};

/**
 * Deep clones a TruxNode to maintain immutability in the spatial mapping
 */
const cloneTruxNode = (node: TruxNode<boolean>): TruxNode<boolean> => {
  const cloned: TruxNode<boolean> = {
    value: node.value,
    children: {}
  };

  Object.keys(node.children).forEach(key => {
    cloned.children[key] = cloneTruxNode(node.children[key]);
  });

  return cloned;
};

/**
 * Navigates to a position in the Trux space and toggles its value.
 * Returns null if the path doesn't exist in the bounded domain.
 */
const toggleNodeAtPath = (root: TruxNode<boolean>, path: string): TruxNode<boolean> | null => {
  const segments = path.split('.');

  // Validate and remove 'trux' prefix
  if (segments[0] !== 'trux') {
    return null;
  }

  const pathSegments = segments.slice(1);
  const newRoot = cloneTruxNode(root);

  // Navigate through the uni-directional graph
  let current = newRoot;
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];

    // Check if this position exists in our bounded domain
    if (!current.children[segment]) {
      return null; // Invalid path in the Trux space
    }

    if (i === pathSegments.length - 1) {
      // Toggle the value at this position in the spatial mapping
      current.children[segment].value = !current.children[segment].value;
    } else {
      // Continue navigating through the uni-directional relationships
      current = current.children[segment];
    }
  }

  return newRoot;
};

export const truxToggle = createQualityCardWithPayload<TruxState, TruxTogglePayload>({
  type: 'trux toggle',
  reducer: (state, action) => {
    const payload = action.payload;
    const newTrux = toggleNodeAtPath(state.trux, payload.path);

    if (newTrux) {
      // Successfully toggled a position in the Trux space
      return {
        trux: newTrux,
        truxFlops: state.truxFlops + 1
      };
    }

    // Invalid path - no change to the spatial mapping
    return {};
  },
  methodCreator: defaultMethodCreator
});

export type TruxToggle = typeof truxToggle.actionCreator;
/*#>*/