/**
 * @type {Map<string, string>}
 */
export const fvttNamespaceMap = new Map([
   ['fvtt.ClientDocument', 'Document'],
   ['ClientDocument', 'Document'],

   ['fvtt.Document', 'Document'],
   ['FVTTDocument', 'Document'],

   ['fvtt.DocumentCollection', 'DocumentCollection'],
   ['FVTTDocumentCollection', 'DocumentCollection'],

   ['fvtt.DocumentConstructor', 'DocumentConstructor'],
   ['FVTTDocumentConstructor', 'DocumentConstructor'],

   ['fvtt.EmbeddedCollection', 'EmbeddedCollection'],
   ['FVTTEmbeddedCollection', 'EmbeddedCollection'],
]);

/**
 * type FVTTDocument = foundry.abstract.Document;
 * type FVTTDocumentConstructor = DocumentConstructorOf<foundry.abstract.Document> & typeof foundry.abstract.Document;
 * type FVTTDocumentCollection = DocumentCollection<any>;
 * type FVTTEmbeddedCollection = foundry.abstract.EmbeddedCollection<any>;
 */