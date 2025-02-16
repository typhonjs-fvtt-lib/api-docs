import { getFileList } from '@typhonjs-utils/file-util';

/**
 * Provides all entry points for generating documentation. You must set the `entryPointStrategy` to `resolve`.
 *
 * @returns {Promise<string[]>}
 */
export async function entryPoints()
{
   const result = await getFileList({ dir: './.doc-gen', resolve: true, walk: true });

   // For TypeDoc to properly generate the re-exported symbols from this package it must be located before
   // other packages that re-export symbols from this package.
   const index = result.findIndex((entry) => entry.includes('#runtime/svelte/store/reducer/array-object/index.d.ts'));

   if (index >= 0)
   {
      const entry = result[index];
      result.splice(index, 1);
      result.unshift(entry);
   }

   return result;
}

// NOTE OLD ENTRY POINT DATA JUST FOR REFERENCE

// /**
//  * Provides the main entry points for generating documentation. You must set the `entryPointStrategy` to `expand`.
//  *
//  * @type {string[]}
//  */
// export const entryPoints = [
//    './.doc-gen/#runtime',
//    './.doc-gen/#standard',
//    './.doc-gen/svelte'
// ];
