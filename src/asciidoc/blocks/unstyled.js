const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize a text node to asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TEXT)
    .then((state) => {
        const node = state.peek();
        const inner = state.use('inline').serialize(node.nodes);

        return state
            .shift()
            .write(`${inner}\n`);
    });


module.exports = { serialize };
