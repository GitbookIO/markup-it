const { Serializer } = require('../../');

/**
 * Serialize a text node to Asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchKind('text')
    .then(state => {
        const node = state.peek();
        const { text } = node;

        return state
            .shift()
            .write(text);
    });

module.exports = { serialize };
