/**
 * @type {Map<string, {caption: string, target: string}>}
 */
const symbolMap = new Map([
   ['FVTTDocumentCollection', { caption: 'DocumentCollection', target: 'https://foundryvtt.com/api/classes/client.DocumentCollection.html' }],
]);

/**
 * @param {string} name - Symbol to resolve.
 *
 * @returns {{ caption: string | undefined, target: string } | undefined} Resolve result.
 */
export function fvttNamespace(name)
{
   return symbolMap.get(name);
}