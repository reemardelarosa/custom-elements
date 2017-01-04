import {CustomElementInternals} from '../../CustomElementInternals';
import * as Utilities from '../../Utilities';

/**
 * @typedef {{
 *   before: !function(...(!Node|string)),
 *   after: !function(...(!Node|string)),
 *   replaceWith: !function(...(!Node|string)),
 *   remove: !function(),
 * }}
 */
let ChildNodeBuiltIns;

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ChildNodeBuiltIns} builtIn
 */
export default function(internals, destination, builtIn) {
  /**
   * @param {...(!Node|string)} nodes
   */
  destination['before'] = function(...nodes) {
    builtIn.before.apply(this, nodes);

    if (Utilities.isConnected(this)) {
      for (const node of nodes) {
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['after'] = function(...nodes) {
    builtIn.after.apply(this, nodes);

    if (Utilities.isConnected(this)) {
      for (const node of nodes) {
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['replaceWith'] = function(...nodes) {
    const wasConnected = Utilities.isConnected(this);

    builtIn.replaceWith.apply(this, nodes);

    if (wasConnected) {
      internals.disconnectTree(this);
      for (const node of nodes) {
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  destination['remove'] = function() {
    const wasConnected = Utilities.isConnected(this);

    builtIn.remove.call(this);

    if (wasConnected) {
      internals.disconnectTree(this);
    }
  };
};
