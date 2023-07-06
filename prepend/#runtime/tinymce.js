/**
 * This subpath export loads the TyphonJS oEmbed plugin for TinyMCE allowing video embeds from YouTube and Vimeo.
 *
 * The oEmbed plugin is automatically added to the `mceConfig` field when you use the TJSTinyMCE Svelte component and
 * select the standard or TJS variants.
 *
 * You must use `import '#runtime/tinymce';` in your main `index.js` / entry point.
 *
 * Note: On Foundry VTT there is server side sanitation and video embeds will be stripped. You must store any
 * editor data in flags.
 *
 * Please see the `TJSTinyMCE` Svelte component for more information.
 *
 * @module #runtime/tinymce
 */