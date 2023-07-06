/**
 * Documentation: {@link https://github.com/omgovich/colord#plugins}
 *
 * There are several `colord` plugins that extend `colord` for additional color formats. These plugins are available
 * as wildcard imports from this sub-path export. It is worth mentioning that `colord` does not provide accurate support
 * for advanced color formats as the intermediary internal format is `RGBA` and a loss of precision occurs internally.
 *
 * Note: For the time being `colord` provides the best API / support for working with color with Javascript. It
 * however may not be the long term solution for TRL.
 *
 * To extend `colord` with a particular plugin:
 * @example
 * import { colord, extend }  from '#runtime/color/colord';
 * import a11yPlugin          from "#runtime/color/colord/plugins/a11y";
 *
 * extend([a11yPlugin]);
 *
 * @module #runtime/color/colord/plugins
 */