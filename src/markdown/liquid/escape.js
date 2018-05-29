const { OrderedMap } = require('immutable');
const { escapeWith, unescapeWith } = require('../../utils/escape');

// Replacements for properties escapement
const REPLACEMENTS = OrderedMap([
    [ '\\', '\\\\' ],
    [ '*', '\\*' ],
    [ '#', '\\#' ],
    [ '(', '\\(' ],
    [ ')', '\\)' ],
    [ '[', '\\[' ],
    [ ']', '\\]' ],
    [ '`', '\\`' ],
    [ '_', '\\_' ],
    [ '|', '\\|' ],
    [ '"', '\\"' ],
    [ '\'', '\\\'' ]
]);

module.exports = {
    escape:   (str) => escapeWith(REPLACEMENTS, str),

    // User-inserted slashes have to be escaped first.
    // But they need to be unescaped last as markupit adds slashes itself.
    // So first we unescape the slashes combined with something else and end by unescaping the lone-slashes.
    unescape: (str) => unescapeWith(REPLACEMENTS.reverse(), str)
};
