import fs      from 'fs-extra';
import upath   from 'upath';

/**
 * Processes TRL runtime & standard libraries along with the Svelte library moving DTS files to `.doc-gen`.
 */
export function processDTS()
{
   fs.emptyDirSync('./.doc-gen');

   processPackageRuntime();
   processPackageRuntimeAmbient();
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
   srcData = srcData.replaceAll(`from '@typhonjs-fvtt/standard/`, `from '#standard/`);
   srcData = srcData.replaceAll(`from 'svelte`, `from '#svelte`);

   fs.writeFileSync(destFilepath, srcData, 'utf-8');
}

/**
 * Processing a module by only including ambient / prepend only data.
 *
 * @param {string}   libname -
 */
function processAmbientPackage(libname)
{
   let srcData = '';
   const destDirPath = `./.doc-gen/${libname}`;
   const destFilePath = `${destDirPath}/index.d.ts`;

   fs.ensureDirSync(destDirPath);

   const prependFilepath = `./prepend/${libname}.js`;
   if (fs.pathExistsSync(prependFilepath))
   {
      srcData = `${fs.readFileSync(prependFilepath, 'utf-8')}\n\n${srcData}`;
   }

   fs.writeFileSync(destFilePath, srcData, 'utf-8');
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
      './types/fvtt-shim/league',
      './types/fvtt-shim/pf2e'
   ];

   // These exports keys have types, but not defined in exports.
   const syntheticTypeKeys = [
      './svelte/application',
      './svelte/application/dialog',   // Need to better define types.
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
}

function processPackageRuntimeAmbient()
{
   // Process ambient GSAP module info.
   processAmbientPackage('#runtime/svelte/animate/gsap/plugin');
   processAmbientPackage('#runtime/svelte/animate/gsap/plugin/bonus');
}

/**
 * Processes the @typhonjs-fvtt/standard NPM package.json and TS declarations.
 */
function processPackageStandard()
{
   const pathNPM = './node_modules/@typhonjs-fvtt/standard';

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
   let svelteTypes = fs.readFileSync('./node_modules/svelte/types/index.d.ts', 'utf-8');

   svelteTypes = svelteTypes.replaceAll('### PRIVATE API', '@internal');
   svelteTypes = svelteTypes.replaceAll('### DO NOT USE!', '@internal');
   svelteTypes = svelteTypes.replaceAll('$capture_state(): void;', '');
   svelteTypes = svelteTypes.replaceAll('$inject_state(): void;', '');

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