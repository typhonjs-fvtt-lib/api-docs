import fs      from 'fs-extra';
import upath   from 'upath';

/**
 * Processes TRL runtime & standard libraries along with the Svelte library moving DTS files to `.doc-gen`.
 */
export function processDTS()
{
   fs.emptyDirSync('./.doc-gen');

   processPackageRuntime();
   processPackageStandard();
   processPackageSvelte();
}

/**
 * Processes all DTS files while copying from the original library to `.doc-gen`. There are two processing steps:
 *
 * 1. If there is a matching file in `./prepend/<export library name>/index.js` that file is prepended to the DTS file.
 *
 * 2. All import references to `@typhonjs-fvtt/runtime`, `@typhonjs-fvtt/standard`, and `svelte` are replaced with
 *    local `imports` from `package.json`. This links all copied declarations together locally and will link symbols
 *    across packages.
 *
 * Prepends data from `prependPath` to source data writing to `destPath`.
 *
 * @param {string}   srcFilepath - Source file path.
 *
 * @param {string}   destFilepath - Destination file path.
 *
 * @param {string}   libName - The name of the subpath export.
 */
function processDTSFile(srcFilepath, destFilepath, libName)
{
   let srcData = fs.readFileSync(srcFilepath, 'utf-8');

   // Prepend header data from local `./prepend` folder.
   const prependFilepath = `./prepend/${libName}.js`;
   if (fs.pathExistsSync(prependFilepath))
   {
      srcData = `${fs.readFileSync(prependFilepath, 'utf-8')}\n\n${srcData}`;
   }

   // Substitute imported declarations to local `imports` from `package.json`.
   srcData = srcData.replaceAll(`from '@typhonjs-fvtt/runtime/`, `from '#runtime/`);
   srcData = srcData.replaceAll(`from '@typhonjs-fvtt/svelte-standard/`, `from '#standard/`);
   srcData = srcData.replaceAll(`from 'svelte`, `from '#svelte`);

   fs.writeFileSync(destFilepath, srcData, 'utf-8');
}

/**
 * Processes the @typhonjs-fvtt/runtime NPM package.json and TS declarations.
 */
function processPackageRuntime()
{
   const pathNPM = './node_modules/@typhonjs-fvtt/runtime';

   const packageJSON = JSON.parse(fs.readFileSync(`${pathNPM}/package.json`, 'utf-8'));

   const ignoreKeys = [
      './package.json',
      './rollup',
      './color/colord',             // Special handling / use index-bundled.d.ts
      './color/colord/plugins/*'    // Need to figure out how to handle declare module types.
   ];

   // These exports keys have types, but not defined in exports.
   const syntheticTypeKeys = [
      './svelte/application',
      './svelte/application/dialog',   // Need to better define types.
      './svelte/application/legacy'
   ];

   for (const [key, value] of Object.entries(packageJSON.exports))
   {
      if (ignoreKeys.includes(key)) { continue; }

      // Synthetically provide `value.types` from the import.
      if (syntheticTypeKeys.includes(key)) { value.types = upath.changeExt(value.import, '.d.ts'); }

      if (typeof value.types !== 'string') { continue; }

      const libName = `#runtime/${key.substring(2)}`;

      const srcFilePath = upath.resolve(pathNPM, value.types);
      const destDirPath = upath.resolve('./.doc-gen/', `${libName}`);
      const destFilePath = `${destDirPath}/index.d.ts`;

      fs.ensureDirSync(destDirPath);

      processDTSFile(srcFilePath, destFilePath, libName);
   }

   // Process colord separately --------------------------------------------------------------------------------------

   const libName = '#runtime/color/colord';
   const srcFilePath = './node_modules/@typhonjs-fvtt/runtime/_dist/color/colord/index-bundled.d.ts'
   const destDirPath = './.doc-gen/#runtime/color/colord';
   const destFilePath = `${destDirPath}/index.d.ts`;

   fs.ensureDirSync(destDirPath);

   processDTSFile(srcFilePath, destFilePath, libName);

}

/**
 * Processes the @typhonjs-fvtt/runtime NPM package.json and TS declarations.
 */
function processPackageStandard()
{
   const pathNPM = './node_modules/@typhonjs-fvtt/svelte-standard';

   const packageJSON = JSON.parse(fs.readFileSync(`${pathNPM}/package.json`, 'utf-8'));

   const ignoreKeys = [
      './package.json',
   ];

   for (const [key, value] of Object.entries(packageJSON.exports))
   {
      if (ignoreKeys.includes(key)) { continue; }
      if (typeof value.types !== 'string') { continue; }

      const libName = `standard/${key.substring(2)}`;

      const srcFilePath = upath.resolve(pathNPM, value.types);
      const destDirPath = upath.resolve('./.doc-gen/', `#${libName}`);
      const destFilePath = `${destDirPath}/index.d.ts`;

      fs.ensureDirSync(destDirPath);

      processDTSFile(srcFilePath, destFilePath, libName);
   }
}

/**
 * Processes the Svelte NPM package.json and TS declarations.
 */
function processPackageSvelte()
{
   const svelteTypes = fs.readFileSync('./node_modules/svelte/types/index.d.ts', 'utf-8');

   // const regex = /declare module '([^']*)' \{([^}]*)}/gs;
   const regex = /declare module '([^']*)' \{((?:[^d]|d(?!eclare module))+)}/gs;

   const modules = new Set([
      'svelte',
      'svelte/action',
      'svelte/animate',
      'svelte/easing',
      'svelte/motion',
      'svelte/store',
      'svelte/transition'
   ]);

   let match;

   while ((match = regex.exec(svelteTypes)) !== null)
   {
      const libName = match[1];
      let libTypes = match[2];

      if (modules.has(libName))
      {
         // Special handling for 'svelte' module.
         if (libName === 'svelte')
         {
            libTypes = libTypes.replace('class SvelteComponent_1', 'declare class SvelteComponent_1');
         }

         const destDirPath = upath.resolve('./.doc-gen', libName);
         const destFilePath = `${destDirPath}/index.d.ts`;

         fs.ensureDirSync(destDirPath);

         // Prepend header data from local `./prepend` folder.
         const prependFilepath = `./prepend/${libName}.js`;
         if (fs.pathExistsSync(prependFilepath))
         {
            libTypes = `${fs.readFileSync(prependFilepath, 'utf-8')}\n\n${libTypes}`;
         }

         fs.writeFileSync(destFilePath, libTypes, 'utf-8');
      }
   }
}