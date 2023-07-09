import {
   Application,
   LogLevel,
   TSConfigReader }        from 'typedoc';

import {
   entryPoints,
   externalSymbolLinkMappings,
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
   // Create a new TypeDoc application instance
   const app = new Application();

   // Set TypeDoc options
   app.options.addReader(new TSConfigReader());

   await app.bootstrapWithPlugins({
      name: 'TyphonJS Runtime Library (FVTT)',

      // Provide a link for the title / name.
      // titleLink: '',

      // Disables the source links as they reference the d.ts files.
      disableSources: true,

      // Sets favicon.
      dmtFavicon: './assets/icons/favicon.ico',

      // Removes the default module page including from navigation & breadcrumbs
      dmtRemoveDefaultModule: true,

      // Removes the top level navigation sidebar namespace SVG icon associated with the sub-path exports.
      dmtRemoveNavTopLevelIcon: true,

      entryPoints,
      entryPointStrategy: 'expand',

      // Excludes any private members including the `#private;` member added by Typescript.
      excludePrivate: true,

      // For external API linking for @link tags.
      // externalSymbolLinkMappings,

      // For Typedoc v0.24+; sorts the main index for a namespace; not the sidebar tab.
      groupOrder,

      // Sorts the sidebar symbol types.
      kindSortOrder,

      // Hide the documentation generator footer.
      hideGenerator: true,

      // Sets log level.
      logLevel,

      // New option in 0.24.8 required to render full navigation tree.
      navigation: {
         fullTree: true
      },

      // Provides links for the top nav bar
      navigationLinks,

      // Output directory for the generated documentation
      out: 'docs',

      plugin: [
         'S:\\program\\Javascript\\projects\\TyphonJS\\typhonjs-typedoc\\typedoc-theme-dmt\\dist\\index.js',
         './dist/plugin/foundry-links/index.cjs',
         // 'typedoc-plugin-coverage'
      ],

      // Boosts relevance for classes and function in search.
      searchGroupBoosts,

      theme: 'default-modern',

      // Only show the `inherited` filter.
      visibilityFilters: {
         inherited: true,
      }
   });

   // Convert TypeScript sources to a TypeDoc ProjectReflection
   const project = app.convert();

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