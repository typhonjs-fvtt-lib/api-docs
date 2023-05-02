import fs               from 'fs-extra';
import upath            from 'upath';

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

   let prependData = '';

   if (fs.pathExistsSync(prependFilepath))
   {
      prependData = `${fs.readFileSync(prependFilepath, 'utf-8')}\n\n`;
   }

   fs.writeFileSync(destFilepath, `${prependData}${srcData}`, 'utf-8');
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
      './color/colord',             // Needs bundled types.
      './color/colord/plugins/*',   // Test eventually if namespace aspects work in combination.
      './plugin/manager'            // Needs bundled types.
   ];

   // These exports keys have types, but not defined in exports.
   const syntheticTypeKeys = [
      './svelte/application',
      // './svelte/application/dialog',   // Need to better define types.
      // './svelte/application/legacy'    // Need to better define types.
   ]

   for (const [key, value] of Object.entries(packageJSON.exports))
   {
      if (ignoreKeys.includes(key)) { continue; }

      // Synthetically provide `value.types` from the import.
      if (syntheticTypeKeys.includes(key)) { value.types = upath.changeExt(value.import, '.d.ts'); }

      if (typeof value.types !== 'string') { continue; }

      const libName = `runtime/${key.substring(2)}`;

      const srcFilePath = upath.resolve(pathNPM, value.types);
      const destDirPath = upath.resolve('./.doc-gen/', libName);
      const destFilePath = `${destDirPath}/index.d.ts`;

      fs.ensureDirSync(destDirPath);

      prependFile(srcFilePath, destFilePath, `./prepend/${libName}.js`);
   }
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
      const destDirPath = upath.resolve('./.doc-gen/', libName);
      const destFilePath = `${destDirPath}/index.d.ts`;

      fs.ensureDirSync(destDirPath);

      prependFile(srcFilePath, destFilePath, `./prepend/${libName}.js`);
   }
}

/**
 * Processes the Svelte NPM package.json and TS declarations.
 */
function processPackageSvelte()
{
   const pathNPM = './node_modules/svelte';

   const packageJSON = JSON.parse(fs.readFileSync(`${pathNPM}/package.json`, 'utf-8'));

   const ignoreKeys = [
      './package.json',
      './compiler',
      './elements',
      './internal',
      './motion', // Motion needs to be bundled as it references local d.ts files.
      './register',
      './ssr'
   ];

   for (const [key, value] of Object.entries(packageJSON.exports))
   {
      if (ignoreKeys.includes(key)) { continue; }
      if (typeof value.types !== 'string') { continue; }

      const libName = key === '.' ? 'svelte' : `svelte/${key.substring(2)}`;

      const srcFilePath = upath.resolve(pathNPM, value.types);
      const destDirPath = upath.resolve('./.doc-gen/external', libName);
      const destFilePath = `${destDirPath}/index.d.ts`;

      fs.ensureDirSync(destDirPath);

      prependFile(srcFilePath, destFilePath, `./prepend/${libName}.js`);
   }
}