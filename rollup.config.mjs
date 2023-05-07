import resolve          from '@rollup/plugin-node-resolve';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
   input: 'src/plugin/foundry-links/index.js',
   external: ['typedoc'],
   plugins: [
      // resolve()
   ],
   output: {
      file: 'dist/plugin/foundry-links/index.cjs',
      format: 'cjs',
      generatedCode: { constBindings: true },
      sourcemap: true
   }
};