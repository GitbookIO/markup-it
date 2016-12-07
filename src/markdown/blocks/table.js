const { Serializer, Deserializer, Block, BLOCKS, TABLE_ALIGN } = require('../../');
const reTable = require('../re/table');

/**
 * Deserialize a table with no leading pipe (gfm) to a node.
 * @type {Deserializer}
 */
const deserializeNoPipe = Deserializer()
    .matchRegExp(reTable.nptable, (state, match) => {
        // Get all non empty lines
        const lines = match[0].split('\n').filter(Boolean);
        const header = lines[0];
        const align = lines[1];
        const rows = lines.slice(2);

        const node = parseTable(state, header, align, rows);
        return state.push(node);
    });

/**
 * Deserialize a normal table to a node.
 * @type {Deserializer}
 */
const deserializeNormal = Deserializer()
    .matchRegExp(reTable.normal, (state, match) => {
        // Get all non empty lines
        const lines = match[0].split('\n').filter(Boolean);
        const header = lines[0];
        const align = lines[1];
        const rows = lines.slice(2);

        const node = parseTable(state, header, align, rows);
        return state.push(node);
    });

/**
 * Serialize a table node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TABLE)
    .then((state) => {
        const node = state.peek();
        const { data, nodes } = node;
        const align = data.get('align');
        const headerRow = nodes.get(0);
        const bodyRows = nodes.slice(1);

        const output = (
            rowToText(state, headerRow) + '\n'
            + alignToText(align) + '\n'
            + bodyRows.map(row => rowToText(state, row)).join('\n')
            + '\n\n'
        );

        return state.shift().write(output);
    });

const deserialize = Deserializer()
    .use([
        deserializeNoPipe,
        deserializeNormal
    ]);

/**
 * Parse a table into a node.
 * @param  {State} state
 * @param  {String} headerStr
 * @param  {String} alignStr
 * @param  {String} rowStrs
 * @return {Block} table
 */
function parseTable(state, headerStr, alignStr, rowStrs) {
    // Header
    const headerRow = parseRow(state, headerStr);

    // Rows
    const rowTokens = rowStrs.map(rowStr => {
        return parseRow(state, rowStr);
    });

    // Align for columns
    const alignCells = rowToCells(alignStr);
    const align = mapAlign(alignCells);

    return Block.create({
        type: BLOCKS.TABLE,
        data: { align },
        nodes: [headerRow].concat(rowTokens)
    });
}

/**
 * Parse a row from a table into a row node.
 *
 * @param {State} state
 * @param {String} row
 * @return {Node}
 */
function parseRow(state, row) {
    // Split into cells
    const cells = rowToCells(row);

    // Tokenize each cell
    const cellNodes = cells.map(cell => {
        const text = cell.trim();
        const nodes = state.use('inline').deserialize(text); // state.deserializeWith(text, rowRules);

        return Block.create({
            type: BLOCKS.TABLE_CELL,
            nodes
        });
    });

    return Block.create({
        type: BLOCKS.TABLE_ROW,
        nodes: cellNodes
    });
}

/**
 * Split a row up into its individual cells
 *
 * @param {String} rowStr
 * @return {Array<String>}
 */
function rowToCells(rowStr) {
    const cells = [];
    const trimmed = rowStr.trim();

    let lastSep = 0;
    for (let i = 0; i < trimmed.length; i++) {
        const prevIdx = i === 0 ? 0 : i - 1;
        const isSep = trimmed[i] === '|';
        const isNotEscaped = (trimmed[prevIdx] !== '\\');

        if (isSep && isNotEscaped) {
            // New cell
            if (i > 0 && i < trimmed.length) {
                cells.push(trimmed.slice(lastSep, i));
            }
            lastSep = i + 1;
        }
    }
    // Last cell
    if (lastSep < trimmed.length) {
        cells.push(trimmed.slice(lastSep));
    }

    return cells;
}

/**
 * Detect alignement per column
 *
 * @param {Array<String>}
 * @return {Array<String|null>}
 */
function mapAlign(align) {
    return align.map(function(s) {
        if (reTable.alignRight.test(s)) {
            return TABLE_ALIGN.RIGHT;
        } else if (reTable.alignCenter.test(s)) {
            return TABLE_ALIGN.CENTER;
        } else if (reTable.alignLeft.test(s)) {
            return TABLE_ALIGN.LEFT;
        } else {
            return null;
        }
    });
}

/**
 * Render a row to text.
 *
 * @param {State} state
 * @param {Node} row
 * @return {String} text
 */
function rowToText(state, row) {
    const { nodes } = row;
    return '| ' + nodes.map(cell => cellToText(state, cell)).join(' | ') + ' |';
}

/**
 * Render a cell to text.
 *
 * @param {State} state
 * @param {Node} row
 * @return {String} text
 */
function cellToText(state, cell) {
    const { nodes } = cell;
    return state.use('inline').serialize(nodes);
}

/**
 * Render align of a table to text
 *
 * @param {Array<String>} row
 * @return {String}
 */
function alignToText(row) {
    return '|' + row.map(function(align) {
        if (align == 'right') {
            return ' ---: |';
        } else if (align == 'center') {
            return ' :---: |';
        } else if (align == 'left') {
            return ' :--- |';
        } else {
            return ' --- |';
        }
    }).join('');
}

module.exports = { serialize, deserialize };
