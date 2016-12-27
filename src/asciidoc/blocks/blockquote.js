const trimRight = require('trim-right');
const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize a blockquote node to asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.BLOCKQUOTE)
    .then((state) => {
        const node = state.peek();
        const inner = state.use('block').serialize(node.nodes);

        return state
            .shift()
            .write(`___________\n${trimRight(inner)}\n___________\n\n`);
    });


module.exports = { serialize };
