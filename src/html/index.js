import blocks from './blocks';
import inlines from './inlines';
import document from './document';
import ignoreNode from './ignoreNode';

const ALL = [
    ...blocks,
    ...inlines,
    ignoreNode // Default catch-all rule
];

// We don't use groups of rules such as 'block' and 'inline' for
// deserialization, because we have a single deserialization rule 'document'.
//
// For serialization, there is no ambiguity in the Slate
// format, so we always use all the rules at the same time.
export default {
    document: [document],
    block: ALL
};
