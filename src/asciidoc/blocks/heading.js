const { Serializer, BLOCKS } = require('../../');

const TYPES = [
    BLOCKS.HEADING_1,
    BLOCKS.HEADING_2,
    BLOCKS.HEADING_3,
    BLOCKS.HEADING_4,
    BLOCKS.HEADING_5,
    BLOCKS.HEADING_6
];

/**
 * Serialize an heading node to asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(TYPES)
    .then((state) => {
        const node = state.peek();
        const { type, data } = node;
        const id = data.get('id');

        const depth = TYPES.indexOf(type);
        const prefix = Array(depth + 2).join('=');

        const inner = state.use('inline').serialize(node.nodes);
        const prefixID = id ? `[[${id}]]\n` : '';

        return state
            .shift()
            .write(`${prefixID}${prefix} ${inner}\n\n`);
    });


module.exports = { serialize };
