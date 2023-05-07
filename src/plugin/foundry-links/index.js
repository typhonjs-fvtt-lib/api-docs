import { Resolver } from './Resolver.js';

/**
 * Provides a plugin for Typedoc to link Foundry VTT global and sript scoped API to Foundry documentation.
 *
 * @param {import('typedoc').Application} app - Typedoc Application
 */
export function load(app)
{
   new Resolver(app);
}

