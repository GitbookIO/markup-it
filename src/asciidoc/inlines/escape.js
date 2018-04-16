const entities = require('entities');
const { Map } = require('immutable');
const { Serializer, MARKS } = require('../../');
const { escapeWith } = require('../../utils/escape');

// Replacements for Asciidoc escaping
const REPLACEMENTS = Map([
    [ '*', '\\*' ],
    [ '#', '\\#' ],
    [ '(', '\\(' ],
    [ ')', '\\)' ],
    [ '[', '\\[' ],
    [ ']', '\\]' ],
    [ '`', '\\`' ],
    [ '<', '&lt;' ],
    [ '>', '&gt;' ],
    [ '_', '\\_' ],
    [ '|', '\\|' ],
    [ '{', '\\{' ],
    [ '}', '\\}' ]
]);

/**
 * Escape a string to asciidoc.
 * @param {String} text
 * @return {String}
 */
function escape(text) {
    text = escapeWith(REPLACEMENTS, text);
    return entities.encodeXML(text);
}

/**
 * Escape all text leaves during serialization.
 * This step should be done before processing text leaves for marks.
 *
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformText((state, leaf) => {
        const { text, marks } = leaf;
        const hasCode = marks.some(mark => mark.type === MARKS.CODE);

        return leaf.merge({
            text: hasCode ? text : escape(text, false)
        });
    });

module.exports = { serialize };
