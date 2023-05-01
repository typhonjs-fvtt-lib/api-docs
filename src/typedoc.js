import { getFileList }  from '@typhonjs-utils/file-util';

import {
   Application,
   Logger,
   LogLevel,
   TypeDocReader,
   TSConfigReader }     from 'typedoc';

/**
 * Create a custom Typedoc logger.
 */
class CustomLogger extends Logger
{
   log(message, level)
   {
      console.log(`${level}: ${message}`);
   }
}

/**
 * Generate docs from TS declarations in `.doc-gen`.
 *
 * @returns {Promise<void>}
 */
export async function typedoc()
{
   const entryPoints = await getFileList({ dir: './.doc-gen' });

   // Create a new TypeDoc application instance
   const app = new Application();

   // Set the custom logger
   app.logger = new CustomLogger();
   app.logger.level = LogLevel.Verbose;

   // Set TypeDoc options
   app.options.addReader(new TypeDocReader());
   app.options.addReader(new TSConfigReader());

   app.bootstrap({
      entryPoints,
      out: 'docs', // Output directory for the generated documentation
      plugin: ['typedoc-theme-yaf'],
      theme: 'yaf'
   });

   // Convert TypeScript sources to a TypeDoc ProjectReflection
   const project = app.convert();

   // Generate the documentation
   if (project)
   {
      return app.generateDocs(project, 'docs');
   }
   else
   {
      console.error('Error: No project generated');
   }
}
