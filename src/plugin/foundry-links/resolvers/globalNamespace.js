/**
 * @type {Map<string, {caption: string, target: string}>}
 */
const symbolMap = new Map([
   ['__global.Application', { caption: 'Application', target: 'https://foundryvtt.com/api/classes/client.Application.html' }],
   ['__global.ApplicationHeaderButton', { caption: 'ApplicationHeaderButton', target: 'https://foundryvtt.com/api/types/hookEvents.ApplicationHeaderButton.html' }],
   ['__global.ApplicationOptions', { caption: 'ApplicationOptions', target: 'https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html' }],
   ['__global.foundry.abstract.Document', { caption: 'foundry.abstract.Document', target: 'https://foundryvtt.com/api/classes/foundry.abstract.Document.html' }],
   ['__global.game', { caption: 'game', target: 'https://foundryvtt.com/api/classes/client.Game.html' }],
   ['__global.DocumentCollection', { caption: 'DocumentCollection', target: 'https://foundryvtt.com/api/classes/client.DocumentCollection.html' }],
   ['__global.EnrichmentOptions', { caption: 'EnrichmentOptions', target: 'https://foundryvtt.com/api/interfaces/client.EnrichmentOptions.html' }],
   ['__global.FavoriteFolder', { caption: 'FavoriteFolder', target: 'https://foundryvtt.com/api/interfaces/client.FavoriteFolder.html' }],
   ['__global.Folder', { caption: 'Folder', target: 'https://foundryvtt.com/api/classes/client.Folder.html' }],
   ['__global.FontFamilyDefinition', { caption: 'FontFamilyDefinition', target: 'https://foundryvtt.com/api/interfaces/client.FontFamilyDefinition.html' }],
   ['__global.RollTable', { caption: 'RollTable', target: 'https://foundryvtt.com/api/classes/client.RollTable.html' }],
   ['Application', { target: 'https://foundryvtt.com/api/classes/client.Application.html' }],
   ['Application.maximize', { target: 'https://foundryvtt.com/api/classes/client.Application.html#maximize' }],
   ['Application.minimize', { target: 'https://foundryvtt.com/api/classes/client.Application.html#minimize' }],
   ['Application.setPosition', { target: 'https://foundryvtt.com/api/classes/client.Application.html#setPosition' }],
   ['ApplicationHeaderButton', { target: 'https://foundryvtt.com/api/types/hookEvents.ApplicationHeaderButton.html' }],
   ['ApplicationOptions', { target: 'https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html' }],
   ['ApplicationOptions.popOut', { target: 'https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html#popOut' }],
   ['ApplicationOptions.title', { target: 'https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html#title' }],
   ['CombatTracker', { target: 'https://foundryvtt.com/api/classes/client.CombatTracker.html' }],
   ['FontFamilyDefinition', { target: 'https://foundryvtt.com/api/interfaces/client.FontFamilyDefinition.html' }],
   ['FormApplication', { target: 'https://foundryvtt.com/api/classes/client.FormApplication.html' }],
]);

/**
 * @param {string} name - Symbol to resolve.
 *
 * @returns {{ caption: string | undefined, target: string } | undefined} Resolve result.
 */
export function globalNamespace(name)
{
   return symbolMap.get(name);
}