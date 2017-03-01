const blocks = require('./blocks');
const inlines = require('./inlines');
const document = require('./document');
const serializeDefault = require('./serializeDefault');

const ALL = [
    ...blocks,
    ...inlines,
    serializeDefault // Default catch-all rule
];

// We don't use groups of rules such as 'block' and 'inline' for
// deserialization, because we have a single deserialization rule 'document'.
//
// For serialization, there is no has no ambiguity in the Slate
// format, so we always use all the rules at the same time.
module.exports = {
    document: [document],
    block: ALL
};
