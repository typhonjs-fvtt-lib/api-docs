/**
 * @type {import('rollup').RollupOptions}
 */
export default {
   input: 'src/plugin/foundry-links/index.js',
   external: ['typedoc'],
   output: {
      file: 'dist/plugin/foundry-links/index.js',
      format: 'es',
      generatedCode: { constBindings: true },
      sourcemap: true
   }
};