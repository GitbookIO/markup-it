const { Serializer, BLOCKS } = require('../../');

// Key to store the current table align in the state
const ALIGN = 'current_table_align';

// Key to indicate that the current row is a header
const THEAD = 'next_row_is_header';

// Key to indicate the current column index
const COL = 'current_column';

/**
 * Serialize a table to HTML
 * @type {Serializer}
 */
const table = {
    serialize: Serializer()
        .matchType(BLOCKS.TABLE)
        .then(state => {
            const tableNode = state.peek();
            const align = tableNode.data.get('align');
            const rows = tableNode.nodes;

            const headerText = state
                      .setProp(ALIGN, align)
                      .setProp(COL, 0)
                      .setProp(THEAD, true)
                      .serialize(rows.slice(0, 1));

            const bodyText = state
                      .setProp(ALIGN, align)
                      .setProp(COL, 0)
                      .serialize(rows.rest());

            return state
                .shift()
                .write([
                    '<table>',
                    '<thead>',
                    headerText + '</thead>',
                    '<tbody>',
                    bodyText + '</tbody>',
                    '</table>',
                    '\n'
                ].join('\n'));
        })
};

/**
 * Serialize a row to HTML
 * @type {Serializer}
 */
const row = {
    serialize: Serializer()
        .matchType(BLOCKS.TABLE_ROW)
        .then(state => {
            const node = state.peek();
            const inner = state
                      .setProp(COL, 0)
                      .serialize(node.nodes);

            return state
                .shift()
                .write(`<tr>\n${inner}</tr>\n`);
        })
};

/**
 * Serialize a table cell to HTML
 * @type {Serializer}
 */
const cell = {
    serialize: Serializer()
        .matchType(BLOCKS.TABLE_CELL)
        .then(state => {
            const node = state.peek();
            const isHead = state.getProp(THEAD);
            const align = state.getProp(ALIGN);
            const column = state.getProp(COL);
            const cellAlign = align[column];

            const inner = state.serialize(node.nodes);

            const tag = isHead ? 'th' : 'td';
            const style = cellAlign
                ? ` style="text-align:${cellAlign}"`
                : '';

            return state
                .shift()
                .setProp(COL, column + 1)
                .write(`<${tag}${style}>${inner}</${tag}>\n`);
        })
};

module.exports = {
    table,
    row,
    cell
};
