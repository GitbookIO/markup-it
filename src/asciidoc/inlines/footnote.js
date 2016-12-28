const { Map } = require('immutable');
const { Serializer, INLINES } = require('../../');

/**
 * Serialize a footnote to asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.FOOTNOTE_REF)
    .then((state) => {
        const footnotes = state.getProp('footnotes') || Map();
        const node = state.peek();
        const id = node.data.get('id');

        const inner = footnotes.get(id);

        if (!inner) {
            return state.shift();
        }

        return state
            .shift()
            .write(`footnote:[${inner}]`);
    });

module.exports = { serialize };
