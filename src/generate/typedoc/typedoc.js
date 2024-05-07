import {
   Application,
   LogLevel,
   TSConfigReader }        from 'typedoc';

import {
   entryPoints,
   groupOrder,
   kindSortOrder,
   navigationLinks,
   searchGroupBoosts }     from './options/index.js';

/**
 * Generate docs from TS declarations in `.doc-gen`.
 *
 * @param {LogLevel} [logLevel=LogLevel.Info] The log level to use when generating Typedoc documentation.
 *
 * @returns {Promise<void>}
 */
export async function typedoc(logLevel = LogLevel.Verbose)
{
   const app = await Application.bootstrapWithPlugins({
      name: 'TyphonJS Runtime Library (FVTT) 0.2.0-next.1',

      // Provide a link for the title / name.
      // titleLink: '',

      // Disables the source links as they reference the d.ts files.
      disableSources: true,

      // Sets favicon.
      dmtFavicon: './assets/icons/favicon.ico',

      // Replaces 'Module' for 'Package'.
      dmtModuleRemap: {
         isPackage: true
      },

      // Add service icon links in toolbar.
      dmtLinksService: {
         "Discord": "https://typhonjs.io/discord/",
         "GitHub": "https://github.com/typhonjs-fvtt-lib/typhonjs",
         "NPM": "https://www.npmjs.com/package/@typhonjs-fvtt/runtime"
      },

      entryPoints,
      entryPointStrategy: 'expand',

      // Excludes any @internal marked symbols.
      excludeInternal: true,

      // Excludes any private members including the `#private;` member added by Typescript.
      excludePrivate: true,

      // For external API linking for @link tags.
      // externalSymbolLinkMappings,

      // For Typedoc v0.24+; sorts the main index for a module / package; not the sidebar tab.
      groupOrder,

      // Sorts the sidebar symbol types.
      kindSortOrder,

      // Hide the documentation generator footer.
      hideGenerator: true,

      // Sets log level.
      logLevel,

      // Provides sidebar links.
      navigationLinks,

      // Output directory for the generated documentation
      out: 'docs',

      plugin: [
         '@typhonjs-typedoc/typedoc-theme-dmt',
         '@typhonjs-typedoc/ts-lib-docs/typedoc/ts-links/dom/2023',
         '@typhonjs-typedoc/ts-lib-docs/typedoc/ts-links/esm/2023',
         './dist/plugin/foundry-links/index.cjs',
      ],

      // Boosts relevance for classes and function in search.
      searchGroupBoosts,

      theme: 'default-modern',

      // Only show the `inherited` & `protected` filters.
      visibilityFilters: {
         inherited: true,
         protected: true
      }
   }, [new TSConfigReader()]);

   // Convert TypeScript sources to a TypeDoc ProjectReflection
   const project = await app.convert();

   // Generate the documentation
   if (project)
   {
      await app.generateDocs(project, 'docs');
   }
   else
   {
      console.error('Error: No project generated');
   }
}