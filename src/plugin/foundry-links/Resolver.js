import { Application }  from 'typedoc';

import { resolvers }    from './resolvers/index.js';

export class Resolver
{
   /** @type {Application} */
   #app;

   /**
    * Stores the `globalThis` and `foundry` namespaced symbols that failed to resolve.
    *
    * @type {Set<string>}
    */
   #failed = new Set();

   /**
    * Typedoc version support.
    *
    * @type {{objectReturn: boolean}}
    */
   #supports = {
      objectReturn: false
   };

   /**
    * @param {Application} app - Typedoc application
    */
   constructor(app)
   {
      this.#app = app;

      const version = Application.VERSION.split(/[.-]/);
      this.#supports.objectReturn = +version[1] > 23 || +version[2] >= 26;

      this.#app.converter.addUnknownSymbolResolver(this.#handleUnknownSymbol.bind(this));
   }

   /**
    * Attempts to resolve an unknown symbol against global, script scope, and foundry namespaced symbols.
    *
    * @param {import('typedoc').DeclarationReference} ref - Declaration reference.
    *
    * @returns {import('typedoc').ExternalResolveResult | string | void} Resolve result.
    */
   #handleUnknownSymbol(ref)
   {
      if (ref.moduleSource === 'typescript' || (!ref.moduleSource && ref.resolutionStart === "global"))
      {
         const name = ref.symbolReference?.path?.map((path) => path.path).join('.');

         if (!name) { return; }

         let result;

         for (const resolver of resolvers) { result = resolver(name); }

         if (!result && !this.#failed.has(name))
         {
            this.#failed.add(name);
            this.#app.logger.verbose(`[typedoc-plugin-foundry-links]: Failed to resolve type: ${name}`);
         }

         if (this.#supports.objectReturn && result)
         {
            return {
               target: result,
               caption: name,
            };
         }

         return result;
      }
   }
}

/**
 * @typedef {(string) => string | void} ResolverFunction
 */

/**
 * @typedef {import('typedoc').ExternalResolveResult | string | void} ResolveResult
 */