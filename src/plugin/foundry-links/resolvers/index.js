import { fvttNamespace }   from './fvttNamespace.js';
import { globalNamespace } from './globalNamespace.js';

/**
 * An array of all resolvers.
 *
 * @type {(() => { name: string | undefined, link: string } | undefined)[]}
 */
export const resolvers = [
   fvttNamespace,
   globalNamespace
];