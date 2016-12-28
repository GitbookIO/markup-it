const trimRight = require('trim-right');
const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize a table cell node to asciidoc.
 * @type {Serializer}
 */
const serializeCell = Serializer()
    .matchType(BLOCKS.TABLE_CELL)
    .then((state) => {
        const node = state.peek();
        const inner = state.use('inline').serialize(node.nodes);

        return state
            .shift()
            .write(`|${inner} `);
    });

/**
 * Serialize a table row node to asciidoc.
 * @type {Serializer}
 */
const serializeRow = Serializer()
    .matchType(BLOCKS.TABLE_ROW)
    .then((state) => {
        const node = state.peek();
        const inner = state.use('block').serialize(node.nodes);

        return state
            .shift()
            .write(`${trimRight(inner)}\n`);
    });

/**
 * Serialize a table node to asciidoc.
 * @type {Serializer}
 */
const serializeTable = Serializer()
    .matchType(BLOCKS.TABLE)
    .then((state) => {
        const node = state.peek();
        const inner = state.use('block').serialize(node.nodes);

        return state
            .shift()
            .write(`[cols=",",options="header",]\n|======\n${trimRight(inner)}\n|======`);
    });

const serialize = Serializer()
    .use([
        serializeTable,
        serializeRow,
        serializeCell
    ]);

module.exports = { serialize };
