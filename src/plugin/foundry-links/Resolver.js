import {
   Application,
   Converter,
   ProjectReflection,
   ReflectionKind,
   RendererEvent }                     from 'typedoc';

import { discoverAllReferenceTypes }   from '../../../node_modules/typedoc/dist/lib/utils/reflections.js';

import { resolvers }                   from './resolvers/index.js';

import { fvttNamespaceMap }            from './fvttNamespaceMap.js';

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
      objectReturn: true
   };

   /**
    * @param {Application} app - Typedoc application
    */
   constructor(app)
   {
      this.#app = app;

      this.#app.converter.addUnknownSymbolResolver(this.#handleUnknownSymbol.bind(this));

      // Convert all non-reflection reference types that don't have types defined.
      // `fvttNamespaceMap` will change the names of all shimmed Foundry types.
      this.#app.converter.on(Converter.EVENT_END, (event) =>
      {
         for (const { type } of discoverAllReferenceTypes(event.project, false))
         {
            if (!type.reflection && fvttNamespaceMap.has(type?.name)) { type.name = fvttNamespaceMap.get(type.name); }
         }
      });

      this.#app.renderer.on(RendererEvent.END, () =>
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

         const nameInitial = symbolPath?.map((path) => path.path).join('.');

         if (!nameInitial) { return; }

         let result;

         for (const resolver of resolvers)
         {
            result = resolver(nameInitial);
            if (result) { break; }
         }

         const fullName = `${ref.moduleSource}/${nameInitial}`;

         if (!result && !this.#failed.has(fullName))
         {
            this.#failed.set(fullName, `[link-resolver] ${nameInitial} from ${ref.moduleSource} in ${
             this.#getSymbolName(refl)} (${ReflectionKind.singularString(refl.kind)})`);
         }

         return result;
      }
   }
}
