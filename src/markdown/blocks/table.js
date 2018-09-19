import { Document } from '@gitbook/slate';
import {
    State,
    Serializer,
    Deserializer,
    Block,
    BLOCKS,
    TABLE_ALIGN
} from '../../';
import reTable from '../re/table';
import HTMLParser from '../../html';

/**
 * Deserialize a table with no leading pipe (gfm) to a node.
 * @type {Deserializer}
 */
const deserializeNoPipe = Deserializer().matchRegExp(
    reTable.nptable,
    (state, match) => {
        // Get all non empty lines
        const lines = match[0].split('\n').filter(Boolean);
        const header = lines[0];
        const aligns = lines[1];
        const rows = lines.slice(2);

        const node = parseTable(state, header, aligns, rows);
        return state.push(node);
    }
);

/**
 * Deserialize a normal table to a node.
 * @type {Deserializer}
 */
const deserializeNormal = Deserializer().matchRegExp(
    reTable.normal,
    (state, match) => {
        // Get all non empty lines
        const lines = match[0].split('\n').filter(Boolean);
        const header = lines[0];
        const aligns = lines[1];
        const rows = lines.slice(2);

        const node = parseTable(state, header, aligns, rows);
        return state.push(node);
    }
);

/**
 * Serialize a table node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TABLE)
    .then(state => {
        const table = state.peek();

        if (mustSerializeAsHTML(table)) {
            // Serialize as HTML
            const htmlState = State.create(HTMLParser);
            const htmlOutput = htmlState.serializeDocument(
                Document.create({
                    nodes: [table]
                })
            );
            return state.shift().write(htmlOutput);
        }

        const { data, nodes } = table;
        const aligns = data.get('aligns');
        const headerRow = nodes.get(0);
        const bodyRows = nodes.slice(1);

        const output = `${rowToText(state, headerRow)}\n${alignsToText(
            aligns
        )}\n${bodyRows.map(row => rowToText(state, row)).join('\n')}\n\n`;

        return state.shift().write(output);
    });

const deserialize = Deserializer().use([deserializeNoPipe, deserializeNormal]);

/**
 * Parse a table into a node.
 * @param  {State} state
 * @param  {String} headerStr
 * @param  {String} alignsStr The line containing the column aligns
 * @param  {String} rowStrs
 * @return {Block} table
 */
function parseTable(state, headerStr, alignsStr, rowStrs) {
    // Header
    const headerRow = parseRow(state, headerStr);

    // Rows
    const rowTokens = rowStrs.map(rowStr => parseRow(state, rowStr));

    // Align for columns
    const alignsCells = rowToCells(alignsStr);
    const aligns = mapAligns(alignsCells);

    return Block.create({
        type: BLOCKS.TABLE,
        data: { aligns },
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
        const nodes = state.use('inline').deserialize(text);

        const paragraph = Block.create({
            type: BLOCKS.PARAGRAPH,
            nodes
        });

        return Block.create({
            type: BLOCKS.TABLE_CELL,
            nodes: [paragraph]
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
    for (let i = 0; i < trimmed.length; i += 1) {
        const prevIdx = i === 0 ? 0 : i - 1;
        const isSep = trimmed[i] === '|';
        const isNotEscaped = trimmed[prevIdx] !== '\\';

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
function mapAligns(aligns) {
    return aligns.map(s => {
        if (reTable.alignRight.test(s)) {
            return TABLE_ALIGN.RIGHT;
        } else if (reTable.alignCenter.test(s)) {
            return TABLE_ALIGN.CENTER;
        } else if (reTable.alignLeft.test(s)) {
            return TABLE_ALIGN.LEFT;
        }
        return null;
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
    return `| ${nodes.map(cell => cellToText(state, cell)).join(' | ')} |`;
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

    // The cell may contain a single paragraph,
    // we just want to serialize the inner
    let nodesToSerialize;
    if (nodes.size === 1 && nodes.first().type === BLOCKS.PARAGRAPH) {
        nodesToSerialize = nodes.first().nodes;
    } else {
        nodesToSerialize = nodes;
    }

    return state.use('inline').serialize(nodesToSerialize);
}

/**
 * Render aligns of a table into a Markdown align row
 *
 * @param {Array<String>} aligns
 * @return {String}
 */
function alignsToText(aligns) {
    return `|${aligns
        .map(align => {
            if (align == 'right') {
                return ' ---: |';
            } else if (align == 'center') {
                return ' :---: |';
            } else if (align == 'left') {
                return ' :--- |';
            }
            return ' --- |';
        })
        .join('')}`;
}

/**
 * Render aligns of a table into a Markdown align row
 *
 * @param {Node} table
 * @return {Boolean}
 */
function mustSerializeAsHTML(table) {
    const isMultiBlockCell = cell => {
        const { nodes } = cell;
        const containOneParagraph =
            nodes.size === 1 && nodes.first().type === BLOCKS.PARAGRAPH;
        const containInlines = nodes.every(child => child.object !== 'block');

        return !containOneParagraph && !containInlines;
    };

    return table.findDescendant(
        node => node.type === BLOCKS.TABLE_CELL && isMultiBlockCell(node)
    );
}

export default { serialize, deserialize };
