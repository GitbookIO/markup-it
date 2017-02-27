const { Map } = require('immutable');
const { escapeWith, unescapeWith } = require('../utils/escape');

// Replacements for properties escapement
const REPLACEMENTS = Map([
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
    unescape: (str) => unescapeWith(REPLACEMENTS, str)
};
