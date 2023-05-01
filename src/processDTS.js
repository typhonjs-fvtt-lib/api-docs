import fs               from 'fs-extra';
import path             from 'path';

// node_modules/@typhonjs-fvtt/runtime/package.json
// node_modules/@typhonjs-fvtt/svelte-standard/package.json

/**
 * Processes TRL runtime & standard libraries along with the Svelte library moving DTS files to `.doc-gen`.
 */
export function processDTS()
{
   fs.emptyDirSync('./.doc-gen');

   processPackageSvelte();
}

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
