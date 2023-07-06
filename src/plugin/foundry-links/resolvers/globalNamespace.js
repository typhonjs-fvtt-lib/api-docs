const symbolMap = new Map([
   ['__global.foundry.abstract.Document', 'https://foundryvtt.com/api/classes/foundry.abstract.Document.html'],
   ['__global.game', 'https://foundryvtt.com/api/classes/client.Game.html'],
   ['__global.DocumentCollection', 'https://foundryvtt.com/api/classes/client.DocumentCollection.html'],
   ['__global.FontFamilyDefinition', 'https://foundryvtt.com/api/interfaces/client.FontFamilyDefinition.html'],
   ['Application.maximize', 'https://foundryvtt.com/api/classes/client.Application.html#maximize'],
   ['Application.minimize', 'https://foundryvtt.com/api/classes/client.Application.html#minimize'],
   ['globalThis.Application.maximize', 'https://foundryvtt.com/api/classes/client.Application.html#maximize'],
   ['globalThis.Application.minimize', 'https://foundryvtt.com/api/classes/client.Application.html#minimize'],
   ['globalThis.Application.setPosition', 'https://foundryvtt.com/api/classes/client.Application.html#setPosition'],
   ['globalThis.CombatTracker', 'https://foundryvtt.com/api/classes/client.CombatTracker.html'],
   ['globalThis.FontFamilyDefinition', 'https://foundryvtt.com/api/interfaces/client.FontFamilyDefinition.html'],
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