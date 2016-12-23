const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize a paragraph node to asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.PARAGRAPH)
    .then((state) => {
        const node = state.peek();
        const inner = state.use('inline').serialize(node.nodes);

        return state
            .shift()
            .write(`${inner}\n\n`);
    });


module.exports = { serialize };
