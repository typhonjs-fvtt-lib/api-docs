/**
 * @type {Map<string, {caption: string, target: string}>}
 */
const symbolMap = new Map([
   ['FVTTDataModel', { caption: 'DataModel', target: 'https://foundryvtt.com/api/classes/foundry.abstract.DataModel.html' }],
   ['FVTTDocumentCollection', { caption: 'DocumentCollection', target: 'https://foundryvtt.com/api/classes/client.DocumentCollection.html' }],
   ['FVTTDocumentConstructor', { caption: 'DocumentConstructor', target: 'https://foundryvtt.com/api/classes/foundry.abstract.Document.html' }],
   ['FVTTDocument', { caption: 'Document', target: 'https://foundryvtt.com/api/classes/foundry.abstract.Document.html' }],

   ['__global.ClientDocument', { caption: 'ClientDocument', target: 'https://foundryvtt.com/api/classes/foundry.abstract.Document.html' }],
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