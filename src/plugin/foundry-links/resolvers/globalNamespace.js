const symbolMap = new Map([
   ['__global.ApplicationHeaderButton', 'https://foundryvtt.com/api/modules/hookEvents.html#ApplicationHeaderButton'],
   ['__global.foundry.abstract.Document', 'https://foundryvtt.com/api/classes/foundry.abstract.Document.html'],
   ['__global.game', 'https://foundryvtt.com/api/classes/client.Game.html'],
   ['__global.DocumentCollection', 'https://foundryvtt.com/api/classes/client.DocumentCollection.html'],
   ['__global.EnrichmentOptions', 'https://foundryvtt.com/api/interfaces/client.EnrichmentOptions.html'],
   ['__global.FavoriteFolder', 'https://foundryvtt.com/api/interfaces/client.FavoriteFolder.html'],
   ['__global.FontFamilyDefinition', 'https://foundryvtt.com/api/interfaces/client.FontFamilyDefinition.html'],
   ['Application', 'https://foundryvtt.com/api/classes/client.Application.html'],
   ['Application.maximize', 'https://foundryvtt.com/api/classes/client.Application.html#maximize'],
   ['Application.minimize', 'https://foundryvtt.com/api/classes/client.Application.html#minimize'],
   ['Application.setPosition', 'https://foundryvtt.com/api/classes/client.Application.html#setPosition'],
   ['ApplicationOptions', 'https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html'],
   ['ApplicationOptions.popOut', 'https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html#popOut'],
   ['ApplicationOptions.title', 'https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html#title'],
   ['CombatTracker', 'https://foundryvtt.com/api/classes/client.CombatTracker.html'],
   ['FontFamilyDefinition', 'https://foundryvtt.com/api/interfaces/client.FontFamilyDefinition.html'],
   ['FormApplication', 'https://foundryvtt.com/api/classes/client.FormApplication.html'],
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