import {
   Application,
   ProjectReflection,
   ReflectionKind,
   RendererEvent }   from 'typedoc';

import { resolvers } from './resolvers/index.js';

export class Resolver
{
   /** @type {[]} */
   static #emptyArray = [];

   /** @type {Application} */
   #app;

   /**
    * Stores the symbols that failed to resolve.
    *
    * @type {Map<string, string>}
    */
   #failed = new Map();

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

      this.#app.renderer.once(RendererEvent.END, () =>
      {
         if (this.#failed.size)
         {
            this.#app.logger.warn('[link-resolver] Failed to resolve the following reflections / types:');

            const keys = [...this.#failed.keys()].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
            for (const key of keys) { this.#app.logger.warn(this.#failed.get(key)); }
         }
      });
   }

   /**
    * @param {import('typedoc').Reflection}  reflection -
    *
    * @returns {string} The fully qualified symbol name.
    */
   #getSymbolName(reflection)
   {
      const parts = [];

      while (reflection)
      {
         // Do not include the project reflection.
         if (reflection instanceof ProjectReflection) { break; }

         parts.unshift(reflection.name);
         reflection = reflection.parent;
      }

      return parts.join('.');
   }

   /**
    * Attempts to resolve an unknown symbol against global, script scope, and foundry namespaced symbols.
    *
    * @param {import('typedoc').DeclarationReference} ref - Unknown symbol reference.
    *
    * @param {import('typedoc').Reflection}  refl - Source reflection.
    *
    * @returns {import('typedoc').ExternalResolveResult | string | void} Resolve result.
    */
   #handleUnknownSymbol(ref, refl)
   {
      if (ref.moduleSource)
      {
         const symbolPath = ref.symbolReference?.path ?? Resolver.#emptyArray;

         const name = symbolPath?.map((path) => path.path).join('.');

         if (!name) { return; }

         let result;

         for (const resolver of resolvers) { result = resolver(name); }

         const fullName = `${ref.moduleSource}/${name}`;

         if (!result && !this.#failed.has(fullName))
         {
            this.#failed.set(fullName, `[link-resolver] ${name} from ${ref.moduleSource} in ${
             this.#getSymbolName(refl)} (${ReflectionKind.singularString(refl.kind)})`);
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
