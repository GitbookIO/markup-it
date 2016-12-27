const trimRight = require('trim-right');
const { Serializer, BLOCKS } = require('../../');

const BULLETS = {
    [BLOCKS.UL_LIST]: '*',
    [BLOCKS.OL_LIST]: '.'
};

/**
 * Serialize a list item to asciidoc.
 * @type {Serializer}
 */
const serializeItem = Serializer()
    .matchType(BLOCKS.LIST_ITEM)
    .then((state) => {
        const node = state.peek();
        const { nodes } = node;

        const listType = state.getProp('listType');
        const listDepth = state.getProp('listDepth');

        const bullet = BULLETS[listType];
        const prefix = Array(listDepth + 1).join(bullet);

        const inner = state
            .use('block')
            .serialize(nodes);

        return state
            .shift()
            .write(`${prefix} ${trimRight(inner)}\n`);
    });

/**
 * Serialize a list node to asciidoc.
 * @type {Serializer}
 */
const serializeList = Serializer()
    .matchType([
        BLOCKS.UL_LIST,
        BLOCKS.OL_LIST
    ])
    .then((state) => {
        const node = state.peek();
        const { nodes, type } = node;

        const inner = state
            .use('block')
            .setProp('listType', type)
            .setProp('listDepth', state.getProp('listDepth', 0) + 1)
            .serialize(nodes);

        return state
            .shift()
            .write(`${inner}\n\n`);
    });

const serialize = Serializer()
    .use([
        serializeList,
        serializeItem
    ]);

module.exports = { serialize };
