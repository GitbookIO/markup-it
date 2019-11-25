import block from './blocks';
import inline from './inlines';
import document from './document';

export const MarkdownParser = {
    document: [document],
    inline,
    block
};
