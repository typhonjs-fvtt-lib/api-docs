const symbolMap = new Map([
   ['global.foundry.abstract.document', 'https://foundryvtt.com/api/classes/foundry.abstract.Document.html'],
   ['global.game', 'https://foundryvtt.com/api/classes/client.Game.html'],
   ['global.DocumentCollection', 'https://foundryvtt.com/api/classes/client.DocumentCollection.html'],
   ['global.FontFamilyDefinition', 'https://foundryvtt.com/api/interfaces/client.FontFamilyDefinition.html'],
]);

/**
 * @param {string} name - Symbol to resolve.
 *
 * @returns {string | void} Resolve result.
 */
export function globalNamespace(name)
{
   return symbolMap.get(name);
}