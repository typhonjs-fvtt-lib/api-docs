/**
 * @type {Map<string, {caption: string, target: string}>}
 */
const symbolMap = new Map([
   ['__global.Application', { caption: 'Application', target: 'https://foundryvtt.com/api/classes/foundry.appv1.api.Application.html' }],
   ['__global.ApplicationHeaderButton', { caption: 'ApplicationHeaderButton', target: 'https://foundryvtt.com/api/types/foundry.ApplicationV1HeaderButton.html' }],
   ['__global.ApplicationOptions', { caption: 'ApplicationOptions', target: 'https://foundryvtt.com/api/interfaces/foundry.ApplicationV1Options.html' }],
   ['__global.foundry.abstract.Document', { caption: 'foundry.abstract.Document', target: 'https://foundryvtt.com/api/classes/foundry.abstract.Document.html' }],
   ['__global.game', { caption: 'game', target: 'https://foundryvtt.com/api/classes/foundry.Game.html' }],
   ['__global.DocumentCollection', { caption: 'DocumentCollection', target: 'https://foundryvtt.com/api/classes/foundry.documents.abstract.DocumentCollection.html' }],
   ['__global.EnrichmentOptions', { caption: 'EnrichmentOptions', target: 'https://foundryvtt.com/api/interfaces/foundry.EnrichmentOptions.html' }],
   ['__global.FavoriteFolder', { caption: 'FavoriteFolder', target: 'https://foundryvtt.com/api/interfaces/foundry.FavoriteFolder.html' }],
   ['__global.Folder', { caption: 'Folder', target: 'https://foundryvtt.com/api/classes/foundry.documents.Folder.html' }],
   ['__global.FontFamilyDefinition', { caption: 'FontFamilyDefinition', target: 'https://foundryvtt.com/api/interfaces/CONFIG.FontFamilyDefinition.html' }],
   ['__global.RollTable', { caption: 'RollTable', target: 'https://foundryvtt.com/api/classes/foundry.documents.RollTable.html' }],
   ['Application', { target: 'https://foundryvtt.com/api/classes/foundry.appv1.api.Application.html' }],
   ['Application.maximize', { target: 'https://foundryvtt.com/api/classes/foundry.appv1.api.Application.html#maximize' }],
   ['Application.minimize', { target: 'https://foundryvtt.com/api/classes/foundry.appv1.api.Application.html#minimize' }],
   ['Application.setPosition', { target: 'https://foundryvtt.com/api/classes/foundry.appv1.api.Application.html#setPosition' }],
   ['ApplicationHeaderButton', { target: 'https://foundryvtt.com/api/types/foundry.ApplicationV1HeaderButton.html' }],
   ['ApplicationOptions', { target: 'https://foundryvtt.com/api/interfaces/foundry.ApplicationV1Options.html' }],
   ['ApplicationOptions.popOut', { target: 'https://foundryvtt.com/api/interfaces/foundry.ApplicationV1Options.html#popOut' }],
   ['ApplicationOptions.title', { target: 'https://foundryvtt.com/api/interfaces/foundry.ApplicationV1Options.html#title' }],
   ['CombatTracker', { target: 'https://foundryvtt.com/api/classes/foundry.applications.sidebar.tabs.CombatTracker.html' }],
   ['FontFamilyDefinition', { target: 'https://foundryvtt.com/api/interfaces/CONFIG.FontFamilyDefinition.html' }],
   ['FormApplication', { target: 'https://foundryvtt.com/api/classes/foundry.appv1.api.FormApplication.html' }],
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