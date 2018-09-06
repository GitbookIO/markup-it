import { Serializer, BLOCKS } from '../../';

// Key to store the current table aligns in the state
const ALIGNS = 'current_table_aligns';

// Key to indicate that the current row is a header
const THEAD = 'next_row_is_header';

// Key to indicate the current column index
const COL = 'current_column';

/**
 * Serialize a table to HTML
 * @type {Serializer}
 */
const serializeTable = {
    serialize: Serializer()
        .matchType(BLOCKS.TABLE)
        .then(state => {
            const table = state.peek();
            const aligns = table.data.get('aligns');
            const rows = table.nodes;

            const headerText = state
                .setProp(ALIGNS, aligns)
                .setProp(COL, 0)
                .setProp(THEAD, true)
                .serialize(rows.slice(0, 1));

            const bodyText = state
                .setProp(ALIGNS, aligns)
                .setProp(COL, 0)
                .serialize(rows.rest());

            return state
                .shift()
                .write(
                    [
                        '<table>',
                        '<thead>',
                        `${headerText}</thead>`,
                        '<tbody>',
                        `${bodyText}</tbody>`,
                        '</table>',
                        '\n'
                    ].join('\n')
                );
        })
};

/**
 * Serialize a row to HTML
 * @type {Serializer}
 */
const serializeRow = {
    serialize: Serializer()
        .matchType(BLOCKS.TABLE_ROW)
        .then(state => {
            const row = state.peek();
            const inner = state.setProp(COL, 0).serialize(row.nodes);

            return state.shift().write(`<tr>\n${inner}</tr>\n`);
        })
};

/**
 * Serialize a table cell to HTML
 * @type {Serializer}
 */
const serializeCell = {
    serialize: Serializer()
        .matchType(BLOCKS.TABLE_CELL)
        .then(state => {
            const cell = state.peek();
            const isHead = state.getProp(THEAD);
            const aligns = state.getProp(ALIGNS);
            const column = state.getProp(COL);
            const cellAlign = aligns[column];

            const containOneParagraph =
                cell.nodes.size === 1 &&
                cell.nodes.first().type === BLOCKS.PARAGRAPH;

            const inner = state.serialize(
                containOneParagraph ? cell.nodes.first().nodes : cell.nodes
            );

            const tag = isHead ? 'th' : 'td';
            const style = cellAlign ? ` style="text-align:${cellAlign}"` : '';

            return state
                .shift()
                .setProp(COL, column + 1)
                .write(`<${tag}${style}>${inner}</${tag}>\n`);
        })
};

export default {
    table: serializeTable,
    row: serializeRow,
    cell: serializeCell
};
