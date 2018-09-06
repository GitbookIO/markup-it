import objectValues from 'object-values';
import BLOCKS from './blocks';

const ALL_BLOCKS = objectValues(BLOCKS);

/**
 * Dictionary of all container block types, and the set block types they accept as children.
 * The first value of each set is the default block type.
 *
 * @type {Map<String:Array>}
 */

export default {
    // We use Document.object instead of its type
    document: [BLOCKS.PARAGRAPH, ...ALL_BLOCKS],
    [BLOCKS.BLOCKQUOTE]: [BLOCKS.TEXT, ...ALL_BLOCKS],
    [BLOCKS.TABLE]: [BLOCKS.TABLE_ROW],
    [BLOCKS.TABLE_ROW]: [BLOCKS.TABLE_CELL],
    [BLOCKS.TABLE_CELL]: [BLOCKS.PARAGRAPH, ...ALL_BLOCKS],
    [BLOCKS.LIST_ITEM]: [BLOCKS.TEXT, ...ALL_BLOCKS],
    [BLOCKS.OL_LIST]: [BLOCKS.LIST_ITEM],
    [BLOCKS.UL_LIST]: [BLOCKS.LIST_ITEM],
    [BLOCKS.CODE]: [BLOCKS.CODE_LINE]
};
