/**
 * @type {Map<string, {caption: string, target: string}>}
 */
const symbolMap = new Map([
   ['default', { caption: 'Application', target: 'https://foundryvtt.com/api/classes/foundry.appv1.api.Application.html' }],
   ['ApplicationV1Options', { caption: 'ApplicationV1Options', target: 'https://foundryvtt.com/api/interfaces/foundry.ApplicationV1Options.html' }],
   ['FVTTApplicationOptions', { caption: 'ApplicationV1Options', target: 'https://foundryvtt.com/api/interfaces/foundry.ApplicationV1Options.html' }],
   ['EnrichmentOptions', { caption: 'EnrichmentOptions', target: 'https://foundryvtt.com/api/interfaces/foundry.EnrichmentOptions.html' }],
   ['FavoriteFolder', { caption: 'FavoriteFolder', target: 'https://foundryvtt.com/api/interfaces/foundry.FavoriteFolder.html' }],
   ['FVTTClientDocument', { caption: 'ClientDocument', target: 'https://foundryvtt.com/api/classes/foundry.ClientDocument.html' }],
   ['FVTTCompendiumCollection', { caption: 'CompendiumCollection', target: 'https://foundryvtt.com/api/classes/foundry.documents.collections.CompendiumCollection.html' }],
   ['FVTTDataModel', { caption: 'DataModel', target: 'https://foundryvtt.com/api/classes/foundry.abstract.DataModel.html' }],
   ['FVTTDocumentCollection', { caption: 'DocumentCollection', target: 'https://foundryvtt.com/api/classes/foundry.documents.abstract.DocumentCollection.html' }],
   ['FVTTDocumentConstructor', { caption: 'DocumentConstructor', target: 'https://foundryvtt.com/api/classes/foundry.abstract.Document.html' }],
   ['FVTTDocument', { caption: 'Document', target: 'https://foundryvtt.com/api/classes/foundry.abstract.Document.html' }],
   ['FVTTEmbeddedCollection', { caption: 'EmbeddedCollection', target: 'https://foundryvtt.com/api/classes/foundry.abstract.EmbeddedCollection.html' }],
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