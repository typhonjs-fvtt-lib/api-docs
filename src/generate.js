import fs               from 'fs-extra';
import path             from 'path';

import { getFileList }  from '@typhonjs-utils/file-util';

import {
   Application,
   Logger,
   LogLevel,
   TypeDocReader,
   TSConfigReader }     from 'typedoc';

// node_modules/@typhonjs-fvtt/runtime/package.json
// node_modules/@typhonjs-fvtt/svelte-standard/package.json

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

fs.emptyDirSync('./.doc-gen');

processPackageSvelte();

await typedoc();

/**
 * Prepends data from `prependPath` to source data writing to `destPath`.
 *
 * @param {string}   srcFilepath - Source file path.
 *
 * @param {string}   destFilepath - Destination file path.
 *
 * @param {string}   prependFilepath - Prepend file path.
 */
function prependFile(srcFilepath, destFilepath, prependFilepath)
{
   const srcData = fs.readFileSync(srcFilepath, 'utf-8');
   const prependData = fs.readFileSync(prependFilepath, 'utf-8');

   fs.writeFileSync(destFilepath, `${prependData}\n\n${srcData}`, 'utf-8');
}

/**
 * Processes the Svelte NPM package.json and TS declarations.
 */
function processPackageSvelte()
{
   const pathNPMSvelte = './node_modules/svelte';

   const packageSvelte = JSON.parse(fs.readFileSync('./node_modules/svelte/package.json', 'utf-8'));

   const svelteIgnoreKeys = [
      './package.json',
      './compiler',
      './elements',
      './internal',
      './motion', // Motion needs to be bundled as it references local d.ts files.
      './register',
      './ssr'
   ];

   for (const [key, value] of Object.entries(packageSvelte.exports))
   {
      if (svelteIgnoreKeys.includes(key)) { continue; }
      if (typeof value.types !== 'string') { continue; }

      const svelteLib = key === '.' ? 'svelte' : `svelte/${key.substring(2)}`;

      const srcFilePath = path.resolve(pathNPMSvelte, value.types);
      const destDirPath = path.resolve('./.doc-gen/external', svelteLib);
      const destFilePath = `${destDirPath}/index.d.ts`;

      fs.ensureDirSync(destDirPath);

      prependFile(srcFilePath, destFilePath, `./prepend/${svelteLib}.js`);
   }
}

/**
 * Generate docs from TS declarations in `.doc-gen`.
 *
 * @returns {Promise<void>}
 */
async function typedoc()
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
